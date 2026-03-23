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
import { Plus, Search, Pencil, Trash2, Cog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Part {
  partId: number;
  name: string;
  price: number;
  status: boolean;
}

const initialParts: Part[] = [
  { partId: 1, name: "Compressor", price: 4500, status: true },
  { partId: 2, name: "Capacitor", price: 350, status: true },
  { partId: 3, name: "Fan Motor", price: 1200, status: true },
  { partId: 4, name: "Thermostat", price: 800, status: true },
  { partId: 5, name: "PCB Board", price: 2500, status: false },
  { partId: 6, name: "Gas Charging Kit", price: 1800, status: true },
  { partId: 7, name: "Drain Pump", price: 950, status: true },
  { partId: 8, name: "Heating Element", price: 1100, status: false },
];

const Parts = () => {
  const { toast } = useToast();
  const [parts, setParts] = useState<Part[]>(initialParts);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [deletingPart, setDeletingPart] = useState<Part | null>(null);
  const [formData, setFormData] = useState({ name: "", price: 0, status: true });

  const filteredParts = parts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddDialog = () => {
    setEditingPart(null);
    setFormData({ name: "", price: 0, status: true });
    setDialogOpen(true);
  };

  const openEditDialog = (part: Part) => {
    setEditingPart(part);
    setFormData({ name: part.name, price: part.price, status: part.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) {
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
          description="Manage spare parts and pricing"
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
            title="Avg Price"
            value={`₹${Math.round(parts.reduce((s, p) => s + p.price, 0) / parts.length).toLocaleString()}`}
            icon={Cog}
          />
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search parts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50"
          />
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
