import Link from "next/link";

interface EmptyStateProps {
    title: string;
    body: string;
    action: string;
    actionHref: string;
}

export default function EmptyState({ title, body, action, actionHref }: EmptyStateProps) {
    return (
        <div className="border border-dashed border-border-default rounded-[8px] p-10 text-center flex flex-col items-center justify-center bg-canvas">
            <h3 className="text-[14px] font-medium text-ink-primary mb-1">{title}</h3>
            <p className="text-[13px] text-ink-secondary mb-4 max-w-sm">{body}</p>
            <Link 
                href={actionHref}
                className="bg-surface border border-border-default text-ink-primary text-[13px] font-medium px-4 py-2 rounded-[6px] hover:bg-elevated hover:border-border-strong transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus"
            >
                {action}
            </Link>
        </div>
    )
}
