import { motion } from "framer-motion";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Banknote,
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchAllWithdrawals, approveWithdrawal, rejectWithdrawal, WithdrawalRequest } from "@/api/wallet";

const Withdrawals = () => {
  const queryClient = useQueryClient();

  const { data: withdrawals = [], isLoading, error, refetch } = useQuery({
    queryKey: ["withdrawals"],
    queryFn: fetchAllWithdrawals,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveWithdrawal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      toast.success("Withdrawal approved successfully");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to approve withdrawal");
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => rejectWithdrawal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      toast.success("Withdrawal rejected");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to reject withdrawal");
    }
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <PageHeader title="Withdrawal Requests" description="Loading requests..." />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <PageHeader title="Withdrawal Requests" description="Manage partner withdrawal requests" />
        <div className="glass-card p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Failed to load withdrawals</h3>
          <button 
            onClick={() => refetch()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium mt-4"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader 
        title="Withdrawal Requests" 
        description="Review and process partner payout requests" 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stats-card bg-primary/5 border-primary/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Requests</p>
              <p className="text-2xl font-bold text-primary">
                {withdrawals.filter(w => w.status === "PENDING").length}
              </p>
            </div>
          </div>
        </div>

        <div className="stats-card bg-success/5 border-success/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/10">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed Today</p>
              <p className="text-2xl font-bold text-success">
                {withdrawals.filter(w => w.status === "COMPLETED").length}
              </p>
            </div>
          </div>
        </div>

        <div className="stats-card bg-info/5 border-info/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-info/10">
              <Banknote className="w-6 h-6 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Payouts</p>
              <p className="text-2xl font-bold text-info">
                ₹{withdrawals
                  .filter(w => w.status === "COMPLETED")
                  .reduce((sum, w) => sum + w.amount, 0)
                  .toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-semibold">Technician</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Amount</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Date</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No withdrawal requests found.
                </TableCell>
              </TableRow>
            ) : (
              withdrawals.map((request, index) => (
                <motion.tr
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="table-row-hover border-border/30"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{request.technicianId}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          ID: {request.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-bold text-lg text-foreground">
                      ₹{request.amount.toLocaleString('en-IN')}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(request.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={request.status.toLowerCase()} />
                  </TableCell>
                  <TableCell className="text-right">
                    {request.status === "PENDING" ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive/20 text-destructive hover:bg-destructive/10"
                          onClick={() => rejectMutation.mutate(request.id)}
                          disabled={rejectMutation.isPending || approveMutation.isPending}
                        >
                          <XCircle className="w-4 h-4 mr-1" /> Reject
                        </Button>
                        <Button
                          size="sm"
                          className="bg-success hover:bg-success/90 text-white"
                          onClick={() => approveMutation.mutate(request.id)}
                          disabled={rejectMutation.isPending || approveMutation.isPending}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                        </Button>
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-sm flex items-center justify-end gap-1">
                        Processed on {request.processedAt ? new Date(request.processedAt).toLocaleDateString() : "---"}
                      </div>
                    )}
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default Withdrawals;
