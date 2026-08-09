import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import NumberTicker from "@/components/ui/number-ticker";   // from Magic UI
import { MagicCard } from "@/components/ui/magic-card";     // from Magic UI

export function StatCard({ label, value, change, icon: Icon, positive = true }: {
  label: string; value: number; change?: string; icon: LucideIcon; positive?: boolean;
}) {
  return (
    <MagicCard className="card p-5 cursor-default" gradientColor="#C95E3515">
      <div className="flex items-start justify-between mb-3">
        <p className="t-label">{label}</p>
        <div className="p-2 bg-p-soft rounded-lg"><Icon size={15} className="text-p" /></div>
      </div>
      <p className="font-display text-3xl font-bold text-tx mb-1">
        <NumberTicker value={value} />
      </p>
      {change && (
        <p className={`t-small font-medium ${positive ? "text-green-600" : "text-red-500"}`}>
          {positive ? "↑" : "↓"} {change}
        </p>
      )}
    </MagicCard>
  );
}
