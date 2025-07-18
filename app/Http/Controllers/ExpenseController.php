<?php

namespace App\Http\Controllers;

use App\Enums\BudgetType;
use App\Enums\MessageType;
use App\Http\Requests\ExpenseRequest;
use Inertia\Response;
use App\Models\Expense;
use App\Enums\MonthEnum;
use Illuminate\Http\Request;
use App\Http\Resources\ExpenseResource;
use App\Models\Budget;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use Throwable;

class ExpenseController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
            new Middleware('can:update,expense',['edit', 'update']),
            new Middleware('can:delete,expense',['destroy']),
        ];
    }

    public function index(): Response
    {
        $expenses = Expense::query()
            ->select(['id', 'user_id', 'date', 'description', 'nominal', 'type', 'type_detail_id', 'payment_id', 'notes', 'month', 'year', 'created_at'])
            ->where('user_id', auth()->user()->id)
            ->filter(request()->only(['search', 'month', 'year']))
            ->sorting(request()->only(['field', 'direction']))
            ->with(['typeDetail', 'payment'])
            ->paginate(request()->load ?? 10);


        return inertia('Expenses/Index', [
            'pageSettings' => fn() => [
                'title' => 'Pengeluaran',
                'subtitle' => 'Menampilkan seluruh data pengeluaran yang tersedia pada akun anda',
            ],
            'expenses' => fn() => ExpenseResource::collection($expenses)->additional([
                'meta' => [
                    'has_pages' => $expenses->hasPages(),
                ],
            ]),
            'state' => fn() => [
                'page' => request()->page ?? 1,
                'search' => request()->search ??'',
                'load' => 10,
                'month' => request()->month ?? MonthEnum::month(now()->month)->value,
                'year' => request()->year ?? now()->year,
            ],
            'items' => fn() => [
                ['label' => 'SakuQ+', 'href' => route('dashboard')],
                ['label' => 'Pengeluaran'],
            ],
            'months' => fn() => MonthEnum::options(),
            'years' => fn() => range(2020, now()->year),
        ]);
    }

    public function create(): Response
    {
        return inertia('Expenses/Create', [
            'pageSettings' => fn() => [
                'title' => 'Tambah pengeluaran',
                'subtitle' => 'Buat pengeluaran baru disini. Klik simpan setelah selesai',
                'method' => 'POST',
                'action' => route('expenses.store'),
            ],
            'items' => fn() => [
                ['label' => 'SakuQ+', 'href' => route('dashboard')],
                ['label' => 'Pengeluaran', 'href' => route('expenses.index')],
                ['label' => 'Tambah Pengeluaran'],
            ],
            'months' => fn() => MonthEnum::options(),
            'years' => fn() => range(2020, now()->year),
            'types' => fn() => BudgetType::options(['INCOME']),
            'payments' => fn() => Payment::query()
                ->select(['id', 'name'])
                ->where('user_id', auth()->user()->id)
                ->get()
                ->map(fn($item) => [
                    'value' => $item->id,
                    'label' => $item->name,
                ]),
            'budgets' => fn() => request()->type
                ? Budget::query()
                ->select(['id', 'user_id', 'type', 'detail', 'month', 'year'])
                ->where('user_id', auth()->user()->id)
                ->where('type', request()->type)
                ->get()
                ->map(fn($item) => [
                    'value' => $item->id,
                    'label' => $item->detail,
                    'month' => $item->month,
                    'year' => $item->year,
                ])
                : [],
            'state' => fn() => [
                'type' => request()->type ?? '',
            ],
        ]);
    }

    public function store(ExpenseRequest $request): RedirectResponse
    {
        try{
            Expense::create([
                'user_id' => auth()->user()->id,
                'date' => $request->date,
                'description' => $request->description,
                'nominal' => $request->nominal,
                'type' => $request->type,
                'type_detail_id' => $request->type_detail_id,
                'payment_id' => $request->payment_id,
                'notes' => $request->notes,
                'month' => $request->month,
                'year' => $request->year,
            ]);
            flashMessage(MessageType::CREATED->message('Pengeluaran'));
            return to_route('expenses.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message( error: $e->getMessage()), 'error');
            return to_route('expenses.index');
        }
    }

    public function edit(Expense $expense): Response
    {
        return inertia('Expenses/Edit', [
            'pageSettings' => fn() => [
                'title' => 'Edit pengeluaran',
                'subtitle' => 'Edit pengeluaran disini. Klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('expenses.update', $expense),
            ],
            'items' => fn() => [
                ['label' => 'SakuQ+', 'href' => route('dashboard')],
                ['label' => 'Pengeluaran', 'href' => route('expenses.index')],
                ['label' => 'Edit Pengeluaran'],
            ],
            'expense' => fn() => $expense,
            'months' => fn() => MonthEnum::options(),
            'years' => fn() => range(2020, now()->year),
            'types' => fn() => BudgetType::options(['INCOME']),
            'payments' => fn() => Payment::query()
                ->select(['id', 'name'])
                ->where('user_id', auth()->user()->id)
                ->get()
                ->map(fn($item) => [
                    'value' => $item->id,
                    'label' => $item->name,
                ]),
            'budgets' => fn() => request()->type
                ? Budget::query()
                ->select(['id', 'user_id', 'type', 'detail', 'month', 'year'])
                ->where('user_id', auth()->user()->id)
                ->where('type', request()->type)
                ->get()
                ->map(fn($item) => [
                    'value' => $item->id,
                    'label' => $item->detail,
                    'month' => $item->month,
                    'year' => $item->year,
                ])
                : [],
            'state' => fn() => [
                'type' => request()->type ?? $expense->type,
            ],
        ]);
    }

    public function update(Expense $expense, ExpenseRequest $request): RedirectResponse
    {
        try{
            $expense->update([
                'date' => $request->date,
                'description' => $request->description,
                'nominal' => $request->nominal,
                'type' => $request->type,
                'type_detail_id' => $request->type_detail_id,
                'payment_id' => $request->payment_id,
                'notes' => $request->notes,
                'month' => $request->month,
                'year' => $request->year,
            ]);
            flashMessage(MessageType::UPDATED->message('Pengeluaran'));
            return to_route('expenses.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message( error: $e->getMessage()), 'error');
            return to_route('expenses.index');
        }
    }

    public function destroy(Expense $expense): RedirectResponse
    {
        try{
            $expense->delete();
            flashMessage(MessageType::DELETED->message('Pengeluaran'));
            return to_route('expenses.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message( error: $e->getMessage()), 'error');
            return to_route('expenses.index');
        }
    }
}
