import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pencil, Trash2, Power, Copy, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Offer, fetchOffers, deleteOffer, toggleOfferStatus } from "@/api/offers";
import { Badge } from "@/components/ui/badge";

const Offers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const data = await fetchOffers();
      setOffers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load offers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    navigate("/offers/new");
  };

  const handleEdit = (offer: Offer) => {
    navigate(`/offers/${offer.id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    try {
      await deleteOffer(id);
      setOffers(offers.filter(o => o.id !== id));
      toast({ title: "Deleted", description: "Offer has been removed" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete offer",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const updated = await toggleOfferStatus(id);
      setOffers(offers.map(o => o.id === id ? updated : o));
      toast({
        title: "Success",
        description: `Offer is now ${updated.status.toLowerCase()}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: `Coupon code "${code}" copied to clipboard` });
  };

  const columns = [
    {
      key: "couponCode",
      header: "Coupon / Offer",
      render: (item: Offer) => (
        <div className="flex flex-col gap-1">
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
          {item.shortDescription && (
            <span className="text-[10px] text-muted-foreground truncate max-w-[150px]" title={item.shortDescription}>
              {item.shortDescription}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item: Offer) => item.categoryName || "All Categories"
    },
    {
      key: "product",
      header: "Product",
      render: (item: Offer) => item.productName || "All Products"
    },
    {
      key: "discount",
      header: "Discount",
      render: (item: Offer) => (
        <span className="font-semibold">
          {item.discountType === "PERCENTAGE" ? `${item.discountValue}%` : `\u20B9${item.discountValue}`}
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
      render: (item: Offer) => {
        const isExpired = new Date(item.expiryDate) < new Date();
        return (
          <div className="flex flex-col gap-1">
            <span className={cn(isExpired && "text-destructive line-through")}>
              {format(new Date(item.expiryDate), "MMM dd, yyyy")}
            </span>
            {isExpired && (
              <Badge variant="outline" className="text-[9px] py-0 px-1 border-destructive text-destructive w-fit">
                Expired
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: "limit",
      header: "Limit",
      render: (item: Offer) => item.limit === 0 ? "Unlimited" : item.limit
    },
    {
      key: "status",
      header: "Status",
      render: (item: Offer) => {
        const isExpired = new Date(item.expiryDate) < new Date();
        if (isExpired) return <StatusBadge status="expired" />;
        return <StatusBadge status={item.status.toLowerCase() as "active" | "inactive"} />;
      },
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
            className={`p-2 rounded-lg transition-colors ${item.status === "ACTIVE"
              ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable columns={columns} data={offers} keyExtractor={(item) => item.id} />
      )}
    </AdminLayout>
  );
};

export default Offers;
