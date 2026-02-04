import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus, X, ImageIcon, Eye, Filter } from "lucide-react";
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
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    title: "",
    categoryId: "",
    type: "REPAIR",
    image: "/placeholder.svg",
    price: 0,
    description: "",
    descriptionList: [],
  });
  const { toast } = useToast();

  const filteredProducts = selectedCategoryFilter === "all" 
    ? products 
    : products.filter(p => p.categoryId === selectedCategoryFilter);

  const handleView = (product: Product) => {
    setViewingProduct(product);
    setIsViewDialogOpen(true);
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.title || "Unknown";
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      categoryId: "",
      type: "REPAIR",
      image: "/placeholder.svg",
      price: 0,
      description: "",
      descriptionList: [],
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      categoryId: product.categoryId,
      type: product.type,
      image: product.image,
      price: product.price,
      description: product.description,
      descriptionList: [...product.descriptionList],
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.price || !formData.categoryId) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...formData, id: editingProduct.id } : p
      ));
      toast({ title: "Success", description: "Product updated successfully" });
    } else {
      const newProduct: Product = { ...formData, id: Date.now().toString() };
      setProducts([...products, newProduct]);
      toast({ title: "Success", description: "Product created successfully" });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast({ title: "Deleted", description: "Product has been removed" });
  };

  const addDescriptionItem = () => {
    setFormData({
      ...formData,
      descriptionList: [...formData.descriptionList, { title: "", description: "" }],
    });
  };

  const removeDescriptionItem = (index: number) => {
    setFormData({
      ...formData,
      descriptionList: formData.descriptionList.filter((_, i) => i !== index),
    });
  };

  const updateDescriptionItem = (index: number, field: keyof ProductDescription, value: string) => {
    const newList = [...formData.descriptionList];
    newList[index] = { ...newList[index], [field]: value };
    setFormData({ ...formData, descriptionList: newList });
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Products"
        description="Manage your repair and maintenance services"
        action={{ label: "Add Product", onClick: handleCreate }}
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
                  ${product.price}
                </TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">
                  {product.description}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleView(product)}
                      className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(product)}
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

      <AnimatePresence>
        {isDialogOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Create Product"}</DialogTitle>
                <DialogDescription>
                  {editingProduct ? "Update the product details" : "Add a new service product"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Product Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter product name"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-secondary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    >
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Service Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "REPAIR" | "MAINTENANCE") => 
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="REPAIR">Repair</SelectItem>
                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      value={formData.price || ""}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="bg-secondary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      placeholder="Image URL"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="bg-secondary/50"
                    />
                    <Button variant="outline" size="icon" className="shrink-0">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter product description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-secondary/50 min-h-[100px]"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Description List</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addDescriptionItem}
                      className="gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Item
                    </Button>
                  </div>

                  {formData.descriptionList.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-3 items-start p-3 rounded-lg bg-secondary/30"
                    >
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Title"
                          value={item.title}
                          onChange={(e) => updateDescriptionItem(index, "title", e.target.value)}
                          className="bg-secondary/50"
                        />
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateDescriptionItem(index, "description", e.target.value)}
                          className="bg-secondary/50"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDescriptionItem(index)}
                        className="text-destructive hover:bg-destructive/10 shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="btn-gradient">
                  {editingProduct ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              View complete product information
            </DialogDescription>
          </DialogHeader>

          {viewingProduct && (
            <div className="space-y-6 py-4">
              {/* Product Image & Basic Info */}
              <div className="flex gap-6">
                <div className="w-32 h-32 rounded-xl bg-secondary/50 overflow-hidden shrink-0">
                  <img
                    src={viewingProduct.image}
                    alt={viewingProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Product ID</p>
                    <p className="font-mono text-sm text-foreground">#{viewingProduct.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Product Title</p>
                    <p className="font-semibold text-lg text-foreground">{viewingProduct.title}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={viewingProduct.type === "REPAIR" ? "destructive" : "default"}>
                      {viewingProduct.type}
                    </Badge>
                    <Badge variant="outline">{getCategoryName(viewingProduct.categoryId)}</Badge>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Service Price</p>
                <p className="text-2xl font-bold text-primary">
                  ₹{viewingProduct.price.toLocaleString('en-IN')}
                </p>
              </div>

              {/* Category & Type Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-xs text-muted-foreground mb-1">Category</p>
                  <p className="font-medium text-foreground">{getCategoryName(viewingProduct.categoryId)}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-xs text-muted-foreground mb-1">Service Type</p>
                  <p className="font-medium text-foreground">{viewingProduct.type}</p>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 rounded-xl bg-secondary/30">
                <p className="text-xs text-muted-foreground mb-2">Description</p>
                <p className="text-foreground">{viewingProduct.description}</p>
              </div>

              {/* Description List */}
              {viewingProduct.descriptionList.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Service Includes</p>
                  <div className="space-y-2">
                    {viewingProduct.descriptionList.map((item, index) => (
                      <div key={index} className="p-3 rounded-lg bg-secondary/30 flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button 
              onClick={() => {
                setIsViewDialogOpen(false);
                if (viewingProduct) handleEdit(viewingProduct);
              }} 
              className="btn-gradient"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Products;
