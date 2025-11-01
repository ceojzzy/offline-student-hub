import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStudents } from "@/contexts/StudentsContext";
import { DisciplinaNotas } from "@/types/student";
import { FileText, Search } from "lucide-react";

export const GradesPage = () => {
  const { students } = useStudents();
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const calculateMT = (notas: DisciplinaNotas[], trimestre: 'trimestre1' | 'trimestre2' | 'trimestre3') => {
    const values = notas.map(disciplina => {
      const trimestreNotas = disciplina[trimestre];
      const mac = parseFloat(trimestreNotas.mac) || 0;
      const npp = parseFloat(trimestreNotas.npp) || 0;
      const npt = parseFloat(trimestreNotas.npt) || 0;
      
      if (!trimestreNotas.mac && !trimestreNotas.npp && !trimestreNotas.npt) return null;
      
      return (mac + npp + npt) / 3;
    }).filter(mt => mt !== null) as number[];
    
    if (values.length === 0) return 0;
    
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  };

  const filteredStudents = students.filter(student => {
    const matchesClass = selectedClass === "all" || student.classe === selectedClass;
    const matchesSearch = student.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.numero.includes(searchQuery);
    return matchesClass && matchesSearch;
  });

  const uniqueClasses = [...new Set(students.map(s => s.classe))].sort();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Notas e Avaliações</h1>
        <p className="text-muted-foreground">
          Mini-Pauta de Avaliação - Acompanhe o desempenho dos alunos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Classe</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as classes</SelectItem>
                  {uniqueClasses.map(classe => (
                    <SelectItem key={classe} value={classe}>{classe}</SelectItem>
                  ))}
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

      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos e Médias</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum aluno encontrado
              </h3>
              <p className="text-muted-foreground">
                Ajuste os filtros ou cadastre novos alunos
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Nº</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-center">Classe/Turma</TableHead>
                    <TableHead className="text-center">MT1</TableHead>
                    <TableHead className="text-center">MT2</TableHead>
                    <TableHead className="text-center">MT3</TableHead>
                    <TableHead className="text-center">MFD</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map(student => {
                    const mt1 = calculateMT(student.notas, 'trimestre1');
                    const mt2 = calculateMT(student.notas, 'trimestre2');
                    const mt3 = calculateMT(student.notas, 'trimestre3');
                    
                    const mfd = mt1 === 0 && mt2 === 0 && mt3 === 0 
                      ? 0 
                      : (mt1 + mt2 + mt3) / 3;
                    
                    const getStatus = (avg: number) => 
                      avg >= 14 ? 'default' : avg >= 10 ? 'secondary' : 'destructive';

                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.numero}</TableCell>
                        <TableCell className="font-medium">{student.nome}</TableCell>
                        <TableCell className="text-center">
                          {student.classe} / {student.turma}
                        </TableCell>
                        {[mt1, mt2, mt3].map((mt, idx) => (
                          <TableCell key={idx} className="text-center">
                            <Badge variant={getStatus(mt)}>
                              {mt.toFixed(1)}
                            </Badge>
                          </TableCell>
                        ))}
                        <TableCell className="text-center">
                            <Badge variant={getStatus(mfd)} className="font-bold">
                              {mfd.toFixed(1)}
                            </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
