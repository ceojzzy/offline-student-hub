import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StudentFormData } from "@/types/student";
import { UserPlus, X } from "lucide-react";

interface StudentFormProps {
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const StudentForm = ({ onSubmit, onCancel, isOpen }: StudentFormProps) => {
  const [formData, setFormData] = useState<StudentFormData>({
    nome: "",
    numero: "",
    classe: "",
    turma: "",
    curso: "",
    periodo: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim() || !formData.numero.trim()) {
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      nome: "",
      numero: "",
      classe: "",
      turma: "",
      curso: "",
      periodo: ""
    });
  };

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <Card className="mb-6 border border-border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-primary-foreground" />
            </div>
            <CardTitle className="text-lg">Cadastrar Novo Aluno</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                placeholder="Digite o nome completo"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Nº de Inscrição *</Label>
              <Input
                id="numero"
                type="text"
                value={formData.numero}
                onChange={(e) => handleInputChange("numero", e.target.value)}
                placeholder="Ex: 001, 002..."
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="classe">Classe</Label>
              <Select value={formData.classe} onValueChange={(value) => handleInputChange("classe", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10ª">10ª Classe</SelectItem>
                  <SelectItem value="11ª">11ª Classe</SelectItem>
                  <SelectItem value="12ª">12ª Classe</SelectItem>
                  <SelectItem value="13ª">13ª Classe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="turma">Turma</Label>
              <Select value={formData.turma} onValueChange={(value) => handleInputChange("turma", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Turma A</SelectItem>
                  <SelectItem value="B">Turma B</SelectItem>
                  <SelectItem value="C">Turma C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="curso">Curso</Label>
              <Input
                id="curso"
                type="text"
                value={formData.curso}
                onChange={(e) => handleInputChange("curso", e.target.value)}
                placeholder="Ex: Ciências Naturais"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodo">Período</Label>
              <Input
                id="periodo"
                type="text"
                value={formData.periodo}
                onChange={(e) => handleInputChange("periodo", e.target.value)}
                placeholder="Ex: Manhã, Tarde"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-glow">
              Salvar Aluno
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};