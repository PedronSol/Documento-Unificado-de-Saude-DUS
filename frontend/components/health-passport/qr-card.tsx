"use client"

import { motion } from "framer-motion"
import { QRCodeSVG } from "qrcode.react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Droplets, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface QRCardProps {
  fullName: string
  universalId: string
  bloodType: string
  qrValue: string
}

export function QRCard({ fullName, universalId, bloodType, qrValue }: QRCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-primary via-primary to-primary/90">
        <CardContent className="p-0">
          {/* Security Frame Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-primary-foreground/10">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium text-primary-foreground/80">
                Documento Verificado
              </span>
            </div>
            <Badge className="bg-accent text-accent-foreground text-xs">
              Válido
            </Badge>
          </div>

          {/* Main Content */}
          <div className="p-5 pt-4">
            {/* QR Code Container */}
            <motion.div
              className="relative mx-auto mb-5 w-fit"
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
              
              {/* QR Code */}
              <div className="rounded-xl bg-card p-3 shadow-inner">
                <QRCodeSVG
                  value={qrValue}
                  size={160}
                  level="H"
                  includeMargin={false}
                  className="rounded-lg"
                />
              </div>
            </motion.div>

            {/* User Info */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-primary-foreground tracking-tight">
                {fullName}
              </h2>
              <p className="text-sm text-primary-foreground/70 font-mono">
                ID: {universalId}
              </p>
            </div>

            {/* Blood Type & Refresh */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-primary-foreground/10">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-destructive" />
                <div>
                  <span className="text-xs text-primary-foreground/60 block">Tipo Sanguíneo</span>
                  <span className="text-lg font-bold text-primary-foreground">{bloodType}</span>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-0"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Atualizar QR
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
