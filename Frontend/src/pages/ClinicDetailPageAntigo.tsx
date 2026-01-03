import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import {
  Building2,
  MapPin,
  Star,
  Phone,
  Mail,
  Clock,
  ArrowLeft,
  X,
} from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string;
  service_type: string;
  duration_minutes: number;
  price_brl: number;
}

interface Staff {
  id: number;
  name: string;
  role: string;
  specialization: string;
}

interface Clinic {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  services: Service[];
  staff: Staff[];
}

interface Pet {
  id: number;
  name: string;
  species: string;
}

export default function ClinicDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingData, setBookingData] = useState({
    pet_id: "",
    scheduled_at: "",
    notes: "",
  });

  useEffect(() => {
    if (!isAuthenticated && !user) {
      navigate("/login");
      return;
    }

    if (user?.role !== 0) {
      navigate("/clinic");
      return;
    }

    fetchData();
  }, [id, user, isAuthenticated, navigate]);

  const fetchData = async () => {
    try {
      const [clinicRes, petsRes] = await Promise.all([
        fetch(`/api/clinics/${id}`),
        fetch("/api/pets"),
      ]);

      const clinicData = await clinicRes.json();
      const petsData = await petsRes.json();

      setClinic(clinicData);
      setPets(petsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingData,
          clinic_id: clinic?.id,
          service_id: selectedService.id,
        }),
      });

      if (response.ok) {
        setShowBookingModal(false);
        setSelectedService(null);
        setBookingData({
          pet_id: "",
          scheduled_at: "",
          notes: "",
        });
        navigate("/appointments");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  const openBookingModal = (service: Service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  if (isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <Layout userType="owner">
        <div className="text-center py-12">
          <p className="text-gray-600">Clínica não encontrada</p>
        </div>
      </Layout>
    );
  }

  const getServiceTypeLabel = (type: string) => {
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
  };

  return (
    <Layout userType="owner">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/clinics")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para clínicas
        </button>

        {/* Clinic Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {clinic.name}
              </h1>
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                <Star className="w-5 h-5 fill-yellow-500" />
                <Star className="w-5 h-5 fill-yellow-500" />
                <Star className="w-5 h-5 fill-yellow-500" />
                <Star className="w-5 h-5 fill-yellow-500" />
                <Star className="w-5 h-5 fill-yellow-500" />
                <span className="text-sm text-gray-600 ml-2">(5.0)</span>
              </div>
              {clinic.description && (
                <p className="text-gray-600 mb-4">{clinic.description}</p>
              )}
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                {clinic.address && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>
                      {clinic.address}, {clinic.city} - {clinic.state}
                    </span>
                  </div>
                )}
                {clinic.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-5 h-5 flex-shrink-0" />
                    <span>{clinic.phone}</span>
                  </div>
                )}
                {clinic.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-5 h-5 flex-shrink-0" />
                    <span>{clinic.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Services */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Serviços Disponíveis
              </h2>

              {clinic.services.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Nenhum serviço disponível
                </p>
              ) : (
                <div className="space-y-4">
                  {clinic.services.map((service) => (
                    <div
                      key={service.id}
                      className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {service.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {getServiceTypeLabel(service.service_type)}
                          </p>
                        </div>
                        {service.price_brl && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              R$ {service.price_brl.toFixed(2)}
                            </div>
                          </div>
                        )}
                      </div>

                      {service.description && (
                        <p className="text-sm text-gray-600 mb-3">
                          {service.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration_minutes} minutos</span>
                        </div>
                        <button
                          onClick={() => openBookingModal(service)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                        >
                          Agendar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Staff */}
          <div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Nossa Equipe
              </h2>

              {clinic.staff.length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-sm">
                  Informações da equipe não disponíveis
                </p>
              ) : (
                <div className="space-y-4">
                  {clinic.staff.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-600">{member.role}</p>
                      {member.specialization && (
                        <p className="text-sm text-blue-600 mt-1">
                          {member.specialization}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && selectedService && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Agendar {selectedService.name}
                </h2>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedService(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione o Pet *
                  </label>
                  <select
                    required
                    value={bookingData.pet_id}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, pet_id: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Escolha um pet</option>
                    {pets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name} ({pet.species === "dog" ? "Cachorro" : "Gato"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data e Hora *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={bookingData.scheduled_at}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        scheduled_at: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={bookingData.notes}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Alguma observação especial?"
                  />
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Serviço:</span>
                    <span className="font-medium text-gray-800">
                      {selectedService.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Duração:</span>
                    <span className="font-medium text-gray-800">
                      {selectedService.duration_minutes} min
                    </span>
                  </div>
                  {selectedService.price_brl && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Valor:</span>
                      <span className="font-bold text-blue-600">
                        R$ {selectedService.price_brl.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingModal(false);
                      setSelectedService(null);
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                  >
                    Confirmar Agendamento
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
