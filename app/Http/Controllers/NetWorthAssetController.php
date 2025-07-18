<?php

namespace App\Http\Controllers;

use App\Enums\MessageType;
use App\Models\Asset;
use App\Models\NetWorth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Throwable;

class NetWorthAssetController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
        ];
    }
    public function __invoke(NetWorth $netWorth, Asset $asset, Request $request): RedirectResponse
    {
        try {
            $transactionCount = $asset->netWorthAssets()
                ->whereMonth('transaction_date', date('m', strtotime($request->transaction_date)))
                ->whereYear('transaction_date', date('Y', strtotime($request->transaction_date)))
                ->count();
            if($transactionCount > $netWorth->transaction_per_month) {
                flashMessage('Jumlah transaksi sudah mencapai maksimal, pilih bulan yang lain', 'error');
                return to_route('assets.index', $netWorth);
            }
            $asset->netWorthAssets()->create([
                'transaction_date' => $request->transaction_date,
                'nominal' => $request->nominal,
            ]);
            flashMessage(MessageType::CREATED->message('Aset Kekayaan Bersih'));
            return to_route('net-worths.show', $netWorth);
        } catch (Throwable $e){
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('net-worths.show', $netWorth);
        }
    }
}
