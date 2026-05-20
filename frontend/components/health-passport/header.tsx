"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle2, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/health-passport/theme-provider"

interface HeaderProps {
  userName: string
  userAvatar?: string
  healthStatus: "updated" | "pending" | "alert"
}

export function Header({ userName, userAvatar, healthStatus }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  const statusConfig = {
    updated: {
      label: "Atualizado",
      variant: "default" as const,
      icon: CheckCircle2,
      className: "bg-accent text-accent-foreground",
    },
    pending: {
      label: "Pendente",
      variant: "secondary" as const,
      icon: Bell,
      className: "bg-warning text-warning-foreground",
    },
    alert: {
      label: "Atenção",
      variant: "destructive" as const,
      icon: Bell,
      className: "bg-destructive text-destructive-foreground",
    },
  }

  const status = statusConfig[healthStatus]
  const StatusIcon = status.icon

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl safe-area-top"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 ring-2 ring-accent/20">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{userName}</span>
            <Badge className={`w-fit text-xs px-2 py-0.5 ${status.className}`}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {status.label}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Alternar tema</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            <span className="sr-only">Notificações</span>
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
