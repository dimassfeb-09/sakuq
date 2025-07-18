<?php

namespace App\Traits;
use App\Models\Budget;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

trait BudgetTrait{
    private function filterBudgetData(Request $request, ?string $type = null): Collection
    {
        return Budget::query()
            ->select(['id', 'user_id', 'detail', 'nominal', 'type', 'month', 'year', 'created_at'])
            ->where('user_id', auth()->user()->id)
            ->when($request->month ?? null, fn($q, $month) => $q->where('month', $month))
            ->when($request->year ?? null, fn($q, $year) => $q->where('year', $year))
            ->when($type, fn($q) => $q->where('type', $type))
            ->get();
    }
    private function prepareBudgetData(Request $request, string $type, string $model, string $groupByField, ?string
    $expenseType = null): Collection
    {
        $budgetPlanData = $this->filterBudgetData($request, $type);
        $actualData = $model::query()
            ->where('user_id', auth()->User()->id)
            ->selectRaw("{$groupByField}, SUM(nominal) as total_nominal")
            ->when($expenseType, fn($q) => $q->where('type', $expenseType))
            ->when($request->month ?? null, fn($q, $month) => $q->where('month', $month))
            ->when($request->year ?? null, fn($q, $year) => $q->where('year', $year))
            ->groupBy($groupByField)
            ->get()
            ->keyBy($groupByField);

        return $budgetPlanData->map(function($item) use ($actualData){
            $key = $item->id;
            $actual = $actualData[$key]->total_nominal ?? 0;
            $difference = abs($item->nominal - $actual);

            $item->detail = $item->detail;
            $item->plan = $item->nominal;
            $item->actual = $actual;
            $item->difference = $difference;

            return $item;
        });
    }
}
