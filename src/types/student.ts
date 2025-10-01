export interface DisciplinaNotas {
  disciplina: string;
  trimestre1: string;
  trimestre2: string;
  trimestre3: string;
}

export interface Student {
  id: number;
  nome: string;
  numero: string;
  classe: string;
  turma: string;
  curso: string;
  periodo: string;
  notas: DisciplinaNotas[];
}

export interface StudentFormData {
  nome: string;
  numero: string;
  classe: string;
  turma: string;
  curso: string;
  periodo: string;
}

export interface GradeInput {
  disciplina: string;
  trimestre: 'trimestre1' | 'trimestre2' | 'trimestre3';
  nota: string;
}

export interface TurmaGroup {
  [key: string]: Student[];
}