import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  Package,
  Calendar,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { fetchAllOrders, updateOrderStatus, OrderResponse } from "@/api/orders";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Orders Page

const professionals = ["Mike Thompson", "David Wilson", "James Brown", "Sarah Lee", "Tom Harris"];

const Orders = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchAllOrders,
  });

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    }
  });

  const handleStatusChange = (orderId: number, newStatus: string) => {
    // Map frontend status to backend status if needed
    // The UI uses assigning, assigned, completed
    // Backend uses CREATED, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED
    let backendStatus = newStatus.toUpperCase();
    if (backendStatus === "ASSIGNING") backendStatus = "CREATED";

    statusMutation.mutate({ orderId, status: backendStatus });
  };

  const handleAssignProfessional = (orderId: number, professional: string) => {
    // For now we just update status to ASSIGNED as professional assignment 
    // might need a different endpoint or technicianId field update
    statusMutation.mutate({ orderId, status: "ASSIGNED" });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <PageHeader title="Orders" description="Loading orders..." />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader title="Orders" description="View and manage customer orders" />

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-semibold">Order</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Customer</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Service</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Amount</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Professional</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="table-row-hover border-border/30 cursor-pointer"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{order.orderId}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{order.serviceAddress.fullName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-foreground">{order.productTitle}</p>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium bg-info/20 text-info`}>
                      {order.applianceBrand || "Service"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-foreground">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={order.technicianId?.toString() || ""}
                    onValueChange={(value) => handleAssignProfessional(order.id, value)}
                  >
                    <SelectTrigger className="w-[160px] bg-secondary/50">
                      <SelectValue placeholder="Assign">
                        {order.technicianId && (
                          <span className="flex items-center gap-2">
                            <UserCheck className="w-3.5 h-3.5 text-success" />
                            Tech #{order.technicianId}
                          </span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {professionals.map((prof) => (
                        <SelectItem key={prof} value={prof}>
                          {prof}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={order.status.toLowerCase()}
                    onValueChange={(value) => handleStatusChange(order.id, value)}
                  >
                    <SelectTrigger className="w-[120px] bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created">Created</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default Orders;
