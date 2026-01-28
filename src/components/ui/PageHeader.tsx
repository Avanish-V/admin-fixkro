import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}

export const PageHeader = ({ title, description, action }: PageHeaderProps) => {
  const ActionIcon = action?.icon || Plus;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action && (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={action.onClick} className="btn-gradient gap-2">
            <ActionIcon className="w-4 h-4" />
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
