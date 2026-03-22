import { motion } from "framer-motion";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Users as UsersIcon, Loader2 } from "lucide-react";
import { UserResponse } from "@/api/users";

const dummyUsers: UserResponse[] = [
  { id: "1", name: "Rahul Sharma", email: "rahul.sharma@gmail.com", phone: "+91 98765 43210", avatar: "", createdAt: "2025-11-15T10:30:00Z", status: true, ordersCount: 12 },
  { id: "2", name: "Priya Patel", email: "priya.patel@yahoo.com", phone: "+91 87654 32109", avatar: "", createdAt: "2025-12-01T08:00:00Z", status: true, ordersCount: 8 },
  { id: "3", name: "Amit Kumar", email: "amit.kumar@outlook.com", phone: "+91 76543 21098", avatar: "", createdAt: "2026-01-10T14:20:00Z", status: false, ordersCount: 3 },
  { id: "4", name: "Sneha Reddy", email: "sneha.r@gmail.com", phone: "+91 65432 10987", avatar: "", createdAt: "2026-01-22T09:45:00Z", status: true, ordersCount: 15 },
  { id: "5", name: "Vikram Singh", email: "vikram.singh@gmail.com", phone: "+91 54321 09876", avatar: "", createdAt: "2026-02-05T16:10:00Z", status: true, ordersCount: 6 },
  { id: "6", name: "Ananya Gupta", email: "ananya.g@hotmail.com", phone: "+91 43210 98765", avatar: "", createdAt: "2026-02-18T11:30:00Z", status: true, ordersCount: 20 },
  { id: "7", name: "Karthik Nair", email: "karthik.n@gmail.com", phone: "+91 32109 87654", avatar: "", createdAt: "2026-03-01T07:15:00Z", status: false, ordersCount: 1 },
  { id: "8", name: "Deepika Joshi", email: "deepika.j@gmail.com", phone: "+91 21098 76543", avatar: "", createdAt: "2026-03-10T13:00:00Z", status: true, ordersCount: 9 },
];

const Users = () => {
  const data = { users: dummyUsers, totalCount: dummyUsers.length };

  const columns = [
    {
      key: "avatar",
      header: "User",
      render: (item: UserResponse) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={item.avatar} alt={item.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {item.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (item: UserResponse) => (
        <span className="text-muted-foreground">{item.phone || "—"}</span>
      ),
    },
    {
      key: "ordersCount",
      header: "Orders",
      render: (item: UserResponse) => (
        <span className="font-medium text-foreground">{item.ordersCount ?? 0}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: UserResponse) => (
        <StatusBadge status={item.status ? "active" : "inactive"} />
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (item: UserResponse) => (
        <span className="text-muted-foreground text-sm">
          {new Date(item.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <PageHeader
            title="Users"
            description="Manage all registered users"
          />
          {data && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 glass-card px-5 py-3"
            >
              <div className="p-2 rounded-xl bg-primary/10">
                <UsersIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">
                  {data.totalCount.toLocaleString()}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {
          <DataTable
            columns={columns}
            data={data?.users || []}
            keyExtractor={(item) => item.id}
          />
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default Users;
