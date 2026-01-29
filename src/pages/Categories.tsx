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
import { Pencil, Trash2, Power, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  title: string;
  iconSvg: string;
  status: "active" | "inactive";
  productsCount: number;
}

const initialCategories: Category[] = [
  { id: "1", title: "Air Conditioner", iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>', status: "active", productsCount: 12 },
  { id: "2", title: "Refrigerator", iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z"/><path d="M5 10h14"/><path d="M15 7v6"/></svg>', status: "active", productsCount: 8 },
  { id: "3", title: "Washing Machine", iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>', status: "active", productsCount: 15 },
  { id: "4", title: "Television", iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>', status: "inactive", productsCount: 6 },
  { id: "5", title: "Microwave", iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', status: "active", productsCount: 4 },
];

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ title: "", iconSvg: "" });
  const [svgPreview, setSvgPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({ title: "", iconSvg: "" });
    setSvgPreview("");
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ title: category.title, iconSvg: category.iconSvg });
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

    if (!formData.iconSvg) {
      toast({ title: "Error", description: "Please upload an SVG icon", variant: "destructive" });
      return;
    }

    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, title: formData.title, iconSvg: formData.iconSvg }
          : c
      ));
      toast({ title: "Success", description: "Category updated successfully" });
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        title: formData.title,
        iconSvg: formData.iconSvg,
        status: "active",
        productsCount: 0,
      };
      setCategories([...categories, newCategory]);
      toast({ title: "Success", description: "Category created successfully" });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    toast({ title: "Deleted", description: "Category has been removed" });
  };

  const handleToggleStatus = (id: string) => {
    setCategories(categories.map(c => 
      c.id === id 
        ? { ...c, status: c.status === "active" ? "inactive" : "active" }
        : c
    ));
  };

  const columns = [
    {
      key: "icon",
      header: "Icon",
      render: (item: Category) => (
        <div 
          className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"
          dangerouslySetInnerHTML={{ __html: item.iconSvg }}
        />
      ),
    },
    { key: "title", header: "Title" },
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
            onClick={() => handleToggleStatus(item.id)}
            className={`p-2 rounded-lg transition-colors ${
              item.status === "active"
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

                <div className="space-y-2">
                  <Label>Upload SVG Icon</Label>
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
                          className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-border"
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
