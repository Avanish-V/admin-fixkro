import { useState } from "react";
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
import {
  Pencil,
  Trash2,
  Power,
  Wrench,
  Refrigerator,
  Tv,
  Waves,
  Wind,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const iconMap: Record<string, React.ElementType> = {
  wrench: Wrench,
  refrigerator: Refrigerator,
  tv: Tv,
  waves: Waves,
  wind: Wind,
  zap: Zap,
};

interface Category {
  id: string;
  title: string;
  icon: string;
  status: "active" | "inactive";
  productsCount: number;
}

const initialCategories: Category[] = [
  { id: "1", title: "Air Conditioner", icon: "wind", status: "active", productsCount: 12 },
  { id: "2", title: "Refrigerator", icon: "refrigerator", status: "active", productsCount: 8 },
  { id: "3", title: "Washing Machine", icon: "waves", status: "active", productsCount: 15 },
  { id: "4", title: "Television", icon: "tv", status: "inactive", productsCount: 6 },
  { id: "5", title: "Microwave", icon: "zap", status: "active", productsCount: 4 },
  { id: "6", title: "General Repairs", icon: "wrench", status: "active", productsCount: 20 },
];

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ title: "", icon: "wrench" });
  const { toast } = useToast();

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({ title: "", icon: "wrench" });
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ title: category.title, icon: category.icon });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title) {
      toast({ title: "Error", description: "Please enter a category title", variant: "destructive" });
      return;
    }

    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, title: formData.title, icon: formData.icon }
          : c
      ));
      toast({ title: "Success", description: "Category updated successfully" });
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        title: formData.title,
        icon: formData.icon,
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
      render: (item: Category) => {
        const Icon = iconMap[item.icon] || Wrench;
        return (
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        );
      },
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
                  <Label>Select Icon</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {Object.entries(iconMap).map(([key, Icon]) => (
                      <motion.button
                        key={key}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFormData({ ...formData, icon: key })}
                        className={`p-3 rounded-lg flex items-center justify-center transition-colors ${
                          formData.icon === key
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.button>
                    ))}
                  </div>
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
