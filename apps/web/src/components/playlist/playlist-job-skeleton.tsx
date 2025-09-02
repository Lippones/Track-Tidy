import { Skeleton } from '@workspace/ui/components/skeleton'

export function PlayListJobSkeleton() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            className="rounded-lg p-4 animate-pulse bg-accent/40"
          >
            <div className="flex flex-col space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-8 w-full" />
            </div>
          </Skeleton>
        ))}
      </div>
    </div>
  )
}
