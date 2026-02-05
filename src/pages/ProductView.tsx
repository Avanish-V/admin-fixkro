import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchCategories, CategoryResponse } from "@/api/categories";
import { fetchProductsByCategory, ProductResponse } from "@/api/products";

const ProductView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const cats = await fetchCategories();
      setCategories(cats);

      if (id) {
        let foundProduct = null;
        // Search across categories to find the product since no fetchById exists
        for (const cat of cats) {
          const products = await fetchProductsByCategory(cat.categoryId);
          const p = products.find((item) => item.productId === parseInt(id));
          if (p) {
            foundProduct = p;
            break;
          }
        }
        setProduct(foundProduct);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load product details", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryName = (categoryId: number) => {
    return categories.find(c => c.categoryId === categoryId)?.title || "Unknown";
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <p className="text-muted-foreground">Product not found</p>
          <Button variant="outline" onClick={() => navigate("/products")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/products")}
              className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Product Details</h1>
              <p className="text-muted-foreground">View complete product information</p>
            </div>
          </div>
          <Button onClick={() => navigate(`/products/edit/${product.productId}`)} className="btn-gradient gap-2">
            <Pencil className="w-4 h-4" />
            Edit Product
          </Button>
        </div>

        {/* Content */}
        <div className="glass-card p-8 space-y-8">
          {/* Product Image & Basic Info */}
          <div className="flex gap-8">
            <div className="w-48 h-48 rounded-xl bg-secondary/50 overflow-hidden shrink-0 border border-border">
              <img
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Product ID</p>
                <p className="font-mono text-sm text-foreground">#{product.productId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Product Title</p>
                <p className="font-semibold text-2xl text-foreground">{product.title}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={product.serviceType === "REPAIR" ? "destructive" : "default"}>
                  {product.serviceType}
                </Badge>
                <Badge variant="outline">{getCategoryName(product.categoryId)}</Badge>
                <Badge variant={product.status ? "default" : "secondary"}>
                  {product.status ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Service Price</p>
            <p className="text-3xl font-bold text-primary">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
          </div>

          {/* Category & Type Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-secondary/30">
              <p className="text-sm text-muted-foreground mb-2">Category</p>
              <p className="font-semibold text-lg text-foreground">{getCategoryName(product.categoryId)}</p>
            </div>
            <div className="p-6 rounded-xl bg-secondary/30">
              <p className="text-sm text-muted-foreground mb-2">Service Type</p>
              <p className="font-semibold text-lg text-foreground">{product.serviceType}</p>
            </div>
          </div>

          {/* Description List */}
          {product.descriptions.length > 0 && (
            <div className="space-y-4">
              <p className="font-semibold text-lg text-foreground">Service Includes</p>
              <div className="grid gap-4">
                {product.descriptions.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-secondary/30 flex gap-4 items-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{item.shortDescription}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button variant="outline" onClick={() => navigate("/products")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
            <Button onClick={() => navigate(`/products/edit/${product.productId}`)} className="btn-gradient gap-2">
              <Pencil className="w-4 h-4" />
              Edit Product
            </Button>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default ProductView;
