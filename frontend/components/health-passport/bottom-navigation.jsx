"use client"

import { motion } from "framer-motion"
import { Home, FileText, History, User } from "lucide-react"
import { useState } from "react"

const navItems = [
  { id: "home", label: "Início", icon: Home },
  { id: "documents", label: "Documentos", icon: FileText },
  { id: "history", label: "Histórico", icon: History },
  { id: "profile", label: "Perfil", icon: User },
]

export function BottomNavigation() {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl safe-area-bottom lg:hidden"
    >
      <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center flex-1 py-2 px-3 rounded-xl transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon
                className={`h-5 w-5 relative z-10 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-xs mt-1 relative z-10 font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1 w-8 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </motion.nav>
  )
}
