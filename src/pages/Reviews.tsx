import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Plus, Search, Edit2, Trash2, MessageSquare } from "lucide-react";
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

interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
}

const products: Product[] = [
  { id: "PRD001", name: "AC Repair Service" },
  { id: "PRD002", name: "Refrigerator Repair" },
  { id: "PRD003", name: "Washing Machine Service" },
  { id: "PRD004", name: "TV Installation" },
  { id: "PRD005", name: "Plumbing Service" },
  { id: "PRD006", name: "Electrical Work" },
];

const initialReviews: Review[] = [
  {
    id: "1",
    productId: "PRD001",
    productName: "AC Repair Service",
    customerName: "Rahul Sharma",
    rating: 5,
    comment: "Excellent service! The technician was very professional and fixed my AC quickly.",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    productId: "PRD002",
    productName: "Refrigerator Repair",
    customerName: "Priya Patel",
    rating: 4,
    comment: "Good service, technician arrived on time. Minor delay in getting parts.",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    productId: "PRD003",
    productName: "Washing Machine Service",
    customerName: "Amit Kumar",
    rating: 5,
    comment: "Very satisfied with the service. Will recommend to others.",
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    productId: "PRD001",
    productName: "AC Repair Service",
    customerName: "Sneha Gupta",
    rating: 3,
    comment: "Service was okay, but took longer than expected.",
    createdAt: "2024-01-12",
  },
  {
    id: "5",
    productId: "PRD005",
    productName: "Plumbing Service",
    customerName: "Vikram Singh",
    rating: 5,
    comment: "Quick response and professional work. Highly recommended!",
    createdAt: "2024-01-11",
  },
];

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
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProduct, setFilterProduct] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    productId: "",
    customerName: "",
    rating: 0,
    comment: "",
  });
  const { toast } = useToast();

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProduct =
      filterProduct === "all" || review.productId === filterProduct;
    return matchesSearch && matchesProduct;
  });

  const handleOpenDialog = (review?: Review) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        productId: review.productId,
        customerName: review.customerName,
        rating: review.rating,
        comment: review.comment,
      });
    } else {
      setEditingReview(null);
      setFormData({ productId: "", customerName: "", rating: 0, comment: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.productId || !formData.customerName || !formData.rating || !formData.comment) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const selectedProduct = products.find((p) => p.id === formData.productId);

    if (editingReview) {
      setReviews(
        reviews.map((r) =>
          r.id === editingReview.id
            ? {
                ...r,
                ...formData,
                productName: selectedProduct?.name || "",
              }
            : r
        )
      );
      toast({ title: "Success", description: "Review updated successfully" });
    } else {
      const newReview: Review = {
        id: Date.now().toString(),
        ...formData,
        productName: selectedProduct?.name || "",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setReviews([newReview, ...reviews]);
      toast({ title: "Success", description: "Review added successfully" });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
    toast({ title: "Success", description: "Review deleted successfully" });
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
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reviews List */}
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
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-foreground">
                      {review.customerName}
                    </span>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-sm text-primary font-medium mb-2">
                    {review.productName}
                  </p>
                  <p className="text-muted-foreground">{review.comment}</p>
                  <p className="text-xs text-muted-foreground mt-3">
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
                    onClick={() => handleDelete(review.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No reviews found</p>
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
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
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
              <div className="space-y-2">
                <Label>Rating *</Label>
                <StarRating
                  rating={formData.rating}
                  onRatingChange={(rating) =>
                    setFormData({ ...formData, rating })
                  }
                  interactive
                />
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
                  rows={4}
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
