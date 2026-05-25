"use client"

import { useEffect, useState } from "react"
import { ThemeProvider } from "@/components/health-passport/theme-provider"
import { Header } from "@/components/health-passport/header"
import { QRCard } from "@/components/health-passport/qr-card"
import { VaccinationHistory } from "@/components/health-passport/vaccination-history"
import { MedicalAlerts } from "@/components/health-passport/medical-alerts"
import { DigitalDocuments } from "@/components/health-passport/digital-documents"
import { BottomNavigation } from "@/components/health-passport/bottom-navigation"

// ─── Tipos que espelham o retorno do FastAPI (snake_case) ────────────────────

type PerfilCompleto = {
  id: string
  nome: string
  foto?: string
  tipo_sanguineo: string
  convenio: string
}

type VacinaAPI = {
  id: string
  nome_vacina: string
  dose: string
  data_aplicacao: string | null
  status: "applied" | "pending" | "overdue"
}

type DocumentoAPI = {
  id: string
  titulo: string
  tipo: "exam" | "prescription" | "report"
  data: string
  status: "new" | "viewed"
}

type AlertaAPI = {
  id: string
  tipo: "allergy" | "condition" | "medication"
  titulo: string
  descricao: string
  severidade: "high" | "medium" | "low"
}

// ─── URL base da API ──────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://super-xylophone-g47qwvxq7pghv4px-8000.app.github.dev"

// ID do paciente logado — no futuro virá do contexto de autenticação
const PACIENTE_ID = "usr-001"

// ─── Helper de fetch ──────────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`Erro ${res.status} em ${path}`)
  return res.json()
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function HealthPassportPage() {
  const [perfil,    setPerfil]    = useState<PerfilCompleto | null>(null)
  const [vacinas,   setVacinas]   = useState<VacinaAPI[]>([])
  const [documentos,setDocumentos]= useState<DocumentoAPI[]>([])
  const [alertas,   setAlertas]   = useState<AlertaAPI[]>([])
  const [loading,   setLoading]   = useState(true)
  const [erro,      setErro]      = useState<string | null>(null)

  useEffect(() => {
    async function carregarTudo() {
      try {
        const base = `/api/pacientes/${PACIENTE_ID}`
        const [p, v, d, a] = await Promise.all([
          apiFetch<PerfilCompleto>(`${base}/perfil-completo`),
          apiFetch<VacinaAPI[]>   (`${base}/vacinas`),
          apiFetch<DocumentoAPI[]>(`${base}/documentos`),
          apiFetch<AlertaAPI[]>   (`${base}/alertas`),
        ])
        setPerfil(p)
        setVacinas(v)
        setDocumentos(d)
        setAlertas(a)
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }
    carregarTudo()
  }, [])

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-muted-foreground animate-pulse">Carregando perfil...</p>
        </div>
      </ThemeProvider>
    )
  }

  if (erro || !perfil) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-destructive">Falha ao carregar: {erro}</p>
        </div>
      </ThemeProvider>
    )
  }

  // ─── Mapeia snake_case da API → props dos componentes ─────────────────────

  const userData = {
    name:         perfil.nome,
    avatar:       perfil.foto,
    healthStatus: "updated" as const,
    fullName:     perfil.nome,
    universalId:  perfil.id,
    bloodType:    perfil.tipo_sanguineo,
    qrValue:      `${API_BASE}/api/pacientes/${perfil.id}/perfil-completo`,
  }

  const vacinasFormatadas = vacinas.map((v) => ({
    id:     v.id,
    name:   v.nome_vacina,
    dose:   v.dose,
    date:   v.data_aplicacao ?? undefined,
    status: v.status,
  }))

  const documentosFormatados = documentos.map((d) => ({
    id:     d.id,
    title:  d.titulo,
    type:   d.tipo,
    date:   d.data,
    status: d.status,
  }))

  const alertasFormatados = alertas.map((a) => ({
    id:          a.id,
    type:        a.tipo,
    title:       a.titulo,
    description: a.descricao,
    severity:    a.severidade,
  }))

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background pb-24">
        <Header
          userName={userData.name}
          userAvatar={userData.avatar}
          healthStatus={userData.healthStatus}
        />

        <main className="container max-w-lg mx-auto px-4 py-6 space-y-6">
          <QRCard
            fullName={userData.fullName}
            universalId={userData.universalId}
            bloodType={userData.bloodType}
            qrValue={userData.qrValue}
          />

          <div className="space-y-6">
            <MedicalAlerts    alerts={alertasFormatados}     />
            <VaccinationHistory vaccines={vacinasFormatadas} />
            <DigitalDocuments documents={documentosFormatados} />
          </div>
        </main>

        <BottomNavigation />
      </div>
    </ThemeProvider>
  )
}
