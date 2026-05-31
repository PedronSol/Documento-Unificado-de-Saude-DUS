"use client"

import { motion } from "framer-motion"
import { Home, FileText, History, User, Settings, Shield, HelpCircle, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const navItems = [
  { id: "home", label: "Início", icon: Home },
  { id: "documents", label: "Documentos", icon: FileText },
  { id: "history", label: "Histórico", icon: History },
  { id: "profile", label: "Perfil", icon: User },
]

const secondaryItems = [
  { id: "security", label: "Segurança", icon: Shield },
  { id: "settings", label: "Configurações", icon: Settings },
  { id: "help", label: "Ajuda", icon: HelpCircle },
]

export function SidebarNavigation({ activeTab, onTabChange }) {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-card/50 backdrop-blur-xl z-40 pt-20"
    >
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "relative flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors text-left",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Outros
          </p>
          <nav className="space-y-1">
            {secondaryItems.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.id}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-colors text-left text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sair da Conta</span>
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="px-4 py-3 rounded-xl bg-primary/5">
          <p className="text-xs text-muted-foreground">Passaporte Universal</p>
          <p className="text-xs font-medium text-primary">Versão 1.0.0</p>
        </div>
      </div>
    </motion.aside>
  )
}
