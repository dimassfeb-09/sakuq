<?php

namespace App\Http\Requests;

use App\Enums\LiabilityType;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Foundation\Http\FormRequest;

class LiabilityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'detail' => [
                'required',
                'min:3',
                'max:255',
                'string',
            ],
            'goal' => [
                'required',
                'min:3',
                'max:255',
                'string',
            ],
            'type' => [
                'required',
                new Enum (LiabilityType::class),
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'detail' => 'Detail',
            'goal' => 'Tujuan',
            'type' => 'Tipe',
        ];
    }
}
