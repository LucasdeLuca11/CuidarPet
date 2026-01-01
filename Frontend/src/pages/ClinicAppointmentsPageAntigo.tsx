import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";

interface Appointment {
  id: number;
  scheduled_at: string;
  status: string;
  pet_name: string;
  pet_species: string;
  service_name: string;
  service_type: string;
  owner_name: string;
  owner_phone: string;
  notes?: string;
}

export default function ClinicAppointmentsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "pending">("all");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "Veterinarian" && user?.role !== "Admin") {
      navigate("/owner");
      return;
    }

    fetchAppointments();
  }, [isAuthenticated, user, navigate]);

  async function fetchAppointments() {
    try {
      const response = await fetch("/api/clinic/appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos da clínica:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateStatus(appointmentId: number, status: string) {
    try {
      await fetch(`/api/appointments/${appointmentId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });

      await fetchAppointments();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.scheduled_at);
    const now = new Date();

    if (filter === "upcoming") {
      return (
        appointmentDate > now &&
        ["pending", "confirmed"].includes(appointment.status)
      );
    }

    if (filter === "pending") {
      return appointment.status === "pending";
    }

    return true;
  });

  function getStatusColor(status: string) {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "no_show":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "pending":
        return "Pendente";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      case "no_show":
        return "Faltou";
      default:
        return status;
    }
  }

  function getServiceTypeLabel(type: string) {
    switch (type) {
      case "consultation":
        return "Consulta";
      case "grooming":
        return "Tosa";
      case "bath":
        return "Banho";
      default:
        return type;
    }
  }

  return (
    <Layout userType="clinic">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Agendamentos da Clínica
          </h1>
          <p className="text-gray-600">
            Gerencie os agendamentos dos seus clientes
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          {["all", "upcoming", "pending"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === type
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "bg-white/80 text-gray-700 hover:bg-white"
              }`}
            >
              {type === "all"
                ? "Todos"
                : type === "upcoming"
                ? "Próximos"
                : "Pendentes"}
            </button>
          ))}
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-12 shadow-lg text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum agendamento encontrado
            </h3>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white/80 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-800">
                        {appointment.pet_name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {getStatusLabel(appointment.status)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Dono:</span>
                        <span className="ml-2 font-medium">
                          {appointment.owner_name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        {appointment.owner_phone}
                      </div>

                      <div>
                        <span className="text-gray-600">Serviço:</span>
                        <span className="ml-2 font-medium">
                          {appointment.service_name}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-600">Tipo:</span>
                        <span className="ml-2 font-medium">
                          {getServiceTypeLabel(appointment.service_type)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {format(
                          new Date(appointment.scheduled_at),
                          "dd 'de' MMMM 'de' yyyy",
                          { locale: ptBR }
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {format(new Date(appointment.scheduled_at), "HH:mm")}
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="p-3 bg-gray-50 rounded-lg text-sm">
                        <strong>Observações:</strong> {appointment.notes}
                      </div>
                    )}
                  </div>

                  {appointment.status === "pending" && (
                    <div className="flex lg:flex-col gap-2">
                      <button
                        onClick={() =>
                          updateStatus(appointment.id, "confirmed")
                        }
                        className="px-4 py-2 bg-green-500 text-white rounded-xl flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirmar
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(appointment.id, "cancelled")
                        }
                        className="px-4 py-2 bg-red-500 text-white rounded-xl flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
