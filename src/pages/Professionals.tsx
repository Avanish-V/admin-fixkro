import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
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
    mobile: "+91 98765 43210",
    address: "123 Tech Street, Mumbai, MH",
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
    mobile: "+91 87654 32109",
    address: "456 Repair Ave, Delhi, DL",
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
    mobile: "+91 76543 21098",
    address: "789 Service Rd, Bangalore, KA",
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
    mobile: "+91 65432 10987",
    address: "321 Fix St, Chennai, TN",
    expertise: ["Air Conditioner", "General Repairs"],
    documents: { aadharCard: "uploaded", photo: "uploaded" },
    status: "active",
    completedJobs: 203,
    rating: 4.9,
  },
];

const Professionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>(initialProfessionals);
  const navigate = useNavigate();
  const { toast } = useToast();

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
        action={{ label: "Add Professional", onClick: () => navigate("/professionals/new") }}
      />

      <div className="glass-card overflow-hidden">
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
            {professionals.map((professional, index) => (
              <motion.tr
                key={professional.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="table-row-hover border-border/30"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/50 overflow-hidden shrink-0">
                      <img
                        src={professional.photo}
                        alt={professional.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-foreground">{professional.name}</span>
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
                      <span className="font-medium">{professional.rating}</span>
                    </div>
                    <p className="text-muted-foreground">{professional.completedJobs} jobs</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`text-sm ${
                    professional.documents.aadharCard === "uploaded" 
                      ? "text-success" 
                      : "text-warning"
                  }`}>
                    {professional.documents.aadharCard === "uploaded" ? "Verified" : "Pending"}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={professional.status} />
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
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default Professionals;
