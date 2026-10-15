import { PropsWithChildren } from 'react';

export type Tone = 'accent' | 'danger' | 'warn' | 'info' | 'neutral';

const tones: Record<Tone, string> = {
    accent: 'bg-admin-accentSoft text-admin-accent',
    danger: 'bg-admin-dangerSoft text-admin-danger',
    warn: 'bg-admin-warnSoft text-admin-warn',
    info: 'bg-admin-infoSoft text-admin-info',
    neutral: 'border border-admin-border bg-admin-bg text-admin-muted',
};

export default function Badge({ tone = 'neutral', children }: PropsWithChildren<{ tone?: Tone }>) {
    return (
        <span className={`rounded-admin inline-flex items-center px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>
            {children}
        </span>
    );
}
