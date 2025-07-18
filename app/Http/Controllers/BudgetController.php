<?php

namespace App\Http\Controllers;

use App\Enums\BudgetType;
use App\Enums\MessageType;
use App\Enums\MonthEnum;
use App\Http\Requests\BudgetRequest;
use App\Http\Resources\BudgetResource;
use App\Models\Budget;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Response;
use Throwable;

class BudgetController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
            new Middleware('can:update,budget', ['edit', 'update']),
            new Middleware('can:delete,budget', ['destroy']),
        ];
    }

    public function index(): Response
    {
        $budgets = Budget::query()
            ->select(['id', 'user_id', 'detail', 'nominal', 'month', 'year', 'type', 'created_at'])
            ->where('user_id', auth()->user()->id)
            ->filter(request()->only(['search', 'month', 'type', 'year']))
            ->sorting(request()->only(['field', 'direction']))
            ->paginate(request()->load ?? 10);


        return inertia('Budgets/Index', [
            'pageSettings' => fn() => [
                'title' => 'Anggaran',
                'subtitle' => 'Menampilkan seluruh data anggaran yang tersedia pada akun anda',
            ],
            'budgets' => fn() => BudgetResource::collection($budgets)->additional([
                'meta' => [
                    'has_pages' => $budgets->hasPages(),
                ],
            ]),
            'state' => fn() => [
                'page' => request()->page ?? 1,
                'search' => request()->search ??'',
                'load' => 10,
                'month' => request()->month ?? MonthEnum::month(now()->month)->value,
                'type' => request()->type ?? '',
                'year' => request()->year ?? now()->year,
            ],
            'items' => fn() => [
                ['label' => 'SakuQ+', 'href' => route('dashboard')],
                ['label' => 'Anggaran'],
            ],
            'months' => fn() => MonthEnum::options(),
            'types' => fn() => BudgetType::options(),
            'years' => fn() => range(2020, now()->year),
            'statistics' => fn() => [
                'incomes' => fn() => Budget::query()
                    ->where('user_id', auth()->user()->id)
                    ->when(request()->month, fn($q, $month) => $q->where('month', $month))
                    ->when(request()->year, fn($q, $year) => $q->where('year', $year))
                    ->where('type', BudgetType::INCOME->value)
                    ->sum('nominal'),
                'savings' => fn() => Budget::query()
                    ->where('user_id', auth()->user()->id)
                    ->when(request()->month, fn($q, $month) => $q->where('month', $month))
                    ->when(request()->year, fn($q, $year) => $q->where('year', $year))
                    ->where('type', BudgetType::SAVING->value)
                    ->sum('nominal'),
                'debts' => fn() => Budget::query()
                    ->where('user_id', auth()->user()->id)
                    ->when(request()->month, fn($q, $month) => $q->where('month', $month))
                    ->when(request()->year, fn($q, $year) => $q->where('year', $year))
                    ->where('type', BudgetType::DEBT->value)
                    ->sum('nominal'),
                'bills' => fn() => Budget::query()
                    ->where('user_id', auth()->user()->id)
                    ->when(request()->month, fn($q, $month) => $q->where('month', $month))
                    ->when(request()->year, fn($q, $year) => $q->where('year', $year))
                    ->where('type', BudgetType::BILL->value)
                    ->sum('nominal'),
                'shoppings' => fn() => Budget::query()
                    ->where('user_id', auth()->user()->id)
                    ->when(request()->month, fn($q, $month) => $q->where('month', $month))
                    ->when(request()->year, fn($q, $year) => $q->where('year', $year))
                    ->where('type', BudgetType::SHOPPING->value)
                    ->sum('nominal'),
            ]
        ]);
    }
    public function create(): Response
    {
        return inertia('Budgets/Create', [
            'pageSettings' => fn() => [
                'title' => 'Tambah anggaran',
                'subtitle' => 'Buat anggaran baru disini. Klik simpan setelah selesai',
                'method' => 'POST',
                'action' => route('budgets.store'),
            ],
                        'items' => fn() => [
                ['label' => 'SakuQ+', 'href' => route('dashboard')],
                ['label' => 'Anggaran', 'href' => route('budgets.index')],
                ['label' => 'Tambah Anggaran'],
            ],
            'months' => fn() => MonthEnum::options(),
            'types' => fn() => BudgetType::options(),
            'years' => fn() => range(2020, now()->year),
        ]);
    }

    public function store(BudgetRequest $request): RedirectResponse
    {
        try{
            Budget::create([
                'user_id' => auth()->user()->id,
                'detail' => $request->detail,
                'nominal' => $request->nominal,
                'month' => $request->month,
                'year' => $request->year,
                'type' => $request->type,
            ]);
            flashMessage(MessageType::CREATED->message('Anggaran'));
            return to_route('budgets.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message( error: $e->getMessage()), 'error');
            return to_route('budgets.index');
        }
    }
    public function edit(Budget $budget): Response
    {
        return inertia('Budgets/Edit', [
            'pageSettings' => fn() => [
                'title' => 'Edit anggaran',
                'subtitle' => 'Edit anggaran disini. Klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('budgets.update', $budget),
            ],
            'items' => fn() => [
                ['label' => 'SakuQ+', 'href' => route('dashboard')],
                ['label' => 'Anggaran', 'href' => route('budgets.index')],
                ['label' => 'Edit Anggaran'],
            ],
            'months' => fn() => MonthEnum::options(),
            'types' => fn() => BudgetType::options(),
            'years' => fn() => range(2020, now()->year),
            'budget' => fn() => $budget,
        ]);
    }

    public function update(Budget $budget,BudgetRequest $request): RedirectResponse
    {
        try{
            $budget->update([
                'detail' => $request->detail,
                'nominal' => $request->nominal,
                'month' => $request->month,
                'year' => $request->year,
                'type' => $request->type,
            ]);
            flashMessage(MessageType::UPDATED->message('Anggaran'));
            return to_route('budgets.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message( error: $e->getMessage()), 'error');
            return to_route('budgets.index');
        }
    }
    public function destroy(Budget $budget): RedirectResponse
    {
        try{
            $budget->delete();
            flashMessage(MessageType::DELETED->message('Anggaran'));
            return to_route('budgets.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message( error: $e->getMessage()), 'error');
            return to_route('budgets.index');
        }
    }
}
