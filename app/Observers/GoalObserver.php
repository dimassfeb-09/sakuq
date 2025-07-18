<?php

namespace App\Observers;

use App\Models\Goal;

class GoalObserver{
    public function created(Goal $goal)
    {
        $goal->update([
            'percentage' => $goal->calculatePercentage(
                $goal->beginning_balance,
                $goal->nominal,
                auth()->user()->id,
            ),
        ]);
    }
}
