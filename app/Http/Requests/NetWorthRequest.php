<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NetWorthRequest extends FormRequest
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
            'net_worth_goal' => [
                'required',
                'numeric',
            ],
            'transaction_per_month' => [
                'required',
                'numeric',
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'net_worth_goal' => 'Tujuan Kekayaan Bersih',
            'transaction_per_month' => 'Transaksi Per Bulan',
        ];
    }
}
