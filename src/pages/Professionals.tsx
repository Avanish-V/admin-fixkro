import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pencil,
  Trash2,
  Power,
  Phone,
  MapPin,
  Award,
  Search,
  Loader2,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchProfessionals,
  deleteProfessional,
  updateProfessional,
  searchProfessionals,
  ProfessionalResponse
} from "@/api/professionals";

const Professionals = () => {
  const [professionals, setProfessionals] = useState<ProfessionalResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProfessionals();
      setProfessionals(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load professionals", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadProfessionals();
      return;
    }
    try {
      const data = await searchProfessionals(query);
      setProfessionals(data);
    } catch (error) {
      toast({ title: "Error", description: "Search failed", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this professional?")) return;
    try {
      await deleteProfessional(id);
      setProfessionals(professionals.filter(p => p.id !== id));
      toast({ title: "Deleted", description: "Professional has been removed" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete professional", variant: "destructive" });
    }
  };

  const handleToggleStatus = async (professional: ProfessionalResponse) => {
    const newStatus = professional.status === "active" ? "inactive" : "active";
    try {
      await updateProfessional(professional.id, {
        name: professional.name,
        photo: professional.photo,
        mobile: professional.mobile,
        address: professional.address,
        expertise: professional.expertise,
        aadharCard: professional.aadharCard,
        idPhoto: professional.idPhoto,
        status: newStatus
      });
      setProfessionals(professionals.map(p =>
        p.id === professional.id ? { ...p, status: newStatus } : p
      ));
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Professionals"
        description="Manage service professionals and technicians"
        action={{ label: "Add Professional", onClick: () => navigate("/professionals/new") }}
      />

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, ID or phone..."
          className="pl-10 bg-secondary/50"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-semibold">Professional</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Contact</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Expertise</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Stats</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Documents</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professionals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No professionals found
                  </TableCell>
                </TableRow>
              ) : (
                professionals.map((professional, index) => (
                  <motion.tr
                    key={professional.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="table-row-hover border-border/30"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/50 overflow-hidden shrink-0 border border-border/50">
                          {professional.photo ? (
                            <img
                              src={professional.photo}
                              alt={professional.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{professional.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">ID: {professional.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <p className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" /> {professional.mobile}
                        </p>
                        <p className="flex items-center gap-1.5 text-muted-foreground truncate max-w-[180px]">
                          <MapPin className="w-3.5 h-3.5 shrink-0" /> {professional.address}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {professional.expertise.slice(0, 2).map((exp) => (
                          <span
                            key={exp}
                            className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium"
                          >
                            {exp}
                          </span>
                        ))}
                        {professional.expertise.length > 2 && (
                          <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground text-xs">
                            +{professional.expertise.length - 2}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-warning" />
                          <span className="font-medium">{professional.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-muted-foreground">{professional.completedJobs} jobs</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className={`text-xs ${professional.aadharCard ? "text-success" : "text-warning"}`}>
                          Aadhar: {professional.aadharCard ? "Uploaded" : "Pending"}
                        </span>
                        <span className={`text-xs ${professional.idPhoto ? "text-success" : "text-warning"}`}>
                          ID Photo: {professional.idPhoto ? "Uploaded" : "Pending"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={professional.status as any} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate(`/professionals/${professional.id}/edit`)}
                          className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleToggleStatus(professional)}
                          className={`p-2 rounded-lg transition-colors ${professional.status === "active"
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
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </AdminLayout>
  );
};

export default Professionals;
