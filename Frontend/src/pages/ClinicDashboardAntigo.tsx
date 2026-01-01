import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  Calendar,
  TrendingUp,
  DollarSign,
  Star,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface AnalyticsData {
  totalAppointments: number;
  completedAppointments: number;
  noShows: number;
  avgRating: number;
  revenue: number;
  appointmentsByDay: Array<{ date: string; count: number }>;
  appointmentsByService: Array<{ service_type: string; count: number }>;
}

interface Appointment {
  id: number;
  scheduled_at: string;
  status: string;
  pet_name: string;
  service_name: string;
  owner_name: string;
}

export default function ClinicDashboard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchData();
  }, [isAuthenticated, navigate]);

  const fetchData = async () => {
    try {
      const [analyticsRes, appointmentsRes] = await Promise.all([
        fetch("/api/analytics/dashboard"),
        fetch("/api/clinic/appointments"),
      ]);

      setAnalytics(await analyticsRes.json());
      setAppointments(await appointmentsRes.json());
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-600 text-lg">Carregando...</span>
      </div>
    );
  }

  const upcomingAppointments = appointments
    .filter(
      (a) =>
        new Date(a.scheduled_at) > new Date() &&
        ["pending", "confirmed"].includes(a.status)
    )
    .sort(
      (a, b) =>
        new Date(a.scheduled_at).getTime() -
        new Date(b.scheduled_at).getTime()
    )
    .slice(0, 5);

  const chartData =
    analytics?.appointmentsByDay.map((item) => ({
      date: format(new Date(item.date), "dd/MM"),
      agendamentos: item.count,
    })) || [];

  const serviceData =
    analytics?.appointmentsByService.map((item) => ({
      name:
        item.service_type === "consultation"
          ? "Consultas"
          : item.service_type === "grooming"
          ? "Tosa"
          : "Banho",
      value: item.count,
    })) || [];

  const COLORS = ["#3B82F6", "#8B5CF6", "#EC4899"];

  return (
    <Layout userType="clinic">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Dashboard da Clínica</h1>
        <p className="text-gray-600 mb-8">Visão geral do seu negócio</p>

        {/* Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Stat title="Agendamentos" value={analytics?.totalAppointments} icon={<Calendar />} />
          <Stat title="Concluídos" value={analytics?.completedAppointments} icon={<TrendingUp />} />
          <Stat title="Receita" value={`R$ ${analytics?.revenue?.toFixed(0)}`} icon={<DollarSign />} />
          <Stat title="Avaliação" value={analytics?.avgRating?.toFixed(1)} icon={<Star />} />
          <Stat title="No-Show" value={analytics?.noShows} icon={<AlertCircle />} />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Agendamentos (30 dias)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="agendamentos" stroke="#3B82F6" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Serviços">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={serviceData} dataKey="value" outerRadius={100}>
                  {serviceData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Próximos agendamentos */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-bold mb-4">Próximos Agendamentos</h2>

          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-500">Nenhum agendamento próximo</p>
          ) : (
            <table className="w-full">
              <tbody>
                {upcomingAppointments.map((a) => (
                  <tr key={a.id} className="border-b">
                    <td>{format(new Date(a.scheduled_at), "dd/MM HH:mm")}</td>
                    <td>{a.pet_name}</td>
                    <td>{a.owner_name}</td>
                    <td>{a.service_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}

/* Helpers */
function Stat({ title, value, icon }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">{title}</span>
        {icon}
      </div>
      <p className="text-3xl font-bold">{value ?? 0}</p>
    </div>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h2 className="font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}
