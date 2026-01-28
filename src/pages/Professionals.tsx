import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Phone,
  MapPin,
  Award,
  Upload,
  FileText,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Professional {
  id: string;
  name: string;
  photo: string;
  mobile: string;
  address: string;
  expertise: string[];
  documents: {
    aadharCard: string;
    photo: string;
  };
  status: "active" | "inactive";
  completedJobs: number;
  rating: number;
}

const initialProfessionals: Professional[] = [
  {
    id: "1",
    name: "Mike Thompson",
    photo: "/placeholder.svg",
    mobile: "+1 234 567 890",
    address: "123 Tech Street, Silicon Valley, CA",
    expertise: ["Air Conditioner", "Refrigerator", "HVAC"],
    documents: { aadharCard: "uploaded", photo: "uploaded" },
    status: "active",
    completedJobs: 156,
    rating: 4.8,
  },
  {
    id: "2",
    name: "David Wilson",
    photo: "/placeholder.svg",
    mobile: "+1 345 678 901",
    address: "456 Repair Ave, Los Angeles, CA",
    expertise: ["Washing Machine", "Dishwasher", "Dryer"],
    documents: { aadharCard: "uploaded", photo: "uploaded" },
    status: "active",
    completedJobs: 98,
    rating: 4.6,
  },
  {
    id: "3",
    name: "James Brown",
    photo: "/placeholder.svg",
    mobile: "+1 456 789 012",
    address: "789 Service Rd, Houston, TX",
    expertise: ["Television", "Microwave", "Electronics"],
    documents: { aadharCard: "pending", photo: "uploaded" },
    status: "inactive",
    completedJobs: 67,
    rating: 4.4,
  },
  {
    id: "4",
    name: "Sarah Lee",
    photo: "/placeholder.svg",
    mobile: "+1 567 890 123",
    address: "321 Fix St, Chicago, IL",
    expertise: ["Air Conditioner", "General Repairs"],
    documents: { aadharCard: "uploaded", photo: "uploaded" },
    status: "active",
    completedJobs: 203,
    rating: 4.9,
  },
];

const Professionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>(initialProfessionals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    expertise: "",
  });
  const { toast } = useToast();

  const handleCreate = () => {
    setEditingProfessional(null);
    setFormData({ name: "", mobile: "", address: "", expertise: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (professional: Professional) => {
    setEditingProfessional(professional);
    setFormData({
      name: professional.name,
      mobile: professional.mobile,
      address: professional.address,
      expertise: professional.expertise.join(", "),
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.mobile) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    if (editingProfessional) {
      setProfessionals(professionals.map(p => 
        p.id === editingProfessional.id 
          ? { 
              ...p, 
              name: formData.name,
              mobile: formData.mobile,
              address: formData.address,
              expertise: formData.expertise.split(",").map(e => e.trim()),
            }
          : p
      ));
      toast({ title: "Success", description: "Professional updated successfully" });
    } else {
      const newProfessional: Professional = {
        id: Date.now().toString(),
        name: formData.name,
        photo: "/placeholder.svg",
        mobile: formData.mobile,
        address: formData.address,
        expertise: formData.expertise.split(",").map(e => e.trim()),
        documents: { aadharCard: "pending", photo: "pending" },
        status: "inactive",
        completedJobs: 0,
        rating: 0,
      };
      setProfessionals([...professionals, newProfessional]);
      toast({ title: "Success", description: "Professional added successfully" });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setProfessionals(professionals.filter(p => p.id !== id));
    toast({ title: "Deleted", description: "Professional has been removed" });
  };

  const handleToggleStatus = (id: string) => {
    setProfessionals(professionals.map(p => 
      p.id === id 
        ? { ...p, status: p.status === "active" ? "inactive" : "active" }
        : p
    ));
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Professionals"
        description="Manage service professionals and technicians"
        action={{ label: "Add Professional", onClick: handleCreate }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {professionals.map((professional, index) => (
          <motion.div
            key={professional.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-start gap-4">
              {/* Photo */}
              <div className="w-20 h-20 rounded-xl bg-secondary/50 overflow-hidden shrink-0">
                <img
                  src={professional.photo}
                  alt={professional.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-foreground text-lg">{professional.name}</h3>
                  <StatusBadge status={professional.status} />
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> {professional.mobile}
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 shrink-0" /> {professional.address}
                  </p>
                </div>

                {/* Expertise */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {professional.expertise.map((exp) => (
                    <span
                      key={exp}
                      className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                    >
                      {exp}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-warning" />
                    <span className="text-sm">
                      <span className="font-semibold">{professional.rating}</span> rating
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">{professional.completedJobs}</span>
                    <span className="text-muted-foreground"> jobs</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <FileText className="w-4 h-4" />
                    <span className={professional.documents.aadharCard === "uploaded" ? "text-success" : "text-warning"}>
                      Docs: {professional.documents.aadharCard}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEdit(professional)}
                  className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleToggleStatus(professional.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    professional.status === "active"
                      ? "bg-success/10 text-success hover:bg-success/20"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Power className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(professional.id)}
                  className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <AnimatePresence>
        {isDialogOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-card border-border max-w-xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProfessional ? "Edit Professional" : "Add Professional"}
                </DialogTitle>
                <DialogDescription>
                  {editingProfessional 
                    ? "Update the professional's details" 
                    : "Add a new service professional to your team"
                  }
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-secondary/50 flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" /> Upload Photo
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-secondary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      placeholder="+1 234 567 890"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="bg-secondary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter full address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-secondary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expertise">Expertise (comma-separated)</Label>
                  <Input
                    id="expertise"
                    placeholder="AC, Refrigerator, Washing Machine"
                    value={formData.expertise}
                    onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                    className="bg-secondary/50"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Documents</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/30 border border-dashed border-border">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                        <p className="text-sm font-medium">Aadhar Card</p>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Upload className="w-3 h-3" /> Upload
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30 border border-dashed border-border">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <User className="w-8 h-8 text-muted-foreground" />
                        <p className="text-sm font-medium">ID Photo</p>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Upload className="w-3 h-3" /> Upload
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="btn-gradient">
                  {editingProfessional ? "Update" : "Add Professional"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default Professionals;
