import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, X, Eye, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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

const categories: Category[] = [
  { id: "1", title: "Air Conditioner" },
  { id: "2", title: "Refrigerator" },
  { id: "3", title: "Washing Machine" },
  { id: "4", title: "Television" },
  { id: "5", title: "Microwave" },
];

const initialProducts: Product[] = [
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

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const { toast } = useToast();

  const filteredProducts = selectedCategoryFilter === "all" 
    ? products 
    : products.filter(p => p.categoryId === selectedCategoryFilter);

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.title || "Unknown";
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast({ title: "Deleted", description: "Product has been removed" });
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Products"
        description="Manage your repair and maintenance services"
        action={{ label: "Add Product", onClick: () => navigate("/products/new") }}
      />

      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select
            value={selectedCategoryFilter}
            onValueChange={setSelectedCategoryFilter}
          >
            <SelectTrigger className="w-[200px] bg-secondary/50">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCategoryFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {getCategoryName(selectedCategoryFilter)}
              <button 
                onClick={() => setSelectedCategoryFilter("all")}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Image</TableHead>
              <TableHead className="text-muted-foreground">Title</TableHead>
              <TableHead className="text-muted-foreground">Category</TableHead>
              <TableHead className="text-muted-foreground">Type</TableHead>
              <TableHead className="text-muted-foreground">Price</TableHead>
              <TableHead className="text-muted-foreground">Description</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-border hover:bg-secondary/30"
              >
                <TableCell>
                  <div className="w-12 h-12 rounded-lg bg-secondary/50 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {product.title}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {getCategoryName(product.categoryId)}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.type === "REPAIR" 
                      ? "bg-destructive/10 text-destructive" 
                      : "bg-info/10 text-info"
                  }`}>
                    {product.type}
                  </span>
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  ₹{product.price}
                </TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">
                  {product.description}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate(`/products/edit/${product.id}`)}
                      className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(product.id)}
                      className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </AdminLayout>
  );
};

export default Products;
