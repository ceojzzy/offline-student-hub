export interface TrimestreNotas {
  mac: string; // Média de Avaliação Contínua
  npp: string; // Nota da Prova Parcial
  npt: string; // Nota da Prova Trimestral
}

export interface DisciplinaNotas {
  disciplina: string;
  trimestre1: TrimestreNotas;
  trimestre2: TrimestreNotas;
  trimestre3: TrimestreNotas;
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
  notas: TrimestreNotas;
}

export interface TurmaGroup {
  [key: string]: Student[];
}