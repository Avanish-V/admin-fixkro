import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pencil, Trash2, Power, Copy } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Offer {
  id: string;
  couponCode: string;
  product: string;
  category: string;
  discountType: "FIXED" | "PERCENTAGE";
  discountValue: number;
  status: "active" | "inactive";
  expiryDate: Date;
  limit: number;
  userType: "FIRST_USER" | "REGULAR";
}

const initialOffers: Offer[] = [
  {
    id: "1",
    couponCode: "FIRST50",
    product: "AC Deep Cleaning",
    category: "Air Conditioner",
    discountType: "PERCENTAGE",
    discountValue: 50,
    status: "active",
    expiryDate: new Date("2024-12-31"),
    limit: 100,
    userType: "FIRST_USER",
  },
  {
    id: "2",
    couponCode: "SAVE20",
    product: "All Services",
    category: "All Categories",
    discountType: "FIXED",
    discountValue: 20,
    status: "active",
    expiryDate: new Date("2024-11-30"),
    limit: 500,
    userType: "REGULAR",
  },
  {
    id: "3",
    couponCode: "SUMMER25",
    product: "Refrigerator Compressor Repair",
    category: "Refrigerator",
    discountType: "PERCENTAGE",
    discountValue: 25,
    status: "inactive",
    expiryDate: new Date("2024-08-31"),
    limit: 200,
    userType: "REGULAR",
  },
];

const Offers = () => {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreate = () => {
    navigate("/offers/new");
  };

  const handleEdit = (offer: Offer) => {
    navigate(`/offers/${offer.id}/edit`);
  };

  const handleDelete = (id: string) => {
    setOffers(offers.filter(o => o.id !== id));
    toast({ title: "Deleted", description: "Offer has been removed" });
  };

  const handleToggleStatus = (id: string) => {
    setOffers(offers.map(o => 
      o.id === id 
        ? { ...o, status: o.status === "active" ? "inactive" : "active" }
        : o
    ));
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: `Coupon code "${code}" copied to clipboard` });
  };

  const columns = [
    {
      key: "couponCode",
      header: "Coupon Code",
      render: (item: Offer) => (
        <div className="flex items-center gap-2">
          <code className="px-2 py-1 rounded bg-primary/10 text-primary font-mono text-sm">
            {item.couponCode}
          </code>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => copyCode(item.couponCode)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Copy className="w-4 h-4" />
          </motion.button>
        </div>
      ),
    },
    { key: "category", header: "Category" },
    { key: "product", header: "Product" },
    {
      key: "discount",
      header: "Discount",
      render: (item: Offer) => (
        <span className="font-semibold">
          {item.discountType === "PERCENTAGE" ? `${item.discountValue}%` : `$${item.discountValue}`}
        </span>
      ),
    },
    {
      key: "userType",
      header: "User Type",
      render: (item: Offer) => (
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          item.userType === "FIRST_USER" 
            ? "bg-info/20 text-info" 
            : "bg-secondary text-muted-foreground"
        )}>
          {item.userType === "FIRST_USER" ? "First User" : "Regular"}
        </span>
      ),
    },
    {
      key: "expiryDate",
      header: "Expires",
      render: (item: Offer) => format(item.expiryDate, "MMM dd, yyyy"),
    },
    { key: "limit", header: "Limit" },
    {
      key: "status",
      header: "Status",
      render: (item: Offer) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: Offer) => (
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleEdit(item)}
            className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleToggleStatus(item.id)}
            className={`p-2 rounded-lg transition-colors ${
              item.status === "active"
                ? "bg-success/10 text-success hover:bg-success/20"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Power className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDelete(item.id)}
            className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Offers & Coupons"
        description="Manage discount offers and coupon codes"
        action={{ label: "Add Offer", onClick: handleCreate }}
      />

      <DataTable columns={columns} data={offers} keyExtractor={(item) => item.id} />
    </AdminLayout>
  );
};

export default Offers;
