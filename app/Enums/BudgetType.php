<?php

namespace App\Enums;

enum BudgetType: string
{
    case INCOME = 'Penghasilan';

    case SAVING = 'Tabungan dan Investasi';

    case DEBT = 'Cicilan Hutang';

    case BILL = 'Tagihan';

    case SHOPPING = 'Belanja';

    public static function options(array $exclude = []): array
    {

        return collect(self::cases())
            ->filter(fn ($item) => ! in_array($item->name, $exclude))
            ->map(fn ($item) => [
                'value' => $item->value,

                'label' => $item->value,

            ])

            ->values()

            ->toArray();

    }
}
