import { useState, useEffect } from "react";
import { Student, StudentFormData, GradeInput } from "@/types/student";

const STORAGE_KEY = "alunos";

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedStudents = localStorage.getItem(STORAGE_KEY);
    if (savedStudents) {
      try {
        setStudents(JSON.parse(savedStudents));
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }
  }, []);

  // Salvar no localStorage sempre que os dados mudarem
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
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

    setStudents(prev => [...prev, newStudent]);
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

    // Ordenar alunos dentro de cada turma por número, depois por nome
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

  return {
    students,
    addStudent,
    updateStudent,
    updateGrade,
    deleteStudent,
    getStudentsByClass,
    searchStudents,
    totalStudents: students.length
  };
};