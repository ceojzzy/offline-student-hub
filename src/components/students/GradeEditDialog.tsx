import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student, GradeInput, DisciplinaNotas, TrimestreNotas } from "@/types/student";
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
    field: 'mac' | 'npp' | 'npt',
    value: string
  ) => {
    setEditingGrades(prev =>
      prev.map(nota =>
        nota.disciplina === disciplina
          ? { 
              ...nota, 
              [trimestre]: { ...nota[trimestre], [field]: value }
            }
          : nota
      )
    );
  };

  const handleAddDisciplina = () => {
    const emptyNotas: TrimestreNotas = { mac: "", npp: "", npt: "" };
    const newDisciplina: DisciplinaNotas = {
      disciplina: "",
      trimestre1: emptyNotas,
      trimestre2: emptyNotas,
      trimestre3: emptyNotas
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
    editingGrades.forEach((disciplinaNotas) => {
      ['trimestre1', 'trimestre2', 'trimestre3'].forEach((trimestre) => {
        const trimestreKey = trimestre as 'trimestre1' | 'trimestre2' | 'trimestre3';
        onUpdateGrade(student.id, {
          disciplina: disciplinaNotas.disciplina,
          trimestre: trimestreKey,
          notas: disciplinaNotas[trimestreKey]
        });
      });
    });
    onClose();
  };

  const calculateMT = (notas: TrimestreNotas) => {
    const mac = parseFloat(notas.mac) || 0;
    const npp = parseFloat(notas.npp) || 0;
    const npt = parseFloat(notas.npt) || 0;
    
    if (!notas.mac && !notas.npp && !notas.npt) return "";
    
    const mt = (mac + npp + npt) / 3;
    return mt.toFixed(1);
  };

  const calculateMFD = (disciplinaNotas: DisciplinaNotas) => {
    const mt1 = calculateMT(disciplinaNotas.trimestre1);
    const mt2 = calculateMT(disciplinaNotas.trimestre2);
    const mt3 = calculateMT(disciplinaNotas.trimestre3);
    
    const values = [mt1, mt2, mt3]
      .filter(mt => mt !== "")
      .map(mt => parseFloat(mt));
    
    if (values.length === 0) return "";
    
    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / values.length).toFixed(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] w-[98vw] sm:w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5" />
            <span>Mini-Pauta de {student.nome}</span>
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Nº {student.numero} • {student.classe} / Turma {student.turma}
          </div>
        </DialogHeader>

        <Tabs defaultValue="trimestre1" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trimestre1">I Trimestre</TabsTrigger>
            <TabsTrigger value="trimestre2">II Trimestre</TabsTrigger>
            <TabsTrigger value="trimestre3">III Trimestre</TabsTrigger>
          </TabsList>

          {(['trimestre1', 'trimestre2', 'trimestre3'] as const).map((trimestre, index) => (
            <TabsContent key={trimestre} value={trimestre} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{['I', 'II', 'III'][index]} Trimestre</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {editingGrades.map((disciplinaNotas, idx) => (
                      <div key={idx} className="p-4 bg-muted/30 rounded-lg space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <Label htmlFor={`${trimestre}-disciplina-${idx}`}>
                              Disciplina
                            </Label>
                            <Input
                              id={`${trimestre}-disciplina-${idx}`}
                              type="text"
                              value={disciplinaNotas.disciplina}
                              onChange={(e) => handleDisciplinaNameChange(disciplinaNotas.disciplina, e.target.value)}
                              placeholder="Nome da disciplina"
                              className="mt-1"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveDisciplina(disciplinaNotas.disciplina)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-6"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-3">
                          <div>
                            <Label htmlFor={`${trimestre}-mac-${idx}`} className="text-xs">
                              MAC
                            </Label>
                            <Input
                              id={`${trimestre}-mac-${idx}`}
                              type="number"
                              min="0"
                              max="20"
                              step="0.1"
                              value={disciplinaNotas[trimestre].mac}
                              onChange={(e) => handleGradeChange(disciplinaNotas.disciplina, trimestre, 'mac', e.target.value)}
                              placeholder="0.0"
                              className="text-center mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`${trimestre}-npp-${idx}`} className="text-xs">
                              NPP
                            </Label>
                            <Input
                              id={`${trimestre}-npp-${idx}`}
                              type="number"
                              min="0"
                              max="20"
                              step="0.1"
                              value={disciplinaNotas[trimestre].npp}
                              onChange={(e) => handleGradeChange(disciplinaNotas.disciplina, trimestre, 'npp', e.target.value)}
                              placeholder="0.0"
                              className="text-center mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`${trimestre}-npt-${idx}`} className="text-xs">
                              NPT
                            </Label>
                            <Input
                              id={`${trimestre}-npt-${idx}`}
                              type="number"
                              min="0"
                              max="20"
                              step="0.1"
                              value={disciplinaNotas[trimestre].npt}
                              onChange={(e) => handleGradeChange(disciplinaNotas.disciplina, trimestre, 'npt', e.target.value)}
                              placeholder="0.0"
                              className="text-center mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-semibold">
                              MT{index + 1}
                            </Label>
                            <div className="mt-1 h-10 flex items-center justify-center bg-primary/10 rounded-md font-bold text-primary">
                              {calculateMT(disciplinaNotas[trimestre]) || "—"}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <div className="text-sm">
                            <span className="text-muted-foreground">MFD: </span>
                            <span className="font-bold text-primary">
                              {calculateMFD(disciplinaNotas) || "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleAddDisciplina}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Disciplina
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Notas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
