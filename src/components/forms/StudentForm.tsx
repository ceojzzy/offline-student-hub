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
import { ComboboxField } from "./ComboboxField";

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
  existingClasses?: string[];
  existingTurmas?: string[];
}

export const StudentForm = ({ onSubmit, onCancel, isOpen, existingClasses = [], existingTurmas = [] }: StudentFormProps) => {
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
    <Card className="mb-4 md:mb-6 border border-border shadow-sm">
      <CardHeader className="pb-3 md:pb-4 p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />
            </div>
            <CardTitle className="text-base sm:text-lg">Cadastrar Novo Aluno</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel} className="h-7 w-7 sm:h-8 sm:w-8 p-0">
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 sm:p-4 md:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
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
                    <FormControl>
                      <ComboboxField
                        value={field.value}
                        onValueChange={field.onChange}
                        options={existingClasses.length > 0 ? existingClasses : ["7ª", "8ª", "9ª", "10ª", "11ª", "12ª", "13ª"]}
                        placeholder="Selecione ou digite a classe"
                        searchPlaceholder="Buscar ou digitar classe..."
                        emptyText="Digite a classe desejada"
                      />
                    </FormControl>
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
                    <FormControl>
                      <ComboboxField
                        value={field.value}
                        onValueChange={field.onChange}
                        options={existingTurmas.length > 0 ? existingTurmas : ["A", "B", "C", "D", "E", "F"]}
                        placeholder="Selecione ou digite a turma"
                        searchPlaceholder="Buscar ou digitar turma..."
                        emptyText="Digite a turma desejada"
                      />
                    </FormControl>
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
                      <ComboboxField
                        value={field.value}
                        onValueChange={field.onChange}
                        options={[
                          "Ciências Físicas e Biológicas",
                          "Ciências Económicas e Jurídicas",
                          "Ciências Humanas",
                          "Artes Visuais",
                          "Ensino Geral"
                        ]}
                        placeholder="Selecione ou digite o curso"
                        searchPlaceholder="Buscar ou digitar curso..."
                        emptyText="Digite o curso desejado"
                      />
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

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-2 md:pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto order-2 sm:order-1">
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary-glow w-full sm:w-auto order-1 sm:order-2">
                Salvar Aluno
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};