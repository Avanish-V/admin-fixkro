import { motion } from "framer-motion";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatsCard } from "@/components/ui/StatsCard";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const revenueData = [
  { name: "Jan", revenue: 4000, orders: 24 },
  { name: "Feb", revenue: 3000, orders: 18 },
  { name: "Mar", revenue: 5000, orders: 32 },
  { name: "Apr", revenue: 4500, orders: 28 },
  { name: "May", revenue: 6000, orders: 38 },
  { name: "Jun", revenue: 5500, orders: 35 },
  { name: "Jul", revenue: 7000, orders: 45 },
];

const recentOrders = [
  { id: "ORD-001", customer: "John Doe", service: "AC Repair", status: "completed" as const, amount: "$150" },
  { id: "ORD-002", customer: "Jane Smith", service: "Washing Machine", status: "assigned" as const, amount: "$200" },
  { id: "ORD-003", customer: "Mike Johnson", service: "Refrigerator", status: "assigning" as const, amount: "$180" },
  { id: "ORD-004", customer: "Sarah Wilson", service: "Microwave", status: "completed" as const, amount: "$80" },
  { id: "ORD-005", customer: "Tom Brown", service: "Dishwasher", status: "pending" as const, amount: "$120" },
];

const orderColumns = [
  { key: "id", header: "Order ID" },
  { key: "customer", header: "Customer" },
  { key: "service", header: "Service" },
  {
    key: "status",
    header: "Status",
    render: (item: (typeof recentOrders)[0]) => <StatusBadge status={item.status} />,
  },
  { key: "amount", header: "Amount" },
];

const Dashboard = () => {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Orders"
            value="1,284"
            change="+12.5% from last month"
            changeType="positive"
            icon={ShoppingCart}
            delay={0}
          />
          <StatsCard
            title="Revenue"
            value="$48,574"
            change="+8.2% from last month"
            changeType="positive"
            icon={DollarSign}
            delay={0.1}
          />
          <StatsCard
            title="Active Services"
            value="156"
            change="23 pending"
            changeType="neutral"
            icon={Package}
            delay={0.2}
          />
          <StatsCard
            title="Professionals"
            value="48"
            change="12 online"
            changeType="positive"
            icon={Users}
            delay={0.3}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(32 95% 55%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(32 95% 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                <XAxis dataKey="name" stroke="hsl(215 20% 55%)" />
                <YAxis stroke="hsl(215 20% 55%)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222 47% 10%)",
                    border: "1px solid hsl(222 30% 18%)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(32 95% 55%)"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Orders by Month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                <XAxis dataKey="name" stroke="hsl(215 20% 55%)" />
                <YAxis stroke="hsl(215 20% 55%)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222 47% 10%)",
                    border: "1px solid hsl(222 30% 18%)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="orders" fill="hsl(32 95% 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: CheckCircle2, label: "Completed Today", value: "12", color: "text-success" },
            { icon: Clock, label: "In Progress", value: "8", color: "text-info" },
            { icon: AlertCircle, label: "Pending", value: "5", color: "text-warning" },
            { icon: TrendingUp, label: "Growth Rate", value: "+24%", color: "text-primary" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="glass-card p-4 flex items-center gap-4"
            >
              <div className={`p-3 rounded-xl bg-secondary/50 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Orders</h3>
          <DataTable columns={orderColumns} data={recentOrders} keyExtractor={(item) => item.id} />
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
};

export default Dashboard;
