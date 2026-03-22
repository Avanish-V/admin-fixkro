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
  MapPin,
  ShoppingCart,
  Calendar,
} from "lucide-react";
import { UserResponse } from "@/api/users";

const dummyUsers: UserResponse[] = [
  { id: "1", name: "Rahul Sharma", email: "rahul.sharma@gmail.com", phone: "+91 98765 43210", avatar: "", createdAt: "2025-11-15T10:30:00Z", status: true, ordersCount: 12, address: { id: "a1", fullName: "Rahul Sharma", phone: "+91 98765 43210", addressLine1: "42, MG Road", addressLine2: "Near City Mall", city: "Mumbai", state: "Maharashtra", pincode: "400001" } },
  { id: "2", name: "Priya Patel", email: "priya.patel@yahoo.com", phone: "+91 87654 32109", avatar: "", createdAt: "2025-12-01T08:00:00Z", status: true, ordersCount: 8, address: { id: "a2", fullName: "Priya Patel", phone: "+91 87654 32109", addressLine1: "15, Ashram Road", city: "Ahmedabad", state: "Gujarat", pincode: "380009" } },
  { id: "3", name: "Amit Kumar", email: "amit.kumar@outlook.com", phone: "+91 76543 21098", avatar: "", createdAt: "2026-01-10T14:20:00Z", status: false, ordersCount: 3, address: { id: "a3", fullName: "Amit Kumar", phone: "+91 76543 21098", addressLine1: "88, Connaught Place", addressLine2: "Block C", city: "New Delhi", state: "Delhi", pincode: "110001" } },
  { id: "4", name: "Sneha Reddy", email: "sneha.r@gmail.com", phone: "+91 65432 10987", avatar: "", createdAt: "2026-01-22T09:45:00Z", status: true, ordersCount: 15, address: { id: "a4", fullName: "Sneha Reddy", phone: "+91 65432 10987", addressLine1: "3rd Floor, Banjara Hills", city: "Hyderabad", state: "Telangana", pincode: "500034" } },
  { id: "5", name: "Vikram Singh", email: "vikram.singh@gmail.com", phone: "+91 54321 09876", avatar: "", createdAt: "2026-02-05T16:10:00Z", status: true, ordersCount: 6, address: { id: "a5", fullName: "Vikram Singh", phone: "+91 54321 09876", addressLine1: "22, Civil Lines", city: "Jaipur", state: "Rajasthan", pincode: "302006" } },
  { id: "6", name: "Ananya Gupta", email: "ananya.g@hotmail.com", phone: "+91 43210 98765", avatar: "", createdAt: "2026-02-18T11:30:00Z", status: true, ordersCount: 20, address: { id: "a6", fullName: "Ananya Gupta", phone: "+91 43210 98765", addressLine1: "7, Park Street", city: "Kolkata", state: "West Bengal", pincode: "700016" } },
  { id: "7", name: "Karthik Nair", email: "karthik.n@gmail.com", phone: "+91 32109 87654", avatar: "", createdAt: "2026-03-01T07:15:00Z", status: false, ordersCount: 1, address: { id: "a7", fullName: "Karthik Nair", phone: "+91 32109 87654", addressLine1: "56, MG Road", city: "Bangalore", state: "Karnataka", pincode: "560001" } },
  { id: "8", name: "Deepika Joshi", email: "deepika.j@gmail.com", phone: "+91 21098 76543", avatar: "", createdAt: "2026-03-10T13:00:00Z", status: true, ordersCount: 9, address: { id: "a8", fullName: "Deepika Joshi", phone: "+91 21098 76543", addressLine1: "101, FC Road", addressLine2: "Shivaji Nagar", city: "Pune", state: "Maharashtra", pincode: "411005" } },
];

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  const data = { users: dummyUsers, totalCount: dummyUsers.length };

  const filteredUsers = data.users.filter((user) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const addressStr = user.address
      ? `${user.address.addressLine1} ${user.address.addressLine2 || ""} ${user.address.city} ${user.address.state} ${user.address.pincode}`.toLowerCase()
      : "";
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.phone.includes(q) ||
      addressStr.includes(q)
    );
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
      key: "address",
      header: "Address",
      render: (item: UserResponse) => (
        <span className="text-muted-foreground text-sm max-w-[200px] truncate block">
          {item.address ? `${item.address.city}, ${item.address.state}` : "—"}
        </span>
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
                {data.totalCount.toLocaleString()}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Search */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-border"
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredUsers}
          keyExtractor={(item) => item.id}
        />

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
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      {selectedUser.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedUser.name}</h3>
                    <StatusBadge status={selectedUser.status ? "active" : "inactive"} />
                  </div>
                </div>

                {/* Info Grid */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{selectedUser.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{selectedUser.ordersCount} Orders</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">
                      Joined {new Date(selectedUser.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Address */}
                {selectedUser.address && (
                  <div className="rounded-xl bg-secondary/50 p-4 space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">Address</span>
                    </div>
                    <p className="text-sm text-foreground">{selectedUser.address.addressLine1}</p>
                    {selectedUser.address.addressLine2 && (
                      <p className="text-sm text-muted-foreground">{selectedUser.address.addressLine2}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.address.city}, {selectedUser.address.state} — {selectedUser.address.pincode}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </AdminLayout>
  );
};

export default Users;
