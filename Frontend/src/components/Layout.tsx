import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Heart,
  LogOut,
  User,
  Calendar,
  Building2,
  Home,
  PawPrint,
} from "lucide-react";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // const isOwner = user?.role === "Tutor";
  const isClinic = user?.role === 1;

  const ownerNavItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: PawPrint, label: "Meus Pets", path: "/pets" },
    { icon: Calendar, label: "Agendamentos", path: "/appointments" },
    { icon: Building2, label: "Clínicas", path: "/clinics" },
  ];

  const clinicNavItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Calendar, label: "Agendamentos", path: "/clinic-appointments" },
  ];

  const navItems = isClinic ? clinicNavItems : ownerNavItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CuidarPet
              </h1>
              <p className="text-xs text-gray-500">
                {isClinic ? "Painel Clínica" : "Meu Painel"}
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group"
              >
                <item.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 text-red-600 rounded-xl hover:shadow-md transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>

      {/* Conteúdo das rotas */}
      <div className="ml-64 p-8">
        <Outlet />
      </div>
    </div>
  );
}
