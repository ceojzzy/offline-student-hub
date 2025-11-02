import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Outlet, useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/": return "Dashboard";
      case "/students": return "Gestão de Alunos";
      case "/add-student": return "Cadastrar Aluno";
      case "/grades": return "Notas";
      case "/reports": return "Relatórios";
      default: return "Dashboard";
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <AppSidebar />
        
        <SidebarInset className="flex-1">
          {/* Mobile header with trigger */}
          <header className="flex h-14 lg:h-16 items-center gap-2 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              <h1 className="font-semibold text-lg md:hidden">
                {getPageTitle()}
              </h1>
            </div>
            <img 
              src="/logo-escolar/logo100.png" 
              alt="Logo Escola Nova Geração" 
              className="h-10 w-10 object-contain select-none pointer-events-none"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-3 sm:p-4 md:p-6 max-w-7xl">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
