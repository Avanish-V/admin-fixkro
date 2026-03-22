import { motion } from "framer-motion";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Users as UsersIcon, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers, UserResponse } from "@/api/users";

const Users = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

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

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-destructive">
            <p>Error loading users. Please try again.</p>
          </div>
        ) : (
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
