import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useStudents } from "@/hooks/useStudents";
import { Student } from "@/types/student";
import { FileText, Download, Printer, BarChart3, Users, Calculator } from "lucide-react";

export const ReportsPage = () => {
  const { students, getStudentsByClass } = useStudents();
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedTrimester, setSelectedTrimester] = useState<string>("all");

  // Obter classes únicas
  const uniqueClasses = [...new Set(students.map(s => s.classe))].sort();

  const calculateClassStats = () => {
    const filteredStudents = selectedClass === "all" 
      ? students 
      : students.filter(s => s.classe === selectedClass);

    const total = filteredStudents.length;
    
    let studentsWithGrades = 0;
    let totalGrades = 0;
    let gradeSum = 0;

    filteredStudents.forEach(student => {
      let hasGrades = false;
      
      Object.values(student.notas).forEach(trimestre => {
        Object.values(trimestre).forEach(nota => {
          if (nota && !isNaN(parseFloat(nota))) {
            hasGrades = true;
            totalGrades++;
            gradeSum += parseFloat(nota);
          }
        });
      });

      if (hasGrades) studentsWithGrades++;
    });

    const averageGrade = totalGrades > 0 ? gradeSum / totalGrades : 0;
    
    return {
      total,
      studentsWithGrades,
      averageGrade,
      completionRate: total > 0 ? (studentsWithGrades / total * 100) : 0
    };
  };

  const generateGradeReport = () => {
    const filteredStudents = selectedClass === "all" 
      ? students 
      : students.filter(s => s.classe === selectedClass);

    const reportData = filteredStudents.map(student => {
      const studentAverage = calculateStudentOverallAverage(student);
      
      return {
        nome: student.nome,
        numero: student.numero,
        classe: student.classe,
        turma: student.turma,
        curso: student.curso,
        media: studentAverage,
        status: studentAverage >= 10 ? "Aprovado" : studentAverage > 0 ? "Reprovado" : "Sem notas"
      };
    }).sort((a, b) => b.media - a.media);

    return reportData;
  };

  const calculateStudentOverallAverage = (student: Student) => {
    const allGrades: number[] = [];
    
    Object.values(student.notas).forEach(trimestre => {
      Object.values(trimestre).forEach(nota => {
        if (nota && !isNaN(parseFloat(nota))) {
          allGrades.push(parseFloat(nota));
        }
      });
    });

    if (allGrades.length === 0) return 0;
    return allGrades.reduce((sum, grade) => sum + grade, 0) / allGrades.length;
  };

  const exportToCSV = () => {
    const reportData = generateGradeReport();
    
    const headers = "Nome,Número,Classe,Turma,Curso,Média,Status\n";
    const csvContent = reportData.map(row => 
      `"${row.nome}","${row.numero}","${row.classe}","${row.turma}","${row.curso}","${row.media.toFixed(1)}","${row.status}"`
    ).join("\n");
    
    const csv = headers + csvContent;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `relatorio_notas_${selectedClass}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const printReport = () => {
    const reportData = generateGradeReport();
    const classInfo = selectedClass === "all" ? "Todas as Classes" : `${selectedClass} Classe`;
    
    const printContent = `
      <html>
        <head>
          <title>Relatório de Notas - ${classInfo}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .school-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .report-title { font-size: 18px; margin-bottom: 5px; }
            .report-date { font-size: 14px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .status-aprovado { color: green; font-weight: bold; }
            .status-reprovado { color: red; font-weight: bold; }
            .status-sem-notas { color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="school-name">Escola Nova Geração</div>
            <div class="report-title">Relatório de Notas - ${classInfo}</div>
            <div class="report-date">Gerado em: ${new Date().toLocaleDateString('pt-BR')}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Nº</th>
                <th>Nome</th>
                <th>Classe</th>
                <th>Turma</th>
                <th>Curso</th>
                <th>Média</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.map(student => `
                <tr>
                  <td>${student.numero}</td>
                  <td>${student.nome}</td>
                  <td>${student.classe}</td>
                  <td>${student.turma}</td>
                  <td>${student.curso}</td>
                  <td>${student.media.toFixed(1)}</td>
                  <td class="status-${student.status.toLowerCase().replace(' ', '-')}">${student.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const stats = calculateClassStats();
  const reportData = generateGradeReport();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Relatórios</h1>
        <p className="text-muted-foreground">
          Gere relatórios e estatísticas do desempenho escolar
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Filtros do Relatório</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <label className="text-sm font-medium">Ações</label>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button onClick={exportToCSV} variant="outline" size="sm" className="w-full sm:w-auto">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
                <Button onClick={printReport} variant="outline" size="sm" className="w-full sm:w-auto">
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Alunos</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Com Avaliações</p>
                <p className="text-2xl font-bold">{stats.studentsWithGrades}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Média Geral</p>
                <p className="text-2xl font-bold">{stats.averageGrade.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">% Avaliados</p>
                <p className="text-2xl font-bold">{stats.completionRate.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Relatório */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Relatório Detalhado</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reportData.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum dado para exibir
              </h3>
              <p className="text-muted-foreground">
                Cadastre alunos e adicione notas para gerar relatórios
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-medium text-muted-foreground">Nº</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Nome</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Classe</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Turma</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Curso</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Média</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((student, index) => (
                      <tr key={index} className="border-b border-border hover:bg-muted/30">
                        <td className="p-3">{student.numero}</td>
                        <td className="p-3 font-medium">{student.nome}</td>
                        <td className="p-3">{student.classe}</td>
                        <td className="p-3">{student.turma}</td>
                        <td className="p-3">{student.curso}</td>
                        <td className="p-3 font-mono">{student.media.toFixed(1)}</td>
                        <td className="p-3">
                          <Badge 
                            variant={
                              student.status === "Aprovado" ? "default" : 
                              student.status === "Reprovado" ? "destructive" : 
                              "secondary"
                            }
                          >
                            {student.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {reportData.map((student, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">{student.nome}</h4>
                        <p className="text-sm text-muted-foreground">Nº {student.numero}</p>
                      </div>
                      <Badge 
                        variant={
                          student.status === "Aprovado" ? "default" : 
                          student.status === "Reprovado" ? "destructive" : 
                          "secondary"
                        }
                      >
                        {student.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Classe:</span>
                        <span className="ml-1 font-medium">{student.classe}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Turma:</span>
                        <span className="ml-1 font-medium">{student.turma}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Curso:</span>
                        <span className="ml-1 font-medium">{student.curso}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Média:</span>
                        <span className="ml-1 font-mono font-bold">{student.media.toFixed(1)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};