import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Plus, Search, Edit2, Trash2, MessageSquare, Loader2, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Review, fetchReviews, createReview, updateReview, deleteReview } from "@/api/reviews";
import { ProductResponse, fetchAllProducts } from "@/api/products";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const StarRating = ({
  rating,
  onRatingChange,
  interactive = false,
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={cn(
            "transition-transform",
            interactive && "hover:scale-110 cursor-pointer"
          )}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => onRatingChange?.(star)}
        >
          <Star
            className={cn(
              "w-5 h-5 transition-colors",
              (hoverRating || rating) >= star
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
};

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProduct, setFilterProduct] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    productId: "",
    customerName: "",
    rating: 0,
    technicianRating: 0,
    isRecommended: true,
    impressions: [] as string[],
    comment: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reviewsData, productsData] = await Promise.all([
        fetchReviews(),
        fetchAllProducts(),
      ]);
      setReviews(reviewsData);
      setProducts(productsData);
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

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProduct =
      filterProduct === "all" || review.productId.toString() === filterProduct;
    return matchesSearch && matchesProduct;
  });

  const handleOpenDialog = (review?: Review) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        productId: review.productId.toString(),
        customerName: review.customerName,
        rating: review.rating,
        technicianRating: review.technicianRating || 0,
        isRecommended: review.isRecommended !== false,
        impressions: review.impressions || [],
        comment: review.comment,
      });
    } else {
      setEditingReview(null);
      setFormData({
        productId: "",
        customerName: "",
        rating: 0,
        technicianRating: 0,
        isRecommended: true,
        impressions: [],
        comment: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.productId || !formData.customerName || !formData.rating || !formData.comment) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingReview) {
        const updated = await updateReview(editingReview.id.toString(), {
          ...formData,
          productId: formData.productId,
        });
        setReviews(reviews.map((r) => (r.id === updated.id ? updated : r)));
        toast({ title: "Success", description: "Review updated successfully" });
      } else {
        const created = await createReview({
          ...formData,
          productId: formData.productId,
        });
        setReviews([created, ...reviews]);
        toast({ title: "Success", description: "Review added successfully" });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save review",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(id);
      setReviews(reviews.filter((r) => r.id !== id));
      toast({ title: "Success", description: "Review deleted successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Product Reviews"
          description="Manage customer reviews for your services"
          action={{
            label: "Add Review",
            onClick: () => handleOpenDialog(),
            icon: Plus,
          }}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold text-foreground">{averageRating}</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold text-foreground">{reviews.length}</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-green-500 fill-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">5-Star Reviews</p>
                <p className="text-2xl font-bold text-foreground">
                  {reviews.filter((r) => r.rating === 5).length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterProduct} onValueChange={setFilterProduct}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {products.map((product) => (
                <SelectItem key={product.productId} value={product.productId.toString()}>
                  {product.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-semibold text-foreground">
                        {review.customerName}
                      </span>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">Service:</span>
                          <StarRating rating={review.rating} />
                        </div>
                        <div className="flex items-center gap-1 border-l border-border pl-4">
                          <span className="text-xs text-muted-foreground">Technician:</span>
                          <StarRating rating={review.technicianRating} />
                        </div>
                      </div>
                      {review.isRecommended ? (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-none flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> Recommended
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-none flex items-center gap-1">
                          <ThumbsDown className="w-3 h-3" /> Not Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-primary font-medium mb-2">
                      {review.productName}
                    </p>
                    <p className="text-muted-foreground mb-3">{review.comment}</p>

                    {review.impressions && review.impressions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {review.impressions.map((imp, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] px-2 py-0">
                            {imp}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenDialog(review)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(review.id.toString())}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredReviews.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No reviews found</p>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingReview ? "Edit Review" : "Add New Review"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Select Product *</Label>
                <Select
                  value={formData.productId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, productId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.productId} value={product.productId.toString()}>
                        {product.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  placeholder="Enter customer name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Service Rating *</Label>
                  <StarRating
                    rating={formData.rating}
                    onRatingChange={(rating) =>
                      setFormData({ ...formData, rating })
                    }
                    interactive
                  />
                </div>
                <div className="space-y-2">
                  <Label>Technician Rating *</Label>
                  <StarRating
                    rating={formData.technicianRating}
                    onRatingChange={(rating) =>
                      setFormData({ ...formData, technicianRating: rating })
                    }
                    interactive
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 py-2">
                <Checkbox
                  id="recommended"
                  checked={formData.isRecommended}
                  onCheckedChange={(checked) => setFormData({ ...formData, isRecommended: !!checked })}
                />
                <label
                  htmlFor="recommended"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Customer recommends this service
                </label>
              </div>

              <div className="space-y-2">
                <Label>Impressions</Label>
                <div className="flex flex-wrap gap-2">
                  {["On Time", "Professional", "Good Support", "Reasonable Price", "Expert Clean"].map((imp) => (
                    <Badge
                      key={imp}
                      variant={formData.impressions.includes(imp) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const newImp = formData.impressions.includes(imp)
                          ? formData.impressions.filter(i => i !== imp)
                          : [...formData.impressions, imp];
                        setFormData({ ...formData, impressions: newImp });
                      }}
                    >
                      {formData.impressions.includes(imp) && <Check className="w-3 h-3 mr-1" />}
                      {imp}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Review Comment *</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  placeholder="Enter review comment"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingReview ? "Update" : "Add"} Review
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Reviews;
