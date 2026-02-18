import { cn } from "@/lib/utils";

type StatusType = "active" | "inactive" | "pending" | "completed" | "assigning" | "assigned" | "expired";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const statusStyles: Record<StatusType, string> = {
  active: "status-active",
  inactive: "status-inactive",
  pending: "status-pending",
  completed: "bg-success/20 text-success border border-success/30",
  assigning: "status-pending",
  assigned: "status-info",
  expired: "bg-destructive/10 text-destructive border border-destructive/20",
};

const statusLabels: Record<StatusType, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  completed: "Completed",
  assigning: "Assigning",
  assigned: "Assigned",
  expired: "Expired",
};

export const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
        statusStyles[status]
      )}
    >
      {label || statusLabels[status]}
    </span>
  );
};
