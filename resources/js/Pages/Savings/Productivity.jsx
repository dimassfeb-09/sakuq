import { Button } from '@/Components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { cn, formatDateIndo } from '@/lib/utils';

export default function Productivity({ transactions }) {
    const columns = [];
    let currentColumn = [];

    const backgroundProductivity = (count) => {
        if (count > 25) return 'bg-cyan-400';
        if (count > 10) return 'bg-cyan-500';
        if (count > 3) return 'bg-cyan-600';
        if (count > 0) return 'bg-cyan-700';
        return 'bg-background';
    };

    transactions.forEach((item, index) => {
        currentColumn.push(
            <TooltipProvider key={index}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className={cn(
                                'h-6 w-6 rounded-full border border-input shadow-none',
                                backgroundProductivity(item.count),
                            )}
                            size="sm"
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        {item.count} Kontribusi menabung pada {formatDateIndo(item.transaction_date)}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>,
        );

        if (currentColumn.length == 9) {
            columns.push(currentColumn);
            currentColumn = [];
        }
    });

    if (currentColumn.length > 0) {
        columns.push(currentColumn);
    }
    return (
        <div className="flex flex-wrap gap-1.5">
            {columns.map((column, index) => (
                <div key={index} className="flex flex-col gap-1.5">
                    {column}
                </div>
            ))}
        </div>
    );
}
