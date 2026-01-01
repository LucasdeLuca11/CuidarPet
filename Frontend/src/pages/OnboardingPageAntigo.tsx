import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Heart, Building2 } from "lucide-react";

export default function OnboardingPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [userType, setUserType] = useState<"Tutor" | "Veterinarian" | null>(null);
  const [formData, setFormData] = useState({
    full_name: user?.name || "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  if (!userType) return

  setIsSubmitting(true)

  try {
    const response = await fetch('http://localhost:5014/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        fullName: formData.full_name,
        phone: formData.phone,
        role: userType,
      }),
    })

    if (!response.ok) {
      throw new Error('Erro ao criar perfil')
    }

    const data = await response.json()

    // backend retorna um NOVO JWT + usuário
    login(data.token, data.user)

    navigate(userType === 'Tutor' ? '/owner' : '/clinic')
  } catch (error) {
    console.error('Erro no onboarding:', error)
    alert('Erro ao criar perfil')
  } finally {
    setIsSubmitting(false)
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Bem-vindo ao CuidarPet 🐾
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setUserType("Tutor")}
              className={`p-6 rounded-2xl border-2 ${
                userType === "Tutor"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <Heart className="w-10 h-10 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold">Dono de Pet</h3>
            </button>

            <button
              type="button"
              onClick={() => setUserType("Veterinarian")}
              className={`p-6 rounded-2xl border-2 ${
                userType === "Veterinarian"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200"
              }`}
            >
              <Building2 className="w-10 h-10 mx-auto mb-2 text-purple-500" />
              <h3 className="font-semibold">Clínica / Veterinário</h3>
            </button>
          </div>

          {userType && (
            <>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-xl"
                placeholder="Nome completo"
              />

              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-xl"
                placeholder="Telefone"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
              >
                {isSubmitting ? "Salvando..." : "Continuar"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
