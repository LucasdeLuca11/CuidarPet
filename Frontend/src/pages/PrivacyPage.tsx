/**
 * Página de Política de Privacidade
 * 
 * Responsável por:
 * - Explicar coleta de dados
 * - Direitos de privacidade
 * - Proteção de informações
 */

import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function PrivacyPage() {
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
          <h1 className="text-4xl font-bold">Política de Privacidade</h1>
          <p className="text-white/80 mt-2">Última atualização: Janeiro de 2025</p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          {/* Introdução */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introdução</h2>
            <p className="text-gray-700 leading-relaxed">
              A CuidarPet ("nós", "nosso" ou "nos") opera a plataforma CuidarPet (o "Serviço").
              Esta página informa você sobre nossas políticas sobre a coleta, uso e divulgação de
              dados pessoais quando você usa nosso Serviço e as opções que você tem associadas a
              esses dados. Leia esta Política de Privacidade cuidadosamente. Se você não concordar
              com nossas políticas e práticas, não use nosso Serviço.
            </p>
          </section>

          {/* 1. Informações que Coletamos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Informações que Coletamos</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Coletamos vários tipos de informações em conexão com os serviços que oferecemos:
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">1.1 Informações Fornecidas por Você</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>Nome, email, telefone e endereço</li>
              <li>Informações sobre seus animais de estimação (nome, espécie, raça, peso, etc.)</li>
              <li>Histórico médico dos seus pets</li>
              <li>Dados de pagamento (processados com segurança)</li>
              <li>Avaliações e comentários sobre serviços</li>
              <li>Fotos e documentos (com sua permissão)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">1.2 Informações Coletadas Automaticamente</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Dados de log (IP, tipo de navegador, páginas visitadas)</li>
              <li>Cookies e tecnologias similares</li>
              <li>Localização geográfica (com sua permissão)</li>
              <li>Dados de uso e comportamento na plataforma</li>
              <li>Informações do dispositivo (tipo, sistema operacional)</li>
            </ul>
          </section>

          {/* 2. Como Usamos Suas Informações */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Como Usamos Suas Informações</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Usamos as informações coletadas para:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Fornecer, manter e melhorar nossos serviços</li>
              <li>Processar transações e enviar notificações relacionadas</li>
              <li>Enviar comunicações de marketing (com sua permissão)</li>
              <li>Responder a suas perguntas e solicitações</li>
              <li>Analisar uso e tendências para melhorar a experiência</li>
              <li>Detectar e prevenir fraudes e atividades ilegais</li>
              <li>Cumprir obrigações legais</li>
              <li>Personalizar sua experiência na plataforma</li>
            </ul>
          </section>

          {/* 3. Compartilhamento de Informações */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Compartilhamento de Informações</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Podemos compartilhar suas informações com:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                <strong>Prestadores de Serviços:</strong> Clínicas veterinárias e pet shops para
                processar seus agendamentos
              </li>
              <li>
                <strong>Parceiros de Pagamento:</strong> Processadores de pagamento para transações
                seguras
              </li>
              <li>
                <strong>Fornecedores de Serviços:</strong> Empresas que nos ajudam a operar a
                plataforma
              </li>
              <li>
                <strong>Autoridades Legais:</strong> Quando exigido por lei ou para proteger direitos
              </li>
              <li>
                <strong>Outros Usuários:</strong> Informações públicas do seu perfil (com sua
                permissão)
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Nunca vendemos suas informações pessoais a terceiros para fins de marketing.
            </p>
          </section>

          {/* 4. Segurança de Dados */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Segurança de Dados</h2>
            <p className="text-gray-700 leading-relaxed">
              Implementamos medidas de segurança técnicas, administrativas e físicas para proteger
              suas informações pessoais contra acesso não autorizado, alteração, divulgação ou
              destruição. Isso inclui:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
              <li>Criptografia SSL/TLS para transmissão de dados</li>
              <li>Senhas criptografadas com algoritmos seguros</li>
              <li>Firewalls e sistemas de detecção de intrusão</li>
              <li>Acesso restrito a informações pessoais</li>
              <li>Auditorias de segurança regulares</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              No entanto, nenhum método de transmissão pela Internet é 100% seguro. Você usa nosso
              Serviço por sua conta e risco.
            </p>
          </section>

          {/* 5. Retenção de Dados */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Retenção de Dados</h2>
            <p className="text-gray-700 leading-relaxed">
              Retemos suas informações pessoais pelo tempo necessário para fornecer nossos serviços
              e cumprir obrigações legais. Você pode solicitar a exclusão de seus dados a qualquer
              momento, exceto quando exigido por lei manter as informações.
            </p>
          </section>

          {/* 6. Seus Direitos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Seus Direitos</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Você tem o direito de:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Acessar suas informações pessoais</li>
              <li>Corrigir informações imprecisas</li>
              <li>Solicitar a exclusão de suas informações</li>
              <li>Optar por não receber comunicações de marketing</li>
              <li>Revogar seu consentimento a qualquer momento</li>
              <li>Solicitar um relatório de seus dados</li>
              <li>Transferir seus dados para outro serviço</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Para exercer esses direitos, entre em contato conosco usando as informações de contato
              fornecidas abaixo.
            </p>
          </section>

          {/* 7. Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies e Tecnologias Similares</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Usamos cookies para:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Manter você conectado à sua conta</li>
              <li>Lembrar suas preferências</li>
              <li>Analisar como você usa nosso Serviço</li>
              <li>Melhorar a experiência do usuário</li>
              <li>Fins de publicidade direcionada</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Você pode controlar cookies através das configurações do seu navegador. No entanto,
              desabilitar cookies pode afetar a funcionalidade do nosso Serviço.
            </p>
          </section>

          {/* 8. Contato */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contato</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Se você tiver perguntas sobre esta Política de Privacidade, entre em contato:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-gray-700">
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@cuidarpet.com" className="text-primary-600 hover:text-primary-700">
                  privacy@cuidarpet.com
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
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-sm text-blue-700">
              <strong>Aviso:</strong> Esta Política de Privacidade pode ser atualizada periodicamente.
              Recomendamos que você a revise regularmente para estar ciente de como protegemos suas
              informações.
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
