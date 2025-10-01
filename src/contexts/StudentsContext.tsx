import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Student, StudentFormData, GradeInput } from "@/types/student";

const STORAGE_KEY = "alunos";

const EXAMPLE_STUDENTS: Student[] = [
  // 10ª Classe - Turma A - Manhã
  { id: 1, nome: "João Silva", numero: "001", classe: "10ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: [
    { disciplina: "MAC", trimestre1: "15", trimestre2: "16", trimestre3: "17" },
    { disciplina: "PPP", trimestre1: "14", trimestre2: "15", trimestre3: "16" },
    { disciplina: "MAT", trimestre1: "16", trimestre2: "17", trimestre3: "18" }
  ]},
  { id: 2, nome: "Maria Santos", numero: "002", classe: "10ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: [
    { disciplina: "MAC", trimestre1: "18", trimestre2: "17", trimestre3: "19" },
    { disciplina: "PPP", trimestre1: "17", trimestre2: "18", trimestre3: "18" },
    { disciplina: "MAT", trimestre1: "19", trimestre2: "18", trimestre3: "20" }
  ]},
  { id: 3, nome: "Pedro Costa", numero: "003", classe: "10ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: [
    { disciplina: "MAC", trimestre1: "13", trimestre2: "14", trimestre3: "15" },
    { disciplina: "PPP", trimestre1: "12", trimestre2: "13", trimestre3: "14" },
    { disciplina: "MAT", trimestre1: "14", trimestre2: "15", trimestre3: "16" }
  ]},
  
  // 10ª Classe - Turma B - Tarde
  { id: 4, nome: "Ana Pereira", numero: "001", classe: "10ª", turma: "B", curso: "Letras", periodo: "Tarde", notas: [
    { disciplina: "MAC", trimestre1: "16", trimestre2: "17", trimestre3: "18" },
    { disciplina: "PPP", trimestre1: "17", trimestre2: "18", trimestre3: "19" },
    { disciplina: "MAT", trimestre1: "15", trimestre2: "16", trimestre3: "17" }
  ]},
  { id: 5, nome: "Carlos Oliveira", numero: "002", classe: "10ª", turma: "B", curso: "Letras", periodo: "Tarde", notas: [
    { disciplina: "MAC", trimestre1: "14", trimestre2: "15", trimestre3: "16" },
    { disciplina: "PPP", trimestre1: "15", trimestre2: "16", trimestre3: "17" },
    { disciplina: "MAT", trimestre1: "13", trimestre2: "14", trimestre3: "15" }
  ]},
  
  // 11ª Classe - Turma A - Manhã
  { id: 6, nome: "Sofia Ferreira", numero: "001", classe: "11ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: [
    { disciplina: "MAC", trimestre1: "17", trimestre2: "18", trimestre3: "19" },
    { disciplina: "PPP", trimestre1: "18", trimestre2: "19", trimestre3: "20" },
    { disciplina: "MAT", trimestre1: "19", trimestre2: "20", trimestre3: "20" }
  ]},
  { id: 7, nome: "Lucas Almeida", numero: "002", classe: "11ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: [
    { disciplina: "MAC", trimestre1: "15", trimestre2: "16", trimestre3: "17" },
    { disciplina: "PPP", trimestre1: "16", trimestre2: "17", trimestre3: "18" },
    { disciplina: "MAT", trimestre1: "17", trimestre2: "18", trimestre3: "19" }
  ]},
  { id: 8, nome: "Beatriz Lima", numero: "003", classe: "11ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: [
    { disciplina: "MAC", trimestre1: "19", trimestre2: "20", trimestre3: "20" },
    { disciplina: "PPP", trimestre1: "18", trimestre2: "19", trimestre3: "20" },
    { disciplina: "MAT", trimestre1: "20", trimestre2: "20", trimestre3: "20" }
  ]},
  
  // 11ª Classe - Turma B - Tarde
  { id: 9, nome: "Rafael Gomes", numero: "001", classe: "11ª", turma: "B", curso: "Letras", periodo: "Tarde", notas: [
    { disciplina: "MAC", trimestre1: "16", trimestre2: "17", trimestre3: "18" },
    { disciplina: "PPP", trimestre1: "17", trimestre2: "18", trimestre3: "19" },
    { disciplina: "MAT", trimestre1: "15", trimestre2: "16", trimestre3: "17" }
  ]},
  { id: 10, nome: "Juliana Sousa", numero: "002", classe: "11ª", turma: "B", curso: "Letras", periodo: "Tarde", notas: [
    { disciplina: "MAC", trimestre1: "18", trimestre2: "19", trimestre3: "20" },
    { disciplina: "PPP", trimestre1: "19", trimestre2: "20", trimestre3: "20" },
    { disciplina: "MAT", trimestre1: "17", trimestre2: "18", trimestre3: "19" }
  ]},
  
  // 12ª Classe - Turma A - Manhã
  { id: 11, nome: "Gabriel Martins", numero: "001", classe: "12ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: [
    { disciplina: "MAC", trimestre1: "17", trimestre2: "18", trimestre3: "19" },
    { disciplina: "PPP", trimestre1: "16", trimestre2: "17", trimestre3: "18" },
    { disciplina: "MAT", trimestre1: "18", trimestre2: "19", trimestre3: "20" }
  ]},
  { id: 12, nome: "Isabela Rodrigues", numero: "002", classe: "12ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: [
    { disciplina: "MAC", trimestre1: "19", trimestre2: "20", trimestre3: "20" },
    { disciplina: "PPP", trimestre1: "20", trimestre2: "20", trimestre3: "20" },
    { disciplina: "MAT", trimestre1: "19", trimestre2: "20", trimestre3: "20" }
  ]},
  { id: 13, nome: "Mateus Fernandes", numero: "003", classe: "12ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: [
    { disciplina: "MAC", trimestre1: "14", trimestre2: "15", trimestre3: "16" },
    { disciplina: "PPP", trimestre1: "15", trimestre2: "16", trimestre3: "17" },
    { disciplina: "MAT", trimestre1: "16", trimestre2: "17", trimestre3: "18" }
  ]},
  
  // 12ª Classe - Turma B - Tarde
  { id: 14, nome: "Camila Araújo", numero: "001", classe: "12ª", turma: "B", curso: "Letras", periodo: "Tarde", notas: [
    { disciplina: "MAC", trimestre1: "18", trimestre2: "19", trimestre3: "20" },
    { disciplina: "PPP", trimestre1: "19", trimestre2: "20", trimestre3: "20" },
    { disciplina: "MAT", trimestre1: "17", trimestre2: "18", trimestre3: "19" }
  ]},
  { id: 15, nome: "Felipe Cardoso", numero: "002", classe: "12ª", turma: "B", curso: "Letras", periodo: "Tarde", notas: [
    { disciplina: "MAC", trimestre1: "15", trimestre2: "16", trimestre3: "17" },
    { disciplina: "PPP", trimestre1: "16", trimestre2: "17", trimestre3: "18" },
    { disciplina: "MAT", trimestre1: "14", trimestre2: "15", trimestre3: "16" }
  ]},
  
  // 13ª Classe - Turma A - Manhã
  { id: 16, nome: "Larissa Barros", numero: "001", classe: "13ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: [
    { disciplina: "MAC", trimestre1: "19", trimestre2: "20", trimestre3: "20" },
    { disciplina: "PPP", trimestre1: "18", trimestre2: "19", trimestre3: "20" },
    { disciplina: "MAT", trimestre1: "20", trimestre2: "20", trimestre3: "20" }
  ]},
  { id: 17, nome: "Thiago Dias", numero: "002", classe: "13ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: [
    { disciplina: "MAC", trimestre1: "16", trimestre2: "17", trimestre3: "18" },
    { disciplina: "PPP", trimestre1: "17", trimestre2: "18", trimestre3: "19" },
    { disciplina: "MAT", trimestre1: "18", trimestre2: "19", trimestre3: "20" }
  ]},
  { id: 18, nome: "Amanda Castro", numero: "003", classe: "13ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: [
    { disciplina: "MAC", trimestre1: "18", trimestre2: "19", trimestre3: "20" },
    { disciplina: "PPP", trimestre1: "19", trimestre2: "20", trimestre3: "20" },
    { disciplina: "MAT", trimestre1: "19", trimestre2: "20", trimestre3: "20" }
  ]},
  
  // 13ª Classe - Turma B - Tarde
  { id: 19, nome: "Bruno Mendes", numero: "001", classe: "13ª", turma: "B", curso: "Letras", periodo: "Tarde", notas: [
    { disciplina: "MAC", trimestre1: "17", trimestre2: "18", trimestre3: "19" },
    { disciplina: "PPP", trimestre1: "18", trimestre2: "19", trimestre3: "20" },
    { disciplina: "MAT", trimestre1: "16", trimestre2: "17", trimestre3: "18" }
  ]},
  { id: 20, nome: "Fernanda Pinto", numero: "002", classe: "13ª", turma: "B", curso: "Letras", periodo: "Tarde", notas: [
    { disciplina: "MAC", trimestre1: "19", trimestre2: "20", trimestre3: "20" },
    { disciplina: "PPP", trimestre1: "20", trimestre2: "20", trimestre3: "20" },
    { disciplina: "MAT", trimestre1: "18", trimestre2: "19", trimestre3: "20" }
  ]},
];

interface StudentsContextType {
  students: Student[];
  addStudent: (studentData: StudentFormData) => Student;
  updateStudent: (id: number, updates: Partial<Student>) => void;
  updateGrade: (studentId: number, gradeData: GradeInput) => void;
  deleteStudent: (id: number) => void;
  getStudentsByClass: () => { [key: string]: Student[] };
  searchStudents: (query: string) => Student[];
  totalStudents: number;
}

const StudentsContext = createContext<StudentsContextType | undefined>(undefined);

export const StudentsProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([]);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedStudents = localStorage.getItem(STORAGE_KEY);
    if (savedStudents) {
      try {
        const parsed = JSON.parse(savedStudents);
        setStudents(parsed);
        console.log("Dados carregados do localStorage:", parsed.length, "alunos");
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setStudents(EXAMPLE_STUDENTS);
      }
    } else {
      console.log("Nenhum dado salvo, usando dados de exemplo");
      setStudents(EXAMPLE_STUDENTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(EXAMPLE_STUDENTS));
    }
  }, []);

  // Salvar no localStorage sempre que os dados mudarem
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
      console.log("Dados salvos no localStorage:", students.length, "alunos");
    }
  }, [students]);

  const addStudent = (studentData: StudentFormData) => {
    const newStudent: Student = {
      id: Date.now(),
      ...studentData,
      notas: [
        { disciplina: "MAC", trimestre1: "", trimestre2: "", trimestre3: "" },
        { disciplina: "PPP", trimestre1: "", trimestre2: "", trimestre3: "" },
        { disciplina: "MAT", trimestre1: "", trimestre2: "", trimestre3: "" }
      ]
    };

    console.log("Adicionando novo aluno:", newStudent);
    setStudents(prev => {
      const updated = [...prev, newStudent];
      console.log("Total de alunos após adicionar:", updated.length);
      return updated;
    });
    return newStudent;
  };

  const updateStudent = (id: number, updates: Partial<Student>) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === id ? { ...student, ...updates } : student
      )
    );
  };

  const updateGrade = (studentId: number, gradeData: GradeInput) => {
    setStudents(prev =>
      prev.map(student => {
        if (student.id === studentId) {
          const notasAtualizadas = student.notas.map(nota => 
            nota.disciplina === gradeData.disciplina
              ? { ...nota, [gradeData.trimestre]: gradeData.nota }
              : nota
          );
          return {
            ...student,
            notas: notasAtualizadas
          };
        }
        return student;
      })
    );
  };

  const deleteStudent = (id: number) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const getStudentsByClass = () => {
    const groups: { [key: string]: Student[] } = {};
    
    students.forEach(student => {
      const key = `${student.classe} / Turma ${student.turma}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(student);
    });

    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => {
        if (a.numero !== b.numero) {
          return parseInt(a.numero) - parseInt(b.numero);
        }
        return a.nome.localeCompare(b.nome);
      });
    });

    return groups;
  };

  const searchStudents = (query: string) => {
    if (!query.trim()) return students;
    
    const lowerQuery = query.toLowerCase();
    return students.filter(student =>
      student.nome.toLowerCase().includes(lowerQuery) ||
      student.numero.includes(query) ||
      student.classe.toLowerCase().includes(lowerQuery) ||
      student.turma.toLowerCase().includes(lowerQuery) ||
      student.curso.toLowerCase().includes(lowerQuery)
    );
  };

  return (
    <StudentsContext.Provider value={{
      students,
      addStudent,
      updateStudent,
      updateGrade,
      deleteStudent,
      getStudentsByClass,
      searchStudents,
      totalStudents: students.length
    }}>
      {children}
    </StudentsContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentsContext);
  if (!context) {
    throw new Error("useStudents must be used within StudentsProvider");
  }
  return context;
};
