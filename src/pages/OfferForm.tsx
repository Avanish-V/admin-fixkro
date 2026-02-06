import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, Tag, Package, Percent, Users, Clock, Hash, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { fetchCategories, CategoryResponse } from "@/api/categories";
import { fetchAllProducts, ProductResponse } from "@/api/products";
import { createOffer, updateOffer, fetchOfferById, CreateOfferRequest } from "@/api/offers";

const OfferForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { toast } = useToast();

  const [loading, setLoading] = useState(isEditing);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);

  const [formData, setFormData] = useState<any>({
    couponCode: "",
    categoryId: "all",
    productId: "all",
    discountType: "PERCENTAGE",
    discountValue: 0,
    expiryDate: new Date(),
    limit: 0,
    userType: "REGULAR",
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [categoriesData, productsData] = await Promise.all([
        fetchCategories(),
        fetchAllProducts(),
      ]);
      setCategories(categoriesData);
      setProducts(productsData);

      if (isEditing && id) {
        const offer = await fetchOfferById(id);
        setFormData({
          couponCode: offer.couponCode,
          categoryId: offer.categoryId?.toString() || "all",
          productId: offer.productId?.toString() || "all",
          discountType: offer.discountType,
          discountValue: offer.discountValue,
          expiryDate: new Date(offer.expiryDate),
          limit: offer.limit,
          userType: offer.userType,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (!formData.categoryId || formData.categoryId === "all") {
      return products;
    }
    return products.filter(p => p.categoryId.toString() === formData.categoryId);
  }, [formData.categoryId, products]);

  const handleCategoryChange = (categoryId: string) => {
    setFormData({
      ...formData,
      categoryId,
      productId: "all" // Reset product when category changes
    });
  };

  const handleSave = async () => {
    if (!formData.couponCode) {
      toast({ title: "Error", description: "Coupon code is required", variant: "destructive" });
      return;
    }

    try {
      const payload: CreateOfferRequest = {
        ...formData,
        categoryId: formData.categoryId === "all" ? null : parseInt(formData.categoryId),
        productId: formData.productId === "all" ? null : parseInt(formData.productId),
        expiryDate: formData.expiryDate.toISOString(),
      };

      if (isEditing && id) {
        await updateOffer(id, payload);
        toast({ title: "Success", description: "Offer updated successfully" });
      } else {
        await createOffer(payload);
        toast({ title: "Success", description: "Offer created successfully" });
      }
      navigate("/offers");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save offer",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AdminLayout>
      <PageHeader
        title={isEditing ? "Edit Offer" : "Create New Offer"}
        description={isEditing ? "Update the offer details" : "Create a new discount offer or coupon code"}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/offers")}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Offers
          </Button>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-8">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Tag className="w-5 h-5 text-primary" />
                Coupon Details
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="couponCode">Coupon Code *</Label>
                  <Input
                    id="couponCode"
                    placeholder="e.g., SAVE20"
                    value={formData.couponCode}
                    onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                    className="bg-secondary/50 font-mono text-lg tracking-wider"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use uppercase letters and numbers for coupon codes
                  </p>
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
                      <SelectItem value="FIRST_USER">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-info" />
                          First Time User
                        </div>
                      </SelectItem>
                      <SelectItem value="REGULAR">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Regular User
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Package className="w-5 h-5 text-primary" />
                Product Selection
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.categoryId} value={category.categoryId.toString()}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Product *</Label>
                  <Select
                    value={formData.productId}
                    onValueChange={(value) => setFormData({ ...formData, productId: value })}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      {filteredProducts.map(product => (
                        <SelectItem key={product.productId} value={product.productId.toString()}>
                          {product.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Percent className="w-5 h-5 text-primary" />
                Discount Configuration
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <SelectItem value="PERCENTAGE">
                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4" />
                          Percentage (%)
                        </div>
                      </SelectItem>
                      <SelectItem value="FIXED">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">\u20B9</span>
                          Fixed Amount (\u20B9)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountValue">
                    Discount Value {formData.discountType === "PERCENTAGE" ? "(%)" : "(\u20B9)"}
                  </Label>
                  <div className="relative">
                    <Input
                      id="discountValue"
                      type="number"
                      placeholder="0"
                      value={formData.discountValue || ""}
                      onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                      className="bg-secondary/50 text-lg pr-12"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      {formData.discountType === "PERCENTAGE" ? "%" : "\u20B9"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Clock className="w-5 h-5 text-primary" />
                Validity & Limits
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-secondary/50 h-11"
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
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="limit"
                      type="number"
                      placeholder="0 for unlimited"
                      value={formData.limit || ""}
                      onChange={(e) => setFormData({ ...formData, limit: parseInt(e.target.value) || 0 })}
                      className="bg-secondary/50 pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter 0 for unlimited usage
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            <motion.div
              variants={itemVariants}
              className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Preview</h3>
              <div className="flex flex-wrap items-center gap-4">
                <code className="px-4 py-2 rounded-lg bg-primary/20 text-primary font-mono text-xl font-bold tracking-wider">
                  {formData.couponCode || "COUPONCODE"}
                </code>
                <span className="text-2xl font-bold text-foreground">
                  {formData.discountType === "PERCENTAGE"
                    ? `${formData.discountValue}% OFF`
                    : `\u20B9${formData.discountValue} OFF`}
                </span>
                <span className="text-muted-foreground">
                  • Valid until {format(formData.expiryDate, "MMM dd, yyyy")}
                </span>
              </div>
            </motion.div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate("/offers")}
                className="px-8"
              >
                Cancel
              </Button>
              <Button onClick={handleSave} className="btn-gradient px-8">
                {isEditing ? "Update Offer" : "Create Offer"}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
};

export default OfferForm;
