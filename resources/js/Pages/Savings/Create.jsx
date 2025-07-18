import InputError from '@/Components/InputError';
import BreadcrumbHeader from '@/Components/ui/BreadcrumbHeader';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import HeaderTitle from '@/Components/ui/HeaderTitle';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { IconArrowBack, IconCheck, IconMoneybag } from '@tabler/icons-react';
import { toast } from 'sonner';

export default function Create(props) {
    const { data, setData, errors, post, processing, reset } = useForm({
        name: '',
        nominal: 0,
        monthly_saving: 0,
        deadline: '',
        beginning_balance: 0,
        _method: props.pageSettings.method,
    });
    const onHandleChange = (e) => setData(e.target.name, e.target.value);
    const onHandleSubmit = (e) => {
        e.preventDefault();
        post(props.pageSettings.action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (success) => {
                const flash = flashMessage(success);
                if (flash) toast[flash.type](flash.message);
            },
        });
    };
    return (
        <div className="flex w-full flex-col gap-y-6 pb-32">
            <BreadcrumbHeader items={props.items} />
            <Card>
                <CardHeader>
                    <div className="flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                        <HeaderTitle
                            title={props.pageSettings.title}
                            subtitle={props.pageSettings.subtitle}
                            icon={IconMoneybag}
                        />
                        <Button variant="cyan" size="xl" asChild>
                            <Link href={route('goals.index')}>
                                <IconArrowBack className="size-4" />
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={onHandleSubmit}>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Nama</Label>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Masukkan tujuan"
                                value={data.name}
                                onChange={onHandleChange}
                            />
                            {errors.name && <InputError message={errors.name} />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input
                                type="date"
                                name="deadline"
                                id="deadline"
                                placeholder="Masukkan deadline"
                                value={data.deadline}
                                onChange={onHandleChange}
                            />
                            {errors.deadline && <InputError message={errors.deadline} />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="nominal">Nominal (Rp)</Label>
                            <Input
                                type="number"
                                name="nominal"
                                id="nominal"
                                placeholder="Masukkan nominal"
                                value={data.nominal}
                                onChange={onHandleChange}
                                min="0"
                                onInput={(e) => {
                                    if (e.target.value < 0) {
                                        e.target.value = 0;
                                    }
                                }}
                            />
                            {errors.nominal && <InputError message={errors.nominal} />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="monthly_saving">Tabungan Bulanan (Rp)</Label>
                            <Input
                                type="number"
                                name="monthly_saving"
                                id="monthly_saving"
                                placeholder="Masukkan tabungan bulanan"
                                value={data.monthly_saving}
                                onChange={onHandleChange}
                                min="0"
                                onInput={(e) => {
                                    if (e.target.value < 0) {
                                        e.target.value = 0;
                                    }
                                }}
                            />
                            {errors.monthly_saving && <InputError message={errors.monthly_saving} />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="beginning_balance">Saldo Awal(Rp)</Label>
                            <Input
                                type="number"
                                name="beginning_balance"
                                id="beginning_balance"
                                placeholder="Masukkan saldo awal"
                                value={data.beginning_balance}
                                onChange={onHandleChange}
                                min="0"
                                onInput={(e) => {
                                    if (e.target.value < 0) {
                                        e.target.value = 0;
                                    }
                                }}
                            />
                            {errors.beginning_balance && <InputError message={errors.beginning_balance} />}
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
                </CardContent>
            </Card>
        </div>
    );
}

Create.layout = (page) => <AppLayout children={page} title={page.props.pageSettings.title} />;
