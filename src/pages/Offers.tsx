import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Pencil, Trash2, Power, CalendarIcon, Copy } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Offer {
  id: string;
  couponCode: string;
  product: string;
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
    product: "Refrigerator Repair",
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState<Omit<Offer, "id">>({
    couponCode: "",
    product: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    status: "active",
    expiryDate: new Date(),
    limit: 0,
    userType: "REGULAR",
  });
  const { toast } = useToast();

  const handleCreate = () => {
    setEditingOffer(null);
    setFormData({
      couponCode: "",
      product: "",
      discountType: "PERCENTAGE",
      discountValue: 0,
      status: "active",
      expiryDate: new Date(),
      limit: 0,
      userType: "REGULAR",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({ ...offer });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.couponCode || !formData.product) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    if (editingOffer) {
      setOffers(offers.map(o => 
        o.id === editingOffer.id ? { ...formData, id: editingOffer.id } : o
      ));
      toast({ title: "Success", description: "Offer updated successfully" });
    } else {
      const newOffer: Offer = { ...formData, id: Date.now().toString() };
      setOffers([...offers, newOffer]);
      toast({ title: "Success", description: "Offer created successfully" });
    }
    setIsDialogOpen(false);
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

      <AnimatePresence>
        {isDialogOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-card border-border max-w-xl">
              <DialogHeader>
                <DialogTitle>{editingOffer ? "Edit Offer" : "Create Offer"}</DialogTitle>
                <DialogDescription>
                  {editingOffer ? "Update the offer details" : "Create a new discount offer"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="couponCode">Coupon Code *</Label>
                    <Input
                      id="couponCode"
                      placeholder="e.g., SAVE20"
                      value={formData.couponCode}
                      onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                      className="bg-secondary/50 font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product">Product *</Label>
                    <Input
                      id="product"
                      placeholder="Product or category"
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      className="bg-secondary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Discount Type</Label>
                    <Select
                      value={formData.discountType}
                      onValueChange={(value: "FIXED" | "PERCENTAGE") => 
                        setFormData({ ...formData, discountType: value })
                      }
                    >
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                        <SelectItem value="FIXED">Fixed Amount ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountValue">
                      Discount Value {formData.discountType === "PERCENTAGE" ? "(%)" : "($)"}
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      placeholder="0"
                      value={formData.discountValue || ""}
                      onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                      className="bg-secondary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-secondary/50"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(formData.expiryDate, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.expiryDate}
                          onSelect={(date) => date && setFormData({ ...formData, expiryDate: date })}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="limit">Usage Limit</Label>
                    <Input
                      id="limit"
                      type="number"
                      placeholder="0 for unlimited"
                      value={formData.limit || ""}
                      onChange={(e) => setFormData({ ...formData, limit: parseInt(e.target.value) || 0 })}
                      className="bg-secondary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>User Type</Label>
                  <Select
                    value={formData.userType}
                    onValueChange={(value: "FIRST_USER" | "REGULAR") => 
                      setFormData({ ...formData, userType: value })
                    }
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FIRST_USER">First Time User</SelectItem>
                      <SelectItem value="REGULAR">Regular User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="btn-gradient">
                  {editingOffer ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default Offers;
