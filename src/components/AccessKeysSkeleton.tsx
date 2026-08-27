function SkeletonBlock({ className = '' }: { className?: string }) {
    return <span className={`block animate-pulse rounded-md bg-zinc-800 ${className}`} aria-hidden="true" />;
}

export default function AccessKeysSkeleton() {
    return (
        <div className="px-6 py-8 lg:px-8" aria-busy="true" aria-label="Loading Flow access keys" role="status">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                        <SkeletonBlock className="h-3 w-28" />
                        <SkeletonBlock className="h-8 w-44" />
                        <SkeletonBlock className="h-4 w-72 max-w-full" />
                    </div>
                    <SkeletonBlock className="h-11 w-48" />
                </div>

                <div className="mb-4 flex flex-col gap-2.5 sm:flex-row">
                    <SkeletonBlock className="h-9 w-full max-w-sm" />
                    <SkeletonBlock className="h-9 w-32" />
                    <SkeletonBlock className="h-9 w-24" />
                </div>

                <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                    <div className="hidden min-w-190 md:block">
                        <div className="grid grid-cols-[1.4fr_1.5fr_1fr_1fr_1fr_32px] gap-4 border-b border-zinc-800 px-4 py-3">
                            {['w-16', 'w-24', 'w-20', 'w-20', 'w-20', 'w-4'].map((width, index) => <SkeletonBlock key={index} className={`h-3 ${width}`} />)}
                        </div>
                        {Array.from({ length: 8 }, (_, index) => (
                            <div key={index} className="grid grid-cols-[1.4fr_1.5fr_1fr_1fr_1fr_32px] items-center gap-4 border-b border-zinc-800/50 px-4 py-4 last:border-0">
                                <SkeletonBlock className="h-4 w-32" />
                                <SkeletonBlock className="h-4 w-40" />
                                <SkeletonBlock className="h-5 w-16" />
                                <SkeletonBlock className="h-4 w-24" />
                                <SkeletonBlock className="h-4 w-24" />
                                <SkeletonBlock className="h-5 w-5 rounded-full" />
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4 p-4 md:hidden">
                        {Array.from({ length: 5 }, (_, index) => (
                            <div key={index} className="space-y-3 border-b border-zinc-800/50 pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between gap-4"><SkeletonBlock className="h-4 w-36" /><SkeletonBlock className="h-5 w-16" /></div>
                                <SkeletonBlock className="h-3 w-48" />
                                <div className="flex gap-4"><SkeletonBlock className="h-3 w-24" /><SkeletonBlock className="h-3 w-24" /></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
