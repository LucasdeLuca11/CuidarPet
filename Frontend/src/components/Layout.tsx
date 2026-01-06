import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navbar superior */}

      {/* Conteúdo das rotas */}
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  )
}
