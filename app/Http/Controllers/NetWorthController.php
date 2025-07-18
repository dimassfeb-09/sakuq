<?php

namespace App\Http\Controllers;

use App\Enums\AssetType;
use App\Enums\LiabilityType;
use Throwable;
use Inertia\Response;
use App\Models\NetWorth;
use App\Enums\MessageType;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\NetWorthRequest;
use App\Http\Resources\NetWorthResource;
use App\Models\Asset;
use App\Models\Liability;
use App\Models\NetWorthAsset;
use App\Models\NetWorthLiability;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class NetWorthController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
            new Middleware('password.confirm'),
            new Middleware('can:view,netWorth', ['show']),
            new Middleware('can:update,netWorth', ['edit', 'update']),
            new Middleware('can:delete,netWorth', ['destroy']),
        ];
    }

    public function index(): Response
    {
        $netWorths = NetWorth::query()
            ->select(['id', 'user_id', 'net_worth_goal', 'current_net_worth', 'amount_left', 'transaction_per_month', 'year', 'created_at'])
            ->where('user_id', auth()->user()->id)
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->paginate(request()->load ?? 10);


        return inertia('NetWorths/Index', [
            'pageSettings' => fn() => [
                'title' => 'Kekayaan Bersih',
                'subtitle' => 'Menampilkan seluruh data kekayaan bersih yang tersedia pada akun anda',
            ],
            'netWorths' => fn() => NetWorthResource::collection($netWorths)->additional([
                'meta' => [
                    'has_pages' => $netWorths->hasPages(),
                ],
            ]),
            'state' => fn() => [
                'page' => request()->page ?? 1,
                'search' => request()->search ??'',
                'load' => 10,
            ],
            'items' => fn() => [
                ['label' => 'SakuQ+', 'href' => route('dashboard')],
                ['label' => 'Kekayaan Bersih'],
            ],
        ]);
    }

    public function create(): Response
    {
        return inertia('NetWorths/Create', [
            'pageSettings' => fn() => [
                'title' => 'Tambah kekayaan bersih',
                'subtitle' => 'Buat kekayaan bersih baru disini. Klik simpan setelah selesai',
                'method' => 'POST',
                'action' => route('net-worths.store'),
            ],
            'items' => fn() => [
                ['label' => 'SakuQ+', 'href' => route('dashboard')],
                ['label' => 'Kekayaan Bersih', 'href' => route('net-worths.index')],
                ['label' => 'Tambah Kekayaan Bersih'],
            ],

            'years' => fn() => range(2020, now()->year),
        ]);
    }

    public function store(NetWorthRequest $request): RedirectResponse
    {
        try{
            NetWorth::create([
                'user_id' => auth()->user()->id,
                'net_worth_goal' => $net_worth_goal = $request->net_worth_goal,
                'current_net_worth' => 0,
                'amount_left' => $net_worth_goal,
                'transaction_per_month' => $request->transaction_per_month,
                'year' => $request->year ?? now()->year,
            ]);
            flashMessage(MessageType::CREATED->message('Kekayaan Bersih'));
            return to_route('net-worths.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message( error: $e->getMessage()), 'error');
            return to_route('net-worths.index');
        }
    }

    public function show(NetWorth $netWorth): Response
    {
        $netWorthAssets = $this->getNetWorthAssets($netWorth);
        $netWorthAssetSummaries = $this->getNetWorthAssetSummaries($netWorth);
        $netWorthLiabilities = $this->getNetWorthLiabilities($netWorth);
        $netWorthLiabilitySummaries = $this->getNetWorthLiabilitySummaries($netWorth);
        return inertia('NetWorths/Show', [
            'pageSettings' => fn() => [
                'title' => 'Detail kekayaan bersih',
                'subtitle' => 'Menampilkan detail kekayaan bersih yang anda miliki',
            ],
            'items' => fn() => [
                ['label' => 'SakuQ+', 'href' => route('dashboard')],
                ['label' => 'Kekayaan Bersih', 'href' => route('net-worths.index')],
                ['label' => $netWorth->id],
            ],
            'netWorth' => fn() => $netWorth,
            'assetSum' => fn() => $this->getAssetSummaries($netWorth),
            'netWorthAssets' => fn() => $netWorthAssets,
            'netWorthAssetSummaries' => fn() => $netWorthAssetSummaries,
            'liabilitySum' => fn() => $this->getLiabilitySummaries($netWorth),
            'netWorthLiabilities' => fn() => $netWorthLiabilities,
            'netWorthLiabilitySummaries' => fn() => $netWorthLiabilitySummaries,
        ]);
    }

    public function edit(NetWorth $netWorth): Response
    {
        return inertia('NetWorths/Edit', [
            'pageSettings' => fn() => [
                'title' => 'Edit kekayaan bersih',
                'subtitle' => 'Edit kekayaan bersih disini. Klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('net-worths.update', $netWorth),
            ],
            'items' => fn() => [
                ['label' => 'SakuQ+', 'href' => route('dashboard')],
                ['label' => 'Kekayaan Bersih', 'href' => route('net-worths.index')],
                ['label' => 'Edit Kekayaan Bersih'],
            ],

            'years' => fn() => range(2020, now()->year),
            'netWorth' => fn() => $netWorth,
        ]);
    }

    public function update(NetWorth $netWorth, NetWorthRequest $request): RedirectResponse
    {
        try{
            $netWorth->update([
                'net_worth_goal' => $net_worth_goal = $request->net_worth_goal,
                'amount_left' => $net_worth_goal,
                'transaction_per_month' => $request->transaction_per_month,
            ]);
            flashMessage(MessageType::UPDATED->message('Kekayaan Bersih'));
            return to_route('net-worths.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message( error: $e->getMessage()), 'error');
            return to_route('net-worths.index');
        }
    }

    public function destroy(NetWorth $netWorth): RedirectResponse
    {
        try{
            $netWorth->delete();
            flashMessage(MessageType::DELETED->message('Kekayaan Bersih'));
            return to_route('net-worths.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message( error: $e->getMessage()), 'error');
            return to_route('net-worths.index');
        }
    }

    private function getAssetNominalSum(NetWorth $netWorth, AssetType $assetType)
    {
        return $netWorth->assets()
            ->where([
                ['net_worth_id', $netWorth->id],
                ['user_id', auth()->user()->id],
                ['type', $assetType->value],
            ])
            ->with('netWorthAssets')
            ->get()
            ->pluck('netWorthAssets')
            ->flatten()
            ->sum('nominal');
    }

    private function getAssetSummaries(NetWorth $netWorth)
    {
        return[
            'assetCashNominalSum' => $this->getAssetNominalSum($netWorth, AssetType::CASH),
            'assetPersonalNominalSum' => $this->getAssetNominalSum($netWorth, AssetType::PERSONAL),
            'assetShortTermNominalSum' => $this->getAssetNominalSum($netWorth, AssetType::SHORTTERM),
            'assetMidTermNominalSum' => $this->getAssetNominalSum($netWorth, AssetType::MIDTERM),
            'assetLongTermNominalSum' => $this->getAssetNominalSum($netWorth, AssetType::LONGTERM),
        ];
    }

    private function getAssetTransactions(Asset $asset)
    {
        return NetWorthAsset::query()
            ->where('asset_id', $asset->id)
            ->orderBy('transaction_date')
            ->get();
    }

    private function prepareTransactionData($transactions, $transaction_per_month = 1)
    {
        $transactionData = $transactions->map(function($transaction) {
            return [
                'transaction_date' => $transaction->transaction_date,
                'nominal' => $transaction->nominal ?? null,
            ];
        })->toArray();

        $transactionCount = $transaction_per_month * 12;
        if(count($transactionData) < $transactionCount) {
            $transactionData = array_merge($transactionData, array_fill(0, $transactionCount - count($transactionData),
            [
                'transaction_date' => null,
                'nominal' => null,
            ]));
        }
        return $transactionData;
    }
    private function accumulateTransactionSummaries($transactionData, &$netWorthAssetSummaries, $assetType)
    {
        foreach ($transactionData as $index => $transaction) {
            if ($transaction['nominal'] != null) {
                if (!isset($netWorthAssetSummaries[$assetType][$index])) {
                    $netWorthAssetSummaries[$assetType][$index] = 0;
                }
                $netWorthAssetSummaries[$assetType][$index] += $transaction['nominal'];
            }
        }
    }
    private function getNetWorthAssets(NetWorth $netWorth)
    {
        $assetTypes = AssetType::cases();
        $netWorthAssets = [];

        foreach($assetTypes as $assetType) {
            $assets = Asset::query()
                ->where([
                    ['net_worth_id', $netWorth->id],
                    ['user_id', auth()->user()->id],
                    ['type', $assetType->value]
                ])
                ->get();
            $assetData = [];

            foreach($assets as $asset){
                $transactions = $this->getAssetTransactions($asset);
                $transactionData = $this->prepareTransactionData($transactions,
                $asset->netWorth->transaction_per_month);

                $assetData[] = [
                    'detail' => $asset->detail,
                    'goal' => $asset->goal,
                    'transactions' => $transactionData,
                ];
            }
            $netWorthAssets[$assetType->value] = $assetData;
        }
        return $netWorthAssets;
    }

    private function getNetWorthAssetSummaries(NetWorth $netWorth)
    {
        $assetTypes = AssetType::cases();
        $netWorthAssetSummaries = [];

        foreach($assetTypes as $assetType){
            $assets = Asset::query()
                ->where([
                    ['net_worth_id', $netWorth->id],
                    ['user_id', auth()->user()->id],
                    ['type', $assetType->value]
                ])
                ->get();

                foreach($assets as $asset){
                    $transactions = $this->getAssetTransactions($asset);
                    $transactionData = $this->prepareTransactionData($transactions,
                    $asset->netWorth->transaction_per_month);

                    $this->accumulateTransactionSummaries($transactionData, $netWorthAssetSummaries, $assetType->value);
                }
        }
        return $netWorthAssetSummaries;
    }

    private function getLiabilityNominalSum(NetWorth $netWorth, LiabilityType $liabilityType)
    {
        return $netWorth->liabilities()
            ->where([
                ['net_worth_id', $netWorth->id],
                ['user_id', auth()->user()->id],
                ['type', $liabilityType->value],
            ])
            ->with('netWorthLiabilities')
            ->get()
            ->pluck('netWorthLiabilities')
            ->flatten()
            ->sum('nominal');
    }

    private function getLiabilitySummaries(NetWorth $netWorth)
    {
        return[
            'liabilityShortTermDebtNominalSum' => $this->getLiabilityNominalSum($netWorth, LiabilityType::SHORTTERMDEBT),
            'liabilityMidTermDebtNominalSum' => $this->getLiabilityNominalSum($netWorth, LiabilityType::MIDTERMDEBT),
            'liabilityLongTermDebtNominalSum' => $this->getLiabilityNominalSum($netWorth, LiabilityType::LONGTERMDEBT),
        ];
    }

    private function getLiabilityTransactions(Liability $liability)
    {
        return NetWorthLiability::query()
            ->where('liability_id', $liability->id)
            ->orderBy('transaction_date')
            ->get();
    }

    private function getNetWorthLiabilities(NetWorth $netWorth)
    {
        $liabilityTypes = LiabilityType::cases();
        $netWorthLiabilities = [];

        foreach($liabilityTypes as $liabilityType) {
            $liabilities = Liability::query()
                ->where([
                    ['net_worth_id', $netWorth->id],
                    ['user_id', auth()->user()->id],
                    ['type', $liabilityType->value]
                ])
                ->get();
            $liabilityData = [];

            foreach($liabilities as $liability){
                $transactions = $this->getLiabilityTransactions($liability);
                $transactionData = $this->prepareTransactionData($transactions,
                $liability->netWorth->transaction_per_month);

                $liabilityData[] = [
                    'detail' => $liability->detail,
                    'goal' => $liability->goal,
                    'transactions' => $transactionData,
                ];
            }
            $netWorthLiabilities[$liabilityType->value] = $liabilityData;
        }
        return $netWorthLiabilities;
    }

    private function getNetWorthLiabilitySummaries(NetWorth $netWorth)
    {
        $liabilityTypes = LiabilityType::cases();
        $netWorthLiabilitySummaries = [];

        foreach($liabilityTypes as $liabilityType) {
            $liabilities = Liability::query()
                ->where([
                    ['net_worth_id', $netWorth->id],
                    ['user_id', auth()->user()->id],
                    ['type', $liabilityType->value]
                ])
                ->get();

            foreach($liabilities as $liability){
                $transactions = $this->getLiabilityTransactions($liability);
                $transactionData = $this->prepareTransactionData($transactions,
                $liability->netWorth->transaction_per_month);
                $this->accumulateTransactionSummaries($transactionData, $netWorthLiabilitySummaries,
                $liabilityType->value);
            }
        }
        return $netWorthLiabilitySummaries;
    }
}
