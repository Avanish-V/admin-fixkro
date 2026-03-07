import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/ImageUpload";
import {
  createProfessional,
  updateProfessional,
  fetchProfessionalById,
  CreateProfessionalRequest,
  UpdateProfessionalRequest
} from "@/api/professionals";

const ProfessionalForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    expertise: "",
    photo: "",
    aadharCard: "",
    idPhoto: ""
  });

  useEffect(() => {
    if (id) {
      loadProfessional(parseInt(id));
    }
  }, [id]);

  const loadProfessional = async (profId: number) => {
    setIsLoading(true);
    try {
      const professional = await fetchProfessionalById(profId);
      setFormData({
        name: professional.name,
        mobile: professional.mobile,
        address: professional.address,
        expertise: professional.expertise.join(", "),
        photo: professional.photo,
        aadharCard: professional.aadharCard,
        idPhoto: professional.idPhoto
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to load professional details", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.mobile) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const payload = {
      ...formData,
      expertise: formData.expertise.split(",").map(s => s.trim()).filter(Boolean)
    };

    setIsLoading(true);
    try {
      if (isEditing) {
        await updateProfessional(parseInt(id!), { ...payload, status: "active" } as UpdateProfessionalRequest);
        toast({ title: "Success", description: "Professional updated successfully" });
      } else {
        await createProfessional(payload as CreateProfessionalRequest);
        toast({ title: "Success", description: "Professional added successfully" });
      }
      navigate("/professionals");
    } catch (error) {
      toast({ title: "Error", description: "Failed to save professional", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditing) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
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

        <div className="glass-card p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ImageUpload
              label="Profile Photo *"
              folder="professionals/photos"
              value={formData.photo}
              onChange={(url) => setFormData(prev => ({ ...prev, photo: url }))}
            />
            <ImageUpload
              label="Aadhar Card"
              folder="professionals/aadhar"
              value={formData.aadharCard}
              onChange={(url) => setFormData(prev => ({ ...prev, aadharCard: url }))}
            />
            <ImageUpload
              label="ID Photo"
              folder="professionals/id-photos"
              value={formData.idPhoto}
              onChange={(url) => setFormData(prev => ({ ...prev, idPhoto: url }))}
            />
          </div>

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

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
            <Button variant="outline" onClick={() => navigate("/professionals")}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="btn-gradient gap-2" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEditing ? "Update Professional" : "Add Professional"}
            </Button>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default ProfessionalForm;
