import { router } from '@inertiajs/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Toaster } from '@/Components/ui/sonner';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

function flashMessage(params) {
    return params.props.flash_message;
}

const deleteAction = (url, { closeModal, ...options } = {}) => {
    const defaultOptions = {
        preserveScroll: true,
        preserveState: true,

        onSuccess: (success) => {
            const flash = flashMessage(success);
            if (flash) {
                Toaster[flash.type](flash.message);
            }

            if (closeModal && typeof closeModal == 'function') {
                closeModal();
            }
        },

        ...options,
    };

    router.delete(url, defaultOptions);
};

const formatDateIndo = (dateString) => {
    if (!dateString) return '-';

    return format(parseISO(dateString), 'eeee, dd MMMM yyyy', {
        locale: id,
    });
};

const formatToRupiah = (amount) => {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return formatter.format(amount);
};

const BUDGETTYPE = {
    INCOME: 'Penghasilan',
    SAVING: 'Tabungan dan Investasi',
    DEBT: 'Cicilan Hutang',
    BILL: 'Tagihan',
    SHOPPING: 'Belanja',
};

const BUDGETTYPEVARIANT = {
    [BUDGETTYPE.INCOME]: 'emerald',
    [BUDGETTYPE.SAVING]: 'orange',
    [BUDGETTYPE.DEBT]: 'red',
    [BUDGETTYPE.BILL]: 'sky',
    [BUDGETTYPE.SHOPPING]: 'purple',
};

const MONTHTYPE = {
    JANUARY: 'Januari',
    FEBRUARI: 'Februari',
    MARET: 'Maret',
    APRIL: 'April',
    MEI: 'Mei',
    JUNI: 'Juni',
    JULI: 'Juli',
    AGUSTUS: 'Agustus',
    SEPTEMBER: 'September',
    OKTOBER: 'Oktober',
    NOVEMBER: 'November',
    DESEMBER: 'Desember',
};

const MONTHTYPEVARIANT = {
    [MONTHTYPE.JANUARY]: 'fuchsia',
    [MONTHTYPE.FEBRUARI]: 'orange',
    [MONTHTYPE.MARET]: 'emerald',
    [MONTHTYPE.APRIL]: 'sky',
    [MONTHTYPE.MEI]: 'purple',
    [MONTHTYPE.JUNI]: 'rose',
    [MONTHTYPE.JULI]: 'pink',
    [MONTHTYPE.AGUSTUS]: 'red',
    [MONTHTYPE.SEPTEMBER]: 'blue',
    [MONTHTYPE.OKTOBER]: 'lime',
    [MONTHTYPE.NOVEMBER]: 'teal',
    [MONTHTYPE.DESEMBER]: 'violet',
};

const ASSETTYPE = {
    CASH: 'Kas',
    PERSONAL: 'Personal',
    SHORTTERM: 'Investasi Jangka Pendek',
    MIDTERM: 'Investasi Jangka Menengah',
    LONGTERM: 'Investasi Jangka Panjang',
};

const ASSETDESCRIPTION = {
    [ASSETTYPE.CASH]: 'Uang tunai yang tersedia untuk kebutuhan operasional sehari-hari',
    [ASSETTYPE.PERSONAL]:
        'Pengelolaan keuangan pribadi, termasuk tabungan dan anggaran untuk mencapai tujuan keuangan jangka pendek maupun panjang',
    [ASSETTYPE.SHORTTERM]: 'Investasi yang bertujuan untuk memperoleh keuntungan dalam waktu singkat',
    [ASSETTYPE.MIDTERM]: 'Investasi dengan periode pengembalian antara satu hingga 5 tahun',
    [ASSETTYPE.LONGTERM]: 'Investasi dengan horizon lebih dari lima tahun, bertujuan memperoleh keuntungan maksimal',
};

const ASSETTYPEVARIANT = {
    [ASSETTYPE.CASH]: 'emerald',
    [ASSETTYPE.PERSONAL]: 'orange',
    [ASSETTYPE.SHORTTERM]: 'red',
    [ASSETTYPE.MIDTERM]: 'sky',
    [ASSETTYPE.LONGTERM]: 'purple',
};

const LIABILITYTYPE = {
    SHORTTERMDEBT: 'Hutang Jangka Pendek',
    MIDTERMDEBT: 'Hutang Jangka Menengah',
    LONGTERMDEBT: 'Hutang Jangka Panjang',
};

const LIABILITYTYPEVARIANT = {
    [LIABILITYTYPE.SHORTTERMDEBT]: 'emerald',
    [LIABILITYTYPE.MIDTERMDEBT]: 'orange',
    [LIABILITYTYPE.LONGTERMDEBT]: 'red',
};

const LIABILITYDESCRIPTION = {
    [LIABILITYTYPE.SHORTTERMDEBT]: 'Tenor 1-5 Tahun',
    [LIABILITYTYPE.MIDTERMDEBT]: 'Tenor 5-10 Tahun',
    [LIABILITYTYPE.LONGTERMDEBT]: 'Tenor > 10 Tahun',
};

const message = {
    503: {
        title: 'Service Unavailaable',
        description: 'Sorry, we are doing some maintenance. Please try again later.',
    },
    500: {
        title: 'Server Error',
        description: 'Oops, something went wrong.',
        status: 500,
    },
    404: {
        title: 'Not Found',
        description: 'Sorry, the page you are looking for was not found.',
        status: 404,
    },
    403: {
        title: 'Forbidden',
        description: 'Sorry, you are forbidden from accessing this page.',
        status: 403,
    },
    401: {
        title: 'Unauthorized',
        description: 'Sorry, you are unauthorized to access this page',
        status: 401,
    },
    429: {
        title: 'Too Many Request',
        description: 'Please try again in just a second.',
        status: 429,
    },
};

export {
    ASSETDESCRIPTION,
    ASSETTYPE,
    ASSETTYPEVARIANT,
    BUDGETTYPE,
    BUDGETTYPEVARIANT,
    cn,
    deleteAction,
    flashMessage,
    formatDateIndo,
    formatToRupiah,
    LIABILITYDESCRIPTION,
    LIABILITYTYPE,
    LIABILITYTYPEVARIANT,
    message,
    MONTHTYPE,
    MONTHTYPEVARIANT,
};
