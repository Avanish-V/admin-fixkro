import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, Search, Edit2, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface City {
  id: string;
  name: string;
  state: string;
  pincode: string;
  isActive: boolean;
  createdAt: string;
}

const initialCities: City[] = [
  { id: "1", name: "Kanpur", state: "Uttar Pradesh", pincode: "208001", isActive: true, createdAt: "2024-01-15" },
  { id: "2", name: "Agra", state: "Uttar Pradesh", pincode: "282001", isActive: true, createdAt: "2024-01-16" },
  { id: "3", name: "Varanasi", state: "Uttar Pradesh", pincode: "221001", isActive: true, createdAt: "2024-01-17" },
  { id: "4", name: "Lucknow", state: "Uttar Pradesh", pincode: "226001", isActive: true, createdAt: "2024-01-18" },
  { id: "5", name: "Bodhgaya", state: "Bihar", pincode: "824231", isActive: true, createdAt: "2024-01-19" },
  { id: "6", name: "Gaya", state: "Bihar", pincode: "823001", isActive: true, createdAt: "2024-01-20" },
  { id: "7", name: "Chandauli", state: "Uttar Pradesh", pincode: "232104", isActive: false, createdAt: "2024-01-21" },
];

const Cities = () => {
  const [cities, setCities] = useState<City[]>(initialCities);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    pincode: "",
    isActive: true,
  });
  const { toast } = useToast();

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.pincode.includes(searchQuery)
  );

  const handleOpenDialog = (city?: City) => {
    if (city) {
      setEditingCity(city);
      setFormData({
        name: city.name,
        state: city.state,
        pincode: city.pincode,
        isActive: city.isActive,
      });
    } else {
      setEditingCity(null);
      setFormData({ name: "", state: "", pincode: "", isActive: true });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.state || !formData.pincode) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingCity) {
      setCities(
        cities.map((c) =>
          c.id === editingCity.id ? { ...c, ...formData } : c
        )
      );
      toast({ title: "Success", description: "City updated successfully" });
    } else {
      const newCity: City = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCities([...cities, newCity]);
      toast({ title: "Success", description: "City added successfully" });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setCities(cities.filter((c) => c.id !== id));
    toast({ title: "Success", description: "City removed successfully" });
  };

  const toggleStatus = (id: string) => {
    setCities(
      cities.map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      )
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Service Cities"
          description="Manage cities where your services are available"
          action={{
            label: "Add City",
            onClick: () => handleOpenDialog(),
            icon: Plus,
          }}
        />

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCities.map((city, index) => (
            <motion.div
              key={city.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <StatusBadge status={city.isActive ? "active" : "inactive"} />
              </div>

              <h3 className="font-semibold text-foreground text-lg">{city.name}</h3>
              <p className="text-sm text-muted-foreground">{city.state}</p>
              <p className="text-xs text-muted-foreground mt-1">PIN: {city.pincode}</p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={city.isActive}
                    onCheckedChange={() => toggleStatus(city.id)}
                  />
                  <span className="text-xs text-muted-foreground">
                    {city.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleOpenDialog(city)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(city.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCities.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No cities found</p>
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCity ? "Edit City" : "Add New City"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">City Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter city name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  placeholder="Enter state"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">PIN Code *</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value })
                  }
                  placeholder="Enter PIN code"
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label>Service Active</Label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingCity ? "Update" : "Add"} City
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Cities;
