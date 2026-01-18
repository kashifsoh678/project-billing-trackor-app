import { Skeleton } from "@/components/ui/skeleton";

export function ProjectDetailSkeleton() {
    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header Skeleton */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                </div>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 w-full max-w-2xl">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    <Skeleton className="h-10 w-32 shrink-0 rounded-md" />
                </div>

                <div className="flex flex-wrap gap-4">
                    <Skeleton className="h-8 w-28 rounded-full" />
                    <Skeleton className="h-8 w-40 rounded-full" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
                {/* Kanban Columns Skeleton */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((col) => (
                        <div key={col} className="bg-muted/30 rounded-xl p-4 space-y-4 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-2">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-5 w-8 rounded-full" />
                            </div>
                            {[1, 2].map((card) => (
                                <div key={card} className="bg-card border rounded-lg p-4 space-y-3 shadow-sm">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <div className="pt-2 border-t flex justify-between items-center">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-7 w-7 rounded-sm" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Sidebar Skeleton */}
                <div className="space-y-6">
                    <div className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
                        <Skeleton className="h-6 w-1/2 mb-4" />
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                            <div className="pt-4 border-t flex justify-between">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
