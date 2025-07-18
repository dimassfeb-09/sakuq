import { Badge } from '@/Components/ui/badge';
import BreadcrumbHeader from '@/Components/ui/BreadcrumbHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import CardStat from '@/Components/ui/CardStat';
import EmptyState from '@/Components/ui/EmptyState';
import HeaderTitle from '@/Components/ui/HeaderTitle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { UseFilter } from '@/hooks/UseFilter';
import AppLayout from '@/Layouts/AppLayout';
import { BUDGETTYPEVARIANT, formatDateIndo, formatToRupiah } from '@/lib/utils';
import {
    IconCash,
    IconDelta,
    IconDoorEnter,
    IconDoorExit,
    IconInvoice,
    IconLogs,
    IconMoneybag,
    IconShoppingBag,
} from '@tabler/icons-react';
import { useState } from 'react';

export default function Index(props) {
    const overviews = props.overviews;
    const cashflows = props.cashflows;
    const budgetIncomes = props.reports.budgetIncomes.data;
    const budgetSavings = props.reports.budgetSavings.data;
    const budgetDebts = props.reports.budgetDebts.data;
    const budgetBills = props.reports.budgetBills.data;
    const budgetShoppings = props.reports.budgetShoppings.data;

    const incomeTrackers = props.incomeTrackers;
    const expenseTrackers = props.expenseTrackers;

    const [params, setParams] = useState(props.state);

    UseFilter({
        route: route('report-trackings'),
        values: params,
        only: ['reports', 'incomeTrackers', 'expenseTrackers'],
    });
    return (
        <div className="flex w-full flex-col gap-y-6 pb-32">
            <BreadcrumbHeader items={props.items} />
            <Card>
                <CardHeader className="p-0">
                    <div className="flex flex-col items-start justify-between gap-y-4 p-4 lg:flex-row lg:items-center">
                        <HeaderTitle
                            title={props.pageSettings.title}
                            subtitle={props.pageSettings.subtitle}
                            icon={IconLogs}
                        />
                        <div className="flex flex-row gap-x-4">
                            <Select value={params?.month} onValueChange={(e) => setParams({ ...params, month: e })}>
                                <SelectTrigger className="w-full sm:w-24">
                                    <SelectValue placeholder="Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {props.months.map((month, index) => (
                                        <SelectItem key={index} value={month.value}>
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={params?.year.toString()}
                                onValueChange={(e) => setParams({ ...params, year: e.toString() })}
                            >
                                <SelectTrigger className="w-full sm:w-24">
                                    <SelectValue placeholder="Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    {props.years.map((year, index) => (
                                        <SelectItem key={index} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
            </Card>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                <CardStat
                    data={{
                        title: 'Penghasilan',
                        icon: IconCash,
                        background: 'text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-500',
                    }}
                >
                    <div className="text-2xl font-bold">{formatToRupiah(props.reports.budgetIncomes.total.actual)}</div>
                </CardStat>
                <CardStat
                    data={{
                        title: 'Tabungan dan Investasi',
                        icon: IconMoneybag,
                        background: 'text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-500',
                    }}
                >
                    <div className="text-2xl font-bold">{formatToRupiah(props.reports.budgetSavings.total.actual)}</div>
                </CardStat>
                <CardStat
                    data={{
                        title: 'Cicilan Hutang',
                        icon: IconDelta,
                        background: 'text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-500',
                    }}
                >
                    <div className="text-2xl font-bold">{formatToRupiah(props.reports.budgetDebts.total.actual)}</div>
                </CardStat>
                <CardStat
                    data={{
                        title: 'Tagihan',
                        icon: IconInvoice,
                        background: 'text-white bg-gradient-to-r from-red-400 via-red-500 to-red-500',
                    }}
                >
                    <div className="text-2xl font-bold">{formatToRupiah(props.reports.budgetBills.total.actual)}</div>
                </CardStat>
                <CardStat
                    data={{
                        title: 'Belanja',
                        icon: IconShoppingBag,
                        background: 'text-white bg-gradient-to-r from-sky-400 via-sky-500 to-sky-500',
                    }}
                >
                    <div className="text-2xl font-bold">
                        {formatToRupiah(props.reports.budgetShoppings.total.actual)}
                    </div>
                </CardStat>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                            <CardDescription>Menyajikan ringkasan keuangan anda secara keseluruhan.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Rencana</TableHead>
                                        <TableHead>Sebenarnya</TableHead>
                                        <TableHead>Perbedaan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.entries(overviews).map(([category, data]) => (
                                        <TableRow key={category}>
                                            <TableCell>
                                                <Badge variant={BUDGETTYPEVARIANT[category]}>{category}</Badge>
                                            </TableCell>
                                            <TableCell>{formatToRupiah(data.plan)}</TableCell>
                                            <TableCell>{formatToRupiah(data.actual)}</TableCell>
                                            <TableCell>{formatToRupiah(data.difference)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Arus Kas</CardTitle>
                            <CardDescription>
                                Melacak pergerakan uang masuk dan keluar dalam periode tertentu untuk membantu dan
                                memahami pola keuangan anda.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Arus Kas</TableHead>
                                        <TableHead>Rencana</TableHead>
                                        <TableHead>Sebenarnya</TableHead>
                                        <TableHead>Perbedaan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.entries(cashflows).map(([category, data]) => (
                                        <TableRow key={category}>
                                            <TableCell>{category}</TableCell>
                                            <TableCell>{formatToRupiah(data.plan)}</TableCell>
                                            <TableCell>{formatToRupiah(data.actual)}</TableCell>
                                            <TableCell>
                                                {typeof data.difference == 'string'
                                                    ? data.difference
                                                    : formatToRupiah(data.difference)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Penghasilan</CardTitle>
                            <CardDescription>
                                Menampilkan sumber dan total pemasukan anda, baik dari gaji, bisnis, maupun pendapatan
                                pasif lainnya
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                            {budgetIncomes.length == 0 ? (
                                <EmptyState
                                    icon={IconCash}
                                    title="Tidak ada penghasilan"
                                    subtitle="Mulailah dengan membuat penghasilan baru"
                                />
                            ) : (
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Sumber</TableHead>
                                            <TableHead>Rencana</TableHead>
                                            <TableHead>Sebenarnya</TableHead>
                                            <TableHead>Perbedaan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {budgetIncomes.map((income, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{income.detail}</TableCell>
                                                <TableCell>{formatToRupiah(income.plan)}</TableCell>
                                                <TableCell>{formatToRupiah(income.actual)}</TableCell>
                                                <TableCell>{formatToRupiah(income.difference)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter className="bg-cyan-500 font-bold text-white">
                                        <TableRow>
                                            <TableCell>Total</TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.reports.budgetIncomes.total.plan)}
                                            </TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.reports.budgetIncomes.total.actual)}
                                            </TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.reports.budgetIncomes.total.difference)}
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cicilan Hutang</CardTitle>
                            <CardDescription>
                                Mengelola dan memantau status pembayaran cicilan hutang, termasuk jumlah yang telah
                                dibayar dan yang masih harus dilunaskan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                            {budgetDebts.length == 0 ? (
                                <EmptyState
                                    icon={IconDelta}
                                    title="Tidak ada cicilan hutang"
                                    subtitle="Mulailah dengan membuat cicilan hutang baru"
                                />
                            ) : (
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Sumber</TableHead>
                                            <TableHead>Rencana</TableHead>
                                            <TableHead>Sebenarnya</TableHead>
                                            <TableHead>Perbedaan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {budgetDebts.map((budgetDebt, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{budgetDebt.detail}</TableCell>
                                                <TableCell>{formatToRupiah(budgetDebt.plan)}</TableCell>
                                                <TableCell>{formatToRupiah(budgetDebt.actual)}</TableCell>
                                                <TableCell>{formatToRupiah(budgetDebt.difference)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter className="bg-cyan-500 font-bold text-white">
                                        <TableRow>
                                            <TableCell>Total</TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.reports.budgetDebts.total.plan)}
                                            </TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.reports.budgetDebts.total.actual)}
                                            </TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.reports.budgetDebts.total.difference)}
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tabungan dan Investasi</CardTitle>
                            <CardDescription>
                                Memberikan gambaran mengenai jumlah tabungan anda dan portofolio investasi yang sedang
                                berjalan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                            {budgetSavings.length == 0 ? (
                                <EmptyState
                                    icon={IconMoneybag}
                                    title="Tidak ada tabungan dan investasi"
                                    subtitle="Mulailah dengan membuat tabungan dan investasi baru"
                                />
                            ) : (
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Sumber</TableHead>
                                            <TableHead>Rencana</TableHead>
                                            <TableHead>Sebenarnya</TableHead>
                                            <TableHead>Perbedaan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {budgetSavings.map((budgetSaving, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{budgetSaving.detail}</TableCell>
                                                <TableCell>{formatToRupiah(budgetSaving.plan)}</TableCell>
                                                <TableCell>{formatToRupiah(budgetSaving.actual)}</TableCell>
                                                <TableCell>{formatToRupiah(budgetSaving.difference)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter className="bg-cyan-500 font-bold text-white">
                                        <TableRow>
                                            <TableCell>Total</TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.reports.budgetSavings.total.plan)}
                                            </TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.reports.budgetSavings.total.actual)}
                                            </TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.reports.budgetSavings.total.difference)}
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tagihan</CardTitle>
                            <CardDescription>
                                Mencatat tagihan rutin yang harus dibayar seperti listrik, air, internet, dan lainnyam
                                serta memberikan pengingat untuk membayar tagihan tersebut.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                            {budgetBills.length == 0 ? (
                                <EmptyState
                                    icon={IconInvoice}
                                    title="Tidak ada tagihan"
                                    subtitle="Mulailah dengan membuat tagihan baru"
                                />
                            ) : (
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Sumber</TableHead>
                                            <TableHead>Rencana</TableHead>
                                            <TableHead>Sebenarnya</TableHead>
                                            <TableHead>Perbedaan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {budgetBills.map((budgetBill, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{budgetBill.detail}</TableCell>
                                                <TableCell>{formatToRupiah(budgetBill.plan)}</TableCell>
                                                <TableCell>{formatToRupiah(budgetBill.actual)}</TableCell>
                                                <TableCell>{formatToRupiah(budgetBill.difference)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter className="bg-cyan-500 font-bold text-white">
                                        <TableRow>
                                            <TableCell>Total</TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.reports.budgetBills.total.plan)}
                                            </TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.reports.budgetBills.total.actual)}
                                            </TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.reports.budgetBills.total.difference)}
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Belanja</CardTitle>
                            <CardDescription>
                                Melacak pengeluaran untuk kebutuhan sehari-hari seperti makanan, minuman, pakaian, dan
                                lain-lain.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                            {budgetShoppings.length == 0 ? (
                                <EmptyState
                                    icon={IconShoppingBag}
                                    title="Tidak ada belanja"
                                    subtitle="Mulailah dengan membuat belanja baru"
                                />
                            ) : (
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Sumber</TableHead>
                                            <TableHead>Rencana</TableHead>
                                            <TableHead>Sebenarnya</TableHead>
                                            <TableHead>Perbedaan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {budgetShoppings.map((budgetShopping, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{budgetShopping.detail}</TableCell>
                                                <TableCell>{formatToRupiah(budgetShopping.plan)}</TableCell>
                                                <TableCell>{formatToRupiah(budgetShopping.actual)}</TableCell>
                                                <TableCell>{formatToRupiah(budgetShopping.difference)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter className="bg-cyan-500 font-bold text-white">
                                        <TableRow>
                                            <TableCell>Total</TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.reports.budgetShoppings.total.plan)}
                                            </TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.reports.budgetShoppings.total.actual)}
                                            </TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.reports.budgetShoppings.total.difference)}
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Lacak Pemasukan</CardTitle>
                    <CardDescription>
                        Memberikan detail setiap transaksi pemasukan untuk mengetahui sumber pendapatan secara rinci
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                    {incomeTrackers.length == 0 ? (
                        <EmptyState
                            icon={IconDoorEnter}
                            title="Tidak ada pemasukan"
                            subtitle="Mulailah dengan membuat pemasukan baru"
                        />
                    ) : (
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Sumber</TableHead>
                                    <TableHead>Nominal</TableHead>
                                    <TableHead>Catatan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {incomeTrackers.map((incomeTracker, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{formatDateIndo(incomeTracker.date)}</TableCell>
                                        <TableCell>{incomeTracker.source.detail}</TableCell>
                                        <TableCell>{formatToRupiah(incomeTracker.nominal)}</TableCell>
                                        <TableCell>{incomeTracker.notes}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Lacak Pengeluaran</CardTitle>
                    <CardDescription>
                        Memantau semua transaksi pengeluaran anda untuk membantu mengelola keuangan/anggaran dengan
                        lebih baik dan efisien
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                    {expenseTrackers.length == 0 ? (
                        <EmptyState
                            icon={IconDoorExit}
                            title="Tidak ada pengeluaran"
                            subtitle="Mulailah dengan membuat pengeluaran baru"
                        />
                    ) : (
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead>Nominal</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead>Detail</TableHead>
                                    <TableHead>Metode Pembayaran</TableHead>
                                    <TableHead>Catatan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {expenseTrackers.map((expenseTracker, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{formatDateIndo(expenseTracker.date)}</TableCell>
                                        <TableCell>{expenseTracker.description}</TableCell>
                                        <TableCell>{formatToRupiah(expenseTracker.nominal)}</TableCell>
                                        <TableCell>
                                            <Badge variant={BUDGETTYPEVARIANT[expenseTracker.type]}>
                                                {expenseTracker.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{expenseTracker.typeDetail.detail}</TableCell>
                                        <TableCell>{expenseTracker.payment.name}</TableCell>
                                        <TableCell>{expenseTracker.notes}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

Index.layout = (page) => <AppLayout title={page.props.pageSettings.title} children={page} />;
