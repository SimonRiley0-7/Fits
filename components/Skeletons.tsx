import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Sk = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-lg bg-border/50", className)} />
);

export function StatCardSkeleton() {
  return <div className="card p-5 space-y-3">
    <div className="flex justify-between"><Sk className="h-3 w-20" /><Sk className="h-8 w-8 rounded-lg" /></div>
    <Sk className="h-8 w-28" /><Sk className="h-3 w-16" />
  </div>;
}

export function ListRowSkeleton({ rows = 5 }: { rows?: number }) {
  return <div className="card overflow-hidden divide-y divide-border">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4">
        <Sk className="h-9 w-9 rounded-full shrink-0" />
        <div className="flex-1 space-y-2"><Sk className="h-4 w-[55%]" /><Sk className="h-3 w-[35%]" /></div>
        <Sk className="h-6 w-16 rounded-pill" />
      </div>
    ))}
  </div>;
}

export function ChatSkeleton() {
  return <div className="space-y-3 p-4">
    <div className="flex justify-end"><Sk className="h-9 w-40 rounded-2xl" /></div>
    <div className="flex justify-start"><Sk className="h-16 w-56 rounded-2xl" /></div>
  </div>;
}
