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
} from "lucide-react";

interface Order {
  id: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  product: {
    id: string;
    title: string;
    type: "REPAIR" | "MAINTENANCE";
    price: number;
  };
  status: "assigning" | "assigned" | "completed";
  professional: string | null;
  orderDate: string;
  schedule: {
    date: string;
    timeSlot: string;
    notes: string;
  };
  transaction: {
    id: string;
    method: string;
    status: string;
    amount: number;
  };
}

// Mock data
const orders: Order[] = [
  {
    id: "ORD-001",
    customer: {
      name: "John Doe",
      phone: "+91 98765 43210",
      email: "john@email.com",
      address: "123 Main St, Apt 4B, Mumbai, MH 400001",
    },
    product: { id: "PRD-001", title: "AC Deep Cleaning", type: "MAINTENANCE", price: 4199 },
    status: "completed",
    professional: "Mike Thompson",
    orderDate: "2024-01-15",
    schedule: { date: "2024-01-18", timeSlot: "10:00 AM - 12:00 PM", notes: "Customer prefers morning slot" },
    transaction: { id: "TXN-001", method: "Credit Card", status: "Completed", amount: 4199 },
  },
  {
    id: "ORD-002",
    customer: {
      name: "Jane Smith",
      phone: "+91 87654 32109",
      email: "jane@email.com",
      address: "456 Oak Ave, Suite 12, Delhi, DL 110001",
    },
    product: { id: "PRD-002", title: "Refrigerator Compressor Repair", type: "REPAIR", price: 12499 },
    status: "assigned",
    professional: "David Wilson",
    orderDate: "2024-01-16",
    schedule: { date: "2024-01-19", timeSlot: "02:00 PM - 04:00 PM", notes: "Ring doorbell on arrival" },
    transaction: { id: "TXN-002", method: "UPI", status: "Completed", amount: 12499 },
  },
  {
    id: "ORD-003",
    customer: {
      name: "Bob Johnson",
      phone: "+91 76543 21098",
      email: "bob@email.com",
      address: "789 Pine Rd, Bangalore, KA 560001",
    },
    product: { id: "PRD-003", title: "Washing Machine Motor Repair", type: "REPAIR", price: 7499 },
    status: "assigning",
    professional: null,
    orderDate: "2024-01-17",
    schedule: { date: "2024-01-20", timeSlot: "04:00 PM - 06:00 PM", notes: "Weekend preferred" },
    transaction: { id: "TXN-003", method: "Credit Card", status: "Pending", amount: 7499 },
  },
];

const professionals = ["Mike Thompson", "David Wilson", "James Brown", "Sarah Lee", "Tom Harris"];

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Order not found</p>
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
                <h1 className="text-2xl font-bold text-foreground">{order.id}</h1>
                <StatusBadge status={order.status} />
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  order.product.type === "REPAIR" 
                    ? "bg-destructive/20 text-destructive" 
                    : "bg-info/20 text-info"
                }`}>
                  {order.product.type}
                </span>
              </div>
              <p className="text-muted-foreground">Order placed on {order.orderDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue={order.status}>
              <SelectTrigger className="w-[140px] bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assigning">Assigning</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
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
                    <p className="font-medium text-foreground">{order.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Phone
                    </p>
                    <p className="font-medium text-foreground">{order.customer.phone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email
                    </p>
                    <p className="font-medium text-foreground">{order.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Address
                    </p>
                    <p className="font-medium text-foreground">{order.customer.address}</p>
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
                  <p className="font-mono font-medium text-foreground">{order.product.id}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30 md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Service Name</p>
                  <p className="font-semibold text-foreground">{order.product.title}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Type</p>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    order.product.type === "REPAIR" 
                      ? "bg-destructive/20 text-destructive" 
                      : "bg-info/20 text-info"
                  }`}>
                    {order.product.type}
                  </span>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Service Amount</p>
                <p className="text-3xl font-bold text-primary">₹{order.product.price.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Service Schedule */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" /> Service Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Scheduled Date</p>
                  <p className="font-semibold text-foreground">{order.schedule.date}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Time Slot</p>
                  <p className="font-semibold text-foreground">{order.schedule.timeSlot}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="font-medium text-foreground">{order.schedule.notes}</p>
                </div>
              </div>
            </div>

            {/* Transaction Info */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-primary" /> Transaction Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                  <p className="font-mono font-medium text-foreground">{order.transaction.id}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                  <p className="font-medium text-foreground">{order.transaction.method}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <StatusBadge 
                    status={order.transaction.status === "Completed" ? "completed" : "pending"} 
                  />
                </div>
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p className="font-bold text-xl text-foreground">₹{order.transaction.amount.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Professional Assignment */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <UserCheck className="w-5 h-5 text-primary" /> Assigned Professional
              </h3>
              {order.professional ? (
                <div className="p-4 rounded-xl bg-success/10 border border-success/30">
                  <p className="font-semibold text-success">{order.professional}</p>
                  <p className="text-sm text-muted-foreground mt-1">Currently assigned</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">No professional assigned yet</p>
                  <Select>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue placeholder="Select Professional" />
                    </SelectTrigger>
                    <SelectContent>
                      {professionals.map((prof) => (
                        <SelectItem key={prof} value={prof}>
                          {prof}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <p className="text-sm text-muted-foreground">{order.orderDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1 ${order.status !== "assigning" ? "bg-success" : "bg-muted"}`} />
                  <div>
                    <p className="font-medium text-foreground">Professional Assigned</p>
                    <p className="text-sm text-muted-foreground">
                      {order.professional || "Pending assignment"}
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
