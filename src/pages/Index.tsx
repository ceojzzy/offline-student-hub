import { useState } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/pages/Dashboard";
import { StudentsPage } from "@/pages/StudentsPage";
import { AddStudentPage } from "@/pages/AddStudentPage";
import { GradesPage } from "@/pages/GradesPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { useStudents } from "@/hooks/useStudents";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const { students } = useStudents();

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard students={students} />;
      case "students":
        return <StudentsPage />;
      case "add-student":
        return <AddStudentPage />;
      case "grades":
        return <GradesPage />;
      case "reports":
        return <ReportsPage />;
      default:
        return <Dashboard students={students} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <AppSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        
        <SidebarInset className="flex-1">
          {/* Mobile header with trigger */}
          <header className="flex h-14 lg:h-16 items-center gap-2 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              <h1 className="font-semibold text-lg md:hidden">
                {menuItems.find(item => item.id === currentPage)?.label || "Dashboard"}
              </h1>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 md:p-6 max-w-7xl">
              {renderPage()}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

const menuItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "students", label: "Gestão de Alunos" },
  { id: "add-student", label: "Cadastrar Aluno" },
  { id: "grades", label: "Notas" },
  { id: "reports", label: "Relatórios" },
];

export default Index;
