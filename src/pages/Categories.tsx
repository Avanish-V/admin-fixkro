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

interface Category {
  id: string;
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

const initialCategories: Category[] = [
  { id: "1", title: "Air Conditioner", iconType: "svg", iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>', iconUrl: "", themeColor: "hsl(221, 83%, 53%)", status: "active", productsCount: 12 },
  { id: "2", title: "Refrigerator", iconType: "svg", iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z"/><path d="M5 10h14"/><path d="M15 7v6"/></svg>', iconUrl: "", themeColor: "hsl(142, 76%, 36%)", status: "active", productsCount: 8 },
  { id: "3", title: "Washing Machine", iconType: "svg", iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>', iconUrl: "", themeColor: "hsl(262, 83%, 58%)", status: "active", productsCount: 15 },
  { id: "4", title: "Television", iconType: "svg", iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>', iconUrl: "", themeColor: "hsl(24, 95%, 53%)", status: "inactive", productsCount: 6 },
  { id: "5", title: "Microwave", iconType: "svg", iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', iconUrl: "", themeColor: "hsl(330, 81%, 60%)", status: "active", productsCount: 4 },
];

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ 
    title: "", 
    iconType: "svg" as "svg" | "url",
    iconSvg: "", 
    iconUrl: "",
    themeColor: themeColors[0].value 
  });
  const [svgPreview, setSvgPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({ title: "", iconType: "svg", iconSvg: "", iconUrl: "", themeColor: themeColors[0].value });
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
      themeColor: category.themeColor 
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

    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? { 
              ...c, 
              title: formData.title, 
              iconType: formData.iconType,
              iconSvg: formData.iconSvg,
              iconUrl: formData.iconUrl,
              themeColor: formData.themeColor
            }
          : c
      ));
      toast({ title: "Success", description: "Category updated successfully" });
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        title: formData.title,
        iconType: formData.iconType,
        iconSvg: formData.iconSvg,
        iconUrl: formData.iconUrl,
        themeColor: formData.themeColor,
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
                      <div className="flex items-center gap-4">
                        <Input
                          placeholder="https://example.com/icon.png"
                          value={formData.iconUrl}
                          onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                          className="bg-secondary/50 flex-1"
                        />
                        {formData.iconUrl && (
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center border border-border"
                            style={{ backgroundColor: `${formData.themeColor}20` }}
                          >
                            <img src={formData.iconUrl} alt="Icon preview" className="w-6 h-6 object-contain" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enter a URL for the category icon (PNG, JPG, or SVG)
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
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.themeColor === color.value 
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
