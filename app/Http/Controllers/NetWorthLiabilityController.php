<?php

namespace App\Http\Controllers;

use Throwable;
use App\Models\NetWorth;
use App\Models\Liability;
use App\Enums\MessageType;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class NetWorthLiabilityController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
        ];
    }
    public function __invoke(NetWorth $netWorth, Liability $liability, Request $request): RedirectResponse
    {
        try {
            $transactionCount = $liability->netWorthLiabilities()
                ->whereMonth('transaction_date', date('m', strtotime($request->transaction_date)))
                ->whereYear('transaction_date', date('Y', strtotime($request->transaction_date)))
                ->count();
            if($transactionCount > $netWorth->transaction_per_month) {
                flashMessage('Jumlah transaksi sudah mencapai maksimal, pilih bulan yang lain', 'error');
                return to_route('liabilities.index', $netWorth);
            }
            $liability->netWorthLiabilities()->create([
                'transaction_date' => $request->transaction_date,
                'nominal' => $request->nominal,
            ]);
            flashMessage(MessageType::CREATED->message('Kewajiban Kekayaan Bersih'));
            return to_route('net-worths.show', $netWorth);
        } catch (Throwable $e){
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('net-worths.show', $netWorth);
        }
    }
}
