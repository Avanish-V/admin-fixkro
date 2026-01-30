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
      phone: "+91 98765 43210",
      email: "john@email.com",
      address: "123 Main St, Apt 4B, Mumbai, MH 400001",
    },
    product: { title: "AC Deep Cleaning", type: "MAINTENANCE", price: 4199 },
    status: "completed",
    professional: "Mike Thompson",
    orderDate: "2024-01-15",
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
    product: { title: "Refrigerator Compressor Repair", type: "REPAIR", price: 12499 },
    status: "assigned",
    professional: "David Wilson",
    orderDate: "2024-01-16",
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
    product: { title: "Washing Machine Motor Repair", type: "REPAIR", price: 7499 },
    status: "assigning",
    professional: null,
    orderDate: "2024-01-17",
    transaction: { id: "TXN-003", method: "Credit Card", status: "Pending", amount: 7499 },
  },
  {
    id: "ORD-004",
    customer: {
      name: "Sarah Davis",
      phone: "+91 65432 10987",
      email: "sarah@email.com",
      address: "321 Elm St, Chennai, TN 600001",
    },
    product: { title: "AC Installation", type: "MAINTENANCE", price: 24999 },
    status: "assigned",
    professional: "James Brown",
    orderDate: "2024-01-18",
    transaction: { id: "TXN-004", method: "Debit Card", status: "Completed", amount: 24999 },
  },
];

const professionals = ["Mike Thompson", "David Wilson", "James Brown", "Sarah Lee", "Tom Harris"];

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const navigate = useNavigate();

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
                      <p className="font-semibold text-foreground">{order.id}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {order.orderDate}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{order.customer.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-foreground">{order.product.title}</p>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      order.product.type === "REPAIR" 
                        ? "bg-destructive/20 text-destructive" 
                        : "bg-info/20 text-info"
                    }`}>
                      {order.product.type}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-foreground">₹{order.product.price.toLocaleString('en-IN')}</p>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={order.professional || ""}
                    onValueChange={(value) => handleAssignProfessional(order.id, value)}
                  >
                    <SelectTrigger className="w-[160px] bg-secondary/50">
                      <SelectValue placeholder="Assign">
                        {order.professional && (
                          <span className="flex items-center gap-2">
                            <UserCheck className="w-3.5 h-3.5 text-success" />
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
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={order.status}
                    onValueChange={(value: Order["status"]) => handleStatusChange(order.id, value)}
                  >
                    <SelectTrigger className="w-[120px] bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assigning">Assigning</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
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
