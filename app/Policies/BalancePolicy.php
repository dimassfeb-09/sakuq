<?php

namespace App\Policies;

use App\Models\Balance;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BalancePolicy
{
    public function delete(User $user, Balance $balance): Response
    {
        return $user->id == $balance->user_id
            ? Response::allow()
            : Response::denyAsNotFound();
    }
}
