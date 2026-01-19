import { Skeleton } from "@/components/ui/skeleton";

export function ProjectSkeleton() {
    return (
        <div className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />

            <div className="pt-4 border-t flex justify-between items-center">
                <div className="flex gap-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-8 w-24 rounded-md" />
            </div>
        </div>
    );
}
