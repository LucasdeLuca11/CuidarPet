/**
 * Página de Termos de Serviço
 * 
 * Responsável por:
 * - Exibir termos e condições
 * - Informações legais
 * - Direitos e responsabilidades
 */

import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <h1 className="text-4xl font-bold">Termos de Serviço</h1>
          <p className="text-white/80 mt-2">Última atualização: Janeiro de 2025</p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          {/* 1. Aceitação dos Termos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-700 leading-relaxed">
              Ao acessar e usar a plataforma CuidarPet, você concorda em cumprir estes Termos de Serviço
              e todas as leis, regras e regulamentos aplicáveis. Se você não concordar com alguma parte
              destes termos, você não poderá usar este serviço.
            </p>
          </section>

          {/* 2. Descrição do Serviço */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descrição do Serviço</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              CuidarPet é uma plataforma digital que conecta tutores de animais de estimação com
              prestadores de serviços veterinários. A plataforma permite:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Cadastro e gerenciamento de perfis de usuários</li>
              <li>Busca e visualização de clínicas veterinárias e pet shops</li>
              <li>Agendamento de serviços veterinários</li>
              <li>Avaliação e comentários sobre serviços</li>
              <li>Gerenciamento de histórico de animais de estimação</li>
            </ul>
          </section>

          {/* 3. Responsabilidades do Usuário */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Responsabilidades do Usuário</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Você concorda em:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Fornecer informações precisas e completas durante o registro</li>
              <li>Manter a confidencialidade de sua senha e informações de conta</li>
              <li>Não usar a plataforma para fins ilegais ou prejudiciais</li>
              <li>Respeitar os direitos e privacidade de outros usuários</li>
              <li>Não fazer spam, phishing ou atividades maliciosas</li>
              <li>Cumprir todas as leis e regulamentos aplicáveis</li>
            </ul>
          </section>

          {/* 4. Limitação de Responsabilidade */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitação de Responsabilidade</h2>
            <p className="text-gray-700 leading-relaxed">
              CuidarPet não é responsável por:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
              <li>Qualidade dos serviços prestados por terceiros</li>
              <li>Danos causados por prestadores de serviços</li>
              <li>Perda de dados ou informações</li>
              <li>Interrupções ou indisponibilidade da plataforma</li>
              <li>Danos indiretos ou consequentes</li>
            </ul>
          </section>

          {/* 5. Propriedade Intelectual */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Propriedade Intelectual</h2>
            <p className="text-gray-700 leading-relaxed">
              Todo conteúdo da plataforma CuidarPet, incluindo textos, gráficos, logos, imagens e
              software, é propriedade de CuidarPet ou seus fornecedores de conteúdo e está protegido
              por leis de direitos autorais internacionais. Você não pode reproduzir, distribuir ou
              transmitir qualquer conteúdo sem permissão prévia por escrito.
            </p>
          </section>

          {/* 6. Política de Cancelamento */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Política de Cancelamento</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Você pode cancelar sua conta a qualquer momento. Após o cancelamento:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Seus dados serão retidos conforme exigido por lei</li>
              <li>Agendamentos futuros serão cancelados</li>
              <li>Você não poderá acessar a plataforma</li>
              <li>Reembolsos serão processados conforme política de reembolso</li>
            </ul>
          </section>

          {/* 7. Modificações dos Termos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modificações dos Termos</h2>
            <p className="text-gray-700 leading-relaxed">
              CuidarPet se reserva o direito de modificar estes Termos de Serviço a qualquer momento.
              As modificações entrarão em vigor imediatamente após a publicação. Seu uso contínuo da
              plataforma após as modificações constitui sua aceitação dos novos termos.
            </p>
          </section>

          {/* 8. Lei Aplicável */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Lei Aplicável</h2>
            <p className="text-gray-700 leading-relaxed">
              Estes Termos de Serviço são regidos pelas leis da República Federativa do Brasil,
              especificamente pela legislação do Estado de São Paulo, sem considerar seus conflitos
              de disposições legais.
            </p>
          </section>

          {/* 9. Resolução de Disputas */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Resolução de Disputas</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Qualquer disputa relacionada a estes Termos de Serviço será resolvida através de:
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
              <li>Negociação amigável entre as partes</li>
              <li>Mediação, se a negociação falhar</li>
              <li>Arbitragem, se a mediação falhar</li>
              <li>Ação judicial, como último recurso</li>
            </ol>
          </section>

          {/* 10. Contato */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contato</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Para questões sobre estes Termos de Serviço, entre em contato:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-gray-700">
                <strong>Email:</strong>{' '}
                <a href="mailto:legal@cuidarpet.com" className="text-primary-600 hover:text-primary-700">
                  legal@cuidarpet.com
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Endereço:</strong> Rua das Flores, 123, São Paulo - SP, Brasil
              </p>
              <p className="text-gray-700">
                <strong>Telefone:</strong> (11) 3333-4444
              </p>
            </div>
          </section>

          {/* Aviso */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-700">
              <strong>Aviso:</strong> Estes Termos de Serviço são um documento legal importante.
              Recomendamos que você os leia cuidadosamente. Se tiver dúvidas, consulte um advogado.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Home
          </Link>
        </div>
      </div>
    </div>
  )
}
