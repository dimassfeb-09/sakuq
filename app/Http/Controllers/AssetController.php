<?php

namespace App\Http\Controllers;

use Throwable;
use App\Models\Asset;
use Inertia\Response;
use App\Enums\AssetType;
use App\Models\NetWorth;
use App\Enums\MessageType;
use Illuminate\Http\Request;
use App\Http\Requests\AssetRequest;
use App\Http\Resources\AssetResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class AssetController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return[
            new Middleware('auth'),
            new Middleware('can:viewAny,netWorth', ['index']),
            new Middleware('can:create,netWorth', ['create', 'store']),
            new Middleware('can:update,netWorth', ['edit', 'update']),
            new Middleware('can:delete,netWorth', ['destroy']),
        ];
    }

    public function index(NetWorth $netWorth): Response
    {
        $assets = Asset::query()
            ->select(['id', 'net_worth_id', 'user_id', 'detail', 'goal', 'type', 'created_at'])
            ->where('net_worth_id', $netWorth->id)
            ->where('user_id', auth()->user()->id)
            ->filter(request()->only(['search', 'type']))
            ->sorting(request()->only(['field', 'direction']))
            ->paginate(request()->load ?? 10);


        return inertia('Assets/Index', [
            'pageSettings' => fn() => [
                'title' => 'Aset',
                'subtitle' => 'Menampilkan seluruh data aset yang tersedia pada akun anda',
            ],
            'assets' => fn() => AssetResource::collection($assets)->additional([
                'meta' => [
                    'has_pages' => $assets->hasPages(),
                ],
            ]),
            'state' => fn() => [
                'page' => request()->page ?? 1,
                'search' => request()->search ??'',
                'type' => request()->type ??'',
                'load' => 10,
            ],
            'items' => fn() => [
                ['label' => 'SakuQ+', 'href' => route('dashboard')],
                ['label' => 'Kekayaan Bersih', 'href' => route('net-worths.index')],
                ['label' => $netWorth->id, 'href' => route('net-worths.show', $netWorth)],
                ['label' => 'Aset'],
            ],
            'netWorth' => fn() => $netWorth,
        ]);
    }

    public function create(NetWorth $netWorth): Response
    {
        return inertia('Assets/Create', [
            'pageSettings' => fn() => [
                'title' => 'Tambah aset',
                'subtitle' => 'Buat aset baru disini. Klik simpan setelah selesai',
                'method' => 'POST',
                'action' => route('assets.store', $netWorth),
            ],
            'items' => fn() => [
                ['label' => 'SakuQ+', 'href' => route('dashboard')],
                ['label' => 'Kekayaan Bersih', 'href' => route('net-worths.index')],
                ['label' => $netWorth->id, 'href' => route('net-worths.show', $netWorth)],
                ['label' => 'Aset', 'href' => route('assets.index', $netWorth)],
                ['label' => 'Tambah Aset'],
            ],
            'netWorth' => fn() => $netWorth,
            'assetTypes' => fn() => AssetType::options(),
        ]);
    }

    public function store(NetWorth $netWorth, AssetRequest $request): RedirectResponse
    {
        try{
            $netWorth->assets()->create([
                'user_id' => auth()->user()->id,
                'detail' => $request->detail,
                'goal' => $request->goal,
                'type' => $request->type,
            ]);
            flashMessage(MessageType::CREATED->message('Aset'));
            return to_route('assets.index', $netWorth);
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message( error: $e->getMessage()), 'error');
            return to_route('assets.index', $netWorth);
        }
    }

    public function edit(NetWorth $netWorth, Asset $asset): Response
    {
        return inertia('Assets/Edit', [
            'pageSettings' => fn() => [
                'title' => 'Edit aset',
                'subtitle' => 'Edit aset disini. Klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('assets.update', [$netWorth, $asset]),
            ],
            'items' => fn() => [
                ['label' => 'SakuQ+', 'href' => route('dashboard')],
                ['label' => 'Kekayaan Bersih', 'href' => route('net-worths.index')],
                ['label' => $netWorth->id, 'href' => route('net-worths.show', $netWorth)],
                ['label' => 'Aset', 'href' => route('assets.index', $netWorth)],
                ['label' => 'Edit Aset'],
            ],
            'netWorth' => fn() => $netWorth,
            'asset' => fn() => $asset,
            'assetTypes' => fn() => AssetType::options(),
        ]);
    }

    public function update(NetWorth $netWorth, Asset $asset, AssetRequest $request): RedirectResponse
    {
        try{
            $asset->update([
                'detail' => $request->detail,
                'goal' => $request->goal,
                'type' => $request->type,
            ]);
            flashMessage(MessageType::UPDATED->message('Aset'));
            return to_route('assets.index', $netWorth);
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message( error: $e->getMessage()), 'error');
            return to_route('assets.index', $netWorth);
        }
    }

    public function destroy(NetWorth $netWorth, Asset $asset): RedirectResponse
    {
        try{
            $asset->delete();
            flashMessage(MessageType::DELETED->message('Aset'));
            return to_route('assets.index', $netWorth);
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message( error: $e->getMessage()), 'error');
            return to_route('assets.index', $netWorth);
        }
    }
}
