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
import { IconArrowBack, IconChartArrowsVertical, IconCheck } from '@tabler/icons-react';
import { toast } from 'sonner';

export default function Edit(props) {
    const { data, setData, errors, post, processing, reset } = useForm({
        detail: props.budget.detail ?? '',
        nominal: props.budget.nominal ?? '',
        month: props.budget.month ?? null,
        year: props.budget.year ?? null,
        type: props.budget.type ?? null,
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
                            icon={IconChartArrowsVertical}
                        />
                        <Button variant="cyan" size="xl" asChild>
                            <Link href={route('budgets.index')}>
                                <IconArrowBack className="size-4" />
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={onHandleSubmit}>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="type">Tipe</Label>
                            <Select defaultValue={data.type} onValueChange={(value) => setData('type', value)}>
                                <SelectTrigger>
                                    <SelectValue>
                                        {props.types.find((type) => type.value == data.type)?.label ?? 'Pilih tipe'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {props.types.map((type, index) => (
                                        <SelectItem key={index} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.type && <InputError message={errors.type} />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="detail">Rincian</Label>
                            <Input
                                type="text"
                                name="detail"
                                id="detail"
                                placeholder="Masukkan rincian"
                                value={data.detail}
                                onChange={onHandleChange}
                            />
                            {errors.detail && <InputError message={errors.detail} />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="nominal">Nominal</Label>
                            <Input
                                type="number"
                                name="nominal"
                                id="nominal"
                                placeholder="Masukkan nominal"
                                value={data.nominal}
                                onChange={onHandleChange}
                            />
                            {errors.nominal && <InputError message={errors.nominal} />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="month">Bulan</Label>
                            <Select defaultValue={data.month} onValueChange={(value) => setData('month', value)}>
                                <SelectTrigger>
                                    <SelectValue>
                                        {props.months.find((month) => month.value == data.month)?.label ??
                                            'Pilih bulan'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {props.months.map((month, index) => (
                                        <SelectItem key={index} value={month.value}>
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.month && <InputError message={errors.month} />}
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

Edit.layout = (page) => <AppLayout children={page} title={page.props.pageSettings.title} />;
