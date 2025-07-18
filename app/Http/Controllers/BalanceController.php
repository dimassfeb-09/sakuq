<?php

namespace App\Http\Controllers;

use App\Enums\MessageType;
use App\Http\Requests\BalanceRequest;
use App\Http\Resources\BalanceResource;
use App\Models\Balance;
use App\Models\Goal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Response;
use Throwable;

class BalanceController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
            new Middleware('can:view,goal', ['index']),
            new Middleware('can:create,goal', ['create', 'store']),
            new Middleware('can:delete,balance', ['destroy']),
        ];
    }

    public function index(Goal $goal): Response
    {
        $balances = Balance::query()
            ->select(['id', 'user_id', 'goal_id', 'amount', 'created_at'])
            ->where('user_id', auth()->user()->id)
            ->where('goal_id', $goal->id)
            ->filter(request()->only(['search']))
            ->sorting(request()->only('field', 'diretion'))
            ->paginate(request()->load ?? 10);

        return inertia('Savings/Balances/Index', [
            'pageSettings' => fn() => [
                'title' => 'Saldo Anda',
                'subtitle' => "Menampilkan semua tabungan anda pada tujuan {$goal->name}",
            ],
            'balances' => fn () => BalanceResource::collection($balances)->additional([
                'meta' => [
                    'has_pages' => $balances->hasPages(),
                ],
            ]),
            'goal' => fn() => $goal->loadSum('balances', 'amount')->loadSum([
                'balances as balances_sum_amount' => function ($query) {
                    $query->whereMonth('created_at', now()->month)
                        ->whereYear('created_at', now()->year);
                }
            ], 'amount'),
            'state' => fn() => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10,
            ],
            'items' => fn() => [
                ['label' => 'SakuQ+', 'href' => route('dashboard')],
                ['label' => 'Tabungan', 'href' => route('goals.index')],
                ['label' => $goal->id, 'href' => route('goals.index')],
                ['label' => 'Saldo']
            ]
        ]);
    }
    public function create(Goal $goal): Response
    {
        return inertia('Savings/Balances/Create', [
            'pageSettings' => fn() => [
                'title' => 'Tambah Saldo',
                'subtitle' => "Menabung sekarang untuk mencapai tujuan Anda",
                'method' => 'POST',
                'action' => route('balances.store', $goal),
            ],
            'goal' => fn() => $goal,
            'items' => fn() => [
                ['label' => 'SakuQ+', 'href' => route('dashboard')],
                ['label' => 'Tabungan', 'href' => route('goals.index')],
                ['label' => $goal->id, 'href' => route('goals.index')],
                ['label' => 'Saldo', 'href' => route('balances.index', $goal)],
                ['label' => 'Tambah Saldo'],
            ],
        ]);
    }

    public function store(Goal $goal, BalanceRequest $request): RedirectResponse
    {
        try{
            $realized = ($goal->nominal - ($goal->beginning_balance + $goal->calculateBalance(auth()->user()->id)));

            if ($request->amount > $realized){
                $excess = $request->amount - $realized;
                flashMessage("Tabungan Anda melebihi target sebesar ". number_format($excess, 0, '.', '.'), 'warning');
                return to_route('balances.index', $goal);
            }
            Balance::create([
                'user_id' => auth()->user()->id,
                'goal_id' => $goal->id,
                'amount' => $request->amount,
            ]);

            $goal->update([
                'percentage' => $goal->calculatePercentage($goal->beginning_balance, $goal->nominal, auth()->user()->id),
            ]);

            flashMessage(MessageType::CREATED->message('Saldo'));
            return to_route('balances.index', $goal);
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message( error: $e->getMessage()), 'error');
            return to_route('balances.index', $goal);
        }
    }
    public function destroy(Goal $goal, Balance $balance): RedirectResponse
    {
        try{
            $balance->delete();
            $goal->update([
                'percentage' => $goal->calculatePercentage($goal->beginning_balance, $goal->nominal, auth()->user()->id),
            ]);
            flashMessage(MessageType::DELETED->message('Saldo'));
            return to_route('balances.index', $goal);
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message( error: $e->getMessage()), 'error');
            return to_route('balances.index', $goal);
        }
    }
}
