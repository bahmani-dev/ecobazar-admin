import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface Props {
    status?: string;
    canResetPassword: boolean;
}

function LeafMark({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
            <path d="M5 19C5 10 10.5 4 20 4c0 9.500-6 15-15 15Z" />
            <path d="M5 19c3.500-5 6.500-8 10.500-10" />
        </svg>
    );
}

export default function Login({ status, canResetPassword }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    const input =
        'rounded-admin mt-1.5 block w-full border bg-white px-3.5 py-2.5 text-sm text-admin-ink placeholder:text-admin-muted/60 focus:outline-none focus:ring-2 focus:ring-admin-accent/30';

    return (
        <div className="grid min-h-screen bg-admin-bg font-sans text-admin-ink lg:grid-cols-[1.05fr_1fr]">
            <Head title="Sign in" />

            {/* Brand panel */}
            <aside className="relative hidden overflow-hidden bg-admin-sidebar p-12 text-white lg:flex lg:flex-col lg:justify-between">
                <svg className="pointer-events-none absolute -bottom-40 -right-40 h-[640px] w-[640px] text-white/[0.06]" viewBox="0 0 600 600" fill="none" stroke="currentColor" aria-hidden="true">
                    {[60, 120, 180, 240, 300].map((r) => (
                        <circle key={r} cx="300" cy="300" r={r} strokeWidth="1.5" />
                    ))}
                </svg>

                <div className="relative flex items-center gap-2.5 text-lg font-semibold tracking-tight">
                    <LeafMark className="h-6 w-6 text-[#9DBB8E]" />
                    Ecobazar
                </div>

                <div className="relative max-w-md">
                    <h2 className="text-4xl font-semibold leading-tight tracking-tight">
                        Everything behind the storefront, in one place.
                    </h2>
                    <p className="mt-4 text-[15px] leading-relaxed text-admin-sidebarMuted">
                        Manage the catalog, orders and your team, with every change recorded in the activity log.
                    </p>
                </div>

                <p className="relative text-sm text-admin-sidebarMuted/70">Ecobazar Ecommerce · Admin panel</p>
            </aside>

            {/* Form panel */}
            <main className="flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm">
                    <div className="mb-8 flex items-center gap-2 text-lg font-semibold tracking-tight lg:hidden">
                        <LeafMark className="h-6 w-6 text-admin-accent" />
                        Ecobazar
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
                    <p className="mt-1.5 text-sm text-admin-muted">Use your staff account to continue to the admin panel.</p>

                    {status && (
                        <div role="status" className="rounded-admin mt-5 bg-admin-accentSoft px-4 py-2.5 text-sm text-admin-accent">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
                        <div>
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                autoFocus
                                placeholder="you@ecobazar.com"
                                onChange={(e) => setData('email', e.target.value)}
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                                className={`${input} ${errors.email ? 'border-admin-danger' : 'border-admin-border focus:border-admin-accent'}`}
                            />
                            {errors.email && <p id="email-error" className="mt-1.5 text-xs text-admin-danger">{errors.email}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium">Password</label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-xs text-admin-accent hover:underline">
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    aria-invalid={!!errors.password}
                                    className={`${input} pr-16 ${errors.password ? 'border-admin-danger' : 'border-admin-border focus:border-admin-accent'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute inset-y-0 right-0 mt-1.5 px-3.5 text-xs font-medium text-admin-muted hover:text-admin-ink"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1.5 text-xs text-admin-danger">{errors.password}</p>}
                        </div>

                        <label className="flex items-center gap-2 text-sm text-admin-muted">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded border-admin-border text-admin-accent focus:ring-admin-accent"
                            />
                            Keep me signed in on this device
                        </label>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-admin w-full bg-admin-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-admin-accentHover focus:outline-none focus:ring-2 focus:ring-admin-accent/40 focus:ring-offset-2 disabled:opacity-60"
                        >
                            {processing ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
