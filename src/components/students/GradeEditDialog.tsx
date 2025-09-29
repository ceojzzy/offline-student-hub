import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student, GradeInput } from "@/types/student";
import { Save, Calculator } from "lucide-react";

interface GradeEditDialogProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onUpdateGrade: (studentId: number, gradeData: GradeInput) => void;
}

export const GradeEditDialog = ({ student, isOpen, onClose, onUpdateGrade }: GradeEditDialogProps) => {
  const [editingGrades, setEditingGrades] = useState(student.notas);

  const handleGradeChange = (
    trimestre: 'trimestre1' | 'trimestre2' | 'trimestre3',
    disciplina: 'MAC' | 'PPP' | 'MAT',
    value: string
  ) => {
    setEditingGrades(prev => ({
      ...prev,
      [trimestre]: {
        ...prev[trimestre],
        [disciplina]: value
      }
    }));
  };

  const handleSave = () => {
    // Salvar todas as mudanças
    Object.entries(editingGrades).forEach(([trimestre, notas]) => {
      Object.entries(notas).forEach(([disciplina, nota]) => {
        if (nota !== student.notas[trimestre as keyof typeof student.notas][disciplina as keyof typeof notas]) {
          onUpdateGrade(student.id, {
            trimestre: trimestre as 'trimestre1' | 'trimestre2' | 'trimestre3',
            disciplina: disciplina as 'MAC' | 'PPP' | 'MAT',
            nota: nota
          });
        }
      });
    });
    onClose();
  };

  const calculateAverage = (trimestre: 'trimestre1' | 'trimestre2' | 'trimestre3') => {
    const notas = editingGrades[trimestre];
    const values = [notas.MAC, notas.PPP, notas.MAT]
      .filter(nota => nota && !isNaN(parseFloat(nota)))
      .map(nota => parseFloat(nota));
    
    if (values.length === 0) return "";
    
    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / values.length).toFixed(1);
  };

  const disciplines = [
    { key: 'MAC', label: 'MAC' },
    { key: 'PPP', label: 'PPP' },
    { key: 'MAT', label: 'MAT' }
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] w-[95vw] sm:w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5" />
            <span>Notas de {student.nome}</span>
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Nº {student.numero} • {student.classe} / Turma {student.turma}
          </div>
        </DialogHeader>

        <Tabs defaultValue="trimestre1" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trimestre1">1º Trimestre</TabsTrigger>
            <TabsTrigger value="trimestre2">2º Trimestre</TabsTrigger>
            <TabsTrigger value="trimestre3">3º Trimestre</TabsTrigger>
          </TabsList>

          {(['trimestre1', 'trimestre2', 'trimestre3'] as const).map((trimestre, index) => (
            <TabsContent key={trimestre} value={trimestre} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{index + 1}º Trimestre</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {disciplines.map((discipline) => (
                      <div key={discipline.key} className="space-y-2">
                        <Label htmlFor={`${trimestre}-${discipline.key}`}>
                          {discipline.label}
                        </Label>
                        <Input
                          id={`${trimestre}-${discipline.key}`}
                          type="number"
                          min="0"
                          max="20"
                          step="0.1"
                          value={editingGrades[trimestre][discipline.key]}
                          onChange={(e) => handleGradeChange(trimestre, discipline.key, e.target.value)}
                          placeholder="0.0"
                          className="text-center"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                    <span className="font-medium">Média do Trimestre:</span>
                    <div className="text-lg font-bold">
                      {calculateAverage(trimestre) || "—"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary-glow">
            <Save className="w-4 h-4 mr-2" />
            Salvar Notas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};