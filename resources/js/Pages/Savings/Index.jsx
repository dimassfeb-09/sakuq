import Filter from '@/Components/Datatable/Filter';
import PaginationTable from '@/Components/Datatable/PaginationTable';
import AlertAction from '@/Components/ui/AlertAction';
import Banner from '@/Components/ui/Banner';
import BreadcrumbHeader from '@/Components/ui/BreadcrumbHeader';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import CardStat from '@/Components/ui/CardStat';
import EmptyState from '@/Components/ui/EmptyState';
import HeaderTitle from '@/Components/ui/HeaderTitle';
import { Progress } from '@/Components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { UseFilter } from '@/hooks/UseFilter';
import AppLayout from '@/Layouts/AppLayout';
import { deleteAction, formatDateIndo, formatToRupiah } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import {
    IconArrowsDownUp,
    IconCash,
    IconCheck,
    IconMoneybag,
    IconPencil,
    IconPlus,
    IconTrash,
    IconX,
} from '@tabler/icons-react';
import { useState } from 'react';
import ShowFilter from '../../Components/Datatable/ShowFilter';
import Productivity from './Productivity';

export default function Index(props) {
    const { data: goals, meta, links } = props.goals;
    const [params, setParams] = useState(props.state);

    const onSortable = (field) => {
        setParams({
            ...params,
            field: field,
            direction: params.direction == 'asc' ? 'desc' : 'asc',
        });
    };

    UseFilter({
        route: route('goals.index'),
        values: params,
        only: ['goals'],
    });
    return (
        <div className="flex w-full flex-col gap-y-6 pb-32">
            <BreadcrumbHeader items={props.items} />
            <Banner title={props.pageSettings.banner.title} subtitle={props.pageSettings.banner.subtitle} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <CardStat
                    data={{
                        title: 'Total Tujuan',
                        icon: IconMoneybag,
                        background: 'text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-500',
                        iconClassName: 'text-white',
                    }}
                >
                    <div className="text-2xl font-bold">{props.count.countGoal}</div>
                </CardStat>
                <CardStat
                    data={{
                        title: 'Tujuan Tercapai',
                        icon: IconCheck,
                        background: 'text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-500',
                        iconClassName: 'text-white',
                    }}
                >
                    <div className="text-2xl font-bold">{props.count.countGoalAchieved}</div>
                </CardStat>
                <CardStat
                    data={{
                        title: 'Tujuan Tidak Tercapai',
                        icon: IconX,
                        background: 'text-white bg-gradient-to-r from-red-400 via-red-500 to-red-500',
                        iconClassName: 'text-white',
                    }}
                >
                    <div className="text-2xl font-bold">{props.count.countGoalNotAchieved}</div>
                </CardStat>
                <CardStat
                    data={{
                        title: 'Total Tabungan',
                        icon: IconCash,
                        background: 'text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-500',
                        iconClassName: 'text-white',
                    }}
                >
                    <div className="text-2xl font-bold">{formatToRupiah(props.count.countBalance)}</div>
                </CardStat>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Kontribusi menabung pada periode 1 Januari {props.year} - 31 Desember {props.year}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Productivity transactions={props.productivityCount} />
                </CardContent>
                <CardFooter>
                    <div className="flex w-full flex-col items-center justify-between gap-2">
                        <Link className="text-sm text-muted-foreground">Pelajari cara kami menghitung kontribusi</Link>
                        <div className="flex flex-row items-center gap-1.5">
                            <span className="mr-2 text-xs text-muted-foreground">Lebih Sedikit</span>
                            <Button className="h-5 w-5 rounded-full" variant="outline" size="sm"></Button>
                            <Button className="h-5 w-5 rounded-full bg-emerald-700" size="sm"></Button>
                            <Button className="h-5 w-5 rounded-full bg-emerald-600" size="sm"></Button>
                            <Button className="h-5 w-5 rounded-full bg-emerald-500" size="sm"></Button>
                            <Button className="h-5 w-5 rounded-full bg-emerald-400" size="sm"></Button>
                            <span className="ml-2 text-xs text-muted-foreground">Lebih Banyak</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader className="p-0">
                    <div className="flex flex-col items-start justify-between gap-y-4 p-4 lg:flex-row lg:items-center">
                        <HeaderTitle
                            title={props.pageSettings.title}
                            subtitle={props.pageSettings.subtitle}
                            icon={IconMoneybag}
                        />
                        <Button variant="cyan" size="xl" asChild>
                            <Link href={route('goals.create')}>
                                <IconPlus className="size-4" />
                                Tambah
                            </Link>
                        </Button>
                    </div>
                    <Filter params={params} setParams={setParams} state={props.state} />
                    <ShowFilter params={params} />
                </CardHeader>
                <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                    {goals.length == 0 ? (
                        <EmptyState
                            icon={IconMoneybag}
                            title="Tidak ada tujuan"
                            subtitle="Mulailah dengan membuat tujuan baru"
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
                                            onClick={() => onSortable('percentage')}
                                        >
                                            Progress
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('name')}
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
                                            onClick={() => onSortable('percentage')}
                                        >
                                            Persentase
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('nominal')}
                                        >
                                            Nominal (Rp)
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('monthly_saving')}
                                        >
                                            Tabungan / Bulan (Rp)
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('deadline')}
                                        >
                                            Deadline
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('beginning_balance')}
                                        >
                                            Saldo Awal (Rp)
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
                                {goals.map((goal, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1 + (meta.current_page - 1) * meta.per_page}</TableCell>
                                        <TableCell>
                                            <Progress value={goal.percentage} />
                                        </TableCell>
                                        <TableCell>{goal.name}</TableCell>
                                        <TableCell>{goal.percentage} %</TableCell>
                                        <TableCell>{formatToRupiah(goal.nominal)}</TableCell>
                                        <TableCell>{formatToRupiah(goal.monthly_saving)}</TableCell>
                                        <TableCell>{formatDateIndo(goal.deadline)}</TableCell>
                                        <TableCell>{formatToRupiah(goal.beginning_balance)}</TableCell>
                                        <TableCell>{formatDateIndo(goal.created_at)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-x-1">
                                                <Button variant="yellow" size="sm" asChild>
                                                    <Link href={route('balances.index', [goal])}>
                                                        <IconMoneybag className="size-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="blue" size="sm" asChild>
                                                    <Link href={route('goals.edit', [goal])}>
                                                        <IconPencil className="size-4" />
                                                    </Link>
                                                </Button>
                                                <AlertAction
                                                    trigger={
                                                        <Button variant="red" size="sm">
                                                            <IconTrash className="size-4" />
                                                        </Button>
                                                    }
                                                    action={() => deleteAction(route('goals.destroy', [goal]))}
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
                        {meta.total} tujuan
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
