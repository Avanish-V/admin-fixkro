import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, User, FileText, Save } from "lucide-react";
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

// Mock data - in real app this would come from API/state management
const mockProfessionals: Professional[] = [
  {
    id: "1",
    name: "Mike Thompson",
    photo: "/placeholder.svg",
    mobile: "+91 98765 43210",
    address: "123 Tech Street, Mumbai, MH",
    expertise: ["Air Conditioner", "Refrigerator", "HVAC"],
    documents: { aadharCard: "uploaded", photo: "uploaded" },
    status: "active",
    completedJobs: 156,
    rating: 4.8,
  },
];

const ProfessionalForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    expertise: "",
  });

  useEffect(() => {
    if (id) {
      const professional = mockProfessionals.find(p => p.id === id);
      if (professional) {
        setFormData({
          name: professional.name,
          mobile: professional.mobile,
          address: professional.address,
          expertise: professional.expertise.join(", "),
        });
      }
    }
  }, [id]);

  const handleSave = () => {
    if (!formData.name || !formData.mobile) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    toast({ 
      title: "Success", 
      description: isEditing ? "Professional updated successfully" : "Professional added successfully" 
    });
    navigate("/professionals");
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/professionals")}
            className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEditing ? "Edit Professional" : "Add Professional"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? "Update the professional's details" : "Add a new service professional to your team"}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="glass-card p-8 space-y-8">
          {/* Photo Upload */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-xl bg-secondary/50 flex items-center justify-center">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
            <div>
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" /> Upload Photo
              </Button>
              <p className="text-sm text-muted-foreground mt-2">JPG, PNG up to 5MB</p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                placeholder="+91 98765 43210"
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
              className="bg-secondary/50 min-h-[100px]"
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

          {/* Documents */}
          <div className="space-y-4">
            <Label>Documents</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-secondary/30 border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Aadhar Card</p>
                    <p className="text-sm text-muted-foreground">Upload front & back</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="w-3 h-3" /> Upload
                  </Button>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-secondary/30 border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">ID Photo</p>
                    <p className="text-sm text-muted-foreground">Passport size photo</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="w-3 h-3" /> Upload
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
            <Button variant="outline" onClick={() => navigate("/professionals")}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="btn-gradient gap-2">
              <Save className="w-4 h-4" />
              {isEditing ? "Update Professional" : "Add Professional"}
            </Button>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default ProfessionalForm;
