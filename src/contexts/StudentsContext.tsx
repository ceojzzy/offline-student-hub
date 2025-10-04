import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Student, StudentFormData, GradeInput, TrimestreNotas } from "@/types/student";
import { toast } from "sonner";

const STORAGE_KEY = "alunos";

const EXAMPLE_STUDENTS: Student[] = [
  {
    id: 1,
    nome: "João Silva",
    numero: "001",
    classe: "10ª Classe",
    turma: "A",
    curso: "Ciências Físicas e Biológicas",
    periodo: "Manhã",
    notas: [
      { 
        disciplina: "Matemática", 
        trimestre1: { mac: "15", npp: "14", npt: "16" },
        trimestre2: { mac: "16", npp: "15", npt: "17" },
        trimestre3: { mac: "14", npp: "15", npt: "15" }
      },
      { 
        disciplina: "Física", 
        trimestre1: { mac: "14", npp: "13", npt: "15" },
        trimestre2: { mac: "15", npp: "14", npt: "16" },
        trimestre3: { mac: "15", npp: "16", npt: "14" }
      },
    ]
  },
  {
    id: 2,
    nome: "Maria Santos",
    numero: "002",
    classe: "10ª Classe",
    turma: "A",
    curso: "Ciências Físicas e Biológicas",
    periodo: "Manhã",
    notas: [
      { 
        disciplina: "Matemática", 
        trimestre1: { mac: "17", npp: "16", npt: "18" },
        trimestre2: { mac: "16", npp: "17", npt: "16" },
        trimestre3: { mac: "18", npp: "17", npt: "19" }
      },
      { 
        disciplina: "Física", 
        trimestre1: { mac: "16", npp: "15", npt: "17" },
        trimestre2: { mac: "17", npp: "16", npt: "18" },
        trimestre3: { mac: "16", npp: "17", npt: "16" }
      },
    ]
  },
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
      notas: []
    };

    console.log("Adicionando novo aluno:", newStudent);
    setStudents(prev => {
      const updated = [...prev, newStudent];
      console.log("Total de alunos após adicionar:", updated.length);
      return updated;
    });
    toast.success("Aluno cadastrado com sucesso!");
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
    setStudents(prev => prev.map(student => {
      if (student.id !== studentId) return student;

      const existingNotaIndex = student.notas.findIndex(
        nota => nota.disciplina === gradeData.disciplina
      );

      if (existingNotaIndex >= 0) {
        const updatedNotas = [...student.notas];
        updatedNotas[existingNotaIndex] = {
          ...updatedNotas[existingNotaIndex],
          [gradeData.trimestre]: gradeData.notas
        };
        return { ...student, notas: updatedNotas };
      } else {
        const emptyNotas: TrimestreNotas = { mac: "", npp: "", npt: "" };
        const newNota = {
          disciplina: gradeData.disciplina,
          trimestre1: gradeData.trimestre === 'trimestre1' ? gradeData.notas : emptyNotas,
          trimestre2: gradeData.trimestre === 'trimestre2' ? gradeData.notas : emptyNotas,
          trimestre3: gradeData.trimestre === 'trimestre3' ? gradeData.notas : emptyNotas
        };
        return { ...student, notas: [...student.notas, newNota] };
      }
    }));
    toast.success("Nota atualizada!");
  };

  const deleteStudent = (id: number) => {
    setStudents(prev => prev.filter(student => student.id !== id));
    toast.success("Aluno removido!");
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
