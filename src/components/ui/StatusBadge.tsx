import { cn } from "@/lib/utils";

type StatusType = "active" | "inactive" | "pending" | "completed" | "assigning" | "assigned" | "expired" | "incomplete" | string;

interface StatusBadgeProps {
  status: string;
  label?: string;
}

const statusStyles: Record<string, string> = {
  active: "status-active",
  inactive: "status-inactive",
  pending: "status-pending",
  completed: "bg-success/20 text-success border border-success/30",
  assigning: "status-pending",
  assigned: "status-info",
  expired: "bg-destructive/10 text-destructive border border-destructive/20",
  incomplete: "bg-muted text-muted-foreground border border-border/50"
};

const statusLabels: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  completed: "Completed",
  assigning: "Assigning",
  assigned: "Assigned",
  expired: "Expired",
  incomplete: "Incomplete"
};

export const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const normalizedStatus = (status || "").toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium uppercase",
        statusStyles[normalizedStatus] || "bg-secondary text-muted-foreground"
      )}
    >
      {label || statusLabels[normalizedStatus] || status}
    </span>
  );
};
