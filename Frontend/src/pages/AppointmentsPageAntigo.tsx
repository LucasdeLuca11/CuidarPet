import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Star } from "lucide-react";
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
  clinic_name: string;
  service_name: string;
  service_type: string;
  notes?: string;
  rating?: number;
  review?: string;
}

export default function AppointmentsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== 0) {
      navigate("/clinic");
      return;
    }

    fetchAppointments();
  }, [isAuthenticated, user, navigate]);

  async function fetchAppointments() {
    try {
      const response = await fetch("/api/appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    } finally {
      setIsLoading(false);
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
      return appointmentDate > now && appointment.status !== "cancelled";
    }

    if (filter === "past") {
      return appointmentDate < now || appointment.status === "completed";
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
      default:
        return status;
    }
  }

  return (
    <Layout userType="owner">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Meus Agendamentos
          </h1>
          <p className="text-gray-600">
            Visualize e gerencie seus agendamentos
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          {["all", "upcoming", "past"].map((type) => (
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
                : "Histórico"}
            </button>
          ))}
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-12 shadow-lg text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum agendamento encontrado
            </h3>
            <button
              onClick={() => navigate("/clinics")}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold"
            >
              Agendar Consulta
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white/80 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex justify-between">
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

                <div className="grid md:grid-cols-2 gap-3 text-sm mt-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {format(
                      new Date(appointment.scheduled_at),
                      "dd 'de' MMMM 'de' yyyy",
                      { locale: ptBR }
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    {format(new Date(appointment.scheduled_at), "HH:mm")}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {appointment.clinic_name}
                  </div>
                </div>

                {appointment.rating && (
                  <div className="mt-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>{appointment.rating}/5</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
