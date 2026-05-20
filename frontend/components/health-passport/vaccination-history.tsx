"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Syringe, CheckCircle2, Clock, AlertCircle, ChevronRight } from "lucide-react"

interface Vaccine {
  id: string
  name: string
  dose: string
  date?: string
  status: "applied" | "pending" | "overdue"
}

interface VaccinationHistoryProps {
  vaccines: Vaccine[]
}

export function VaccinationHistory({ vaccines }: VaccinationHistoryProps) {
  const statusConfig = {
    applied: {
      icon: CheckCircle2,
      label: "Aplicada",
      className: "text-accent bg-accent/10",
      iconClass: "text-accent",
    },
    pending: {
      icon: Clock,
      label: "Pendente",
      className: "text-warning bg-warning/10",
      iconClass: "text-warning",
    },
    overdue: {
      icon: AlertCircle,
      label: "Atrasada",
      className: "text-destructive bg-destructive/10",
      iconClass: "text-destructive",
    },
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 },
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Syringe className="h-5 w-5 text-primary" />
              Histórico de Vacinação
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {vaccines.filter((v) => v.status === "applied").length}/{vaccines.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <motion.ul
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {vaccines.map((vaccine) => {
              const status = statusConfig[vaccine.status]
              const StatusIcon = status.icon

              return (
                <motion.li
                  key={vaccine.id}
                  variants={item}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center h-10 w-10 rounded-full ${status.className}`}
                    >
                      <StatusIcon className={`h-5 w-5 ${status.iconClass}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{vaccine.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {vaccine.dose}
                        {vaccine.date && ` • ${vaccine.date}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${status.className} border-0`}>
                      {status.label}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.li>
              )
            })}
          </motion.ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}
