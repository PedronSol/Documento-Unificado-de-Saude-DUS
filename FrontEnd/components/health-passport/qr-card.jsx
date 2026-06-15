"use client";

import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Droplets, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function QRCard({ fullName, universalId, bloodType, qrValue }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="w-full"
    >
      <Card className="overflow-hidden border-0 shadow-xl bg-linear-to-br from-primary via-primary to-primary/90">
        <CardContent className="p-0">
          {/* Security Frame Header */}
          <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-primary-foreground/10">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-xs md:text-sm font-medium text-primary-foreground/80">
                Documento Verificado
              </span>
            </div>
            <Badge className="bg-accent text-accent-foreground text-xs">
              Válido
            </Badge>
          </div>

          {/* Main Content - Responsive Layout */}
          <div className="p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:gap-8 lg:gap-12">
              {/* QR Code Container */}
              <motion.div
                className="relative mx-auto md:mx-0 mb-5 md:mb-0 w-fit shrink-0"
                animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Outer Security Frame */}
                <div className="absolute -inset-3 rounded-2xl border-2 border-dashed border-primary-foreground/20" />
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 h-4 w-4 border-t-2 border-l-2 border-accent rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 h-4 w-4 border-t-2 border-r-2 border-accent rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-accent rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-accent rounded-br-lg" />

                {/* QR Code - Responsive Size */}
                <div className="rounded-xl bg-card p-3 shadow-inner">
                  <QRCodeSVG
                    value={qrValue}
                    size={140}
                    level="H"
                    includeMargin={false}
                    className="rounded-lg w-[140px] h-[140px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px]"
                  />
                </div>
              </motion.div>

              {/* User Info - Expands on larger screens */}
              <div className="flex-1 text-center md:text-left space-y-3 md:space-y-4">
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-primary-foreground tracking-tight">
                    {fullName}
                  </h2>
                  <p className="text-sm md:text-base text-primary-foreground/70 font-mono mt-1">
                    ID: {universalId}
                  </p>
                </div>

                {/* Blood Type & Refresh - Reflows */}
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4 border-t border-primary-foreground/10">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-destructive" />
                    <div className="text-left">
                      <span className="text-xs text-primary-foreground/60 block">
                        Tipo Sanguíneo
                      </span>
                      <span className="text-lg md:text-xl font-bold text-primary-foreground">
                        {bloodType}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-0"
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                    />
                    Atualizar QR
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
