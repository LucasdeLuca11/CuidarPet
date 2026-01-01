import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Building2, MapPin, Star, Phone, Mail } from "lucide-react";

interface Clinic {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  logo_url: string;
}

export default function ClinicsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isAuthenticated && !user) {
      navigate("/login");
      return;
    }

    if (user?.role !== "Tutor") {
      navigate("/clinic");
      return;
    }

    fetchClinics();
  }, [user, isAuthenticated, navigate]);

  const fetchClinics = async () => {
    try {
      const response = await fetch("/api/clinics");
      const data = await response.json();
      setClinics(data);
    } catch (error) {
      console.error("Error fetching clinics:", error);
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

  const filteredClinics = clinics.filter(
    (clinic) =>
      clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout userType="owner">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Clínicas Parceiras
          </h1>
          <p className="text-gray-600">
            Encontre a melhor clínica veterinária para o seu pet
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nome ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-xl"
          />
        </div>

        {filteredClinics.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 border border-white/20 shadow-lg text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma clínica encontrada
            </h3>
            <p className="text-gray-500">
              Tente buscar com outros termos
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClinics.map((clinic) => (
              <div
                key={clinic.id}
                onClick={() => navigate(`/clinics/${clinic.id}`)}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 truncate group-hover:text-blue-600 transition-colors">
                      {clinic.name}
                    </h3>
                    <div className="flex items-center gap-1 text-yellow-500 mb-2">
                      <Star className="w-4 h-4 fill-yellow-500" />
                      <Star className="w-4 h-4 fill-yellow-500" />
                      <Star className="w-4 h-4 fill-yellow-500" />
                      <Star className="w-4 h-4 fill-yellow-500" />
                      <Star className="w-4 h-4 fill-yellow-500" />
                      <span className="text-sm text-gray-600 ml-1">(5.0)</span>
                    </div>
                  </div>
                </div>

                {clinic.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {clinic.description}
                  </p>
                )}

                <div className="space-y-2 text-sm">
                  {clinic.address && (
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        {clinic.address}, {clinic.city} - {clinic.state}
                      </span>
                    </div>
                  )}
                  {clinic.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{clinic.phone}</span>
                    </div>
                  )}
                  {clinic.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{clinic.email}</span>
                    </div>
                  )}
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all group-hover:scale-105">
                  Ver Detalhes
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
