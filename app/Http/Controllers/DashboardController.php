<?php

namespace App\Http\Controllers;

use App\Constants\ColorConstants;
use App\Enums\BudgetType;
use App\Enums\MonthEnum;
use App\Models\Budget;
use App\Models\Expense;
use App\Models\Goal;
use App\Models\Income;
use App\Models\NetWorth;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Response;

use function Pest\Laravel\get;

class DashboardController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
        ] ;
    }

    public function index(): Response
    {
        $incomeSum = Income::query()
            ->where([
                ['user_id', auth()->user()->id],
                ['year', now()->year],
            ])
            ->sum('nominal');

        $expenseSum = Expense::query()
            ->where([
                ['user_id', auth()->user()->id],
                ['year', now()->year],
            ])
            ->sum('nominal');

        $balanceSum = Goal::query()
            ->with('balances')
            ->where('user_id', auth()->user()->id)
            ->get()
            ->sum(fn($goal) => $goal->balances->sum('amount') + $goal->beginning_balance);

        $netWorthSum = NetWorth::query()
            ->where([
                ['user_id', auth()->user()->id],
                ['year', now()->year],
            ])
            ->pluck('amount_left');

        $goals = Goal::query()
            ->select(['id', 'user_id', 'name', 'percentage', 'nominal', 'beginning_balance', 'deadline', 'created_at'])
            ->where('user_id', auth()->user()->id)
            ->latest('deadline')
            ->withSum('balances', 'amount')
            ->limit(5)
            ->get();

        $incomes = Income::query()
            ->select(['id', 'user_id', 'source_id', 'date', 'nominal', 'year', 'created_at'])
            ->where([
                ['user_id', auth()->user()->id],
                ['year', now()->year],
            ])
            ->with(['source'])
            ->latest('created_at')
            ->limit(5)
            ->get();

        $expenses = Expense::query()
            ->select(['id', 'user_id', 'date', 'description', 'nominal', 'type', 'type_detail_id', 'payment_id', 'notes', 'year', 'created_at'])
            ->where([
                ['user_id', auth()->user()->id],
                ['year', now()->year],
            ])
            ->with(['typeDetail', 'payment'])
            ->latest('created_at')
            ->limit(5)
            ->get();

        return Inertia("Dashboard", [
            'sum' => fn() => [
                'incomeSum' => $incomeSum,
                'expenseSum' => $expenseSum,
                'balanceSum' => $balanceSum,
                'netWorthSum' => $netWorthSum,
            ],
            'budgetChart' => fn() => $this->budgetChart(),
            'incomeExpenseChart' => fn() => $this->incomeExpenseChart(),
            'year' => fn() => now()->year,
            'goals' => fn() => $goals,
            'incomes' => fn() => $incomes,
            'expenses' => fn() => $expenses,
        ]);
    }

    private static function getColor(string $type, array $colors): string
    {
        return $colors[crc32($type) % count($colors)];
    }

    private function budgetChart(): array
    {
        $budgets = Budget::query()
            ->selectRaw('type, SUM(nominal) as total_nominal')
            ->where([
                ['user_id', auth()->user()->id],
                ['year', now()->year],
            ])
            ->groupBy('type')
            ->get()
            ->map(function($budget){
                return [
                    'type' => $budget->type,
                    'nominals' => (int) $budget->total_nominal,
                    'fill' => self::getColor($budget->type->value, ColorConstants::COLORS),
                ];
            });
        $chartConfigBudget = [
            'nominals' => [
                'label' => 'Nominal',
            ],
        ];
        foreach(BudgetType::cases() as $budgetType){
            $key = strtolower(str_replace(' ', '_', $budgetType->value));
            $chartConfigBudget[$key] = [
                'label' => $budgetType->value,
                'color' => self::getColor($budgetType->value, ColorConstants::COLORS),
            ];
        }
        return [
            'budgets' => $budgets,
            'chartConfigBudget' => $chartConfigBudget,
        ];
    }

    private function incomeExpenseChart()
    {
        $incomeData = Income::query()
            ->selectRaw('month, year, SUM(nominal) as pemasukan')
            ->where([
                ['user_id', auth()->user()->id],
                ['year', now()->year],
            ])
            ->groupBy('month', 'year')
            ->get();

        $expenseData = Expense::query()
            ->selectRaw('month, year, SUM(nominal) as pengeluaran')
            ->where([
                ['user_id', auth()->user()->id],
                ['year', now()->year],
            ])
            ->groupBy('month', 'year')
            ->get();

        $chartData = [];

        foreach (MonthEnum::cases() as $monthEnum) {
            $month = $monthEnum->value;
            $year = date('Y');
            $incomes = $incomeData->where('month', $month)
                ->where('year', $year)->first()
                ->pemasukan ?? 0;
            $expenses = $expenseData->where('month', $month)
                ->where('year', $year)->first()
                ->pengeluaran ?? 0;

            $chartData[] = [
                'month' => $month,
                'pemasukan' => $incomes,
                'pengeluaran' => $expenses,
            ];
        }
        return $chartData;
    }
}
