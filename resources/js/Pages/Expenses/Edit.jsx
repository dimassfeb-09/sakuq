import InputError from '@/Components/InputError';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import BreadcrumbHeader from '@/Components/ui/BreadcrumbHeader';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import HeaderTitle from '@/Components/ui/HeaderTitle';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { UseFilter } from '@/hooks/UseFilter';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { IconArrowBack, IconCheck, IconDoorExit } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Edit(props) {
    const [params, setParams] = useState(props.state);
    UseFilter({
        route: route('expenses.edit', props.expense),
        values: params,
        only: ['budgets'],
    });
    const { data, setData, errors, post, processing, reset } = useForm({
        date: props.expense.date ?? '',
        description: props.expense.description ?? '',
        nominal: props.expense.nominal ?? '',
        type: props.expense.type ?? params.type,
        type_detail_id: props.expense.type_detail_id ?? null,
        notes: props.expense.notes ?? '',
        payment_id: props.expense.payment_id ?? null,
        month: props.expense.month ?? null,
        year: props.expense.year ?? null,
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
    useEffect(() => {
        setData('type', params.type);
    }, [params.type]);
    return (
        <div className="flex w-full flex-col gap-y-6 pb-32">
            <BreadcrumbHeader items={props.items} />
            {props.budgets.length == 0 && params?.type && (
                <Alert variant="destructive">
                    <AlertDescription>
                        Tipe detail tidak ditemukan pada tipe <strong>{params?.type}</strong>. Silahkan untuk membuat
                        terlebih dahulu
                    </AlertDescription>
                </Alert>
            )}
            <Card>
                <CardHeader>
                    <div className="flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                        <HeaderTitle
                            title={props.pageSettings.title}
                            subtitle={props.pageSettings.subtitle}
                            icon={IconDoorExit}
                        />
                        <Button variant="cyan" size="xl" asChild>
                            <Link href={route('expenses.index')}>
                                <IconArrowBack className="size-4" />
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={onHandleSubmit}>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="date">Tanggal</Label>
                            <Input
                                type="date"
                                name="date"
                                id="date"
                                placeholder="Masukkan tanggal"
                                value={data.date}
                                onChange={onHandleChange}
                            />
                            {errors.date && <InputError message={errors.date} />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                name="description"
                                id="description"
                                onChange={onHandleChange}
                                placeholder="Masukkan deskripsi..."
                                value={data.description}
                            ></Textarea>
                            {errors.description && <InputError message={errors.description} />}
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
                            <Label htmlFor="type">Tipe</Label>
                            <Select
                                defaultValue={data.type}
                                onValueChange={(value) => setParams({ ...params, type: value })}
                            >
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
                        {props.budgets.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="type_detail_id">Detail</Label>
                                <Select
                                    defaultValue={data.type_detail_id}
                                    onValueChange={(value) => setData('type_detail_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue>
                                            {props.budgets.find((budget) => budget.value == data.type_detail_id)
                                                ?.label ?? 'Pilih detail'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.budgets.map((budget, index) => (
                                            <SelectItem key={index} value={budget.value}>
                                                {budget.label} - ({budget.month}/{budget.year})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.type_detail_id && <InputError message={errors.type_detail_id} />}
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="payment_id">Metode Pembayaran</Label>
                            <Select
                                defaultValue={data.payment_id}
                                onValueChange={(value) => setData('payment_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue>
                                        {props.payments.find((payment) => payment.value == data.payment_id)?.label ??
                                            'Pilih metode pembayaran'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {props.payments.map((payment, index) => (
                                        <SelectItem key={index} value={payment.value}>
                                            {payment.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.payment && <InputError message={errors.payment} />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="notes">Catatan</Label>
                            <Textarea
                                name="notes"
                                id="notes"
                                onChange={onHandleChange}
                                placeholder="Masukkan catatan..."
                                value={data.notes}
                            ></Textarea>
                            {errors.notes && <InputError message={errors.notes} />}
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
