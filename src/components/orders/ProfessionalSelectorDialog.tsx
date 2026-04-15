import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Star, UserPlus, CheckCircle2, MapPin } from "lucide-react";
import { ProfessionalResponse as Professional } from "@/api/professionals";

interface ProfessionalSelectorDialogProps {
  professionals: Professional[];
  onSelect: (id: number) => void;
  currentlyAssignedId?: number | null;
  trigger?: React.ReactNode;
}

export const ProfessionalSelectorDialog = ({
  professionals,
  onSelect,
  currentlyAssignedId,
  trigger
}: ProfessionalSelectorDialogProps) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredProfessionals = professionals.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.expertise.some(e => e.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full gap-2 border-dashed">
            <UserPlus className="w-4 h-4" />
            {currentlyAssignedId ? "Change Professional" : "Assign Professional"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl">Select Professional</DialogTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or expertise (AC, Fridge...)"
              className="pl-9 bg-secondary/30"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] p-6 pt-2">
          <div className="space-y-3">
            {filteredProfessionals.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p>No professionals found matching "{search}"</p>
              </div>
            ) : (
              filteredProfessionals.map((prof) => (
                <div
                  key={prof.id}
                  onClick={() => {
                    onSelect(prof.id);
                    setOpen(false);
                  }}
                  className={`
                    flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer
                    ${currentlyAssignedId === prof.id 
                      ? "border-primary bg-primary/5 ring-1 ring-primary" 
                      : "border-border hover:border-primary/50 hover:bg-secondary/20"}
                  `}
                >
                  <Avatar className="w-12 h-12 border">
                    <AvatarImage src={prof.photo} />
                    <AvatarFallback>{prof.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-foreground truncate">{prof.name}</h4>
                      {currentlyAssignedId === prof.id && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Assigned
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-xs font-medium text-amber-500">
                        <Star className="w-3 h-3 fill-current mr-1" />
                        {(prof.rating ?? 0).toFixed(1)}
                      </div>
                      <span className="text-muted-foreground/30">•</span>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-success" />
                        {prof.completedJobs} Jobs
                      </div>
                      <span className="text-muted-foreground/30">•</span>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3" />
                        {prof.address.split(',')[0]}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {prof.expertise.slice(0, 3).map((exp, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] py-0 px-2 font-normal bg-secondary/50">
                          {exp}
                        </Badge>
                      ))}
                      {prof.expertise.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">+{prof.expertise.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-secondary/10 flex justify-end">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
