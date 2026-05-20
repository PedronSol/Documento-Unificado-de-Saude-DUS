"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Heart, Pill, ShieldAlert } from "lucide-react"

interface MedicalAlert {
  id: string
  type: "allergy" | "condition" | "medication"
  title: string
  description: string
  severity: "high" | "medium" | "low"
}

interface MedicalAlertsProps {
  alerts: MedicalAlert[]
}

export function MedicalAlerts({ alerts }: MedicalAlertsProps) {
  const typeConfig = {
    allergy: {
      icon: ShieldAlert,
      label: "Alergia",
      iconClass: "text-destructive",
    },
    condition: {
      icon: Heart,
      label: "Condição",
      iconClass: "text-warning",
    },
    medication: {
      icon: Pill,
      label: "Medicação",
      iconClass: "text-primary",
    },
  }

  const severityConfig = {
    high: {
      className: "bg-destructive text-destructive-foreground",
      label: "Alta",
    },
    medium: {
      className: "bg-warning text-warning-foreground",
      label: "Média",
    },
    low: {
      className: "bg-secondary text-secondary-foreground",
      label: "Baixa",
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
    hidden: { scale: 0.95, opacity: 0 },
    show: { scale: 1, opacity: 1 },
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="border shadow-sm border-destructive/20 bg-destructive/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Alertas Médicos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {alerts.map((alert) => {
              const type = typeConfig[alert.type]
              const severity = severityConfig[alert.severity]
              const TypeIcon = type.icon

              return (
                <motion.div
                  key={alert.id}
                  variants={item}
                  className="p-3 rounded-xl bg-card border border-destructive/10 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-destructive/10 shrink-0">
                        <TypeIcon className={`h-5 w-5 ${type.iconClass}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm text-foreground">
                            {alert.title}
                          </p>
                          <Badge className={`text-xs ${severity.className}`}>
                            {severity.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
