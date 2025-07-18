<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IncomeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date' => $this->date,
            'nominal' => $this->nominal,
            'notes' => $this->notes,
            'month' => $this->month,
            'year' => $this->year,
            'created_at' => $this->created_at,
            'source' => $this->whenLoaded('source', [
                'id' => $this->source?->id,
                'detail' => $this->source?->detail,
                'type' => $this->source?->type,
            ]),
        ];
    }
}
