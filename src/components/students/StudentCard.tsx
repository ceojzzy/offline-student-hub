import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Student, GradeInput } from "@/types/student";
import { FileText, Trash2, User } from "lucide-react";
import { GradeEditDialog } from "./GradeEditDialog";

interface StudentCardProps {
  student: Student;
  onUpdateGrade: (studentId: number, gradeData: GradeInput) => void;
  onDelete: (id: number) => void;
}

export const StudentCard = ({ student, onUpdateGrade, onDelete }: StudentCardProps) => {
  const [showGradeDialog, setShowGradeDialog] = useState(false);

  const calculateMT = (trimestre: 'trimestre1' | 'trimestre2' | 'trimestre3') => {
    const values = student.notas.map(disciplina => {
      const notas = disciplina[trimestre];
      const mac = parseFloat(notas.mac) || 0;
      const npp = parseFloat(notas.npp) || 0;
      const npt = parseFloat(notas.npt) || 0;
      
      if (!notas.mac && !notas.npp && !notas.npt) return null;
      
      return (mac + npp + npt) / 3;
    }).filter(mt => mt !== null) as number[];
    
    if (values.length === 0) return "";
    
    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / values.length).toFixed(1);
  };

  const getGradeStatus = (average: string) => {
    if (!average) return "neutral";
    const avg = parseFloat(average);
    if (avg >= 14) return "success";
    if (avg >= 10) return "warning";
    return "destructive";
  };

  return (
    <>
      <Card className="border border-border hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-muted rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{student.nome}</h4>
                <p className="text-sm text-muted-foreground">Nº {student.numero}</p>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGradeDialog(true)}
                className="h-8 w-8 p-0"
              >
                <FileText className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(student.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Curso:</span>
              <span className="text-foreground">{student.curso}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Período:</span>
              <span className="text-foreground">{student.periodo}</span>
            </div>
          </div>

          {/* Médias por trimestre */}
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Médias:</span>
              <div className="flex space-x-2">
                {(['trimestre1', 'trimestre2', 'trimestre3'] as const).map((trimestre, index) => {
                  const average = calculateMT(trimestre);
                  const status = getGradeStatus(average);
                  
                  return (
                    <Badge
                      key={trimestre}
                      variant={status === "success" ? "default" : status === "warning" ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      MT{index + 1}: {average || "—"}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <GradeEditDialog
        student={student}
        isOpen={showGradeDialog}
        onClose={() => setShowGradeDialog(false)}
        onUpdateGrade={onUpdateGrade}
      />
    </>
  );
};
