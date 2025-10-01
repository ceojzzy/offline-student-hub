import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Student, StudentFormData, GradeInput } from "@/types/student";

const STORAGE_KEY = "alunos";

const EXAMPLE_STUDENTS: Student[] = [
  // 10ª Classe - Turma A - Manhã
  { id: 1, nome: "João Silva", numero: "001", classe: "10ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: { trimestre1: { MAC: "15", PPP: "14", MAT: "16" }, trimestre2: { MAC: "16", PPP: "15", MAT: "17" }, trimestre3: { MAC: "17", PPP: "16", MAT: "18" } } },
  { id: 2, nome: "Maria Santos", numero: "002", classe: "10ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: { trimestre1: { MAC: "18", PPP: "17", MAT: "19" }, trimestre2: { MAC: "17", PPP: "18", MAT: "18" }, trimestre3: { MAC: "19", PPP: "18", MAT: "20" } } },
  { id: 3, nome: "Pedro Costa", numero: "003", classe: "10ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: { trimestre1: { MAC: "13", PPP: "12", MAT: "14" }, trimestre2: { MAC: "14", PPP: "13", MAT: "15" }, trimestre3: { MAC: "15", PPP: "14", MAT: "16" } } },
  
  // 10ª Classe - Turma B - Tarde
  { id: 4, nome: "Ana Pereira", numero: "001", classe: "10ª", turma: "B", curso: "Letras", periodo: "Tarde", notas: { trimestre1: { MAC: "16", PPP: "17", MAT: "15" }, trimestre2: { MAC: "17", PPP: "18", MAT: "16" }, trimestre3: { MAC: "18", PPP: "19", MAT: "17" } } },
  { id: 5, nome: "Carlos Oliveira", numero: "002", classe: "10ª", turma: "B", curso: "Letras", periodo: "Tarde", notas: { trimestre1: { MAC: "14", PPP: "15", MAT: "13" }, trimestre2: { MAC: "15", PPP: "16", MAT: "14" }, trimestre3: { MAC: "16", PPP: "17", MAT: "15" } } },
  
  // 11ª Classe - Turma A - Manhã
  { id: 6, nome: "Sofia Ferreira", numero: "001", classe: "11ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: { trimestre1: { MAC: "17", PPP: "18", MAT: "19" }, trimestre2: { MAC: "18", PPP: "19", MAT: "20" }, trimestre3: { MAC: "19", PPP: "20", MAT: "20" } } },
  { id: 7, nome: "Lucas Almeida", numero: "002", classe: "11ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: { trimestre1: { MAC: "15", PPP: "16", MAT: "17" }, trimestre2: { MAC: "16", PPP: "17", MAT: "18" }, trimestre3: { MAC: "17", PPP: "18", MAT: "19" } } },
  { id: 8, nome: "Beatriz Lima", numero: "003", classe: "11ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: { trimestre1: { MAC: "19", PPP: "18", MAT: "20" }, trimestre2: { MAC: "20", PPP: "19", MAT: "20" }, trimestre3: { MAC: "20", PPP: "20", MAT: "20" } } },
  
  // 11ª Classe - Turma B - Tarde
  { id: 9, nome: "Rafael Gomes", numero: "001", classe: "11ª", turma: "B", curso: "Letras", periodo: "Tarde", notas: { trimestre1: { MAC: "16", PPP: "17", MAT: "15" }, trimestre2: { MAC: "17", PPP: "18", MAT: "16" }, trimestre3: { MAC: "18", PPP: "19", MAT: "17" } } },
  { id: 10, nome: "Juliana Sousa", numero: "002", classe: "11ª", turma: "B", curso: "Letras", periodo: "Tarde", notas: { trimestre1: { MAC: "18", PPP: "19", MAT: "17" }, trimestre2: { MAC: "19", PPP: "20", MAT: "18" }, trimestre3: { MAC: "20", PPP: "20", MAT: "19" } } },
  
  // 12ª Classe - Turma A - Manhã
  { id: 11, nome: "Gabriel Martins", numero: "001", classe: "12ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: { trimestre1: { MAC: "17", PPP: "16", MAT: "18" }, trimestre2: { MAC: "18", PPP: "17", MAT: "19" }, trimestre3: { MAC: "19", PPP: "18", MAT: "20" } } },
  { id: 12, nome: "Isabela Rodrigues", numero: "002", classe: "12ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: { trimestre1: { MAC: "19", PPP: "20", MAT: "19" }, trimestre2: { MAC: "20", PPP: "20", MAT: "20" }, trimestre3: { MAC: "20", PPP: "20", MAT: "20" } } },
  { id: 13, nome: "Mateus Fernandes", numero: "003", classe: "12ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: { trimestre1: { MAC: "14", PPP: "15", MAT: "16" }, trimestre2: { MAC: "15", PPP: "16", MAT: "17" }, trimestre3: { MAC: "16", PPP: "17", MAT: "18" } } },
  
  // 12ª Classe - Turma B - Tarde
  { id: 14, nome: "Camila Araújo", numero: "001", classe: "12ª", turma: "B", curso: "Letras", periodo: "Tarde", notas: { trimestre1: { MAC: "18", PPP: "19", MAT: "17" }, trimestre2: { MAC: "19", PPP: "20", MAT: "18" }, trimestre3: { MAC: "20", PPP: "20", MAT: "19" } } },
  { id: 15, nome: "Felipe Cardoso", numero: "002", classe: "12ª", turma: "B", curso: "Letras", periodo: "Tarde", notas: { trimestre1: { MAC: "15", PPP: "16", MAT: "14" }, trimestre2: { MAC: "16", PPP: "17", MAT: "15" }, trimestre3: { MAC: "17", PPP: "18", MAT: "16" } } },
  
  // 13ª Classe - Turma A - Manhã
  { id: 16, nome: "Larissa Barros", numero: "001", classe: "13ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: { trimestre1: { MAC: "19", PPP: "18", MAT: "20" }, trimestre2: { MAC: "20", PPP: "19", MAT: "20" }, trimestre3: { MAC: "20", PPP: "20", MAT: "20" } } },
  { id: 17, nome: "Thiago Dias", numero: "002", classe: "13ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: { trimestre1: { MAC: "16", PPP: "17", MAT: "18" }, trimestre2: { MAC: "17", PPP: "18", MAT: "19" }, trimestre3: { MAC: "18", PPP: "19", MAT: "20" } } },
  { id: 18, nome: "Amanda Castro", numero: "003", classe: "13ª", turma: "A", curso: "Ciências", periodo: "Manhã", notas: { trimestre1: { MAC: "18", PPP: "19", MAT: "19" }, trimestre2: { MAC: "19", PPP: "20", MAT: "20" }, trimestre3: { MAC: "20", PPP: "20", MAT: "20" } } },
  
  // 13ª Classe - Turma B - Tarde
  { id: 19, nome: "Bruno Mendes", numero: "001", classe: "13ª", turma: "B", curso: "Letras", periodo: "Tarde", notas: { trimestre1: { MAC: "17", PPP: "18", MAT: "16" }, trimestre2: { MAC: "18", PPP: "19", MAT: "17" }, trimestre3: { MAC: "19", PPP: "20", MAT: "18" } } },
  { id: 20, nome: "Fernanda Pinto", numero: "002", classe: "13ª", turma: "B", curso: "Letras", periodo: "Tarde", notas: { trimestre1: { MAC: "19", PPP: "20", MAT: "18" }, trimestre2: { MAC: "20", PPP: "20", MAT: "19" }, trimestre3: { MAC: "20", PPP: "20", MAT: "20" } } },
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
      notas: {
        trimestre1: { MAC: "", PPP: "", MAT: "" },
        trimestre2: { MAC: "", PPP: "", MAT: "" },
        trimestre3: { MAC: "", PPP: "", MAT: "" }
      }
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
          return {
            ...student,
            notas: {
              ...student.notas,
              [gradeData.trimestre]: {
                ...student.notas[gradeData.trimestre],
                [gradeData.disciplina]: gradeData.nota
              }
            }
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
