import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useStudents } from "@/hooks/useStudents";
import { Student } from "@/types/student";
import { Calculator, FileText, Search, TrendingUp, TrendingDown, Minus } from "lucide-react";

export const GradesPage = () => {
  const { students, updateGrade } = useStudents();
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedTrimester, setSelectedTrimester] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const calculateStudentAverage = (student: Student) => {
    const allGrades: number[] = [];
    
    Object.values(student.notas).forEach(trimestre => {
      Object.values(trimestre).forEach(nota => {
        if (nota && !isNaN(parseFloat(nota))) {
          allGrades.push(parseFloat(nota));
        }
      });
    });

    if (allGrades.length === 0) return null;
    return allGrades.reduce((sum, grade) => sum + grade, 0) / allGrades.length;
  };

  const calculateTrimesterAverage = (student: Student, trimestre: 'trimestre1' | 'trimestre2' | 'trimestre3') => {
    const grades = Object.values(student.notas[trimestre])
      .filter(nota => nota && !isNaN(parseFloat(nota)))
      .map(nota => parseFloat(nota));
    
    if (grades.length === 0) return null;
    return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
  };

  const getGradeStatus = (average: number | null) => {
    if (average === null) return { color: "secondary", icon: Minus, text: "Sem notas" };
    if (average >= 14) return { color: "success", icon: TrendingUp, text: "Excelente" };
    if (average >= 10) return { color: "warning", icon: TrendingUp, text: "Aprovado" };
    return { color: "destructive", icon: TrendingDown, text: "Reprovado" };
  };

  // Filtrar estudantes
  const filteredStudents = students.filter(student => {
    const matchesClass = selectedClass === "all" || student.classe === selectedClass;
    const matchesSearch = student.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.numero.includes(searchQuery);
    return matchesClass && matchesSearch;
  });

  // Obter classes únicas
  const uniqueClasses = [...new Set(students.map(s => s.classe))].sort();

  const trimesterLabels = {
    trimestre1: "1º Trimestre",
    trimestre2: "2º Trimestre", 
    trimestre3: "3º Trimestre"
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Notas e Avaliações</h1>
        <p className="text-muted-foreground">
          Acompanhe o desempenho dos alunos por trimestre
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Classe</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as classes</SelectItem>
                  {uniqueClasses.map(classe => (
                    <SelectItem key={classe} value={classe}>{classe} Classe</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Trimestre</label>
              <Select value={selectedTrimester} onValueChange={setSelectedTrimester}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os trimestres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os trimestres</SelectItem>
                  <SelectItem value="trimestre1">1º Trimestre</SelectItem>
                  <SelectItem value="trimestre2">2º Trimestre</SelectItem>
                  <SelectItem value="trimestre3">3º Trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar Aluno</label>
              <Input
                placeholder="Nome ou número..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alunos com Notas */}
      <div className="space-y-4">
        {filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum aluno encontrado
              </h3>
              <p className="text-muted-foreground">
                Ajuste os filtros ou cadastre novos alunos
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredStudents.map(student => {
            const overallAverage = calculateStudentAverage(student);
            const overallStatus = getGradeStatus(overallAverage);
            const OverallIcon = overallStatus.icon;

            return (
              <Card key={student.id} className="border border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{student.nome}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {student.classe} / Turma {student.turma} • Nº {student.numero}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <OverallIcon className="w-4 h-4" />
                        <Badge variant={overallStatus.color === "success" ? "default" : "secondary"}>
                          Média: {overallAverage ? overallAverage.toFixed(1) : "—"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{overallStatus.text}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(trimesterLabels).map(([trimestre, label]) => {
                      if (selectedTrimester !== "all" && selectedTrimester !== trimestre) {
                        return null;
                      }

                      const trimesterAverage = calculateTrimesterAverage(student, trimestre as any);
                      const trimesterStatus = getGradeStatus(trimesterAverage);
                      const TrimesterIcon = trimesterStatus.icon;
                      const notas = student.notas[trimestre as keyof typeof student.notas];

                      return (
                        <Card key={trimestre} className="border border-muted">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm">{label}</CardTitle>
                              <div className="flex items-center space-x-1">
                                <TrimesterIcon className="w-3 h-3" />
                                <span className="text-xs font-medium">
                                  {trimesterAverage ? trimesterAverage.toFixed(1) : "—"}
                                </span>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pt-0">
                            <div className="space-y-2">
                              {Object.entries(notas).map(([disciplina, nota]) => (
                                <div key={disciplina} className="flex justify-between items-center text-sm">
                                  <span className="text-muted-foreground">{disciplina}:</span>
                                  <span className="font-medium">
                                    {nota || "—"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};