"use client"

import { ThemeProvider } from "@/components/health-passport/theme-provider"
import { Header } from "@/components/health-passport/header"
import { QRCard } from "@/components/health-passport/qr-card"
import { VaccinationHistory } from "@/components/health-passport/vaccination-history"
import { MedicalAlerts } from "@/components/health-passport/medical-alerts"
import { DigitalDocuments } from "@/components/health-passport/digital-documents"
import { BottomNavigation } from "@/components/health-passport/bottom-navigation"

// Dados de exemplo para demonstração
const userData = {
  name: "Maria Silva Santos",
  avatar: undefined,
  healthStatus: "updated" as const,
  fullName: "Maria Silva Santos",
  universalId: "BR-2024-7829-4561",
  bloodType: "O+",
  qrValue: "https://saude.gov.br/passport/BR-2024-7829-4561",
}

const vaccineData = [
  {
    id: "1",
    name: "COVID-19 (Pfizer)",
    dose: "3ª Dose - Reforço",
    date: "15/03/2024",
    status: "applied" as const,
  },
  {
    id: "2",
    name: "Influenza",
    dose: "Dose Anual",
    date: "20/04/2024",
    status: "applied" as const,
  },
  {
    id: "3",
    name: "Febre Amarela",
    dose: "Dose Única",
    date: "10/01/2023",
    status: "applied" as const,
  },
  {
    id: "4",
    name: "Hepatite B",
    dose: "3ª Dose",
    status: "pending" as const,
  },
  {
    id: "5",
    name: "Tétano (dT)",
    dose: "Reforço",
    status: "overdue" as const,
  },
]

const alertsData = [
  {
    id: "1",
    type: "allergy" as const,
    title: "Alergia a Penicilina",
    description: "Reação anafilática severa. Evitar todos os antibióticos beta-lactâmicos.",
    severity: "high" as const,
  },
  {
    id: "2",
    type: "condition" as const,
    title: "Diabetes Tipo 2",
    description: "Diagnóstico em 2019. Controlada com medicação oral.",
    severity: "medium" as const,
  },
  {
    id: "3",
    type: "medication" as const,
    title: "Metformina 850mg",
    description: "Uso contínuo, 2x ao dia após refeições.",
    severity: "low" as const,
  },
]

const documentsData = [
  {
    id: "1",
    title: "Hemograma Completo",
    type: "exam" as const,
    date: "05/05/2024",
    status: "new" as const,
  },
  {
    id: "2",
    title: "Receita - Dr. João Mendes",
    type: "prescription" as const,
    date: "28/04/2024",
    status: "viewed" as const,
  },
  {
    id: "3",
    title: "Laudo Cardiológico",
    type: "report" as const,
    date: "15/04/2024",
    status: "viewed" as const,
  },
  {
    id: "4",
    title: "Glicemia em Jejum",
    type: "exam" as const,
    date: "01/04/2024",
    status: "viewed" as const,
  },
]

export default function HealthPassportPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background pb-24">
        <Header
          userName={userData.name}
          userAvatar={userData.avatar}
          healthStatus={userData.healthStatus}
        />

        <main className="container max-w-lg mx-auto px-4 py-6 space-y-6">
          {/* Hero Card com QR Code */}
          <QRCard
            fullName={userData.fullName}
            universalId={userData.universalId}
            bloodType={userData.bloodType}
            qrValue={userData.qrValue}
          />

          {/* Grid de Funcionalidades */}
          <div className="space-y-6">
            {/* Alertas Médicos - Prioridade visual */}
            <MedicalAlerts alerts={alertsData} />

            {/* Histórico de Vacinação */}
            <VaccinationHistory vaccines={vaccineData} />

            {/* Documentos Digitais */}
            <DigitalDocuments documents={documentsData} />
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    </ThemeProvider>
  )
}
