<?php

namespace App\Http\Controllers;

use App\Enums\BudgetType;
use App\Enums\MonthEnum;
use App\Http\Resources\ExpenseResource;
use App\Http\Resources\IncomeResource;
use App\Models\Expense;
use App\Models\Income;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Response;
use App\Traits\BudgetTrait;
use Illuminate\Http\Request;
use App\Traits\FormatReportTrait;

class ReportTrackingController extends Controller implements HasMiddleware
{
    use BudgetTrait, FormatReportTrait;

    public static function middleware()
    {
        return [
            new Middleware('auth'),
            new Middleware('password.confirm'),
        ];
    }
    public function __invoke(Request $request): Response
    {
        $budgetIncomes = $this->prepareBudgetData($request, BudgetType::INCOME->value, Income::class, 'source_id');
        $budgetSavings = $this->prepareBudgetData($request, BudgetType::SAVING->value, Expense::class, 'type_detail_id', BudgetType::SAVING->value);
        $budgetDebts = $this->prepareBudgetData($request, BudgetType::DEBT->value, Expense::class, 'type_detail_id', BudgetType::DEBT->value);
        $budgetBills = $this->prepareBudgetData($request, BudgetType::BILL->value, Expense::class, 'type_detail_id', BudgetType::BILL->value);
        $budgetShoppings = $this->prepareBudgetData($request, BudgetType::SHOPPING->value, Expense::class, 'type_detail_id', BudgetType::SHOPPING->value);
        $incomeTrackers = Income::query()
            ->select(['id', 'user_id', 'source_id', 'date', 'nominal', 'notes', 'month', 'year', 'created_at'])
            ->when($request->month ?? null, function($query, $month){
                $query->where('month', $month);
            })
            ->when($request->year ?? null, function($query, $year){
                $query->where('year', $year);
            })
            ->where('user_id', auth()->user()->id)
            ->get();
        $expenseTrackers = Expense::query()
            ->select(['id', 'user_id', 'date', 'description', 'nominal', 'type', 'type_detail_id', 'payment_id', 'notes', 'created_at'])
            ->when($request->month ?? null, function($query, $month){
                $query->where('month', $month);
            })
            ->when($request->year ?? null, function($query, $year){
                $query->where('year', $year);
            })
            ->where('user_id', auth()->user()->id)
            ->get();

        $overviews = collect([
            'Cicilan Hutang' => $budgetDebts,
            'Tabungan dan Investasi' => $budgetSavings,
            'Tagihan' => $budgetBills,
            'Belanja' => $budgetShoppings
        ])->mapWithKeys(function($items, $category){
            return [
                $category => [
                    'plan' => $items->sum('plan'),
                    'actual' => $items->sum('actual'),
                    'difference' => $items->sum('difference'),
                ],
            ];
        });

        $cashflows = collect([
            'Total Penghasilan' => $budgetIncomes,
            'Total Pengeluaran' => $overviews,
        ])->mapWithKeys(function($item, $category) use ($budgetIncomes, $overviews){
            if($category == 'Total Penghasilan'){
                return [
                    $category => [
                        'plan' => $budgetIncomes->sum('plan'),
                        'actual' => $budgetIncomes->sum('actual'),
                        'difference' => $budgetIncomes->sum('difference'),
                    ],
                ];
            } elseif ($category == 'Total Pengeluaran'){
                return [
                    $category => [
                        'plan' => $overviews->sum('plan'),
                        'actual' => $overviews->sum('actual'),
                        'difference' => $overviews->sum('difference'),
                    ],
                ];
            }
        })->merge([
            'Net Cash Flow' => [
                'plan' => abs($budgetIncomes->sum('plan') - $overviews->sum('plan')),
                'actual' => abs($budgetIncomes->sum('actual') - $overviews->sum('actual')),
                'difference' => 'Net Cash Flow',
            ]
        ]);

        return inertia('ReportTrackings/Index', [
            'pageSettings' => fn () => [
                'title' => 'Laporan Pelacakan',
                'subtitle' => 'Menampilkan semua data laporan pelacakan yang tersedia pada akun anda',
            ],
            'items' => fn() => [
                ['label' => 'SakuQ+', 'href' => route('dashboard')],
                ['label' => 'Laporan Pelacakan'],
            ],
            'state' => fn() => [
                'month' => $request->month ?? MonthEnum::month(now()->month)->value,
                'year' => $request->year ?? now()->year,
            ],
            'months' => fn() => MonthEnum::options(),
            'years' => fn() => range(2020, now()->year),
            'reports' => fn() => [
                'budgetIncomes' => fn() => $this->formatReport($budgetIncomes),
                'budgetSavings' => fn() => $this->formatReport($budgetSavings),
                'budgetDebts' => fn() => $this->formatReport($budgetDebts),
                'budgetBills' => fn() => $this->formatReport($budgetBills),
                'budgetShoppings' => fn() => $this->formatReport($budgetShoppings),
            ],
            'incomeTrackers' => fn() => IncomeResource::collection($incomeTrackers),
            'expenseTrackers' => fn() => ExpenseResource::collection($expenseTrackers),
            'overviews' => fn() => $overviews,
            'cashflows' => fn() => $cashflows,
        ]);
    }
}
