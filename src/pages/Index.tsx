import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/pages/Dashboard";
import { StudentsPage } from "@/pages/StudentsPage";
import { GradesPage } from "@/pages/GradesPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { useStudents } from "@/hooks/useStudents";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const { students } = useStudents();

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard students={students} />;
      case "students":
        return <StudentsPage />;
      case "grades":
        return <GradesPage />;
      case "reports":
        return <ReportsPage />;
      default:
        return <Dashboard students={students} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-subtle">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 max-w-7xl">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default Index;
