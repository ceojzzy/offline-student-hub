import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Student, GradeInput } from "@/types/student";
import { StudentCard } from "./StudentCard";
import { ChevronDown, ChevronUp, Search, Users } from "lucide-react";

interface ClassGroupProps {
  className: string;
  students: Student[];
  onUpdateGrade: (studentId: number, gradeData: GradeInput) => void;
  onDeleteStudent: (id: number) => void;
}

export const ClassGroup = ({ className, students, onUpdateGrade, onDeleteStudent }: ClassGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter(student =>
    student.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.numero.includes(searchQuery)
  );

  const getClassStats = () => {
    const totalStudents = students.length;
    const studentsWithGrades = students.filter(student => {
      const hasGrades = Object.values(student.notas).some(trimestre =>
        Object.values(trimestre).some(nota => nota && !isNaN(parseFloat(nota)))
      );
      return hasGrades;
    }).length;

    return { totalStudents, studentsWithGrades };
  };

  const { totalStudents, studentsWithGrades } = getClassStats();

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">{className}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {totalStudents} alunos
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {studentsWithGrades} com notas
                </Badge>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>

        {isExpanded && totalStudents > 0 && (
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar aluno por nome ou número..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}
      </CardHeader>

      {isExpanded && (
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? (
                <div>
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum aluno encontrado para "{searchQuery}"</p>
                </div>
              ) : (
                <div>
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum aluno cadastrado nesta turma</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onUpdateGrade={onUpdateGrade}
                  onDelete={onDeleteStudent}
                />
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};