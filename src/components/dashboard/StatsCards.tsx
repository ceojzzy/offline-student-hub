import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, FileText, AlertTriangle } from "lucide-react";
import { Student, DisciplinaNotas } from "@/types/student";
import { useNavigate } from "react-router-dom";

interface StatsCardsProps {
  students: Student[];
}

export const StatsCards = ({ students }: StatsCardsProps) => {
  const navigate = useNavigate();
  const totalStudents = students.length;
  
  const classesCounts = students.reduce((acc, student) => {
    acc[student.classe] = (acc[student.classe] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const turmasCounts = students.reduce((acc, student) => {
    const key = `${student.classe} / Turma ${student.turma}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const studentsWithoutGrades = students.filter(student => {
    return !student.notas.some(disciplina => {
      return ['trimestre1', 'trimestre2', 'trimestre3'].some(trimestre => {
        const notas = disciplina[trimestre as keyof Pick<DisciplinaNotas, 'trimestre1' | 'trimestre2' | 'trimestre3'>];
        return notas.mac || notas.npp || notas.npt;
      });
    });
  }).length;

  const totalClasses = Object.keys(classesCounts).length;
  const totalTurmas = Object.keys(turmasCounts).length;

  const stats = [
    {
      title: "Total de Alunos",
      value: totalStudents,
      description: "Alunos cadastrados",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      onClick: () => navigate('/students')
    },
    {
      title: "Classes Ativas",
      value: totalClasses,
      description: "Classes diferentes",
      icon: GraduationCap,
      color: "from-green-500 to-green-600",
      onClick: () => navigate('/students')
    },
    {
      title: "Turmas",
      value: totalTurmas,
      description: "Turmas organizadas",
      icon: FileText,
      color: "from-purple-500 to-purple-600",
      onClick: () => navigate('/students')
    },
    {
      title: "Sem Avaliações",
      value: studentsWithoutGrades,
      description: "Alunos sem notas",
      icon: AlertTriangle,
      color: "from-red-500 to-red-600",
      onClick: () => navigate('/grades')
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-4 md:mb-6 lg:mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card 
            key={index} 
            className="border border-border hover:shadow-lg transition-all cursor-pointer hover:scale-105"
            onClick={stat.onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 md:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight">
                {stat.title}
              </CardTitle>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};