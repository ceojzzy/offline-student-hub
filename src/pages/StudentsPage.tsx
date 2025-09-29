import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StudentForm } from "@/components/forms/StudentForm";
import { ClassGroup } from "@/components/students/ClassGroup";
import { useStudents } from "@/hooks/useStudents";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus } from "lucide-react";

export const StudentsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const { 
    students, 
    addStudent, 
    updateGrade, 
    deleteStudent, 
    getStudentsByClass,
    searchStudents 
  } = useStudents();
  const { toast } = useToast();

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestão de Alunos</h1>
          <p className="text-muted-foreground">
            Cadastre e gerencie alunos do sistema escolar
          </p>
        </div>
        
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-primary hover:bg-primary-glow"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Aluno
        </Button>
      </div>

      {/* Busca Global */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar alunos..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="pl-10"
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
              onClick={() => setShowForm(true)}
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