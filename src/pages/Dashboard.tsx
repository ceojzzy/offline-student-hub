import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Student } from "@/types/student";
import { Calendar, Clock, BookOpen } from "lucide-react";

interface DashboardProps {
  students: Student[];
}

export const Dashboard = ({ students }: DashboardProps) => {
  const recentStudents = students
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  const getClassDistribution = () => {
    const distribution = students.reduce((acc, student) => {
      acc[student.classe] = (acc[student.classe] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    return Object.entries(distribution).map(([classe, count]) => ({
      classe,
      count,
      percentage: students.length > 0 ? (count / students.length * 100).toFixed(1) : "0"
    }));
  };

  const classDistribution = getClassDistribution();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de gestão escolar
        </p>
      </div>

      <StatsCards students={students} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Distribuição por Classes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {classDistribution.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Nenhum aluno cadastrado ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {classDistribution.map((item) => (
                  <div key={item.classe} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="font-medium">{item.classe} Classe</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                      <span className="font-semibold">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alunos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Alunos Recentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Nenhum aluno cadastrado ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-foreground">{student.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.classe} / Turma {student.turma} • Nº {student.numero}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{student.curso}</p>
                      <p className="text-xs text-muted-foreground">{student.periodo}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Informações do Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">Ano Letivo</p>
              <p className="text-lg font-semibold text-foreground">{new Date().getFullYear()}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">Sistema</p>
              <p className="text-lg font-semibold text-foreground">100% Offline</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">Última Atualização</p>
              <p className="text-lg font-semibold text-foreground">{new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};