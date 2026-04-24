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
  incomplete: "bg-muted text-muted-foreground border border-border/50",
  paid: "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30",
  cancelled: "bg-destructive/10 text-destructive border border-destructive/20",
  cancelled_by_user: "bg-destructive/10 text-destructive border border-destructive/20",
  failed: "bg-destructive/20 text-destructive border border-destructive/40",
  in_progress: "bg-amber-500/20 text-amber-500 border border-amber-500/30",
  created: "bg-blue-500/20 text-blue-500 border border-blue-500/30"
};

const statusLabels: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  completed: "Completed",
  assigning: "Assigning",
  assigned: "Assigned",
  expired: "Expired",
  incomplete: "Incomplete",
  paid: "Paid",
  cancelled: "Cancelled",
  cancelled_by_user: "Cancelled by User",
  failed: "Failed",
  in_progress: "In Progress",
  created: "Created"
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
