import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student, GradeInput, DisciplinaNotas } from "@/types/student";
import { Save, Calculator, Plus, Trash2 } from "lucide-react";

interface GradeEditDialogProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onUpdateGrade: (studentId: number, gradeData: GradeInput) => void;
}

export const GradeEditDialog = ({ student, isOpen, onClose, onUpdateGrade }: GradeEditDialogProps) => {
  const [editingGrades, setEditingGrades] = useState<DisciplinaNotas[]>(student.notas);

  const handleGradeChange = (
    disciplina: string,
    trimestre: 'trimestre1' | 'trimestre2' | 'trimestre3',
    value: string
  ) => {
    setEditingGrades(prev =>
      prev.map(nota =>
        nota.disciplina === disciplina
          ? { ...nota, [trimestre]: value }
          : nota
      )
    );
  };

  const handleAddDisciplina = () => {
    const newDisciplina: DisciplinaNotas = {
      disciplina: "",
      trimestre1: "",
      trimestre2: "",
      trimestre3: ""
    };
    setEditingGrades(prev => [...prev, newDisciplina]);
  };

  const handleRemoveDisciplina = (disciplina: string) => {
    setEditingGrades(prev => prev.filter(nota => nota.disciplina !== disciplina));
  };

  const handleDisciplinaNameChange = (oldName: string, newName: string) => {
    setEditingGrades(prev =>
      prev.map(nota =>
        nota.disciplina === oldName
          ? { ...nota, disciplina: newName }
          : nota
      )
    );
  };

  const handleSave = () => {
    // Salvar todas as mudanças
    editingGrades.forEach((disciplinaNotas) => {
      ['trimestre1', 'trimestre2', 'trimestre3'].forEach((trimestre) => {
        const trimestreKey = trimestre as 'trimestre1' | 'trimestre2' | 'trimestre3';
        onUpdateGrade(student.id, {
          disciplina: disciplinaNotas.disciplina,
          trimestre: trimestreKey,
          nota: disciplinaNotas[trimestreKey]
        });
      });
    });
    onClose();
  };

  const calculateAverage = (trimestre: 'trimestre1' | 'trimestre2' | 'trimestre3') => {
    const values = editingGrades
      .map(nota => nota[trimestre])
      .filter(nota => nota && !isNaN(parseFloat(nota)))
      .map(nota => parseFloat(nota));
    
    if (values.length === 0) return "";
    
    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / values.length).toFixed(1);
  };

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
                  <div className="space-y-4 mb-6">
                    {editingGrades.map((disciplinaNotas, idx) => (
                      <div key={idx} className="flex items-end gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`${trimestre}-disciplina-${idx}`}>
                            Disciplina
                          </Label>
                          <Input
                            id={`${trimestre}-disciplina-${idx}`}
                            type="text"
                            value={disciplinaNotas.disciplina}
                            onChange={(e) => handleDisciplinaNameChange(disciplinaNotas.disciplina, e.target.value)}
                            placeholder="Nome da disciplina"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`${trimestre}-nota-${idx}`}>
                            Nota
                          </Label>
                          <Input
                            id={`${trimestre}-nota-${idx}`}
                            type="number"
                            min="0"
                            max="20"
                            step="0.1"
                            value={disciplinaNotas[trimestre]}
                            onChange={(e) => handleGradeChange(disciplinaNotas.disciplina, trimestre, e.target.value)}
                            placeholder="0.0"
                            className="text-center"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveDisciplina(disciplinaNotas.disciplina)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleAddDisciplina}
                    className="w-full mb-4"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Disciplina
                  </Button>
                  
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
