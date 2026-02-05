import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, User, FileText, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  createProfessional,
  updateProfessional,
  fetchProfessionalById,
  uploadFile,
  CreateProfessionalRequest,
  UpdateProfessionalRequest
} from "@/api/professionals";

const ProfessionalForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    expertise: "",
    photo: "",
    aadharCard: "",
    idPhoto: ""
  });

  const photoInputRef = useRef<HTMLInputElement>(null);
  const aadharInputRef = useRef<HTMLInputElement>(null);
  const idPhotoInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: "photo" | "aadharCard" | "idPhoto") => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(field);
    try {
      const url = await uploadFile(file, `professionals/${field}`);
      setFormData(prev => ({ ...prev, [field]: url }));
      toast({ title: "Success", description: "File uploaded successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to upload file", variant: "destructive" });
    } finally {
      setIsUploading(null);
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
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-xl bg-secondary/50 flex items-center justify-center overflow-hidden border border-border">
              {formData.photo ? (
                <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <div>
              <input
                type="file"
                hidden
                ref={photoInputRef}
                onChange={(e) => handleFileUpload(e, "photo")}
                accept="image/*"
              />
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => photoInputRef.current?.click()}
                disabled={isUploading === "photo"}
              >
                {isUploading === "photo" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload Photo
              </Button>
              <p className="text-sm text-muted-foreground mt-2">JPG, PNG up to 5MB</p>
            </div>
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

          <div className="space-y-4">
            <Label>Documents</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="p-6 rounded-xl bg-secondary/30 border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => aadharInputRef.current?.click()}
              >
                <input
                  type="file"
                  hidden
                  ref={aadharInputRef}
                  onChange={(e) => handleFileUpload(e, "aadharCard")}
                />
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {formData.aadharCard ? <FileText className="w-6 h-6 text-success" /> : <FileText className="w-6 h-6 text-primary" />}
                  </div>
                  <div>
                    <p className="font-medium">Aadhar Card</p>
                    <p className="text-sm text-muted-foreground">{formData.aadharCard ? "File uploaded" : "Upload front & back"}</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" disabled={isUploading === "aadharCard"}>
                    {isUploading === "aadharCard" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                    {formData.aadharCard ? "Change" : "Upload"}
                  </Button>
                </div>
              </div>

              <div
                className="p-6 rounded-xl bg-secondary/30 border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => idPhotoInputRef.current?.click()}
              >
                <input
                  type="file"
                  hidden
                  ref={idPhotoInputRef}
                  onChange={(e) => handleFileUpload(e, "idPhoto")}
                />
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {formData.idPhoto ? <User className="w-6 h-6 text-success" /> : <User className="w-6 h-6 text-primary" />}
                  </div>
                  <div>
                    <p className="font-medium">ID Photo</p>
                    <p className="text-sm text-muted-foreground">{formData.idPhoto ? "File uploaded" : "Passport size photo"}</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" disabled={isUploading === "idPhoto"}>
                    {isUploading === "idPhoto" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                    {formData.idPhoto ? "Change" : "Upload"}
                  </Button>
                </div>
              </div>
            </div>
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
