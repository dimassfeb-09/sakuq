import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet';
import { flashMessage } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { IconCheck } from '@tabler/icons-react';
import { toast } from 'sonner';

export default function NetWorthAsset({ asset }) {
    const { data, setData, reset, errors, post, processing } = useForm({
        transaction_date: '',
        nominal: '',
    });
    const onHandleChange = (e) => setData(e.target.name, e.target.value);
    const onHandleSubmit = (e) => {
        e.preventDefault();
        post(route('net-worth-asset', [asset.net_worth_id, asset.id]), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (success) => {
                const flash = flashMessage(success);
                if (flash) toast[flash.type](flash.message);
            },
        });
    };
    return (
        <Sheet>
            <SheetTrigger>
                <Button variant="yellow" size="sm">
                    Aset Kekayaan Bersih
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Aset Kekayaan Bersih</SheetTitle>
                    <SheetDescription>Tambah Aset Kekayaan Bersih Berdasarkan Tanggal Dimasukkannya</SheetDescription>
                </SheetHeader>
                <form className="mt-4 space-y-4" onSubmit={onHandleSubmit}>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div className="col-span-full">
                            <Label htmlFor="transaction_date">Tanggal Transaksi</Label>
                            <Input
                                type="date"
                                name="transaction_date"
                                id="transaction_date"
                                value={data.transaction_date}
                                onChange={onHandleChange}
                            />
                            {errors.transaction_date && <InputError message={errors.transaction_date} />}
                        </div>
                        <div className="col-span-full">
                            <Label htmlFor="nominal">Nominal</Label>
                            <Input
                                type="number"
                                name="nominal"
                                id="nominal"
                                value={data.nominal}
                                onChange={onHandleChange}
                            />
                            {errors.nominal && <InputError message={errors.nominal} />}
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col gap-2 lg:flex-row lg:justify-end">
                        <Button type="button" variant="ghost" size="xl" onClick={() => reset()}>
                            Reset
                        </Button>
                        <Button type="submit" variant="cyan" size="xl" disabled={processing}>
                            <IconCheck />
                            Submit
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
