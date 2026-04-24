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
  Loader2,
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
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats } from "@/api/dashboard";
import { fetchAllOrders, OrderResponse } from "@/api/orders";

const Dashboard = () => {
  const { data: stats, isLoading: isStatsLoading, error: statsError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  });

  const { data: allOrders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ["all-orders"],
    queryFn: fetchAllOrders,
  });

  const isLoading = isStatsLoading || isOrdersLoading;
  const error = statsError;

  const completedOrdersList = allOrders.filter(order => order.status.toUpperCase() === "COMPLETED");
  const totalCompletedOrders = completedOrdersList.length;
  const totalCompletedRevenue = completedOrdersList.reduce((sum, order) => sum + order.totalAmount, 0);

  const orderColumns = [
    { 
      key: "orderId", 
      header: "Order ID",
      render: (item: OrderResponse) => <span className="font-bold">#{item.orderId.slice(-8).toUpperCase()}</span>
    },
    {
      key: "serviceAddress",
      header: "Customer",
      render: (item: OrderResponse) => item.serviceAddress.fullName
    },
    { key: "productTitle", header: "Service" },
    {
      key: "status",
      header: "Status",
      render: (item: OrderResponse) => <StatusBadge status={item.status.toLowerCase() as any} />,
    },
    {
      key: "totalAmount",
      header: "Amount",
      render: (item: OrderResponse) => `₹${item.totalAmount.toLocaleString('en-IN')}`
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-destructive">
          <p>Error loading dashboard data. Please try again later.</p>
        </div>
      </AdminLayout>
    );
  }

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
            title="Completed Orders"
            value={totalCompletedOrders.toLocaleString()}
            change={stats.growthRate + " from last month"}
            changeType="positive"
            icon={CheckCircle2}
            delay={0}
          />
          <StatsCard
            title="Completed Revenue"
            value={`₹${totalCompletedRevenue.toLocaleString('en-IN')}`}
            change="+8.2% from last month"
            changeType="positive"
            icon={DollarSign}
            delay={0.1}
          />
          <StatsCard
            title="Active Services"
            value={stats.activeServices.toString()}
            change="Across categories"
            changeType="neutral"
            icon={Package}
            delay={0.2}
          />
          <StatsCard
            title="Professionals"
            value={stats.totalProfessionals.toString()}
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
              <AreaChart data={stats.revenueData}>
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
              <BarChart data={stats.revenueData}>
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
            { icon: CheckCircle2, label: "Completed Today", value: stats.completedToday.toString(), color: "text-success" },
            { icon: Clock, label: "In Progress", value: stats.inProgress.toString(), color: "text-info" },
            { icon: AlertCircle, label: "Pending", value: stats.pending.toString(), color: "text-warning" },
            { icon: TrendingUp, label: "Growth Rate", value: stats.growthRate, color: "text-primary" },
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
          </div>
          <DataTable
            columns={orderColumns}
            data={stats.recentOrders}
            keyExtractor={(item) => item.id.toString()}
          />
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
};

export default Dashboard;
