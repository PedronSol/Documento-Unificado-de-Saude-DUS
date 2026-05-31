"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { ThemeProvider } from "@/components/health-passport/theme-provider";
import { Header } from "@/components/health-passport/header";
import { MedicalAlerts } from "@/components/health-passport/medical-alerts";
import { DigitalDocuments } from "@/components/health-passport/digital-documents";

export default function HealthPassportPage() {
  const [userData, setUserData] = useState(null);
  const [vaccineData, setVaccineData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [documentsData, setDocumentsData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  const [idVacina, setIdVacina] = useState("");
  const [nomeVacina, setNomeVacina] = useState("");
  const [dose, setDose] = useState("");
  const [dataAplicacao, setDataAplicacao] = useState("");
  const [statusVacina, setStatusVacina] = useState("applied");

  useEffect(() => {
    const storedUser = sessionStorage.getItem("patient_data");
    const storedVaccines = sessionStorage.getItem("vaccines");
    const storedAlerts = sessionStorage.getItem("alerts");
    const storedDocuments = sessionStorage.getItem("documents");

    if (!storedUser) {
      window.location.href = "/";
      return;
    }

    setUserData(JSON.parse(storedUser));
    setVaccineData(storedVaccines ? JSON.parse(storedVaccines) : []);
    setAlertsData(storedAlerts ? JSON.parse(storedAlerts) : []);
    setDocumentsData(storedDocuments ? JSON.parse(storedDocuments) : []);
  }, []);

  const handleOpenAddModal = () => {
    setEditingVaccine(null);
    setIdVacina(Math.floor(Math.random() * 10000).toString());
    setNomeVacina("");
    setDose("");
    setDataAplicacao("");
    setStatusVacina("applied");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vaccine) => {
    setEditingVaccine(vaccine);
    setIdVacina(vaccine.id_vacina);
    setNomeVacina(vaccine.nome_vacina);
    setDose(vaccine.dose);
    setDataAplicacao(vaccine.data_aplicacao || "");
    setStatusVacina(vaccine.status_vacina);
    setIsModalOpen(true);
  };

  const handleSaveVaccine = async (e) => {
    e.preventDefault();
    setIsLoadingAction(true);

    const payload = {
      id_vacina: idVacina,
      nome_vacina: nomeVacina,
      dose: dose,
      data_aplicacao: dataAplicacao || null,
      status_vacina: statusVacina,
    };

    const isEditing = editingVaccine !== null;
    const url = isEditing
      ? `http://localhost:8000/patients/${userData.cpf_paciente}/vaccines/${idVacina}`
      : `http://localhost:8000/patients/${userData.cpf_paciente}/vaccines`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao salvar dados da vacina.");

      let updatedVaccines = [...vaccineData];
      if (isEditing) {
        updatedVaccines = updatedVaccines.map((v) =>
          v.id_vacina === idVacina ? payload : v,
        );
      } else {
        updatedVaccines.push(payload);
      }

      setVaccineData(updatedVaccines);
      sessionStorage.setItem("vaccines", JSON.stringify(updatedVaccines));
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleDeleteVaccine = async (id_vacina) => {
    if (!confirm("Tem certeza que deseja remover esta vacina do prontuário?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:8000/patients/${userData.cpf_paciente}/vaccines/${id_vacina}`,
        { method: "DELETE" },
      );

      if (!response.ok) throw new Error("Erro ao deletar vacina.");

      const updatedVaccines = vaccineData.filter(
        (v) => v.id_vacina !== id_vacina,
      );
      setVaccineData(updatedVaccines);
      sessionStorage.setItem("vaccines", JSON.stringify(updatedVaccines));
    } catch (err) {
      alert(err.message);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">
          Carregando prontuário digital...
        </p>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background relative">
        <Header
          userName={userData.nome_paciente}
          userAvatar={userData.avatar}
          healthStatus={userData.status_saude}
        />

        <main className="pb-16 lg:pb-8">
          <div className="container max-w-7xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
            <div className="space-y-6 lg:space-y-8 w-full">
              <MedicalAlerts alerts={alertsData} />
              <DigitalDocuments documents={documentsData} />

              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      Histórico de Vacinação
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Gerencie o registro de vacinas aplicadas ou pendentes
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-1 text-xs font-medium bg-primary text-primary-foreground px-3 h-9 rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Vacina
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vaccineData.map((vaccine) => (
                    <div
                      key={vaccine.id_vacina}
                      className="bg-secondary/20 border border-border/40 rounded-xl p-4 flex flex-col justify-between relative group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-sm text-foreground">
                            {vaccine.nome_vacina}
                          </h3>

                          <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEditModal(vaccine)}
                              className="p-1.5 text-muted-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                              title="Editar vacina"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteVaccine(vaccine.id_vacina)
                              }
                              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                              title="Excluir vacina"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {vaccine.dose}
                        </p>
                        {vaccine.data_aplicacao && (
                          <p className="text-[11px] text-muted-foreground/80">
                            Aplicada em: {vaccine.data_aplicacao}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                            vaccine.status_vacina === "applied"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : vaccine.status_vacina === "pending"
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-rose-500/10 text-rose-500"
                          }`}
                        >
                          {vaccine.status_vacina === "applied" ? (
                            <Check className="w-3 h-3" />
                          ) : vaccine.status_vacina === "pending" ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          {vaccine.status_vacina === "applied"
                            ? "Aplicada"
                            : vaccine.status_vacina === "pending"
                              ? "Pendente"
                              : "Atrasada"}
                        </span>
                        <span className="text-[10px] text-muted-foreground/50">
                          ID: #{vaccine.id_vacina}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-foreground">
                    {editingVaccine
                      ? "Editar Registro de Vacina"
                      : "Registrar Nova Vacina"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveVaccine} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">
                      Nome da Vacina
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: COVID-19 (Pfizer), Influenza"
                      value={nomeVacina}
                      onChange={(e) => setNomeVacina(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">
                      Dose / Categoria
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 1ª Dose, Dose Anual, Reforço"
                      value={dose}
                      onChange={(e) => setDose(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-foreground block mb-1">
                        Status
                      </label>
                      <select
                        value={statusVacina}
                        onChange={(e) => setStatusVacina(e.target.value)}
                        className="w-full h-10 px-2 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      >
                        <option value="applied">Aplicada</option>
                        <option value="pending">Pendente</option>
                        <option value="overdue">Atrasada</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-foreground block mb-1">
                        Data de Aplicação
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: DD/MM/AAAA"
                        value={dataAplicacao}
                        disabled={statusVacina !== "applied"}
                        onChange={(e) => setDataAplicacao(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="h-10 px-4 rounded-xl text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoadingAction}
                      className="h-10 px-4 bg-primary text-primary-foreground rounded-xl text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isLoadingAction ? "Salvando..." : "Salvar Registro"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
