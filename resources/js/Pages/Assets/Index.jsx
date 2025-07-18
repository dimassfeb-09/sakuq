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
import { deleteAction, formatDateIndo } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { IconArrowsDownUp, IconCheese, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import ShowFilter from '../../Components/Datatable/ShowFilter';
import NetWorthAsset from './NetWorthAsset';

export default function Index(props) {
    const { data: assets, meta, links } = props.assets;
    const [params, setParams] = useState(props.state);

    const onSortable = (field) => {
        setParams({
            ...params,
            field: field,
            direction: params.direction == 'asc' ? 'desc' : 'asc',
        });
    };

    UseFilter({
        route: route('assets.index', [props.netWorth]),
        values: params,
        only: ['assets'],
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
                            icon={IconCheese}
                        />
                        <Button variant="emerald" size="xl" asChild>
                            <Link href={route('assets.create', [props.netWorth])}>
                                <IconPlus className="size-4" />
                                Tambah
                            </Link>
                        </Button>
                    </div>
                    <Filter params={params} setParams={setParams} state={props.state} />
                    <ShowFilter params={params} />
                </CardHeader>
                <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                    {assets.length == 0 ? (
                        <EmptyState
                            icon={IconCheese}
                            title="Tidak ada aset"
                            subtitle="Mulailah dengan membuat aset baru"
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
                                            onClick={() => onSortable('detail')}
                                        >
                                            Detail
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('goal')}
                                        >
                                            Tujuan
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('type')}
                                        >
                                            Tipe
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
                                {assets.map((asset, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1 + (meta.current_page - 1) * meta.per_page}</TableCell>
                                        <TableCell>{asset.detail}</TableCell>
                                        <TableCell>{asset.goal}</TableCell>
                                        <TableCell>{asset.type}</TableCell>
                                        <TableCell>{formatDateIndo(asset.created_at)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-x-1">
                                                <NetWorthAsset asset={asset} />
                                                <Button variant="blue" size="sm" asChild>
                                                    <Link href={route('assets.edit', [props.netWorth, asset])}>
                                                        <IconPencil className="size-4" />
                                                    </Link>
                                                </Button>
                                                <AlertAction
                                                    trigger={
                                                        <Button variant="red" size="sm">
                                                            <IconTrash className="size-4" />
                                                        </Button>
                                                    }
                                                    action={() =>
                                                        deleteAction(route('assets.destroy', [props.netWorth, asset]))
                                                    }
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
                        Menampilkan <span className="font-medium text-emerald-600">{meta.from ?? 0}</span> dari{' '}
                        {meta.total} aset
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
