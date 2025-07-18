<?php
namespace App\Traits;
use App\Http\Resources\ReportResource;

trait FormatReportTrait {
    private function formatReport($data): ?array
    {
        return [
            'data' => ReportResource::collection($data),
            'total' => [
                'plan' => $data->sum('plan'),
                'actual' => $data->sum('actual'),
                'difference' => $data->sum('difference'),
            ],
        ];
    }
}
