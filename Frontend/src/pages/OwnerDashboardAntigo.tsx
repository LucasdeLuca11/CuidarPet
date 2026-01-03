import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Calendar, PawPrint, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
}

interface Appointment {
  id: number;
  scheduled_at: string;
  status: string;
  pet_name: string;
  clinic_name: string;
  service_name: string;
}

export default function OwnerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !user) {
      navigate("/login");
      return;
    }

    if (user?.role  === 1) {
      navigate("/clinic");
      return;
    }

    if (!user?.role) {
      navigate("/onboarding");
      return;
    }

    fetchData();
  }, [user, isAuthenticated, navigate]);

  const fetchData = async () => {
    try {
      const [petsRes, appointmentsRes] = await Promise.all([
        fetch("/api/pets"),
        fetch("/api/appointments"),
      ]);

      const petsData = await petsRes.json();
      const appointmentsData = await appointmentsRes.json();

      setPets(petsData);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.scheduled_at) > new Date() && a.status !== "cancelled"
  );

  const recentAppointments = appointments
    .filter((a) => a.status === "completed")
    .slice(0, 5);

  return (
    <Layout userType="owner">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Olá, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Bem-vindo ao seu painel de cuidados com os pets
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Meus Pets</h3>
              <PawPrint className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{pets.length}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Próximos</h3>
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {upcomingAppointments.length}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Realizados</h3>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {appointments.filter((a) => a.status === "completed").length}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Este Mês</h3>
              <Calendar className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {
                appointments.filter(
                  (a) =>
                    new Date(a.scheduled_at).getMonth() === new Date().getMonth()
                ).length
              }
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Próximos Agendamentos
              </h2>
              <button
                onClick={() => navigate("/appointments")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver todos
              </button>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nenhum agendamento próximo</p>
                <button
                  onClick={() => navigate("/clinics")}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                >
                  Agendar consulta
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.slice(0, 3).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {appointment.pet_name}
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg font-medium">
                        {appointment.status === "confirmed"
                          ? "Confirmado"
                          : "Pendente"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {appointment.service_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {appointment.clinic_name}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {format(
                        new Date(appointment.scheduled_at),
                        "dd 'de' MMMM 'às' HH:mm",
                        { locale: ptBR }
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent History */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Histórico Recente
              </h2>
              <button
                onClick={() => navigate("/appointments")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver todos
              </button>
            </div>

            {recentAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nenhum histórico ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {appointment.pet_name}
                      </h3>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {appointment.service_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {appointment.clinic_name}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {format(
                        new Date(appointment.scheduled_at),
                        "dd 'de' MMMM",
                        { locale: ptBR }
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
