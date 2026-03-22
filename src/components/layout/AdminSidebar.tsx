import { useState, createContext, useContext, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  Package,
  Tags,
  ShoppingCart,
  CreditCard,
  Users,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  Wrench,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FolderOpen, label: "Categories", path: "/categories" },
  { icon: Package, label: "Products", path: "/products" },
  { icon: Tags, label: "Offers", path: "/offers" },
  { icon: ShoppingCart, label: "Orders", path: "/orders" },
  { icon: CreditCard, label: "Transactions", path: "/transactions" },
  { icon: Users, label: "Professionals", path: "/professionals" },
  { icon: MapPin, label: "Cities", path: "/cities" },
  { icon: Star, label: "Reviews", path: "/reviews" },
];

// Context for sidebar collapsed state
interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => { }
});

export const useSidebarCollapsed = () => useContext(SidebarContext);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const AdminSidebar = () => {
  const { collapsed, setCollapsed } = useSidebarCollapsed();
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-50"
    >
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white font-black text-sm">FK</span>
          </motion.div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center"
              >
                <span className="text-xl font-black text-primary">Fix</span>
                <span className="text-xl font-black text-[#FFB300]">Kro</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-sidebar-accent"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground transition-all duration-200 hover:bg-sidebar-accent"
          )}
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-medium"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <Link
          to="/login"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl text-destructive transition-all duration-200 hover:bg-destructive/10"
          )}
        >
          <LogOut className="w-5 h-5" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Collapse toggle */}
      <motion.button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-sidebar border border-sidebar-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </motion.button>
    </motion.aside>
  );
};
