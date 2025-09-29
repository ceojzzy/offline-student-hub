import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, FileText, TrendingUp } from "lucide-react";
import { Student } from "@/types/student";

interface StatsCardsProps {
  students: Student[];
}

export const StatsCards = ({ students }: StatsCardsProps) => {
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

  const studentsWithGrades = students.filter(student => {
    return Object.values(student.notas).some(trimestre =>
      Object.values(trimestre).some(nota => nota && !isNaN(parseFloat(nota)))
    );
  }).length;

  const totalClasses = Object.keys(classesCounts).length;
  const totalTurmas = Object.keys(turmasCounts).length;

  const stats = [
    {
      title: "Total de Alunos",
      value: totalStudents,
      description: "Alunos cadastrados",
      icon: Users,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Classes Ativas",
      value: totalClasses,
      description: "Classes diferentes",
      icon: GraduationCap,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Turmas",
      value: totalTurmas,
      description: "Turmas organizadas",
      icon: FileText,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Com Avaliações",
      value: studentsWithGrades,
      description: "Alunos com notas",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card key={index} className="border border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};