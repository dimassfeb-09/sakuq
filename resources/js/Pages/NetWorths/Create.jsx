import InputError from '@/Components/InputError';
import BreadcrumbHeader from '@/Components/ui/BreadcrumbHeader';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import HeaderTitle from '@/Components/ui/HeaderTitle';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { IconArrowBack, IconCheck, IconMenorah } from '@tabler/icons-react';
import { toast } from 'sonner';

export default function Create(props) {
    const { data, setData, errors, post, processing, reset } = useForm({
        net_worth_goal: 0,
        transaction_per_month: 1,
        year: null,
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
                            icon={IconMenorah}
                        />
                        <Button variant="cyan" size="xl" asChild>
                            <Link href={route('net-worths.index')}>
                                <IconArrowBack className="size-4" />
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={onHandleSubmit}>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="net_worth_goal">Tujuan Kekayaan Bersih</Label>
                            <Input
                                type="number"
                                name="net_worth_goal"
                                id="net_worth_goal"
                                placeholder="Masukkan kekayaan bersih"
                                value={data.net_worth_goal}
                                onChange={onHandleChange}
                            />
                            {errors.net_worth_goal && <InputError message={errors.net_worth_goal} />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="transaction_per_month">Transaksi per Bulan</Label>
                            <Input
                                type="number"
                                name="transaction_per_month"
                                id="transaction_per_month"
                                placeholder="Masukkan transaksi per bulan"
                                value={data.transaction_per_month}
                                onChange={onHandleChange}
                            />
                            {errors.transaction_per_month && <InputError message={errors.transaction_per_month} />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="year">Tahun</Label>
                            <Select defaultValue={data.year} onValueChange={(value) => setData('year', value)}>
                                <SelectTrigger>
                                    <SelectValue>
                                        {props.years.find((year) => year == data.year) ?? 'Pilih tahun'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {props.years.map((year, index) => (
                                        <SelectItem key={index} value={year}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.year && <InputError message={errors.year} />}
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
