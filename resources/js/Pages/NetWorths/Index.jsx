import Filter from '@/Components/Datatable/Filter';
import PaginationTable from '@/Components/Datatable/PaginationTable';
import AlertAction from '@/Components/ui/AlertAction';
import BreadcrumbHeader from '@/Components/ui/BreadcrumbHeader';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/ui/card';
import EmptyState from '@/Components/ui/EmptyState';
import HeaderTitle from '@/Components/ui/HeaderTitle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { UseFilter } from '@/hooks/UseFilter';
import AppLayout from '@/Layouts/AppLayout';
import { deleteAction, formatDateIndo, formatToRupiah } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { IconArrowsDownUp, IconEye, IconMenorah, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import ShowFilter from '../../Components/Datatable/ShowFilter';

export default function Index(props) {
    const { data: netWorths, meta, links } = props.netWorths;
    const [params, setParams] = useState(props.state);

    const onSortable = (field) => {
        setParams({
            ...params,
            field: field,
            direction: params.direction == 'asc' ? 'desc' : 'asc',
        });
    };

    UseFilter({
        route: route('net-worths.index'),
        values: params,
        only: ['netWorths'],
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
                            icon={IconMenorah}
                        />
                        <Button variant="cyan" size="xl" asChild>
                            <Link href={route('net-worths.create')}>
                                <IconPlus className="size-4" />
                                Tambah
                            </Link>
                        </Button>
                    </div>
                    <Filter params={params} setParams={setParams} state={props.state} />
                    <ShowFilter params={params} />
                </CardHeader>
                <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                    {netWorths.length == 0 ? (
                        <EmptyState
                            icon={IconMenorah}
                            title="Tidak ada kekayaan bersih"
                            subtitle="Mulailah dengan membuat kekayaan bersih baru"
                        />
                    ) : (
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('id')}
                                        >
                                            #
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('net_worth_goal')}
                                        >
                                            Tujuan Kekayaan Bersih
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('current_net_worth')}
                                        >
                                            Kekayaan Bersih Sekarang
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('amount_left')}
                                        >
                                            Jumlah Yang Tersisa
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('transaction_per_month')}
                                        >
                                            Transaksi per Bulan
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('year')}
                                        >
                                            Tahun
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('created_at')}
                                        >
                                            Dibuat Pada
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {netWorths.map((netWorth, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1 + (meta.current_page - 1) * meta.per_page}</TableCell>
                                        <TableCell>{formatToRupiah(netWorth.net_worth_goal)}</TableCell>
                                        <TableCell>{formatToRupiah(netWorth.current_net_worth)}</TableCell>
                                        <TableCell>{formatToRupiah(netWorth.amount_left)}</TableCell>
                                        <TableCell>{netWorth.transaction_per_month}</TableCell>
                                        <TableCell>{netWorth.year}</TableCell>
                                        <TableCell>{formatDateIndo(netWorth.created_at)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-x-1">
                                                <Button variant="yellow" size="sm" asChild>
                                                    <Link href={route('assets.index', [netWorth])}>Aset</Link>
                                                </Button>
                                                <Button variant="purple" size="sm" asChild>
                                                    <Link href={route('liabilities.index', [netWorth])}>Kewajiban</Link>
                                                </Button>
                                                <Button variant="cyan" size="sm" asChild>
                                                    <Link href={route('net-worths.show', [netWorth])}>
                                                        <IconEye className="size-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="blue" size="sm" asChild>
                                                    <Link href={route('net-worths.edit', [netWorth])}>
                                                        <IconPencil className="size-4" />
                                                    </Link>
                                                </Button>
                                                <AlertAction
                                                    trigger={
                                                        <Button variant="red" size="sm">
                                                            <IconTrash className="size-4" />
                                                        </Button>
                                                    }
                                                    action={() => deleteAction(route('net-worths.destroy', [netWorth]))}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
                <CardFooter className="flex w-full flex-col items-center justify-between gap-y-2 border-t py-3 lg:flex-row">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan <span className="font-medium text-cyan-600">{meta.from ?? 0}</span> dari{' '}
                        {meta.total} kekayaan bersih
                    </p>
                    <div className="overflow-x-auto">
                        {meta.has_pages && <PaginationTable meta={meta} links={links} />}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

Index.layout = (page) => <AppLayout title={page.props.pageSettings.title} children={page} />;
