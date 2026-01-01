import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { PawPrint, Plus, Edit2, Trash2, X } from "lucide-react";
import { format } from "date-fns";

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  birth_date: string;
  weight_kg: number;
  photo_url: string;
  notes: string;
  created_at: string;
}

export default function PetsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    species: "dog",
    breed: "",
    birth_date: "",
    weight_kg: "",
    notes: "",
  });

  useEffect(() => {
    if (!isAuthenticated && !user) {
      navigate("/login");
      return;
    }

    if (user?.role !== "Tutor") {
      navigate("/clinic");
      return;
    }

    fetchPets();
  }, [user, isAuthenticated, navigate]);

  const fetchPets = async () => {
    try {
      const response = await fetch("/api/pets");
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingPet ? `/api/pets/${editingPet.id}` : "/api/pets";
      const method = editingPet ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        }),
      });

      if (response.ok) {
        await fetchPets();
        setShowModal(false);
        setEditingPet(null);
        setFormData({
          name: "",
          species: "dog",
          breed: "",
          birth_date: "",
          weight_kg: "",
          notes: "",
        });
      }
    } catch (error) {
      console.error("Error saving pet:", error);
    }
  };

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed || "",
      birth_date: pet.birth_date || "",
      weight_kg: pet.weight_kg?.toString() || "",
      notes: pet.notes || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (petId: number) => {
    if (!confirm("Tem certeza que deseja excluir este pet?")) return;

    try {
      await fetch(`/api/pets/${petId}`, { method: "DELETE" });
      await fetchPets();
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  if (isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <Layout userType="owner">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Meus Pets</h1>
            <p className="text-gray-600">Gerencie o perfil dos seus pets</p>
          </div>
          <button
            onClick={() => {
              setEditingPet(null);
              setFormData({
                name: "",
                species: "dog",
                breed: "",
                birth_date: "",
                weight_kg: "",
                notes: "",
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Adicionar Pet
          </button>
        </div>

        {pets.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 border border-white/20 shadow-lg text-center">
            <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum pet cadastrado
            </h3>
            <p className="text-gray-500 mb-6">
              Adicione seus pets para começar a usar o CuidarPet
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
            >
              Adicionar Primeiro Pet
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <PawPrint className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {pet.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {pet.species === "dog" ? "Cachorro" : "Gato"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(pet)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(pet.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {pet.breed && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Raça:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {pet.breed}
                      </span>
                    </div>
                  )}
                  {pet.birth_date && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Nascimento:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {format(new Date(pet.birth_date), "dd/MM/yyyy")}
                      </span>
                    </div>
                  )}
                  {pet.weight_kg && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Peso:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {pet.weight_kg} kg
                      </span>
                    </div>
                  )}
                  {pet.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{pet.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingPet ? "Editar Pet" : "Adicionar Pet"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingPet(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Espécie *
                  </label>
                  <select
                    required
                    value={formData.species}
                    onChange={(e) =>
                      setFormData({ ...formData, species: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="dog">Cachorro</option>
                    <option value="cat">Gato</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raça
                  </label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) =>
                      setFormData({ ...formData, breed: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) =>
                      setFormData({ ...formData, birth_date: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight_kg}
                    onChange={(e) =>
                      setFormData({ ...formData, weight_kg: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingPet(null);
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                  >
                    {editingPet ? "Salvar" : "Adicionar"}
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
