import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  highlight?: boolean;
  testId?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, highlight, testId }: StatCardProps) {
  return (
    <Card className={`p-8 ${highlight ? "border-primary/30 bg-card/80" : ""}`} data-testid={`card-${testId || title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
        {Icon && (
          <Icon className={`w-6 h-6 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
        )}
      </div>
      <motion.div
        key={value}
        initial={{ scale: 1.05, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`text-4xl md:text-5xl lg:text-6xl font-mono font-bold ${
          highlight ? "text-primary" : "text-foreground"
        }`}
        data-testid={testId}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </motion.div>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-4">{subtitle}</p>
      )}
    </Card>
  );
}
