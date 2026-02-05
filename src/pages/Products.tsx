import { useState, useEffect } from "react";
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
import { Pencil, Trash2, Plus, X, ImageIcon, Loader2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchCategories, CategoryResponse, ProductDescription } from "@/api/categories";
import {
  fetchProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest
} from "@/api/products";

const Products = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<ProductResponse | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
  const [formData, setFormData] = useState<CreateProductRequest>({
    title: "",
    categoryId: 0,
    serviceType: "REPAIR",
    imageUrl: "",
    price: 0,
    status: true,
    descriptions: [],
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategoryId(data[0].categoryId);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load categories", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (selectedCategoryId !== null) {
      loadProducts(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const loadProducts = async (categoryId: number) => {
    setIsLoading(true);
    try {
      const data = await fetchProductsByCategory(categoryId);
      setProducts(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load products", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      categoryId: selectedCategoryId || 0,
      serviceType: "REPAIR",
      imageUrl: "",
      price: 0,
      status: true,
      descriptions: [],
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (product: ProductResponse) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      categoryId: product.categoryId,
      serviceType: product.serviceType,
      imageUrl: product.imageUrl,
      price: product.price,
      status: product.status,
      descriptions: [...product.descriptions],
    });
    setIsDialogOpen(true);
  };

  const handleView = (product: ProductResponse) => {
    setViewingProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.price || !formData.categoryId) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.productId, formData as UpdateProductRequest);
        toast({ title: "Success", description: "Product updated successfully" });
      } else {
        await createProduct(formData);
        toast({ title: "Success", description: "Product created successfully" });
      }
      setIsDialogOpen(false);
      if (selectedCategoryId !== null) loadProducts(selectedCategoryId);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save product", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      toast({ title: "Deleted", description: "Product has been removed" });
      if (selectedCategoryId !== null) loadProducts(selectedCategoryId);
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
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

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <PageHeader
          title="Products"
          description="Manage your repair and maintenance services"
          action={{ label: "Add Product", onClick: handleCreate }}
        />
        <div className="flex items-center gap-3 bg-card p-2 rounded-xl border border-border">
          <Label className="text-muted-foreground ml-2">Category:</Label>
          <Select
            value={selectedCategoryId?.toString()}
            onValueChange={(v) => setSelectedCategoryId(parseInt(v))}
          >
            <SelectTrigger className="w-[180px] bg-secondary/50 border-none">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Image</TableHead>
                <TableHead className="text-muted-foreground">Title</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Price</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No products found for this category.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product, index) => (
                  <motion.tr
                    key={product.productId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-border hover:bg-secondary/30"
                  >
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg bg-secondary/50 overflow-hidden">
                        <img
                          src={product.imageUrl || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {product.title}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.serviceType === "REPAIR"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-info/10 text-info"
                        }`}>
                        {product.serviceType}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      ₹{product.price}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        }`}>
                        {product.status ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleView(product)}
                          className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(product)}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
                          title="Edit Product"
                        >
                          <Pencil className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(product.productId)}
                          className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        )}
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

                <div className="grid grid-cols-2 gap-4">
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

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      placeholder="Image URL"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="bg-secondary/50"
                    />
                    <Button variant="outline" size="icon" className="shrink-0">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

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

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Description Items</Label>
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

                  {formData.descriptions.map((item, index) => (
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

      <AnimatePresence>
        {isViewDialogOpen && viewingProduct && (
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="glass-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-secondary/50 overflow-hidden shrink-0 border border-border">
                    <img
                      src={viewingProduct.imageUrl || "/placeholder.svg"}
                      alt={viewingProduct.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-foreground">{viewingProduct.title}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Product ID: {viewingProduct.productId}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-8 py-6">
                <div className="space-y-6">
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Pricing</Label>
                    <p className="text-2xl font-bold text-primary">₹{viewingProduct.price}</p>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Service Type</Label>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${viewingProduct.serviceType === "REPAIR"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-info/10 text-info"
                      }`}>
                      {viewingProduct.serviceType}
                    </span>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Status</Label>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${viewingProduct.status ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      }`}>
                      {viewingProduct.status ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground block">Key Features</Label>
                  <div className="space-y-3">
                    {viewingProduct.descriptions.length > 0 ? (
                      viewingProduct.descriptions.map((desc, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                          <h4 className="text-sm font-semibold text-foreground">{desc.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{desc.shortDescription}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No descriptions available</p>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="rounded-xl">
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleEdit(viewingProduct);
                  }}
                  className="btn-gradient rounded-xl"
                >
                  <Pencil className="w-3.5 h-3.5 mr-2" />
                  Edit Product
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
