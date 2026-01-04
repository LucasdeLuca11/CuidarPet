/**
 * Página de Ajuda e Suporte
 * 
 * Responsável por:
 * - FAQs
 * - Contato com suporte
 * - Documentação
 * - Guias de uso
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Mail, MessageSquare, Phone, Search, ArrowLeft } from 'lucide-react'

const faqs = [
  {
    id: 1,
    category: 'Geral',
    question: 'O que é CuidarPet?',
    answer: 'CuidarPet é uma plataforma que conecta tutores de pets com clínicas veterinárias e pet shops, facilitando o agendamento de serviços e o cuidado dos seus animais de estimação.',
  },
  {
    id: 2,
    category: 'Geral',
    question: 'Como funciona o agendamento?',
    answer: 'Você pode buscar clínicas próximas, visualizar os serviços oferecidos, escolher um horário disponível e confirmar o agendamento. A clínica receberá a solicitação e confirmará.',
  },
  {
    id: 3,
    category: 'Conta',
    question: 'Como criar uma conta?',
    answer: 'Clique em "Criar conta" na página de login, escolha seu perfil (Tutor ou Veterinário), preencha seus dados e clique em "Criar Conta". Você também pode usar sua conta Google.',
  },
  {
    id: 4,
    category: 'Conta',
    question: 'Esqueci minha senha. O que faço?',
    answer: 'Clique em "Esqueceu a senha?" na página de login, digite seu email e clique em "Enviar Link de Recuperação". Você receberá um email com instruções para redefinir sua senha.',
  },
  {
    id: 5,
    category: 'Pets',
    question: 'Como adicionar meus pets?',
    answer: 'Após fazer login, vá para "Meus Pets" e clique em "Adicionar Pet". Preencha as informações do seu pet (nome, espécie, raça, peso) e clique em "Salvar".',
  },
  {
    id: 6,
    category: 'Pets',
    question: 'Posso ter mais de um pet?',
    answer: 'Sim! Você pode adicionar quantos pets quiser. Cada pet terá seu próprio perfil e histórico de agendamentos.',
  },
  {
    id: 7,
    category: 'Agendamentos',
    question: 'Como cancelar um agendamento?',
    answer: 'Vá para "Meus Agendamentos", selecione o agendamento que deseja cancelar e clique em "Cancelar". A clínica será notificada automaticamente.',
  },
  {
    id: 8,
    category: 'Agendamentos',
    question: 'Posso remarcar um agendamento?',
    answer: 'Sim! Você pode cancelar o agendamento atual e criar um novo em outro horário. Alternativamente, entre em contato com a clínica para solicitar uma remarcação.',
  },
  {
    id: 9,
    category: 'Clínicas',
    question: 'Como registrar minha clínica?',
    answer: 'Crie uma conta selecionando o perfil "Veterinário/PetShop", preencha os dados da sua clínica e configure seus serviços. Você poderá começar a receber agendamentos imediatamente.',
  },
  {
    id: 10,
    category: 'Clínicas',
    question: 'Como gerenciar meus serviços?',
    answer: 'Vá para "Serviços", clique em "Adicionar Serviço", preencha o nome, descrição, preço e duração. Você pode editar ou deletar serviços a qualquer momento.',
  },
]

const categories = ['Todos', 'Geral', 'Conta', 'Pets', 'Agendamentos', 'Clínicas']

export function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Todos' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Enviar formulário de contato
    console.log('Formulário de contato:', contactForm)
    alert('Obrigado! Entraremos em contato em breve.')
    setContactForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <h1 className="text-4xl font-bold mb-2">Central de Ajuda</h1>
          <p className="text-white/80">
            Encontre respostas para suas dúvidas e entre em contato com nosso suporte
          </p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQs */}
          <div className="lg:col-span-2">
            {/* Busca */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar perguntas frequentes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categorias */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-500'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQs List */}
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-left">
                        <span className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                          {faq.category}
                        </span>
                        <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedId === faq.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {expandedId === faq.id && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg p-8 text-center">
                  <p className="text-gray-600">Nenhuma pergunta encontrada</p>
                </div>
              )}
            </div>
          </div>

          {/* Suporte */}
          <div className="space-y-6">
            {/* Canais de Contato */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Entre em Contato</h2>

              {/* Email */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-900">Email</h3>
                </div>
                <a
                  href="mailto:suporte@cuidarpet.com"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  suporte@cuidarpet.com
                </a>
              </div>

              {/* WhatsApp */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                </div>
                <a
                  href="https://wa.me/5511987654321"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  (11) 98765-4321
                </a>
              </div>

              {/* Telefone */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-900">Telefone</h3>
                </div>
                <a
                  href="tel:+551133334444"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  (11) 3333-4444
                </a>
              </div>
            </div>

            {/* Horário de Atendimento */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Horário de Atendimento</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>
                  <strong>Seg-Sex:</strong> 09:00 - 18:00
                </p>
                <p>
                  <strong>Sábado:</strong> 09:00 - 13:00
                </p>
                <p>
                  <strong>Domingo:</strong> Fechado
                </p>
              </div>
            </div>

            {/* Links Úteis */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Links Úteis</h2>
              <div className="space-y-3">
                <Link
                  to="/terms"
                  className="block text-primary-600 hover:text-primary-700 font-medium"
                >
                  Termos de Serviço
                </Link>
                <Link
                  to="/privacy"
                  className="block text-primary-600 hover:text-primary-700 font-medium"
                >
                  Política de Privacidade
                </Link>
                <a
                  href="#"
                  className="block text-primary-600 hover:text-primary-700 font-medium"
                >
                  Blog
                </a>
                <a
                  href="#"
                  className="block text-primary-600 hover:text-primary-700 font-medium"
                >
                  Comunidade
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
