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
import { Pencil, Trash2, Plus, X, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductDescription {
  title: string;
  description: string;
}

interface Product {
  id: string;
  title: string;
  type: "REPAIR" | "MAINTENANCE";
  image: string;
  price: number;
  description: string;
  descriptionList: ProductDescription[];
}

const initialProducts: Product[] = [
  {
    id: "1",
    title: "AC Deep Cleaning",
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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    title: "",
    type: "REPAIR",
    image: "/placeholder.svg",
    price: 0,
    description: "",
    descriptionList: [],
  });
  const { toast } = useToast();

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
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
      type: product.type,
      image: product.image,
      price: product.price,
      description: product.description,
      descriptionList: [...product.descriptionList],
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.price) {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card overflow-hidden group"
          >
            <div className="aspect-video bg-secondary/50 relative overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  product.type === "REPAIR" 
                    ? "bg-destructive/80 text-destructive-foreground" 
                    : "bg-info/80 text-info-foreground"
                }`}>
                  {product.type}
                </span>
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-foreground mb-2">{product.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">${product.price}</span>
                <div className="flex items-center gap-2">
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
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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
                </div>

                <div className="grid grid-cols-2 gap-4">
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
    </AdminLayout>
  );
};

export default Products;
