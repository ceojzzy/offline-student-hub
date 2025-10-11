import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { StudentFormData } from "@/types/student";
import { UserPlus, X } from "lucide-react";

const studentFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  numero: z.string().min(1, "Número de inscrição é obrigatório"),
  classe: z.string().optional(),
  turma: z.string().optional(),
  curso: z.string().optional(),
  periodo: z.string().optional()
});

interface StudentFormProps {
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const StudentForm = ({ onSubmit, onCancel, isOpen }: StudentFormProps) => {
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      nome: "",
      numero: "",
      classe: "",
      turma: "",
      curso: "",
      periodo: ""
    }
  });

  const handleFormSubmit = (data: StudentFormData) => {
    onSubmit(data);
    form.reset();
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2 md:col-span-1">
                    <FormLabel>Nome Completo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nº de Inscrição *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 001, 002..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="classe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classe</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a classe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="10ª">10ª Classe</SelectItem>
                        <SelectItem value="11ª">11ª Classe</SelectItem>
                        <SelectItem value="12ª">12ª Classe</SelectItem>
                        <SelectItem value="13ª">13ª Classe</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="turma"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turma</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a turma" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A">Turma A</SelectItem>
                        <SelectItem value="B">Turma B</SelectItem>
                        <SelectItem value="C">Turma C</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="curso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Curso</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Ciências Naturais" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="periodo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o período" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Manhã">Manhã</SelectItem>
                        <SelectItem value="Tarde">Tarde</SelectItem>
                        <SelectItem value="Noite">Noite</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary-glow w-full sm:w-auto">
                Salvar Aluno
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};