"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCircle2,
  Moon,
  Sun,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/health-passport/theme-provider";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export function Header({ userName, userAvatar, healthStatus, cpf }) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    router.push("/");
  };

  const statusConfig = {
    updated: {
      label: "Atualizado",
      variant: "default",
      icon: CheckCircle2,
      className: "bg-accent text-accent-foreground",
    },
    pending: {
      label: "Pendente",
      variant: "secondary",
      icon: Bell,
      className: "bg-warning text-warning-foreground",
    },
    alert: {
      label: "Atenção",
      variant: "destructive",
      icon: Bell,
      className: "bg-destructive text-destructive-foreground",
    },
  };

  const status = statusConfig[healthStatus];
  const StatusIcon = status.icon;

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl safe-area-top"
    >
      <div className="flex items-center justify-between px-4 py-3 lg:px-8 lg:py-4 max-w-7xl mx-auto">
        <div
          className="flex items-center gap-3 lg:gap-4 relative"
          ref={menuRef}
        >
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 lg:gap-4 focus:outline-none"
          >
            <Avatar className="h-11 w-11 lg:h-14 lg:w-14 ring-2 ring-accent/20 cursor-pointer hover:ring-accent/40 transition-all">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="bg-primary text-primary-foreground font-medium text-sm lg:text-base">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left">
              <span className="text-sm lg:text-base font-medium text-foreground">
                {userName} - {cpf}
              </span>
              <Badge
                className={`w-fit text-xs px-2 py-0.5 ${status.className}`}
              >
                <StatusIcon className="mr-1 h-3 w-3" />
                {status.label}
              </Badge>
            </div>
          </button>

          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden"
            >
              <div className="p-2">
                <button
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <User className="h-4 w-4" />
                  Meu Perfil
                </button>
                <button
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Configuracoes
                </button>
              </div>
              <div className="border-t border-border p-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sair da Conta
                </button>
              </div>
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 lg:h-10 lg:w-10 rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Alternar tema</span>
          </Button>
          {/* <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 lg:h-10 lg:w-10 rounded-full relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            <span className="sr-only">Notificações</span>
          </Button> */}
        </div>
      </div>
    </motion.header>
  );
}
