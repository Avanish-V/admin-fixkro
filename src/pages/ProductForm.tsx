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
import { ArrowLeft, Plus, X, ImageIcon, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { fetchCategories, CategoryResponse, ProductDescription } from "@/api/categories";
import {
  createProduct,
  updateProduct,
  fetchProductsByCategory, // Note: No direct fetchById in current api/products.ts
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest
} from "@/api/products";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateProductRequest>({
    title: "",
    categoryId: 0,
    serviceType: "REPAIR",
    imageUrl: "",
    price: 0,
    status: true,
    descriptions: [],
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load categories", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id, categories]);

  const loadProduct = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      // Since fetchById isn't in API, we'll have to fetch by category or find a way.
      // But typically, a product listing would have put the product in state or we'd have a specific API.
      // For now, let's assume we might need to fetch all and find it, OR 
      // if the user already has a way. 
      // Actually, looking at the API, there is no fetchProductById. 
      // I'll check categories one by one or fetch from the specific category if I knew it.
      // Let's try to fetch from all categories to find the product.

      for (const cat of categories) {
        const products = await fetchProductsByCategory(cat.categoryId);
        const product = products.find(p => p.productId === parseInt(id));
        if (product) {
          setFormData({
            title: product.title,
            categoryId: product.categoryId,
            serviceType: product.serviceType,
            imageUrl: product.imageUrl,
            price: product.price,
            status: product.status,
            descriptions: [...product.descriptions],
          });
          break;
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load product details", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.price || !formData.categoryId) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      if (isEditing) {
        await updateProduct(parseInt(id!), formData as UpdateProductRequest);
        toast({ title: "Success", description: "Product updated successfully" });
      } else {
        await createProduct(formData);
        toast({ title: "Success", description: "Product created successfully" });
      }
      navigate("/products");
    } catch (error) {
      toast({ title: "Error", description: "Failed to save product", variant: "destructive" });
    }
  };

  const addDescriptionItem = () => {
    setFormData({
      ...formData,
      descriptions: [...formData.descriptions, { title: "", shortDescription: "" }],
    });
  };

  const removeDescriptionItem = (index: number) => {
    setFormData({
      ...formData,
      descriptions: formData.descriptions.filter((_, i) => i !== index),
    });
  };

  const updateDescriptionItem = (index: number, field: keyof ProductDescription, value: string) => {
    const newList = [...formData.descriptions];
    newList[index] = { ...newList[index], [field]: value };
    setFormData({ ...formData, descriptions: newList });
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
                value={formData.categoryId.toString()}
                onValueChange={(value) => setFormData({ ...formData, categoryId: parseInt(value) })}
              >
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.categoryId} value={category.categoryId.toString()}>
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
                value={formData.serviceType}
                onValueChange={(value) =>
                  setFormData({ ...formData, serviceType: value })
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
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                className="bg-secondary/50"
              />
            </div>
          </div>

          <ImageUpload
            label="Product Image"
            folder="products"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="status"
              checked={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
              className="w-4 h-4 rounded border-border bg-secondary/50"
            />
            <Label htmlFor="status">Active</Label>
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
              {formData.descriptions.map((item, index) => (
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
                      placeholder="Short Description"
                      value={item.shortDescription}
                      onChange={(e) => updateDescriptionItem(index, "shortDescription", e.target.value)}
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

              {formData.descriptions.length === 0 && (
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
