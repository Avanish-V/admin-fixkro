import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Power, Upload, X, Link, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCategories, createCategory, updateCategory, deleteCategory, CreateCategoryRequest } from "@/api/categories";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface Category {
  id: string; // This corresponds to categoryId from backend
  title: string;
  iconType: "svg" | "url";
  iconSvg: string;
  iconUrl: string;
  themeColor: string;
  status: "active" | "inactive";
  productsCount: number;
}

const themeColors = [
  { name: "Blue", value: "hsl(221, 83%, 53%)" },
  { name: "Green", value: "hsl(142, 76%, 36%)" },
  { name: "Purple", value: "hsl(262, 83%, 58%)" },
  { name: "Orange", value: "hsl(24, 95%, 53%)" },
  { name: "Pink", value: "hsl(330, 81%, 60%)" },
  { name: "Teal", value: "hsl(172, 66%, 50%)" },
  { name: "Red", value: "hsl(0, 72%, 51%)" },
  { name: "Yellow", value: "hsl(45, 93%, 47%)" },
];

// initialCategories removed


const Categories = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const data = await fetchCategories();
      return data.map((item): Category => ({
        id: item.categoryId.toString(),
        title: item.title,
        iconType: item.iconType as "svg" | "url",
        iconSvg: item.iconType === "svg" ? item.iconValue : "",
        iconUrl: item.iconType === "url" ? item.iconValue : "",
        themeColor: item.themeColor,
        status: item.status as "active" | "inactive",
        productsCount: 0 // Not provided by backend yet
      }));
    }
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: "Success", description: "Category created successfully" });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to create category", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: CreateCategoryRequest }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: "Success", description: "Category updated successfully" });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update category", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: "Deleted", description: "Category removed successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete category", variant: "destructive" });
    }
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    iconType: "svg" as "svg" | "url",
    iconSvg: "",
    iconUrl: "",
    themeColor: themeColors[0].value,
    status: "active" as "active" | "inactive"
  });
  const [svgPreview, setSvgPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({ title: "", iconType: "svg", iconSvg: "", iconUrl: "", themeColor: themeColors[0].value, status: "active" });
    setSvgPreview("");
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      title: category.title,
      iconType: category.iconType,
      iconSvg: category.iconSvg,
      iconUrl: category.iconUrl,
      themeColor: category.themeColor,
      status: category.status
    });
    setSvgPreview(category.iconSvg);
    setIsDialogOpen(true);
  };

  const handleSvgUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "image/svg+xml") {
      toast({ title: "Error", description: "Please upload an SVG file", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const svgContent = e.target?.result as string;
      setFormData({ ...formData, iconSvg: svgContent });
      setSvgPreview(svgContent);
    };
    reader.readAsText(file);
  };

  const clearSvg = () => {
    setFormData({ ...formData, iconSvg: "" });
    setSvgPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    if (!formData.title) {
      toast({ title: "Error", description: "Please enter a category title", variant: "destructive" });
      return;
    }

    const hasIcon = formData.iconType === "svg" ? formData.iconSvg : formData.iconUrl;
    if (!hasIcon) {
      toast({ title: "Error", description: formData.iconType === "svg" ? "Please upload an SVG icon" : "Please enter an icon URL", variant: "destructive" });
      return;
    }

    const payload: CreateCategoryRequest = {
      title: formData.title,
      iconType: formData.iconType,
      iconValue: formData.iconType === "svg" ? formData.iconSvg : formData.iconUrl,
      themeColor: formData.themeColor,
      status: formData.status
    };

    if (editingCategory) {
      updateMutation.mutate({ id: parseInt(editingCategory.id), data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(parseInt(id));
    }
  };

  const handleToggleStatus = (category: Category) => {
    const newStatus = category.status === "active" ? "inactive" : "active";
    const payload: CreateCategoryRequest = {
      title: category.title,
      iconType: category.iconType,
      iconValue: category.iconType === "svg" ? category.iconSvg : category.iconUrl,
      themeColor: category.themeColor,
      status: newStatus
    };
    updateMutation.mutate({ id: parseInt(category.id), data: payload });
  };

  const columns = [
    {
      key: "icon",
      header: "Icon",
      render: (item: Category) => (
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${item.themeColor}20`, color: item.themeColor }}
        >
          {item.iconType === "svg" ? (
            <div dangerouslySetInnerHTML={{ __html: item.iconSvg }} />
          ) : (
            <img src={item.iconUrl} alt={item.title} className="w-6 h-6 object-contain" />
          )}
        </div>
      ),
    },
    { key: "title", header: "Title" },
    {
      key: "themeColor",
      header: "Theme",
      render: (item: Category) => (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border border-border"
            style={{ backgroundColor: item.themeColor }}
          />
        </div>
      ),
    },
    { key: "productsCount", header: "Products" },
    {
      key: "status",
      header: "Status",
      render: (item: Category) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: Category) => (
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleEdit(item)}
            className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleToggleStatus(item)}
            className={`p-2 rounded-lg transition-colors ${item.status === "active"
              ? "bg-success/10 text-success hover:bg-success/20"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
          >
            <Power className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDelete(item.id)}
            className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Categories"
        description="Manage your service categories"
        action={{ label: "Add Category", onClick: handleCreate }}
      />

      <DataTable columns={columns} data={categories} keyExtractor={(item) => item.id} />

      <AnimatePresence>
        {isDialogOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>{editingCategory ? "Edit Category" : "Create Category"}</DialogTitle>
                <DialogDescription>
                  {editingCategory ? "Update the category details" : "Add a new service category"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Category Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter category name"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-secondary/50"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Icon Source</Label>
                  <RadioGroup
                    value={formData.iconType}
                    onValueChange={(value: "svg" | "url") => setFormData({ ...formData, iconType: value })}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="svg" id="icon-svg" />
                      <Label htmlFor="icon-svg" className="flex items-center gap-1 cursor-pointer">
                        <Upload className="w-4 h-4" /> Upload SVG
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="url" id="icon-url" />
                      <Label htmlFor="icon-url" className="flex items-center gap-1 cursor-pointer">
                        <Link className="w-4 h-4" /> Icon URL
                      </Label>
                    </div>
                  </RadioGroup>

                  {formData.iconType === "svg" ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".svg,image/svg+xml"
                          onChange={handleSvgUpload}
                          className="hidden"
                          id="svg-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Choose SVG File
                        </Button>

                        {svgPreview && (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center border border-border"
                              style={{ backgroundColor: `${formData.themeColor}20`, color: formData.themeColor }}
                              dangerouslySetInnerHTML={{ __html: svgPreview }}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={clearSvg}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Upload an SVG file for the category icon
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageUpload
                        label="Icon Image"
                        folder="categories"
                        value={formData.iconUrl}
                        onChange={(url) => setFormData({ ...formData, iconUrl: url })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload an image or enter a URL for the category icon (PNG, JPG, or SVG)
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Theme Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {themeColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, themeColor: color.value })}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${formData.themeColor === color.value
                          ? "border-foreground scale-110"
                          : "border-transparent hover:scale-105"
                          }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Choose a theme color for this category
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="btn-gradient">
                  {editingCategory ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default Categories;
