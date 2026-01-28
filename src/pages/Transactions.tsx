import { motion } from "framer-motion";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  DollarSign,
} from "lucide-react";

interface Transaction {
  id: string;
  orderId: string;
  customer: string;
  type: "credit" | "debit";
  amount: number;
  method: string;
  status: "completed" | "pending" | "failed";
  date: string;
}

const transactions: Transaction[] = [
  {
    id: "TXN-001",
    orderId: "ORD-001",
    customer: "John Doe",
    type: "credit",
    amount: 49.99,
    method: "Credit Card",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "TXN-002",
    orderId: "ORD-002",
    customer: "Jane Smith",
    type: "credit",
    amount: 149.99,
    method: "PayPal",
    status: "completed",
    date: "2024-01-16",
  },
  {
    id: "TXN-003",
    orderId: "ORD-003",
    customer: "Bob Johnson",
    type: "credit",
    amount: 89.99,
    method: "Credit Card",
    status: "pending",
    date: "2024-01-17",
  },
  {
    id: "TXN-004",
    orderId: "ORD-004",
    customer: "Sarah Davis",
    type: "credit",
    amount: 299.99,
    method: "Debit Card",
    status: "completed",
    date: "2024-01-18",
  },
  {
    id: "TXN-005",
    orderId: "REF-001",
    customer: "Mike Wilson",
    type: "debit",
    amount: 50.00,
    method: "Refund",
    status: "completed",
    date: "2024-01-19",
  },
  {
    id: "TXN-006",
    orderId: "ORD-005",
    customer: "Emily Brown",
    type: "credit",
    amount: 199.99,
    method: "Credit Card",
    status: "completed",
    date: "2024-01-20",
  },
];

const Transactions = () => {
  const totalRevenue = transactions
    .filter(t => t.type === "credit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter(t => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  const columns = [
    {
      key: "id",
      header: "Transaction ID",
      render: (item: Transaction) => (
        <span className="font-mono text-sm">{item.id}</span>
      ),
    },
    {
      key: "orderId",
      header: "Order ID",
      render: (item: Transaction) => (
        <span className="font-mono text-sm text-muted-foreground">{item.orderId}</span>
      ),
    },
    { key: "customer", header: "Customer" },
    {
      key: "type",
      header: "Type",
      render: (item: Transaction) => (
        <div className={`flex items-center gap-2 ${
          item.type === "credit" ? "text-success" : "text-destructive"
        }`}>
          {item.type === "credit" ? (
            <ArrowDownLeft className="w-4 h-4" />
          ) : (
            <ArrowUpRight className="w-4 h-4" />
          )}
          <span className="capitalize">{item.type}</span>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (item: Transaction) => (
        <span className={`font-semibold ${
          item.type === "credit" ? "text-success" : "text-destructive"
        }`}>
          {item.type === "credit" ? "+" : "-"}${item.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "method",
      header: "Method",
      render: (item: Transaction) => (
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          {item.method}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Transaction) => (
        <StatusBadge 
          status={item.status === "failed" ? "inactive" : item.status === "pending" ? "pending" : "completed"} 
          label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        />
      ),
    },
    { key: "date", header: "Date" },
  ];

  return (
    <AdminLayout>
      <PageHeader title="Transactions" description="View all payment transactions" />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="stats-card"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/10">
              <DollarSign className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-success">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stats-card"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-warning/10">
              <DollarSign className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-warning">${pendingAmount.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="stats-card"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <DataTable columns={columns} data={transactions} keyExtractor={(item) => item.id} />
    </AdminLayout>
  );
};

export default Transactions;
