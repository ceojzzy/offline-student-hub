import { StudentForm } from "@/components/forms/StudentForm";
import { useStudents } from "@/hooks/useStudents";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const AddStudentPage = () => {
  const { addStudent } = useStudents();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddStudent = (studentData: any) => {
    try {
      addStudent(studentData);
      toast({
        title: "Sucesso!",
        description: "Aluno cadastrado com sucesso.",
        duration: 3000,
      });
      // Redirecionar para a página de gestão de alunos
      navigate("/students");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar aluno.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cadastrar Novo Aluno</h1>
          <p className="text-muted-foreground">
            Preencha os dados do aluno para cadastrá-lo no sistema
          </p>
        </div>
      </div>

      <StudentForm
        isOpen={true}
        onSubmit={handleAddStudent}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
};