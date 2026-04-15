import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  Package,
  Calendar,
  CreditCard,
  Clock,
  UserCheck,
  Mail,
  XCircle,
  Loader2,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Star,
  UserMinus,
  Trash2
} from "lucide-react";
import { fetchOrder, updateOrderStatus, cancelOrder, assignTechnician, unassignTechnician, OrderResponse as Order } from "@/api/orders";
import { fetchProfessionals } from "@/api/professionals";
import { ProfessionalSelectorDialog } from "@/components/orders/ProfessionalSelectorDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const orderId = parseInt(id || "0");

  const { data: order, isLoading: isOrderLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
    enabled: !!orderId,
  });

  const { data: professionals = [] } = useQuery({
    queryKey: ["professionals"],
    queryFn: fetchProfessionals,
  });

  const isLoading = isOrderLoading;

  const statusMutation = useMutation({
    mutationFn: (newStatus: string) => updateOrderStatus(orderId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      toast.success("Order status updated");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    }
  });

  const cancelMutation = useMutation({
    mutationFn: (reason: string) => cancelOrder(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      toast.success("Order cancelled");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to cancel order");
    }
  });

  const assignMutation = useMutation({
    mutationFn: (techId: number) => assignTechnician(orderId, techId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      toast.success("Professional assigned and notification alert sent!");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to assign professional");
    }
  });

  const unassignMutation = useMutation({
    mutationFn: () => unassignTechnician(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      toast.success("Professional removed from order");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to remove professional");
    }
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-muted-foreground">
          <p>Order not found</p>
          <Button variant="outline" onClick={() => navigate("/orders")} className="mt-4">
            Back to Orders
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/orders")}
              className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{order.orderId}</h1>
                <StatusBadge status={order.status.toLowerCase() as any} />
                <span className={`px-2 py-0.5 rounded text-xs font-medium bg-info/20 text-info`}>
                  {order.applianceBrand || "Service"}
                </span>
              </div>
              <p className="text-muted-foreground">Order placed on {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={order.status.toUpperCase()}
              onValueChange={(val) => statusMutation.mutate(val)}
            >
              <SelectTrigger className="w-[160px] bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CREATED">Created</SelectItem>
                <SelectItem value="ASSIGNED">Assigned</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>

            {order.status !== "CANCELLED" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  const reason = window.prompt("Enter cancellation reason:");
                  if (reason !== null) cancelMutation.mutate(reason);
                }}
              >
                <XCircle className="w-4 h-4 mr-2" /> Cancel
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" /> Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                    <p className="font-medium text-foreground">{order.serviceAddress.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Phone
                    </p>
                    <p className="font-medium text-foreground">{order.serviceAddress.phone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email
                    </p>
                    <p className="font-medium text-foreground">Customer: {order.customerId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Address
                    </p>
                    <p className="font-medium text-foreground">
                      {order.serviceAddress.addressLine1}, {order.serviceAddress.city}, {order.serviceAddress.state} - {order.serviceAddress.postalCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-primary" /> Service Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Product ID</p>
                  <p className="font-mono font-medium text-foreground">{order.productId}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30 md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Service Name</p>
                  <p className="font-semibold text-foreground">{order.productTitle}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Brand/Model</p>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium bg-info/20 text-info`}>
                    {order.applianceBrand} {order.applianceModel}
                  </span>
                </div>
              </div>
              <div className="mt-6 p-6 rounded-2xl bg-secondary/20 border border-border/50">
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Pricing Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Base Price</span>
                    <span className="font-medium text-foreground">₹{order.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium text-foreground">₹{order.tax.toLocaleString('en-IN')}</span>
                  </div>
                  {order.discount !== null && order.discount !== undefined && order.discount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Discount Applied</span>
                        {order.couponCode && (
                          <span className="text-[10px] text-success font-mono uppercase tracking-wider">
                            Code: {order.couponCode}
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-success">-₹{order.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {order.offerId && !order.couponCode && (
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-muted-foreground">Offer ID</span>
                      <span className="font-mono text-muted-foreground">{order.offerId}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-border/50 flex justify-between items-center">
                    <span className="font-semibold text-foreground text-lg">Total Payable</span>
                    <span className="text-2xl font-bold text-primary">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Schedule */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" /> Service Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Scheduled Date/Time</p>
                  <p className="font-semibold text-foreground">{order.scheduledAt || "Not scheduled"}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Completed At</p>
                  <p className="font-semibold text-foreground">{order.completedAt ? new Date(order.completedAt).toLocaleString() : "Pending"}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Cancellation Reason</p>
                  <p className="font-medium text-destructive">{order.cancellationReason || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Transaction Info */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" /> Transaction Details
                </h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Business Order ID</p>
                  <p className="font-mono text-sm font-medium text-foreground truncate" title={order.orderId}>{order.orderId}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Payment Mode</p>
                  <p className="font-medium text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {order.paymentMode || "Not Specified"}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                  <StatusBadge
                    status={order.paymentStatus.toLowerCase() as any}
                  />
                </div>
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1 font-semibold">Net Received</p>
                  <p className="font-bold text-xl text-primary">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Professional Assignment */}
            <div className="glass-card p-6 overflow-hidden relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-primary" /> Assigned Professional
                </h3>
              </div>
              
              {order.technicianId ? (() => {
                const assignedProf = professionals.find(p => p.id === order.technicianId);
                return (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 group">
                      <Avatar className="w-16 h-16 border-2 border-primary/20 ring-4 ring-primary/5">
                        <AvatarImage src={order.technicianPhoto || assignedProf?.photo} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {(order.technicianName || "T").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-foreground text-lg truncate hover:text-primary transition-colors cursor-pointer">
                          {order.technicianName || assignedProf?.name || `Tech #${order.technicianId}`}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="bg-success/20 text-success border-success/30 px-2 py-0 h-5 text-[10px] uppercase font-black">
                            Active
                          </Badge>
                          <div className="flex items-center text-xs font-bold text-amber-500">
                             <Star className="w-3 h-3 fill-current mr-0.5" />
                             {(assignedProf?.rating ?? 5.0).toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-dashed border-border/60">
                      <div className="flex items-center justify-between text-xs text-muted-foreground bg-secondary/30 p-2 rounded-lg">
                        <div className="flex items-center gap-2 pr-2 border-r border-border/50 flex-1">
                           <Phone className="w-3 h-3" />
                           <span className="font-medium text-foreground">{assignedProf?.mobile || "No Mobile"}</span>
                        </div>
                        <div className="flex items-center gap-2 pl-2 flex-1">
                           <ShieldCheck className="w-3 h-3 text-primary" />
                           <span className="font-medium text-foreground">Verified ID</span>
                        </div>
                      </div>

                      {assignedProf?.expertise && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {assignedProf.expertise.slice(0, 3).map((exp, idx) => (
                            <Badge key={idx} variant="outline" className="text-[9px] bg-primary/5 text-primary/80 border-primary/20 hover:bg-primary/10 py-0">
                              {exp}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex gap-2">
                       <ProfessionalSelectorDialog 
                         professionals={professionals}
                         currentlyAssignedId={order.technicianId}
                         onSelect={(techId) => assignMutation.mutate(techId)}
                         trigger={
                           <Button variant="outline" size="sm" className="flex-1 text-xs hover:bg-secondary/40 h-10 gap-2 border-dashed">
                             <MessageSquare className="w-3 h-3" /> Change
                           </Button>
                         }
                       />
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         onClick={() => {
                           if (confirm("Are you sure you want to remove this professional from the order?")) {
                             unassignMutation.mutate();
                           }
                         }}
                         className="h-10 text-destructive hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20"
                       >
                         <UserMinus className="w-4 h-4" />
                       </Button>
                    </div>
                  </div>
                );
              })() : (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 rounded-xl bg-secondary/20 border border-dashed border-border/60">
                  <div className="w-12 h-12 rounded-full bg-secondary/40 flex items-center justify-center text-muted-foreground/60 ring-8 ring-secondary/10">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">No Professional Assigned</p>
                    <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">Assign a verified professional to start this service order.</p>
                  </div>
                  <ProfessionalSelectorDialog 
                    professionals={professionals}
                    onSelect={(techId) => assignMutation.mutate(techId)}
                    trigger={
                      <Button className="btn-gradient w-40 text-xs shadow-lg h-9">
                         Pick Professional
                      </Button>
                    }
                  />
                </div>
              )}
            </div>

            {/* Order Timeline */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" /> Order Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-success mt-1" />
                  <div>
                    <p className="font-medium text-foreground">Order Placed</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1 ${order.status !== "assigning" ? "bg-success" : "bg-muted"}`} />
                  <div>
                    <p className="font-medium text-foreground">Professional Assigned</p>
                    <p className="text-sm text-muted-foreground">
                      {order.technicianId ? `Tech #${order.technicianId}` : "Pending assignment"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1 ${order.status === "completed" ? "bg-success" : "bg-muted"}`} />
                  <div>
                    <p className="font-medium text-foreground">Service Completed</p>
                    <p className="text-sm text-muted-foreground">
                      {order.status === "completed" ? "Completed" : "In progress"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default OrderDetail;
