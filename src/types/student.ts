export interface Student {
  id: number;
  nome: string;
  numero: string;
  classe: string;
  turma: string;
  curso: string;
  periodo: string;
  notas: {
    trimestre1: { MAC: string; PPP: string; MAT: string };
    trimestre2: { MAC: string; PPP: string; MAT: string };
    trimestre3: { MAC: string; PPP: string; MAT: string };
  };
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
  trimestre: 'trimestre1' | 'trimestre2' | 'trimestre3';
  disciplina: 'MAC' | 'PPP' | 'MAT';
  nota: string;
}

export interface TurmaGroup {
  [key: string]: Student[];
}