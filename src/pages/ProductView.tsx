import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil } from "lucide-react";

interface ProductDescription {
  title: string;
  description: string;
}

interface Category {
  id: string;
  title: string;
}

interface Product {
  id: string;
  title: string;
  categoryId: string;
  type: "REPAIR" | "MAINTENANCE";
  image: string;
  price: number;
  description: string;
  descriptionList: ProductDescription[];
}

// Mock data - in real app this would come from API/state management
const categories: Category[] = [
  { id: "1", title: "Air Conditioner" },
  { id: "2", title: "Refrigerator" },
  { id: "3", title: "Washing Machine" },
  { id: "4", title: "Television" },
  { id: "5", title: "Microwave" },
];

const mockProducts: Product[] = [
  {
    id: "1",
    title: "AC Deep Cleaning",
    categoryId: "1",
    type: "MAINTENANCE",
    image: "/placeholder.svg",
    price: 49.99,
    description: "Complete AC cleaning service including filters and coils",
    descriptionList: [
      { title: "Filter Cleaning", description: "Remove and clean all filters" },
      { title: "Coil Cleaning", description: "Deep clean evaporator and condenser coils" },
    ],
  },
  {
    id: "2",
    title: "Refrigerator Compressor Repair",
    categoryId: "2",
    type: "REPAIR",
    image: "/placeholder.svg",
    price: 149.99,
    description: "Expert compressor diagnosis and repair service",
    descriptionList: [
      { title: "Diagnosis", description: "Complete system analysis" },
      { title: "Repair", description: "Fix or replace faulty components" },
    ],
  },
  {
    id: "3",
    title: "Washing Machine Motor Repair",
    categoryId: "3",
    type: "REPAIR",
    image: "/placeholder.svg",
    price: 89.99,
    description: "Motor repair and replacement services",
    descriptionList: [
      { title: "Motor Check", description: "Test motor functionality" },
      { title: "Belt Replacement", description: "Replace worn belts if needed" },
    ],
  },
];

const ProductView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const product = mockProducts.find(p => p.id === id);

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.title || "Unknown";
  };

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
          <Button onClick={() => navigate(`/products/edit/${product.id}`)} className="btn-gradient gap-2">
            <Pencil className="w-4 h-4" />
            Edit Product
          </Button>
        </div>

        {/* Content */}
        <div className="glass-card p-8 space-y-8">
          {/* Product Image & Basic Info */}
          <div className="flex gap-8">
            <div className="w-48 h-48 rounded-xl bg-secondary/50 overflow-hidden shrink-0">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Product ID</p>
                <p className="font-mono text-sm text-foreground">#{product.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Product Title</p>
                <p className="font-semibold text-2xl text-foreground">{product.title}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={product.type === "REPAIR" ? "destructive" : "default"}>
                  {product.type}
                </Badge>
                <Badge variant="outline">{getCategoryName(product.categoryId)}</Badge>
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
              <p className="font-semibold text-lg text-foreground">{product.type}</p>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 rounded-xl bg-secondary/30">
            <p className="text-sm text-muted-foreground mb-3">Description</p>
            <p className="text-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Description List */}
          {product.descriptionList.length > 0 && (
            <div className="space-y-4">
              <p className="font-semibold text-lg text-foreground">Service Includes</p>
              <div className="grid gap-4">
                {product.descriptionList.map((item, index) => (
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
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
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
            <Button onClick={() => navigate(`/products/edit/${product.id}`)} className="btn-gradient gap-2">
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
