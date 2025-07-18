<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;


class GoalRequest extends FormRequest
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
            'name' => [
                'required',
                'string',
                'min:3',
                'max:255',
            ],
            'deadline' => [
                'required',
                'date',
            ],
            'nominal'=> [
                'required',
                'numeric',
                'min:0',
            ],
            'monthly_saving'=> [
                'required',
                'numeric',
                'min:0',
            ],
            'beginning_balance'=> [
                'required',
                'numeric',
                'min:0',
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'name'=> 'Tujuan',
            'deadline'=> 'Tenggat',
            'nominal'=> 'Nominal',
            'monthly_saving'=> 'Tabungan Bulanan',
            'beginning_balance'=> 'Saldo Awal',
        ];
    }
}
