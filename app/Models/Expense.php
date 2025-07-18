<?php

namespace App\Models;

use App\Enums\MonthEnum;
use App\Enums\BudgetType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'date',
        'description',
        'nominal',
        'type',
        'type_detail_id',
        'payment_id',
        'notes',
        'month',
        'year',
    ];

    public function casts(): array
    {
        return [
            'type'=> BudgetType::class,
            'month' => MonthEnum::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    public function typeDetail(): BelongsTo
    {
        return $this->belongsTo(Budget::class, 'type_detail_id', 'id');
    }

    public function Budget(): BelongsTo
    {
        return $this->belongsTo(Budget::class, 'type_detail_id', 'id');
    }

    public function scopeFilter(Builder $query, array $filters): void
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->whereAny(['description', 'month'], 'REGEXP', $search);
        })->when($filters['month'] ?? null, function ($query, $month) {
            $query->where('month', $month);
        })->when($filters['year'] ?? null, function ($query, $year) {
            $query->where('year', $year);
        });
    }

    public function scopeSorting(Builder $query, array $sorts): void
    {
        $query->when($sorts['field'] ?? null && $sorts['direction'] ?? null, function ($query) use ($sorts) {
            $query->orderBy($sorts['field'], $sorts['direction']);
        });
    }
}
