<?php

namespace App\Http\Controllers;

use App\Enums\MessageType;
use App\Http\Requests\GoalRequest;
use App\Http\Resources\GoalResource;
use App\Models\Balance;
use App\Models\Goal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Carbon;
use Inertia\Response;
use Throwable;

class GoalController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
            new Middleware('can:update,goal', only:['edit','update']),
            new Middleware('can:delete,goal', only:['destroy']),
        ];
    }

    public function index(): Response
    {
        $goals = Goal::query()
            ->select(['id', 'user_id', 'name', 'percentage', 'nominal', 'monthly_saving', 'deadline',
            'beginning_balance', 'created_at'])
            ->where('user_id', auth()->user()->id)
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->paginate(request()->load ?? 10);


        return inertia('Savings/Index', [
            'pageSettings' => fn() => [
                'title' => 'Tujuan Menabung',
                'subtitle' => 'Menabung untuk pendidikan, Liburan, atau Investasi Masa Depan',
                'banner' => [
                    'title' =>'Tabungan',
                    'subtitle'=> 'Wujudkan impian dengan menabung. Langkah kecil menuju cita-cita yang besar',
                ],
            ],
            'goals' => fn() => GoalResource::collection($goals)->additional([
                'meta' => [
                    'has_pages' => $goals->hasPages(),
                ],
            ]),
            'state' => fn() => [
                'page' => request()->page ?? 1,
                'search' => request()->search ??'',
                'load' => 10,
            ],
            'items' => fn() => [
                ['label' => 'SakuQ+', 'href' => route('dashboard')],
                ['label' => 'Tabungan'],
            ],
            'year' => fn() => now()->year,
            'count' => fn() => [
                'countGoal' => fn() => Goal::query()->where('user_id', auth()->user()->id)->count(),
                'countGoalAchieved' => fn() => Goal::query()->where('user_id', auth()->user()->id)->where('percentage', 100)->count(),
                'countGoalNotAchieved' => fn() => Goal::query()->where('user_id', auth()->user()->id)->where('percentage', '<', 100)->count(),
                'countBalance' => fn() => Balance::query()->whereHas('goal', fn($query) => $query->where('user_id', auth()->user()->id))->sum('amount') + Goal::query()->where('user_id', auth()->user()->id)->sum('beginning_balance'),
            ],
            'productivityCount' => fn() => $this->getProductivityCount(),
        ]);
    }

    public function create(): Response
    {
        return inertia('Savings/Create', [
            'pageSettings' => fn() => [
                'title' => 'Mulai tetapkan tujuan menabung sekarang',
                'subtitle' => 'Dengan menabung dan tujuan yang jelas,  setiap langkah kecil menabung membawa Anda bisa lebih dekat ke mencapai tujuan impian besar Anda',
                'method' => 'POST',
                'action' => route('goals.store'),
            ],
                        'items' => fn() => [
                ['label' => 'SakuQ+', 'href' => route('dashboard')],
                ['label' => 'Tabungan', 'href' => route('goals.index')],
                ['label' => 'Tambah Tujuan Menabung'],
            ],
        ]);
    }
    public function store(GoalRequest $request): RedirectResponse
    {
        try{
            Goal::create([
                'user_id' => auth()->user()->id,
                'name' => $request->name,
                'nominal' => $request->nominal,
                'monthly_saving' => $request->monthly_saving,
                'deadline' => $request->deadline,
                'beginning_balance' => $request->beginning_balance,
            ]);
            flashMessage(MessageType::CREATED->message('Tujuan'));
            return to_route('goals.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message( error: $e->getMessage()), 'error');
            return to_route('goals.index');
        }
    }

        public function edit(Goal $goal): Response
    {
        return inertia('Savings/Edit', [
            'pageSettings' => fn() => [
                'title' => 'Mulai tetapkan tujuan menabung sekarang',
                'subtitle' => 'Dengan menabung dan tujuan yang jelas,  setiap langkah kecil menabung membawa Anda bisa lebih dekat ke mencapai tujuan impian besar Anda',
                'method' => 'PUT',
                'action' => route('goals.update', $goal),
            ],
            'goal'=> fn()=> $goal,
                        'items' => fn() => [
                ['label' => 'SakuQ+', 'href' => route('dashboard')],
                ['label' => 'Tabungan', 'href' => route('goals.index')],
                ['label' => 'Perbarui Tujuan Menabung'],
            ],
        ]);
    }
    public function update(Goal $goal, GoalRequest $request): RedirectResponse
    {
        try{
            $goal->update([
                'name' => $request->name,
                'nominal' => $request->nominal,
                'monthly_saving' => $request->monthly_saving,
                'deadline' => $request->deadline,
                'beginning_balance' => $request->beginning_balance,
                'percentage' => $goal ->calculatePercentage($request->beginning_balance, $request->nominal, auth()->user()->id),
            ]);
            flashMessage(MessageType::UPDATED->message('Tujuan'));
            return to_route('goals.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message( error: $e->getMessage()), 'error');
            return to_route('goals.index');
        }
    }

        public function destroy(Goal $goal): RedirectResponse
    {
        try{
            $goal->delete();
            flashMessage(MessageType::DELETED->message('Tujuan'));
            return to_route('goals.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message( error: $e->getMessage()), 'error');
            return to_route('goals.index');
        }
    }

    public function getProductivityCount(): array
    {
        $startDate = Carbon::create(now()->year, 1, 1);
        $endDate = Carbon::create(now()->year, 12, 31);

        $balances = Balance::query()
            ->where('user_id', auth()->user()->id)
            ->selectRaw('DATE(created_at) as transaction_date, count(*) as count')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('transaction_date')
            ->orderBy('transaction_date')
            ->get();

        $dates = [];
        $currentdate = $startDate;

        while($currentdate <= $endDate){
            $dates[] = $currentdate->format('Y-m-d');
            $currentdate->addDay();
        }

        $result = [];

        foreach($dates as $date){
            $transaction = $balances->firstWhere('transaction_date', $date);
            $result[] = [
                'transaction_date' => $date,
                'count' => $transaction ? $transaction->count : 0,
            ];
        }

        return $result;
    }
}
