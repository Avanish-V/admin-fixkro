import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
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
import { ArrowLeft, Plus, X, ImageIcon, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

// Mock data - in real app this would come from API/state management
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

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Omit<Product, "id">>({
    title: "",
    categoryId: "",
    type: "REPAIR",
    image: "/placeholder.svg",
    price: 0,
    description: "",
    descriptionList: [],
  });

  useEffect(() => {
    if (id) {
      const product = mockProducts.find(p => p.id === id);
      if (product) {
        setFormData({
          title: product.title,
          categoryId: product.categoryId,
          type: product.type,
          image: product.image,
          price: product.price,
          description: product.description,
          descriptionList: [...product.descriptionList],
        });
      }
    }
  }, [id]);

  const handleSave = () => {
    if (!formData.title || !formData.price || !formData.categoryId) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    toast({ 
      title: "Success", 
      description: isEditing ? "Product updated successfully" : "Product created successfully" 
    });
    navigate("/products");
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/products")}
            className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEditing ? "Edit Product" : "Add Product"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? "Update the product details" : "Add a new service product"}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="glass-card p-8 space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Label htmlFor="price">Price (₹) *</Label>
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
              className="bg-secondary/50 min-h-[120px]"
            />
          </div>

          {/* Description List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Service Includes</Label>
                <p className="text-sm text-muted-foreground mt-1">Add detailed service breakdown</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addDescriptionItem}
                className="gap-2"
              >
                <Plus className="w-4 h-4" /> Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {formData.descriptionList.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-4 items-start p-4 rounded-xl bg-secondary/30"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {formData.descriptionList.length === 0 && (
                <div className="p-8 rounded-xl bg-secondary/20 border-2 border-dashed border-border text-center">
                  <p className="text-muted-foreground">No items added yet. Click "Add Item" to get started.</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
            <Button variant="outline" onClick={() => navigate("/products")}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="btn-gradient gap-2">
              <Save className="w-4 h-4" />
              {isEditing ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default ProductForm;
