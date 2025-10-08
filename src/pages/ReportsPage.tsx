import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useStudents } from "@/contexts/StudentsContext";
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
      
      student.notas.forEach(disciplina => {
        ['trimestre1', 'trimestre2', 'trimestre3'].forEach(trimestre => {
          const trimestreNotas = disciplina[trimestre as keyof typeof disciplina];
          if (typeof trimestreNotas === 'object') {
            ['mac', 'npp', 'npt'].forEach(tipo => {
              const nota = trimestreNotas[tipo as keyof typeof trimestreNotas];
              if (nota && !isNaN(parseFloat(nota))) {
                hasGrades = true;
                totalGrades++;
                gradeSum += parseFloat(nota);
              }
            });
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

  const calculateMT = (trimestre: any) => {
    const mac = parseFloat(trimestre.mac) || 0;
    const npp = parseFloat(trimestre.npp) || 0;
    const npt = parseFloat(trimestre.npt) || 0;
    
    if (mac === 0 && npp === 0 && npt === 0) return 0;
    return (mac + npp + npt) / 3;
  };

  const calculateMFD = (disciplina: any) => {
    const mt1 = calculateMT(disciplina.trimestre1);
    const mt2 = calculateMT(disciplina.trimestre2);
    const mt3 = calculateMT(disciplina.trimestre3);
    
    if (mt1 === 0 && mt2 === 0 && mt3 === 0) return 0;
    
    let sum = 0;
    let count = 0;
    if (mt1 > 0) { sum += mt1; count++; }
    if (mt2 > 0) { sum += mt2; count++; }
    if (mt3 > 0) { sum += mt3; count++; }
    
    return count > 0 ? sum / count : 0;
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
        periodo: student.periodo,
        media: studentAverage,
        notas: student.notas,
        status: studentAverage >= 10 ? "Aprovado" : studentAverage > 0 ? "Reprovado" : "Sem notas"
      };
    }).sort((a, b) => b.media - a.media);

    return reportData;
  };

  const calculateStudentOverallAverage = (student: Student) => {
    const allGrades: number[] = [];
    
    student.notas.forEach(disciplina => {
      ['trimestre1', 'trimestre2', 'trimestre3'].forEach(trimestre => {
        const trimestreNotas = disciplina[trimestre as keyof typeof disciplina];
        if (typeof trimestreNotas === 'object') {
          ['mac', 'npp', 'npt'].forEach(tipo => {
            const nota = trimestreNotas[tipo as keyof typeof trimestreNotas];
            if (nota && !isNaN(parseFloat(nota))) {
              allGrades.push(parseFloat(nota));
            }
          });
        }
      });
    });

    if (allGrades.length === 0) return 0;
    return allGrades.reduce((sum, grade) => sum + grade, 0) / allGrades.length;
  };

  const exportToCSV = () => {
    const reportData = generateGradeReport();
    
    let headers = "Nome,Número,Classe,Turma,Curso,Período";
    
    // Add discipline headers
    const allDisciplines = new Set<string>();
    reportData.forEach(student => {
      student.notas.forEach(disc => allDisciplines.add(disc.disciplina));
    });
    
    allDisciplines.forEach(disc => {
      headers += `,${disc} - 1ºT,${disc} - 2ºT,${disc} - 3ºT,${disc} - MFD`;
    });
    headers += ",Média Geral,Status\n";
    
    const csvContent = reportData.map(student => {
      let row = `"${student.nome}","${student.numero}","${student.classe}","${student.turma}","${student.curso}","${student.periodo}"`;
      
      allDisciplines.forEach(discName => {
        const disc = student.notas.find(d => d.disciplina === discName);
        if (disc) {
          const mt1 = calculateMT(disc.trimestre1);
          const mt2 = calculateMT(disc.trimestre2);
          const mt3 = calculateMT(disc.trimestre3);
          const mfd = calculateMFD(disc);
          row += `,"${mt1.toFixed(1)}","${mt2.toFixed(1)}","${mt3.toFixed(1)}","${mfd.toFixed(1)}"`;
        } else {
          row += `,"","","",""`;
        }
      });
      
      row += `,"${student.media.toFixed(1)}","${student.status}"`;
      return row;
    }).join("\n");
    
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
    
    // Get all unique disciplines
    const allDisciplines = new Set<string>();
    reportData.forEach(student => {
      student.notas.forEach(disc => allDisciplines.add(disc.disciplina));
    });
    const disciplinesList = Array.from(allDisciplines);
    
    const printContent = `
      <html>
        <head>
          <title>Relatório de Notas - ${classInfo}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 10px; }
            .header { text-align: center; margin-bottom: 20px; }
            .school-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
            .report-title { font-size: 14px; margin-bottom: 3px; }
            .report-date { font-size: 10px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #333; padding: 4px 6px; text-align: center; font-size: 9px; }
            th { background-color: #e0e0e0; font-weight: bold; }
            .student-info { text-align: left; }
            .discipline-header { background-color: #f0f0f0; }
            .sub-header { font-size: 8px; background-color: #f5f5f5; }
            @media print {
              @page { size: landscape; margin: 15mm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="school-name">Escola Nova Geração</div>
            <div class="report-title">Mini-Pauta - ${classInfo}</div>
            <div class="report-date">Gerado em: ${new Date().toLocaleDateString('pt-BR')}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th rowspan="2">Nº</th>
                <th rowspan="2" class="student-info">Nome</th>
                <th rowspan="2">Classe</th>
                <th rowspan="2">Turma</th>
                ${disciplinesList.map(disc => `
                  <th colspan="4" class="discipline-header">${disc}</th>
                `).join('')}
                <th rowspan="2">Média Geral</th>
              </tr>
              <tr class="sub-header">
                ${disciplinesList.map(() => `
                  <th>1ºT</th>
                  <th>2ºT</th>
                  <th>3ºT</th>
                  <th>MFD</th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              ${reportData.map(student => `
                <tr>
                  <td>${student.numero}</td>
                  <td class="student-info">${student.nome}</td>
                  <td>${student.classe}</td>
                  <td>${student.turma}</td>
                  ${disciplinesList.map(discName => {
                    const disc = student.notas.find(d => d.disciplina === discName);
                    if (disc) {
                      const mt1 = calculateMT(disc.trimestre1);
                      const mt2 = calculateMT(disc.trimestre2);
                      const mt3 = calculateMT(disc.trimestre3);
                      const mfd = calculateMFD(disc);
                      return `
                        <td>${mt1 > 0 ? mt1.toFixed(1) : '-'}</td>
                        <td>${mt2 > 0 ? mt2.toFixed(1) : '-'}</td>
                        <td>${mt3 > 0 ? mt3.toFixed(1) : '-'}</td>
                        <td><strong>${mfd > 0 ? mfd.toFixed(1) : '-'}</strong></td>
                      `;
                    } else {
                      return '<td>-</td><td>-</td><td>-</td><td>-</td>';
                    }
                  }).join('')}
                  <td><strong>${student.media > 0 ? student.media.toFixed(1) : '-'}</strong></td>
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
              {/* Desktop Table - Consolidated Grade Report */}
              <div className="hidden lg:block overflow-x-auto">
                {(() => {
                  // Get all unique disciplines across all students
                  const allDisciplines = new Set<string>();
                  reportData.forEach(student => {
                    student.notas.forEach(disc => allDisciplines.add(disc.disciplina));
                  });
                  const disciplinesList = Array.from(allDisciplines).sort();

                  return (
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        {/* Main header row */}
                        <tr className="bg-muted/50">
                          <th rowSpan={2} className="p-2 border border-border text-left sticky left-0 bg-muted/50 z-10">Nº</th>
                          <th rowSpan={2} className="p-2 border border-border text-left sticky left-12 bg-muted/50 z-10 min-w-[150px]">Nome</th>
                          <th rowSpan={2} className="p-2 border border-border text-center">Classe</th>
                          <th rowSpan={2} className="p-2 border border-border text-center">Turma</th>
                          {disciplinesList.map(disc => (
                            <th key={disc} colSpan={9} className="p-2 border border-border text-center bg-muted/70 font-bold">
                              {disc}
                            </th>
                          ))}
                          <th rowSpan={2} className="p-2 border border-border text-center font-bold">Média Geral</th>
                        </tr>
                        {/* Sub-header row for trimesters */}
                        <tr className="bg-muted/30 text-[10px]">
                          {disciplinesList.map(disc => (
                            <>
                              <th className="p-1 border border-border text-center">1ºT MAC</th>
                              <th className="p-1 border border-border text-center">1ºT NPP</th>
                              <th className="p-1 border border-border text-center bg-muted/50">1ºT NPT</th>
                              <th className="p-1 border border-border text-center">2ºT MAC</th>
                              <th className="p-1 border border-border text-center">2ºT NPP</th>
                              <th className="p-1 border border-border text-center bg-muted/50">2ºT NPT</th>
                              <th className="p-1 border border-border text-center">3ºT MAC</th>
                              <th className="p-1 border border-border text-center">3ºT NPP</th>
                              <th className="p-1 border border-border text-center bg-muted/50">3ºT NPT</th>
                            </>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.map((student, idx) => (
                          <tr key={idx} className="hover:bg-muted/10">
                            <td className="p-2 border border-border text-center sticky left-0 bg-background">{student.numero}</td>
                            <td className="p-2 border border-border font-medium sticky left-12 bg-background">{student.nome}</td>
                            <td className="p-2 border border-border text-center">{student.classe}</td>
                            <td className="p-2 border border-border text-center">{student.turma}</td>
                            {disciplinesList.map(discName => {
                              const disc = student.notas.find(d => d.disciplina === discName);
                              if (disc) {
                                return (
                                  <>
                                    <td className="p-2 border border-border text-center">{disc.trimestre1.mac || '-'}</td>
                                    <td className="p-2 border border-border text-center">{disc.trimestre1.npp || '-'}</td>
                                    <td className="p-2 border border-border text-center bg-muted/20 font-semibold">{disc.trimestre1.npt || '-'}</td>
                                    <td className="p-2 border border-border text-center">{disc.trimestre2.mac || '-'}</td>
                                    <td className="p-2 border border-border text-center">{disc.trimestre2.npp || '-'}</td>
                                    <td className="p-2 border border-border text-center bg-muted/20 font-semibold">{disc.trimestre2.npt || '-'}</td>
                                    <td className="p-2 border border-border text-center">{disc.trimestre3.mac || '-'}</td>
                                    <td className="p-2 border border-border text-center">{disc.trimestre3.npp || '-'}</td>
                                    <td className="p-2 border border-border text-center bg-muted/20 font-semibold">{disc.trimestre3.npt || '-'}</td>
                                  </>
                                );
                              } else {
                                return (
                                  <>
                                    <td className="p-2 border border-border text-center">-</td>
                                    <td className="p-2 border border-border text-center">-</td>
                                    <td className="p-2 border border-border text-center bg-muted/20">-</td>
                                    <td className="p-2 border border-border text-center">-</td>
                                    <td className="p-2 border border-border text-center">-</td>
                                    <td className="p-2 border border-border text-center bg-muted/20">-</td>
                                    <td className="p-2 border border-border text-center">-</td>
                                    <td className="p-2 border border-border text-center">-</td>
                                    <td className="p-2 border border-border text-center bg-muted/20">-</td>
                                  </>
                                );
                              }
                            })}
                            <td className="p-2 border border-border text-center font-bold text-base">
                              {student.media > 0 ? student.media.toFixed(1) : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {reportData.map((student, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">{student.nome}</h4>
                        <p className="text-sm text-muted-foreground">
                          Nº {student.numero} | {student.classe} Classe
                        </p>
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
                    
                    <div className="mb-3 pb-3 border-b border-border">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Média Geral:</span>
                        <span className="ml-2 text-xl font-bold">{student.media.toFixed(1)}</span>
                      </div>
                    </div>

                    {student.notas.length > 0 ? (
                      <div className="space-y-3">
                        {student.notas.map((disciplina, idx) => {
                          const mt1 = calculateMT(disciplina.trimestre1);
                          const mt2 = calculateMT(disciplina.trimestre2);
                          const mt3 = calculateMT(disciplina.trimestre3);
                          const mfd = calculateMFD(disciplina);
                          
                          return (
                            <div key={idx} className="border border-border rounded-lg p-3">
                              <h5 className="font-semibold mb-2">{disciplina.disciplina}</h5>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                  <p className="font-medium text-muted-foreground mb-1">1º Trim.</p>
                                  <p>MAC: {disciplina.trimestre1.mac || '-'}</p>
                                  <p>NPP: {disciplina.trimestre1.npp || '-'}</p>
                                  <p>NPT: {disciplina.trimestre1.npt || '-'}</p>
                                  {mt1 > 0 && <p className="font-bold text-primary mt-1">MT: {mt1.toFixed(1)}</p>}
                                </div>
                                <div>
                                  <p className="font-medium text-muted-foreground mb-1">2º Trim.</p>
                                  <p>MAC: {disciplina.trimestre2.mac || '-'}</p>
                                  <p>NPP: {disciplina.trimestre2.npp || '-'}</p>
                                  <p>NPT: {disciplina.trimestre2.npt || '-'}</p>
                                  {mt2 > 0 && <p className="font-bold text-primary mt-1">MT: {mt2.toFixed(1)}</p>}
                                </div>
                                <div>
                                  <p className="font-medium text-muted-foreground mb-1">3º Trim.</p>
                                  <p>MAC: {disciplina.trimestre3.mac || '-'}</p>
                                  <p>NPP: {disciplina.trimestre3.npp || '-'}</p>
                                  <p>NPT: {disciplina.trimestre3.npt || '-'}</p>
                                  {mt3 > 0 && <p className="font-bold text-primary mt-1">MT: {mt3.toFixed(1)}</p>}
                                </div>
                              </div>
                              {mfd > 0 && (
                                <div className="mt-2 pt-2 border-t border-border">
                                  <span className="text-sm font-bold">MFD: {mfd.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma disciplina cadastrada
                      </p>
                    )}
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