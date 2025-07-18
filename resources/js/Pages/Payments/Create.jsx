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
import { IconArrowBack, IconCheck, IconCreditCardPay } from '@tabler/icons-react';
import { toast } from 'sonner';

export default function Create(props) {
    const { data, setData, errors, post, processing, reset } = useForm({
        name: '',
        type: null,
        account_number: '',
        account_owner: '',
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
                            icon={IconCreditCardPay}
                        />
                        <Button variant="cyan" size="xl" asChild>
                            <Link href={route('payments.index')}>
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
                                        {props.paymentTypes.find((type) => type.value == data.type)?.label ??
                                            'Pilih tipe'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {props.paymentTypes.map((type, index) => (
                                        <SelectItem key={index} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.type && <InputError message={errors.type} />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Nama</Label>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Masukkan nama"
                                value={data.name}
                                onChange={onHandleChange}
                            />
                            {errors.name && <InputError message={errors.name} />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="account_number">Nomor Rekening</Label>
                            <Input
                                type="text"
                                name="account_number"
                                id="account_number"
                                placeholder="Masukkan nomor rekening"
                                value={data.account_number}
                                onChange={onHandleChange}
                            />
                            {errors.account_number && <InputError message={errors.account_number} />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="account_owner">Nama Rekening</Label>
                            <Input
                                type="text"
                                name="account_owner"
                                id="account_owner"
                                placeholder="Masukkan nama rekening"
                                value={data.account_owner}
                                onChange={onHandleChange}
                            />
                            {errors.account_owner && <InputError message={errors.account_owner} />}
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
