import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, Search, Edit2, Trash2, Loader2 } from "lucide-react";
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
import { citiesApi, City } from "@/api/cities";

const Cities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    pincode: "",
    symbol: "🏙️",
    isActive: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setIsLoading(true);
      const data = await citiesApi.getAll();
      setCities(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch cities",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        symbol: city.symbol || "🏙️",
        isActive: city.isActive,
      });
    } else {
      setEditingCity(null);
      setFormData({ name: "", state: "", pincode: "", symbol: "🏙️", isActive: true });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.state || !formData.pincode) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingCity) {
        await citiesApi.update(editingCity.id, formData);
        toast({ title: "Success", description: "City updated successfully" });
      } else {
        await citiesApi.create(formData);
        toast({ title: "Success", description: "City added successfully" });
      }
      setIsDialogOpen(false);
      fetchCities();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save city",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this city?")) return;

    try {
      await citiesApi.delete(id);
      toast({ title: "Success", description: "City removed successfully" });
      fetchCities();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete city",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (city: City) => {
    try {
      await citiesApi.update(city.id, { ...city, isActive: !city.isActive });
      fetchCities();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
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
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                    {city.symbol}
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
                      onCheckedChange={() => toggleStatus(city)}
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
        )}

        {filteredCities.length === 0 && !isLoading && (
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
                <Label htmlFor="symbol">City Symbol (Emoji) *</Label>
                <Input
                  id="pincode"
                  value={formData.symbol}
                  onChange={(e) =>
                    setFormData({ ...formData, symbol: e.target.value })
                  }
                  placeholder="Enter city emoji (e.g. 🏰, 🏙️)"
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
