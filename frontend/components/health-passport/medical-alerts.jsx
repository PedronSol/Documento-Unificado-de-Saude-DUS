"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Heart, Pill, ShieldAlert } from "lucide-react";

export function MedicalAlerts({ alerts }) {
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
  };

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
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { scale: 0.95, opacity: 0 },
    show: { scale: 1, opacity: 1 },
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="border shadow-sm border-destructive/20 bg-destructive/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base lg:text-lg font-semibold">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Alertas Médicos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
          >
            {alerts.map((alert) => {
              const type = typeConfig[alert.tipo_alerta];
              const severity = severityConfig[alert.severidade_alerta];
              const TypeIcon = type.icon;

              return (
                <motion.div
                  key={alert.id_alerta}
                  variants={item}
                  className="p-3 lg:p-4 rounded-xl bg-card border border-destructive/10 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-destructive/10 shrink-0">
                      <TypeIcon
                        className={`h-5 w-5 lg:h-6 lg:w-6 ${type.iconClass}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-sm lg:text-base text-foreground truncate">
                          {alert.titulo_alerta}
                        </p>
                        <Badge
                          className={`text-xs shrink-0 ${severity.className}`}
                        >
                          {severity.label}
                        </Badge>
                      </div>
                      <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {alert.descricao_alerta}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
