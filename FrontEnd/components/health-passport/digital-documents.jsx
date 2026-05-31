"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DigitalDocuments({ documents }) {
  const typeConfig = {
    exam: {
      label: "Exame",
      className: "bg-chart-3/10 text-chart-3",
    },
    prescription: {
      label: "Receita",
      className: "bg-primary/10 text-primary",
    },
    report: {
      label: "Laudo",
      className: "bg-accent/10 text-accent",
    },
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg font-semibold">
              <FileText className="h-5 w-5 text-primary" />
              Documentos Digitais
            </CardTitle>
            {/* <Button variant="ghost" size="sm" className="text-xs text-primary">
              Ver todos
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button> */}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3"
          >
            {documents.map((doc) => {
              const type = typeConfig[doc.tipo_documento];

              return (
                <motion.div
                  key={doc.id_documento}
                  variants={item}
                  className="group relative p-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border transition-all cursor-pointer"
                >
                  {doc.status_documento === "new" && (
                    <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
                  )}
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center h-12 w-12 lg:h-14 lg:w-14 rounded-xl bg-card shadow-sm shrink-0">
                      <FileText className="h-6 w-6 lg:h-7 lg:w-7 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm lg:text-base text-foreground truncate">
                        {doc.titulo_documento}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge className={`text-xs border-0 ${type.className}`}>
                          {type.label}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {doc.data_criacao_documento}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 text-xs flex-1"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      Visualizar
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div> */}
                </motion.div>
              );
            })}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
