import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users as UsersIcon,
  Search,
  Eye,
  Mail,
  Phone,
  ShoppingCart,
  Calendar,
} from "lucide-react";
import { fetchUsers, UserResponse } from "@/api/users";
import { useQuery } from "@tanstack/react-query";

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const filteredUsers = (users || []).filter((user) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (user.name?.toLowerCase() || "").includes(q) ||
      (user.email?.toLowerCase() || "").includes(q) ||
      (user.phoneNumber?.includes(q) || false)
    );
  });

  const columns = [
    {
      key: "avatar",
      header: "User",
      render: (item: UserResponse) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={item.avatar} alt={item.name || "User"} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {item.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{item.name || "Anonymous"}</p>
            <p className="text-xs text-muted-foreground">{item.email || "No email"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phoneNumber",
      header: "Phone",
      render: (item: UserResponse) => (
        <span className="text-muted-foreground">{item.phoneNumber || "—"}</span>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (item: UserResponse) => (
        <span className="text-muted-foreground uppercase text-xs font-semibold">{item.role}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: UserResponse) => (
        <StatusBadge status={item.status === "ACTIVE" ? "active" : "inactive"} />
      ),
    },
    {
      key: "actions",
      header: "Action",
      render: (item: UserResponse) => (
        <button
          onClick={() => setSelectedUser(item)}
          className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
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
          <PageHeader title="Users" description="Manage all registered users" />
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
                {(users?.length || 0).toLocaleString()}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Search */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-border"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredUsers}
            keyExtractor={(item) => item.id.toString()}
          />
        )}

        {/* Profile Dialog */}
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">User Profile</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                {/* Avatar & Name */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name || "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      {selectedUser.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedUser.name || "Anonymous"}</h3>
                    <div className="flex gap-2 items-center">
                       <StatusBadge status={selectedUser.status === "ACTIVE" ? "active" : "inactive"} />
                       <span className="text-xs text-muted-foreground uppercase font-bold">{selectedUser.role}</span>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{selectedUser.email || "No email"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{selectedUser.phoneNumber || "No phone"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">
                      Joined {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </AdminLayout>
  );
};

export default Users;
