import { Link } from '@inertiajs/react';
import { IconCash } from '@tabler/icons-react';

export default function ApplicationLogo({ url = '#' }) {
    return (
        <Link href={url} className="mt-6 flex items-center gap-x-2">
            <div className="rounded-xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-gray-200 p-2">
                <IconCash className="size-6 text-white" />
            </div>
            <span className="text-xl font-semibold leading-relaxed tracking-wide dark:text-cyan-500">
                SakuQ <span className="text-lg text-cyan-500 dark:text-white">+</span>
            </span>
        </Link>
    );
}
