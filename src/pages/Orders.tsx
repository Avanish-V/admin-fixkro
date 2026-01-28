import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  Phone,
  User,
  Package,
  DollarSign,
  Calendar,
  ChevronRight,
  UserCheck,
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
    title: string;
    type: "REPAIR" | "MAINTENANCE";
    price: number;
  };
  status: "assigning" | "assigned" | "completed";
  professional: string | null;
  orderDate: string;
  transaction: {
    id: string;
    method: string;
    status: string;
    amount: number;
  };
}

const initialOrders: Order[] = [
  {
    id: "ORD-001",
    customer: {
      name: "John Doe",
      phone: "+1 234 567 890",
      email: "john@email.com",
      address: "123 Main St, Apt 4B, New York, NY 10001",
    },
    product: { title: "AC Deep Cleaning", type: "MAINTENANCE", price: 49.99 },
    status: "completed",
    professional: "Mike Thompson",
    orderDate: "2024-01-15",
    transaction: { id: "TXN-001", method: "Credit Card", status: "Completed", amount: 49.99 },
  },
  {
    id: "ORD-002",
    customer: {
      name: "Jane Smith",
      phone: "+1 345 678 901",
      email: "jane@email.com",
      address: "456 Oak Ave, Suite 12, Los Angeles, CA 90001",
    },
    product: { title: "Refrigerator Compressor Repair", type: "REPAIR", price: 149.99 },
    status: "assigned",
    professional: "David Wilson",
    orderDate: "2024-01-16",
    transaction: { id: "TXN-002", method: "PayPal", status: "Completed", amount: 149.99 },
  },
  {
    id: "ORD-003",
    customer: {
      name: "Bob Johnson",
      phone: "+1 456 789 012",
      email: "bob@email.com",
      address: "789 Pine Rd, Chicago, IL 60601",
    },
    product: { title: "Washing Machine Motor Repair", type: "REPAIR", price: 89.99 },
    status: "assigning",
    professional: null,
    orderDate: "2024-01-17",
    transaction: { id: "TXN-003", method: "Credit Card", status: "Pending", amount: 89.99 },
  },
  {
    id: "ORD-004",
    customer: {
      name: "Sarah Davis",
      phone: "+1 567 890 123",
      email: "sarah@email.com",
      address: "321 Elm St, Houston, TX 77001",
    },
    product: { title: "AC Installation", type: "MAINTENANCE", price: 299.99 },
    status: "assigned",
    professional: "James Brown",
    orderDate: "2024-01-18",
    transaction: { id: "TXN-004", method: "Debit Card", status: "Completed", amount: 299.99 },
  },
];

const professionals = ["Mike Thompson", "David Wilson", "James Brown", "Sarah Lee", "Tom Harris"];

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
  };

  const handleAssignProfessional = (orderId: string, professional: string) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, professional, status: "assigned" as const } : o
    ));
  };

  const openDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  return (
    <AdminLayout>
      <PageHeader title="Orders" description="View and manage customer orders" />

      <div className="space-y-4">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Order Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-foreground">{order.id}</h3>
                    <StatusBadge status={order.status} />
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      order.product.type === "REPAIR" 
                        ? "bg-destructive/20 text-destructive" 
                        : "bg-info/20 text-info"
                    }`}>
                      {order.product.type}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{order.product.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {order.customer.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {order.orderDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ${order.product.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                {/* Professional Assignment */}
                <div className="min-w-[200px]">
                  <Select
                    value={order.professional || ""}
                    onValueChange={(value) => handleAssignProfessional(order.id, value)}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue placeholder="Assign Professional">
                        {order.professional && (
                          <span className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-success" />
                            {order.professional}
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
                </div>

                {/* Status Change */}
                <Select
                  value={order.status}
                  onValueChange={(value: Order["status"]) => handleStatusChange(order.id, value)}
                >
                  <SelectTrigger className="w-[140px] bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assigning">Assigning</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Details */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openDetail(order)}
                  className="p-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Complete order information and transaction details
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Customer Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4" /> Customer Information
                </h4>
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/30">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedOrder.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Phone
                    </p>
                    <p className="font-medium">{selectedOrder.customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Address
                    </p>
                    <p className="font-medium">{selectedOrder.customer.address}</p>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Package className="w-4 h-4" /> Product Details
                </h4>
                <div className="p-4 rounded-lg bg-secondary/30 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedOrder.product.title}</p>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      selectedOrder.product.type === "REPAIR" 
                        ? "bg-destructive/20 text-destructive" 
                        : "bg-info/20 text-info"
                    }`}>
                      {selectedOrder.product.type}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-primary">${selectedOrder.product.price}</p>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Transaction Details
                </h4>
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/30">
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction ID</p>
                    <p className="font-mono font-medium">{selectedOrder.transaction.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium">{selectedOrder.transaction.method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <StatusBadge 
                      status={selectedOrder.transaction.status === "Completed" ? "completed" : "pending"} 
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-bold text-lg">${selectedOrder.transaction.amount}</p>
                  </div>
                </div>
              </div>

              {/* Professional */}
              {selectedOrder.professional && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <UserCheck className="w-4 h-4" /> Assigned Professional
                  </h4>
                  <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                    <p className="font-medium text-success">{selectedOrder.professional}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Orders;
