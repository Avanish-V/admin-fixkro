import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatsCard } from "@/components/ui/StatsCard";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Pencil, Trash2, Cog, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  categoryId: number;
  title: string;
}

interface Part {
  partId: number;
  name: string;
  price: number;
  categoryId: number;
  status: boolean;
}

const dummyCategories: Category[] = [
  { categoryId: 1, title: "AC" },
  { categoryId: 2, title: "Washing Machine" },
  { categoryId: 3, title: "Refrigerator" },
  { categoryId: 4, title: "Microwave" },
  { categoryId: 5, title: "Water Purifier" },
];

const initialParts: Part[] = [
  { partId: 1, name: "Compressor", price: 4500, categoryId: 1, status: true },
  { partId: 2, name: "Capacitor", price: 350, categoryId: 1, status: true },
  { partId: 3, name: "Fan Motor", price: 1200, categoryId: 1, status: true },
  { partId: 4, name: "Thermostat", price: 800, categoryId: 3, status: true },
  { partId: 5, name: "PCB Board", price: 2500, categoryId: 2, status: false },
  { partId: 6, name: "Gas Charging Kit", price: 1800, categoryId: 1, status: true },
  { partId: 7, name: "Drain Pump", price: 950, categoryId: 2, status: true },
  { partId: 8, name: "Heating Element", price: 1100, categoryId: 4, status: false },
];

const Parts = () => {
  const { toast } = useToast();
  const [parts, setParts] = useState<Part[]>(initialParts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [deletingPart, setDeletingPart] = useState<Part | null>(null);
  const [formData, setFormData] = useState({ name: "", price: 0, categoryId: 0, status: true });

  const getCategoryName = (categoryId: number) =>
    dummyCategories.find((c) => c.categoryId === categoryId)?.title || "Unknown";

  const filteredParts = parts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || p.categoryId === parseInt(filterCategory);
    return matchesSearch && matchesCategory;
  });

  const openAddDialog = () => {
    setEditingPart(null);
    setFormData({ name: "", price: 0, categoryId: 0, status: true });
    setDialogOpen(true);
  };

  const openEditDialog = (part: Part) => {
    setEditingPart(part);
    setFormData({ name: part.name, price: part.price, categoryId: part.categoryId, status: part.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.categoryId) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    if (editingPart) {
      setParts(parts.map((p) =>
        p.partId === editingPart.partId ? { ...p, ...formData } : p
      ));
      toast({ title: "Success", description: "Part updated successfully" });
    } else {
      const newPart: Part = {
        partId: Math.max(...parts.map((p) => p.partId), 0) + 1,
        ...formData,
      };
      setParts([...parts, newPart]);
      toast({ title: "Success", description: "Part added successfully" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deletingPart) return;
    setParts(parts.filter((p) => p.partId !== deletingPart.partId));
    toast({ title: "Success", description: "Part deleted successfully" });
    setDeleteDialogOpen(false);
    setDeletingPart(null);
  };

  const columns = [
    {
      key: "partId",
      header: "ID",
      render: (part: Part) => (
        <span className="text-xs font-mono text-muted-foreground">#{part.partId}</span>
      ),
    },
    {
      key: "name",
      header: "Part Name",
      render: (part: Part) => (
        <span className="font-medium text-foreground">{part.name}</span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (part: Part) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
          {getCategoryName(part.categoryId)}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (part: Part) => (
        <span className="font-semibold text-foreground">₹{part.price.toLocaleString()}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (part: Part) => (
        <StatusBadge status={part.status ? "active" : "inactive"} />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (part: Part) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEditDialog(part)}
            className="text-muted-foreground hover:text-primary"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setDeletingPart(part);
              setDeleteDialogOpen(true);
            }}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <PageHeader
          title="Parts"
          description="Manage spare parts and pricing by category"
          action={{ label: "Add Part", onClick: openAddDialog, icon: Plus }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Total Parts" value={parts.length} icon={Cog} />
          <StatsCard
            title="Active Parts"
            value={parts.filter((p) => p.status).length}
            icon={Cog}
          />
          <StatsCard
            title="Categories"
            value={dummyCategories.length}
            icon={Filter}
          />
        </div>

        {/* Search + Category Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[200px] bg-secondary/50">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {dummyCategories.map((cat) => (
                <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={filteredParts}
          keyExtractor={(p) => p.partId.toString()}
        />
      </motion.div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPart ? "Edit Part" : "Add Part"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.categoryId ? formData.categoryId.toString() : ""}
                onValueChange={(value) => setFormData({ ...formData, categoryId: parseInt(value) })}
              >
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {dummyCategories.map((cat) => (
                    <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="partName">Part Name *</Label>
              <Input
                id="partName"
                placeholder="Enter part name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partPrice">Price (₹) *</Label>
              <Input
                id="partPrice"
                type="number"
                placeholder="0"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                className="bg-secondary/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="partStatus"
                checked={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                className="w-4 h-4 rounded border-border bg-secondary/50"
              />
              <Label htmlFor="partStatus">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="btn-gradient">
              {editingPart ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Part</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingPart?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Parts;
