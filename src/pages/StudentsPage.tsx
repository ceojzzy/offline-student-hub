import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StudentForm } from "@/components/forms/StudentForm";
import { ClassGroup } from "@/components/students/ClassGroup";
import { useStudents } from "@/contexts/StudentsContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const StudentsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const { 
    students, 
    addStudent, 
    updateGrade, 
    deleteStudent,
    clearAllStudents,
    getStudentsByClass,
    searchStudents 
  } = useStudents();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddStudent = (studentData: any) => {
    try {
      addStudent(studentData);
      setShowForm(false);
      toast({
        title: "Sucesso!",
        description: "Aluno cadastrado com sucesso.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar aluno.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleDeleteStudent = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      try {
        deleteStudent(id);
        toast({
          title: "Aluno removido",
          description: "Aluno removido com sucesso.",
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao remover aluno.",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };

  const handleUpdateGrade = (studentId: number, gradeData: any) => {
    try {
      updateGrade(studentId, gradeData);
      toast({
        title: "Nota salva",
        description: "Nota atualizada com sucesso.",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar nota.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Filtrar estudantes se houver busca global
  const filteredStudents = globalSearch 
    ? searchStudents(globalSearch)
    : students;

  // Agrupar por classe
  const studentsByClass = globalSearch 
    ? { "Resultados da Busca": filteredStudents }
    : (() => {
        const groups: { [key: string]: any[] } = {};
        Object.entries(getStudentsByClass()).forEach(([className, students]) => {
          groups[className] = students;
        });
        return groups;
      })();

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Gestão de Alunos</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Cadastre e gerencie alunos do sistema escolar
          </p>
        </div>
        
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          {students.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="flex-1 sm:flex-none">
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Limpar Todos</span>
                  <span className="sm:hidden">Limpar</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Todos os {students.length} alunos cadastrados 
                    e suas notas serão permanentemente removidos do sistema.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={clearAllStudents}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Sim, limpar todos os alunos
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          <Button 
            onClick={() => navigate("/add-student")}
            className="bg-primary hover:bg-primary-glow flex-1 sm:flex-none"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Novo Aluno</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </div>
      </div>

      {/* Busca Global */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar alunos..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Formulário de Cadastro */}
      <StudentForm
        isOpen={showForm}
        onSubmit={handleAddStudent}
        onCancel={() => setShowForm(false)}
      />

      {/* Lista de Turmas */}
      <div className="space-y-6">
        {Object.keys(studentsByClass).length === 0 ? (
          <div className="text-center py-12">
            <UserPlus className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum aluno cadastrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Comece cadastrando o primeiro aluno do sistema
            </p>
            <Button 
              onClick={() => navigate("/add-student")}
              className="bg-primary hover:bg-primary-glow"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Cadastrar Primeiro Aluno
            </Button>
          </div>
        ) : (
          Object.entries(studentsByClass).map(([className, classStudents]) => (
            <ClassGroup
              key={className}
              className={className}
              students={classStudents}
              onUpdateGrade={handleUpdateGrade}
              onDeleteStudent={handleDeleteStudent}
            />
          ))
        )}
      </div>
    </div>
  );
};