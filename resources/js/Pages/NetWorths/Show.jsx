import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { Badge } from '@/Components/ui/badge';
import BreadcrumbHeader from '@/Components/ui/BreadcrumbHeader';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import CardStat from '@/Components/ui/CardStat';
import EmptyState from '@/Components/ui/EmptyState';
import HeaderTitle from '@/Components/ui/HeaderTitle';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import AppLayout from '@/Layouts/AppLayout';
import {
    ASSETDESCRIPTION,
    ASSETTYPEVARIANT,
    formatDateIndo,
    formatToRupiah,
    LIABILITYDESCRIPTION,
    LIABILITYTYPEVARIANT,
} from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { IconArrowBack, IconCash, IconInfoCircle, IconMenorah, IconX } from '@tabler/icons-react';

export default function Show(props) {
    const netWorthAssets = props.netWorthAssets;
    const netWorthLiabilities = props.netWorthLiabilities;
    return (
        <div className="flex w-full flex-col gap-y-6 pb-32">
            <BreadcrumbHeader items={props.items} />
            <Card>
                <CardHeader className="p0">
                    <div className="flex flex-col items-start justify-between gap-y-4 p-4 lg:flex-row lg:items-center">
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
            </Card>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <CardStat
                    data={{
                        title: 'Tujuan Kekayaan Bersih',
                        icon: IconCash,
                        background: 'text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-500',
                    }}
                >
                    <div className="text-2xl font-bold">{formatToRupiah(props.netWorth.net_worth_goal)}</div>
                </CardStat>
                <CardStat
                    data={{
                        title: 'Kekayaan Bersih Sekarang',
                        icon: IconCash,
                        background: 'text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-500',
                    }}
                >
                    <div className="text-2xl font-bold">{formatToRupiah(props.netWorth.current_net_worth)}</div>
                </CardStat>
                <CardStat
                    data={{
                        title: 'Jumlah yang Tersisa',
                        icon: IconCash,
                        background: 'text-white bg-gradient-to-r from-red-400 via-red-500 to-red-500',
                    }}
                >
                    <div className="text-2xl font-bold">{formatToRupiah(props.netWorth.amount_left)}</div>
                </CardStat>
            </div>
            <Alert variant="info">
                <IconInfoCircle className="size-6" />
                <AlertTitle>Aset</AlertTitle>
                <AlertDescription>
                    Aset adalah sesuatu yang dimiliki oleh individu atau perusahaan yang memiliki nilai ekonomi dan
                    dapat memberikan manfaat di masa depan. Contohnya: uang tunai, properti, investasi, piutang, atau
                    peralatan.
                </AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                <CardStat
                    data={{
                        title: 'Total Kas',
                        icon: IconCash,
                        background: 'text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-500',
                    }}
                >
                    <div className="text-2xl font-bold">{formatToRupiah(props.assetSum.assetCashNominalSum)}</div>
                </CardStat>
                <CardStat
                    data={{
                        title: 'Total Personal',
                        icon: IconCash,
                        background: 'text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-500',
                    }}
                >
                    <div className="text-2xl font-bold">{formatToRupiah(props.assetSum.assetPersonalNominalSum)}</div>
                </CardStat>
                <CardStat
                    data={{
                        title: 'Total Investasi Jangka Pendek',
                        icon: IconCash,
                        background: 'text-white bg-gradient-to-r from-red-400 via-red-500 to-red-500',
                    }}
                >
                    <div className="text-2xl font-bold">{formatToRupiah(props.assetSum.assetShortTermNominalSum)}</div>
                </CardStat>
                <CardStat
                    data={{
                        title: 'Total Investasi Jangka Menengah',
                        icon: IconCash,
                        background: 'text-white bg-gradient-to-r from-sky-400 via-sky-500 to-sky-500',
                    }}
                >
                    <div className="text-2xl font-bold">{formatToRupiah(props.assetSum.assetMidTermNominalSum)}</div>
                </CardStat>
                <CardStat
                    data={{
                        title: 'Total Investasi Jangka Panjang',
                        icon: IconCash,
                        background: 'text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-500',
                    }}
                >
                    <div className="text-2xl font-bold">{formatToRupiah(props.assetSum.assetLongTermNominalSum)}</div>
                </CardStat>
            </div>
            {Object.keys(netWorthAssets).map((netWorthAsset, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle>
                            <Badge variant={ASSETTYPEVARIANT[netWorthAsset]}>{netWorthAsset}</Badge>
                        </CardTitle>
                        <CardDescription>{ASSETDESCRIPTION[netWorthAsset]}</CardDescription>
                    </CardHeader>
                    {netWorthAssets[netWorthAsset].length == 0 ? (
                        <EmptyState
                            icon={IconMenorah}
                            title={`Tidak ada aset kekayaan bersih (${netWorthAsset})`}
                            subtitle={`Mulai dengan membuat aset (${netWorthAsset}) baru`}
                        />
                    ) : (
                        <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="border" rowSpan="2">
                                            #
                                        </TableHead>
                                        <TableHead className="border" rowSpan="2">
                                            Detail
                                        </TableHead>
                                        <TableHead className="border" rowSpan="2">
                                            Tujuan
                                        </TableHead>
                                        {Array.from(
                                            {
                                                length: Math.max(
                                                    ...netWorthAssets[netWorthAsset].map(
                                                        (asset) => asset.transactions.length,
                                                    ),
                                                ),
                                            },
                                            (_, idx) => (
                                                <TableHead className="border" key={idx}>
                                                    {idx + 1}
                                                </TableHead>
                                            ),
                                        )}
                                    </TableRow>
                                    <TableRow>
                                        {Array.from(
                                            {
                                                length: Math.max(
                                                    ...netWorthAssets[netWorthAsset].map(
                                                        (asset) => asset.transactions.length,
                                                    ),
                                                ),
                                            },
                                            (_, idx) => (
                                                <TableHead className="border" key={`transactions-${idx}`}>
                                                    {netWorthAssets[netWorthAsset]
                                                        .map((asset) =>
                                                            formatDateIndo(asset.transactions[idx]?.transaction_date),
                                                        )
                                                        .filter(Boolean)[0] || '-'}
                                                </TableHead>
                                            ),
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {netWorthAssets[netWorthAsset].map((asset, nwaIdx) => (
                                        <TableRow key={nwaIdx}>
                                            <TableCell>{nwaIdx + 1}</TableCell>
                                            <TableCell>{asset.detail}</TableCell>
                                            <TableCell>{asset.goal}</TableCell>
                                            {asset.transactions.map((transaction, tIdx) => (
                                                <TableCell key={tIdx}>
                                                    {transaction.transaction_date && transaction.nominal != null ? (
                                                        formatToRupiah(transaction.nominal)
                                                    ) : (
                                                        <IconX className="size-4 text-red-500" />
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter className="bg-gradient-to-br from-cyan-500 via-cyan-500 to-gray-100 font-bold text-white">
                                    <TableRow>
                                        <TableCell colSpan="3">Total</TableCell>
                                        {Array.from(
                                            {
                                                length: Math.max(
                                                    ...netWorthAssets[netWorthAsset].map(
                                                        (asset) => asset.transactions.length,
                                                    ),
                                                ),
                                            },
                                            (_, idx) => (
                                                <TableCell key={`total-${idx}`}>
                                                    {props.netWorthAssetSummaries[netWorthAsset]?.[idx]
                                                        ? formatToRupiah(
                                                              props.netWorthAssetSummaries[netWorthAsset][idx],
                                                          )
                                                        : formatToRupiah(0)}
                                                </TableCell>
                                            ),
                                        )}
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </CardContent>
                    )}
                </Card>
            ))}

            <Alert variant="info">
                <IconInfoCircle className="size-6" />
                <AlertTitle>Liabilitas</AlertTitle>
                <AlertDescription>
                    Liabilitas adalah kewajiban atau hutang yang harus dibayar oleh individu atau perusahaan kepada
                    pihak lain di masa depan.
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <CardStat
                    data={{
                        title: 'Total Hutang Jangka Pendek',
                        icon: IconCash,
                        background: 'text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-500',
                    }}
                >
                    <div className="text-2xl font-bold">
                        {formatToRupiah(props.liabilitySum.liabilityShortTermDebtNominalSum)}
                    </div>
                </CardStat>
                <CardStat
                    data={{
                        title: 'Total Hutang Jangka Menengah',
                        icon: IconCash,
                        background: 'text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-500',
                    }}
                >
                    <div className="text-2xl font-bold">
                        {formatToRupiah(props.liabilitySum.liabilityMidTermDebtNominalSum)}
                    </div>
                </CardStat>
                <CardStat
                    data={{
                        title: 'Total Hutang Jangka Panjang',
                        icon: IconCash,
                        background: 'text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-500',
                    }}
                >
                    <div className="text-2xl font-bold">
                        {formatToRupiah(props.liabilitySum.liabilityLongTermDebtNominalSum)}
                    </div>
                </CardStat>
            </div>

            {Object.keys(netWorthLiabilities).map((netWorthLiability, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle>
                            <Badge variant={LIABILITYTYPEVARIANT[netWorthLiability]}>{netWorthLiability}</Badge>
                        </CardTitle>
                        <CardDescription>{LIABILITYDESCRIPTION[netWorthLiability]}</CardDescription>
                    </CardHeader>
                    {netWorthLiabilities[netWorthLiability].length == 0 ? (
                        <EmptyState
                            icon={IconMenorah}
                            title={`Tidak ada kewajiban kekayaan bersih (${netWorthLiability})`}
                            subtitle={`Mulai dengan membuat kewajiban (${netWorthLiability}) baru`}
                        />
                    ) : (
                        <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="border" rowSpan="2">
                                            #
                                        </TableHead>
                                        <TableHead className="border" rowSpan="2">
                                            Detail
                                        </TableHead>
                                        <TableHead className="border" rowSpan="2">
                                            Tujuan
                                        </TableHead>
                                        {Array.from(
                                            {
                                                length: Math.max(
                                                    ...netWorthLiabilities[netWorthLiability].map(
                                                        (liability) => liability.transactions.length,
                                                    ),
                                                ),
                                            },
                                            (_, idx) => (
                                                <TableHead className="border" key={idx}>
                                                    {idx + 1}
                                                </TableHead>
                                            ),
                                        )}
                                    </TableRow>
                                    <TableRow>
                                        {Array.from(
                                            {
                                                length: Math.max(
                                                    ...netWorthLiabilities[netWorthLiability].map(
                                                        (liability) => liability.transactions.length,
                                                    ),
                                                ),
                                            },
                                            (_, idx) => (
                                                <TableHead className="border" key={`transactions-${idx}`}>
                                                    {netWorthLiabilities[netWorthLiability]
                                                        .map((liability) =>
                                                            formatDateIndo(
                                                                liability.transactions[idx]?.transaction_date,
                                                            ),
                                                        )
                                                        .filter(Boolean)[0] || '-'}
                                                </TableHead>
                                            ),
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {netWorthLiabilities[netWorthLiability].map((liability, nwaIdx) => (
                                        <TableRow key={nwaIdx}>
                                            <TableCell>{nwaIdx + 1}</TableCell>
                                            <TableCell>{liability.detail}</TableCell>
                                            <TableCell>{liability.goal}</TableCell>
                                            {liability.transactions.map((transaction, tIdx) => (
                                                <TableCell key={tIdx}>
                                                    {transaction.transaction_date && transaction.nominal != null ? (
                                                        formatToRupiah(transaction.nominal)
                                                    ) : (
                                                        <IconX className="size-4 text-red-500" />
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter className="bg-gradient-to-br from-cyan-500 via-cyan-500 to-gray-100 font-bold text-white">
                                    <TableRow>
                                        <TableCell colSpan="3">Total</TableCell>
                                        {Array.from(
                                            {
                                                length: Math.max(
                                                    ...netWorthLiabilities[netWorthLiability].map(
                                                        (liability) => liability.transactions.length,
                                                    ),
                                                ),
                                            },
                                            (_, idx) => (
                                                <TableCell key={`total-${idx}`}>
                                                    {props.netWorthLiabilitySummaries[netWorthLiability]?.[idx]
                                                        ? formatToRupiah(
                                                              props.netWorthLiabilitySummaries[netWorthLiability][idx],
                                                          )
                                                        : formatToRupiah(0)}
                                                </TableCell>
                                            ),
                                        )}
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </CardContent>
                    )}
                </Card>
            ))}
        </div>
    );
}

Show.layout = (page) => <AppLayout children={page} title={page.props.pageSettings.title} />;
