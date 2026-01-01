# CuidarPet - Frontend React

Frontend da aplicação CuidarPet, um marketplace de serviços veterinários que conecta tutores de pets com clínicas e veterinários.

## 🎯 Funcionalidades

### Para Tutores
- ✅ Cadastro e gerenciamento de pets
- ✅ Busca e visualização de clínicas
- ✅ Agendamento de serviços
- ✅ Histórico de agendamentos
- ✅ Avaliação de serviços

### Para Veterinários
- ✅ Cadastro e gerenciamento de clínica
- ✅ Criação e gerenciamento de serviços
- ✅ Visualização de agendamentos
- ✅ Atualização de status de agendamentos
- ✅ Análise de avaliações

## 🛠️ Stack Tecnológico

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **React Router v6** - Roteamento
- **Axios** - HTTP Client
- **Tailwind CSS** - Styling
- **React Hook Form** - Gerenciamento de Formulários
- **Zod** - Validação de Schemas
- **Lucide React** - Ícones
- **React Hot Toast** - Notificações

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.tsx      # Layout principal
│   ├── PrivateRoute.tsx # Proteção de rotas
│   └── Toast.tsx       # Sistema de notificações
├── contexts/           # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
├── hooks/              # Hooks customizados
│   └── useApi.ts       # Hook para requisições
├── pages/              # Páginas da aplicação
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   └── ForbiddenPage.tsx
├── services/           # Serviços de API
│   ├── api.ts          # Configuração Axios
│   ├── authService.ts
│   ├── petService.ts
│   ├── clinicService.ts
│   ├── serviceService.ts
│   └── appointmentService.ts
├── types/              # Tipos TypeScript
│   └── index.ts
├── utils/              # Utilitários
├── App.tsx             # Componente principal
├── main.tsx            # Entry point
└── index.css           # Estilos globais
```

## 🚀 Como Começar

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/LucasdeLuca11/cuidarpet.git
cd cuidarpet/frontend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas configurações:
```env
VITE_API_BASE_URL=http://localhost:5014/api
VITE_ENV=development
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 📝 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_API_BASE_URL` | URL base da API | `http://localhost:5014/api` |
| `VITE_ENV` | Ambiente | `development` ou `production` |

## 🔐 Autenticação

A autenticação é gerenciada via JWT (JSON Web Token):

1. Usuário faz login/registro
2. Backend retorna token JWT
3. Token é salvo no `localStorage`
4. Token é enviado em todas as requisições via header `Authorization: Bearer {token}`
5. Se token expirar, usuário é redirecionado para login

## 🔄 Fluxo de Requisições

```
Componente
    ↓
Hook (useApi/useMutation)
    ↓
Service (petService, clinicService, etc)
    ↓
API (axios instance)
    ↓
Interceptor (adiciona token JWT)
    ↓
Backend
```

## 📚 Exemplos de Uso

### Listar Pets
```typescript
import { useApi } from '@hooks/useApi'
import { petService } from '@services/petService'

function PetsList() {
  const { data: pets, loading, error } = useApi(
    () => petService.listPets(),
    true
  )

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error.message}</div>

  return (
    <ul>
      {pets?.map(pet => (
        <li key={pet.id}>{pet.name}</li>
      ))}
    </ul>
  )
}
```

### Criar Pet
```typescript
import { useMutation } from '@hooks/useApi'
import { petService } from '@services/petService'
import { showToast } from '@components/Toast'

function CreatePetForm() {
  const { mutate, loading } = useMutation(
    (data) => petService.createPet(data)
  )

  const handleSubmit = async (formData) => {
    try {
      await mutate(formData)
      showToast.success('Pet criado com sucesso!')
    } catch (error) {
      showToast.error('Erro ao criar pet')
    }
  }

  return (
    // Formulário aqui
  )
}
```

## 🎨 Temas e Cores

O projeto usa Tailwind CSS com um tema personalizado:

- **Primary**: Azul (Céu) - `#0ea5e9`
- **Secondary**: Roxo - `#a855f7`
- **Accent**: Rosa - `#ec4899`

## 🧪 Testes

```bash
# Executar testes
npm run test

# Testes com cobertura
npm run test:coverage
```

## 📦 Build para Produção

```bash
npm run build
```

Arquivos compilados estarão em `dist/`

## 🐛 Troubleshooting

### CORS Error
Se receber erro de CORS, verifique:
1. Backend está rodando em `http://localhost:5014`
2. CORS está configurado no backend
3. Variável `VITE_API_BASE_URL` está correta

### Token Expirado
Se o token expirar:
1. Você será redirecionado para `/login`
2. Faça login novamente
3. Novo token será gerado

### Componentes não carregam
1. Verifique o console para erros
2. Verifique se a API está respondendo
3. Verifique as variáveis de ambiente

## 📖 Documentação

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para contato@cuidarpet.com ou abra uma issue no GitHub.

## 🙏 Agradecimentos

- Comunidade React
- Tailwind CSS
- Vite
- Todos os contribuidores