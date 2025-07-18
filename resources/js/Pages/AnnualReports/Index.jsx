import { Badge } from '@/Components/ui/badge';
import BreadcrumbHeader from '@/Components/ui/BreadcrumbHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import HeaderTitle from '@/Components/ui/HeaderTitle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { UseFilter } from '@/hooks/UseFilter';
import AppLayout from '@/Layouts/AppLayout';
import { BUDGETTYPEVARIANT, formatToRupiah, MONTHTYPEVARIANT } from '@/lib/utils';
import { IconCash, IconDelta, IconInvoice, IconLogs, IconMoneybag, IconShoppingBag } from '@tabler/icons-react';
import { useState } from 'react';

export default function Index(props) {
    const [params, setParams] = useState(props.state);
    const annualIncomes = props.annuals.annualIncomes.data;
    const annualSavings = props.annuals.annualSavings.data;
    const annualBills = props.annuals.annualBills.data;
    const annualDebts = props.annuals.annualDebts.data;
    const annualShoppings = props.annuals.annualShoppings.data;

    const annualMonths = props.annuals.annualMonths;

    UseFilter({
        route: route('annual-reports'),
        values: params,
        only: ['annuals'],
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
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Penghasilan</CardTitle>
                            <CardDescription>
                                Menyajikan ringkasan total penghasilan selama satu tahun, lengkap dengan rincian per
                                bulan untuk setiap sumber penghasilan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                            {annualIncomes.length == 0 ? (
                                <EmptyState
                                    icon={IconCash}
                                    title="Tidak ada penghasilan"
                                    subtitle="Mulailah dengan membuat penghasilan baru"
                                />
                            ) : (
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Bulan</TableHead>
                                            <TableHead>Rencana</TableHead>
                                            <TableHead>Sebenarnya</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {annualIncomes.map((income, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Badge variant={MONTHTYPEVARIANT[income.month]}>
                                                        {income.month}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{formatToRupiah(income.plan)}</TableCell>
                                                <TableCell>{formatToRupiah(income.actual)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter className="bg-cyan-500 font-bold text-white">
                                        <TableRow>
                                            <TableCell>Total</TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.annuals.annualIncomes.total.plan)}
                                            </TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.annuals.annualIncomes.total.actual)}
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
                                Menampilkan perkembangan tabungan dan nilai investasi anda sepanjang tahun, termasuk
                                pertumbuhan atau perubahan signifikan setiap bulan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                            {annualSavings.length == 0 ? (
                                <EmptyState
                                    icon={IconMoneybag}
                                    title="Tidak ada tabungan dan investasi"
                                    subtitle="Mulailah dengan membuat tabungan dan investasi baru"
                                />
                            ) : (
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Bulan</TableHead>
                                            <TableHead>Rencana</TableHead>
                                            <TableHead>Sebenarnya</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {annualSavings.map((saving, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Badge variant={MONTHTYPEVARIANT[saving.month]}>
                                                        {saving.month}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{formatToRupiah(saving.plan)}</TableCell>
                                                <TableCell>{formatToRupiah(saving.actual)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter className="bg-cyan-500 font-bold text-white">
                                        <TableRow>
                                            <TableCell>Total</TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.annuals.annualSavings.total.plan)}
                                            </TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.annuals.annualSavings.total.actual)}
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cicilan Hutang</CardTitle>
                            <CardDescription>
                                Memberikan laporan tentang pembayaran cicilan hutang tahunan, meliputi jumlah yang telah
                                dibayar, sisa cicilan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                            {annualDebts.length == 0 ? (
                                <EmptyState
                                    icon={IconDelta}
                                    title="Tidak ada cicilan hutang"
                                    subtitle="Mulailah dengan membuat cicilan hutang baru"
                                />
                            ) : (
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Bulan</TableHead>
                                            <TableHead>Rencana</TableHead>
                                            <TableHead>Sebenarnya</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {annualDebts.map((debt, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Badge variant={MONTHTYPEVARIANT[debt.month]}>{debt.month}</Badge>
                                                </TableCell>
                                                <TableCell>{formatToRupiah(debt.plan)}</TableCell>
                                                <TableCell>{formatToRupiah(debt.actual)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter className="bg-cyan-500 font-bold text-white">
                                        <TableRow>
                                            <TableCell>Total</TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.annuals.annualDebts.total.plan)}
                                            </TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.annuals.annualDebts.total.actual)}
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
                                Menyediakan rekapitulasi tagihan bulanan seperti listrik, air, internet, dan lain-lain.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                            {annualBills.length == 0 ? (
                                <EmptyState
                                    icon={IconInvoice}
                                    title="Tidak ada tagihan"
                                    subtitle="Mulailah dengan membuat tagihan baru"
                                />
                            ) : (
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Bulan</TableHead>
                                            <TableHead>Rencana</TableHead>
                                            <TableHead>Sebenarnya</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {annualBills.map((bill, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Badge variant={MONTHTYPEVARIANT[bill.month]}>{bill.month}</Badge>
                                                </TableCell>
                                                <TableCell>{formatToRupiah(bill.plan)}</TableCell>
                                                <TableCell>{formatToRupiah(bill.actual)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter className="bg-cyan-500 font-bold text-white">
                                        <TableRow>
                                            <TableCell>Total</TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.annuals.annualBills.total.plan)}
                                            </TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.annuals.annualBills.total.actual)}
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
                            <CardTitle>Belaja</CardTitle>
                            <CardDescription>
                                Menampilkan total pengeluaran untuk kebutuhan belanja selama satu tahun.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                            {annualShoppings.length == 0 ? (
                                <EmptyState
                                    icon={IconShoppingBag}
                                    title="Tidak ada belanja"
                                    subtitle="Mulailah dengan membuat belanja baru"
                                />
                            ) : (
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Bulan</TableHead>
                                            <TableHead>Rencana</TableHead>
                                            <TableHead>Sebenarnya</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {annualShoppings.map((shopping, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Badge variant={MONTHTYPEVARIANT[shopping.month]}>
                                                        {shopping.month}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{formatToRupiah(shopping.plan)}</TableCell>
                                                <TableCell>{formatToRupiah(shopping.actual)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter className="bg-cyan-500 font-bold text-white">
                                        <TableRow>
                                            <TableCell>Total</TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.annuals.annualShoppings.total.plan)}
                                            </TableCell>
                                            <TableCell>
                                                {formatToRupiah(props.annuals.annualShoppings.total.actual)}
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
                    <CardTitle>Menampilkan Laporan Setiap Kategori Per Bulan</CardTitle>
                    <CardDescription>
                        Menampilkan laporan bulanan yang terperinci untuk setiap kategori keuangan, seperti penghasilan,
                        tabungan, tagihan dan belanja.
                    </CardDescription>
                </CardHeader>
            </Card>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {Object.entries(annualMonths).map(([month, data]) => (
                    <div className="col-span-1" key={month}>
                        <Card>
                            <CardHeader>
                                <CardTitle>{month}</CardTitle>
                                <CardDescription>Menampilkan laporan keuangan untuk bulan {month}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Kategori</TableHead>
                                            <TableHead>Rencana</TableHead>
                                            <TableHead>Sebenarnya</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.entries(data.categories).map(([category, values]) => (
                                            <TableRow key={category}>
                                                <TableCell>
                                                    <Badge variant={BUDGETTYPEVARIANT[category]}>{category}</Badge>
                                                </TableCell>
                                                <TableCell>{formatToRupiah(values.plan)}</TableCell>
                                                <TableCell>{formatToRupiah(values.actual)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter className="bg-gradient-to-br from-cyan-500 via-cyan-500 to-gray-100 font-bold text-white">
                                        <TableRow>
                                            <TableCell>Total</TableCell>
                                            <TableCell>{formatToRupiah(data.total.plan)}</TableCell>
                                            <TableCell>{formatToRupiah(data.total.actual)}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}

Index.layout = (page) => <AppLayout title={page.props.pageSettings.title} children={page} />;
