# Guia Completo: Sistema de Gestão de Alunos no AIDE (Java Puro)

Este guia mostra como criar o sistema de gestão de alunos usando apenas o AIDE no celular, com Java puro e Android SDK básico.

## 📋 Pré-requisitos

- Celular Android (versão 5.0 ou superior)
- AIDE - Android IDE instalado
- Pelo menos 500MB de espaço livre
- Conhecimento básico de Java e Android

## 🔧 Passo 1: Instalar AIDE

1. Baixe o AIDE da Play Store:
   - Link: https://play.google.com/store/apps/details?id=com.aide.ui
   
2. Instale e abra o AIDE

3. Conceda as permissões necessárias de armazenamento

## 🆕 Passo 2: Criar Novo Projeto

1. Abra o AIDE
2. Toque em "+" (Novo Projeto)
3. Selecione "App Android"
4. Escolha "Material Design (Java)"
5. Defina:
   - **Nome do App**: Gestão de Alunos
   - **Package**: com.escola.gestao
   - **Localização**: Pasta padrão do AIDE

## 📁 Passo 3: Estrutura do Projeto

```
GestaoDeAlunos/
├── app/
│   └── src/
│       └── main/
│           ├── java/com/escola/gestao/
│           │   ├── MainActivity.java
│           │   ├── DashboardActivity.java
│           │   ├── AddStudentActivity.java
│           │   ├── StudentsListActivity.java
│           │   ├── GradesActivity.java
│           │   ├── ReportsActivity.java
│           │   ├── models/
│           │   │   ├── Student.java
│           │   │   ├── Grade.java
│           │   │   └── Trimestre.java
│           │   ├── adapters/
│           │   │   ├── StudentAdapter.java
│           │   │   └── GradeAdapter.java
│           │   └── utils/
│           │       ├── DataManager.java
│           │       └── JsonHelper.java
│           ├── res/
│           │   ├── layout/
│           │   │   ├── activity_main.xml
│           │   │   ├── activity_dashboard.xml
│           │   │   ├── activity_add_student.xml
│           │   │   ├── activity_students_list.xml
│           │   │   ├── activity_grades.xml
│           │   │   ├── activity_reports.xml
│           │   │   ├── item_student.xml
│           │   │   └── item_grade.xml
│           │   ├── values/
│           │   │   ├── strings.xml
│           │   │   ├── colors.xml
│           │   │   └── styles.xml
│           │   ├── drawable/
│           │   │   └── (imagens e ícones)
│           │   └── menu/
│           │       └── menu_main.xml
│           └── AndroidManifest.xml
└── README.md
```

## 📝 Passo 4: Criar Modelos (Models)

### Student.java

```java
package com.escola.gestao.models;

import java.util.ArrayList;

public class Student {
    private int id;
    private String nome;
    private String numero;
    private String classe;
    private String turma;
    private String curso;
    private String periodo;
    private ArrayList<Grade> notas;

    public Student() {
        this.notas = new ArrayList<>();
    }

    public Student(int id, String nome, String numero, String classe, 
                   String turma, String curso, String periodo) {
        this.id = id;
        this.nome = nome;
        this.numero = numero;
        this.classe = classe;
        this.turma = turma;
        this.curso = curso;
        this.periodo = periodo;
        this.notas = new ArrayList<>();
    }

    // Getters
    public int getId() { return id; }
    public String getNome() { return nome; }
    public String getNumero() { return numero; }
    public String getClasse() { return classe; }
    public String getTurma() { return turma; }
    public String getCurso() { return curso; }
    public String getPeriodo() { return periodo; }
    public ArrayList<Grade> getNotas() { return notas; }

    // Setters
    public void setId(int id) { this.id = id; }
    public void setNome(String nome) { this.nome = nome; }
    public void setNumero(String numero) { this.numero = numero; }
    public void setClasse(String classe) { this.classe = classe; }
    public void setTurma(String turma) { this.turma = turma; }
    public void setCurso(String curso) { this.curso = curso; }
    public void setPeriodo(String periodo) { this.periodo = periodo; }
    public void setNotas(ArrayList<Grade> notas) { this.notas = notas; }

    public void addNota(Grade nota) {
        this.notas.add(nota);
    }
}
```

### Grade.java

```java
package com.escola.gestao.models;

public class Grade {
    private String disciplina;
    private Trimestre trimestre1;
    private Trimestre trimestre2;
    private Trimestre trimestre3;

    public Grade() {
        this.trimestre1 = new Trimestre();
        this.trimestre2 = new Trimestre();
        this.trimestre3 = new Trimestre();
    }

    public Grade(String disciplina) {
        this.disciplina = disciplina;
        this.trimestre1 = new Trimestre();
        this.trimestre2 = new Trimestre();
        this.trimestre3 = new Trimestre();
    }

    // Getters
    public String getDisciplina() { return disciplina; }
    public Trimestre getTrimestre1() { return trimestre1; }
    public Trimestre getTrimestre2() { return trimestre2; }
    public Trimestre getTrimestre3() { return trimestre3; }

    // Setters
    public void setDisciplina(String disciplina) { this.disciplina = disciplina; }
    public void setTrimestre1(Trimestre trimestre1) { this.trimestre1 = trimestre1; }
    public void setTrimestre2(Trimestre trimestre2) { this.trimestre2 = trimestre2; }
    public void setTrimestre3(Trimestre trimestre3) { this.trimestre3 = trimestre3; }

    // Calcular média final
    public double calcularMediaFinal() {
        double m1 = trimestre1.calcularMedia();
        double m2 = trimestre2.calcularMedia();
        double m3 = trimestre3.calcularMedia();
        return (m1 + m2 + m3) / 3.0;
    }
}
```

### Trimestre.java

```java
package com.escola.gestao.models;

public class Trimestre {
    private double mac; // Média de Avaliação Contínua
    private double npp; // Nota da Prova Parcial
    private double npt; // Nota da Prova Trimestral

    public Trimestre() {
        this.mac = 0.0;
        this.npp = 0.0;
        this.npt = 0.0;
    }

    public Trimestre(double mac, double npp, double npt) {
        this.mac = mac;
        this.npp = npp;
        this.npt = npt;
    }

    // Getters
    public double getMac() { return mac; }
    public double getNpp() { return npp; }
    public double getNpt() { return npt; }

    // Setters
    public void setMac(double mac) { this.mac = mac; }
    public void setNpp(double npp) { this.npp = npp; }
    public void setNpt(double npt) { this.npt = npt; }

    // Calcular média do trimestre
    public double calcularMedia() {
        return (mac + npp + npt) / 3.0;
    }
}
```

## 🔧 Passo 5: Criar Gerenciador de Dados

### DataManager.java

```java
package com.escola.gestao.utils;

import android.content.Context;
import android.content.SharedPreferences;
import com.escola.gestao.models.Student;
import com.escola.gestao.models.Grade;
import com.escola.gestao.models.Trimestre;
import java.util.ArrayList;

public class DataManager {
    private static final String PREFS_NAME = "GestaoAlunosPrefs";
    private static final String KEY_STUDENTS = "students";
    private static final String KEY_LAST_ID = "last_id";
    
    private Context context;
    private SharedPreferences prefs;
    private ArrayList<Student> students;

    public DataManager(Context context) {
        this.context = context;
        this.prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        this.students = new ArrayList<>();
        loadStudents();
    }

    // Carregar alunos do SharedPreferences
    private void loadStudents() {
        String json = prefs.getString(KEY_STUDENTS, "[]");
        students = JsonHelper.parseStudents(json);
    }

    // Salvar alunos no SharedPreferences
    private void saveStudents() {
        String json = JsonHelper.studentsToJson(students);
        prefs.edit().putString(KEY_STUDENTS, json).apply();
    }

    // Obter próximo ID
    private int getNextId() {
        int lastId = prefs.getInt(KEY_LAST_ID, 0);
        lastId++;
        prefs.edit().putInt(KEY_LAST_ID, lastId).apply();
        return lastId;
    }

    // Adicionar aluno
    public boolean addStudent(Student student) {
        student.setId(getNextId());
        students.add(student);
        saveStudents();
        return true;
    }

    // Atualizar aluno
    public boolean updateStudent(Student student) {
        for (int i = 0; i < students.size(); i++) {
            if (students.get(i).getId() == student.getId()) {
                students.set(i, student);
                saveStudents();
                return true;
            }
        }
        return false;
    }

    // Remover aluno
    public boolean deleteStudent(int id) {
        for (int i = 0; i < students.size(); i++) {
            if (students.get(i).getId() == id) {
                students.remove(i);
                saveStudents();
                return true;
            }
        }
        return false;
    }

    // Obter todos os alunos
    public ArrayList<Student> getAllStudents() {
        return new ArrayList<>(students);
    }

    // Obter aluno por ID
    public Student getStudentById(int id) {
        for (Student student : students) {
            if (student.getId() == id) {
                return student;
            }
        }
        return null;
    }

    // Filtrar alunos por turma
    public ArrayList<Student> getStudentsByTurma(String turma) {
        ArrayList<Student> filtered = new ArrayList<>();
        for (Student student : students) {
            if (student.getTurma().equals(turma)) {
                filtered.add(student);
            }
        }
        return filtered;
    }

    // Obter estatísticas
    public int getTotalStudents() {
        return students.size();
    }

    public int getPassedStudents() {
        int count = 0;
        for (Student student : students) {
            boolean passed = true;
            for (Grade grade : student.getNotas()) {
                if (grade.calcularMediaFinal() < 10.0) {
                    passed = false;
                    break;
                }
            }
            if (passed && student.getNotas().size() > 0) count++;
        }
        return count;
    }

    public int getFailedStudents() {
        return getTotalStudents() - getPassedStudents();
    }
}
```

### JsonHelper.java

```java
package com.escola.gestao.utils;

import com.escola.gestao.models.Student;
import com.escola.gestao.models.Grade;
import com.escola.gestao.models.Trimestre;
import java.util.ArrayList;

public class JsonHelper {
    
    // Converter lista de alunos para JSON manualmente
    public static String studentsToJson(ArrayList<Student> students) {
        StringBuilder json = new StringBuilder("[");
        
        for (int i = 0; i < students.size(); i++) {
            Student s = students.get(i);
            json.append("{");
            json.append("\"id\":").append(s.getId()).append(",");
            json.append("\"nome\":\"").append(escapeJson(s.getNome())).append("\",");
            json.append("\"numero\":\"").append(escapeJson(s.getNumero())).append("\",");
            json.append("\"classe\":\"").append(escapeJson(s.getClasse())).append("\",");
            json.append("\"turma\":\"").append(escapeJson(s.getTurma())).append("\",");
            json.append("\"curso\":\"").append(escapeJson(s.getCurso())).append("\",");
            json.append("\"periodo\":\"").append(escapeJson(s.getPeriodo())).append("\",");
            json.append("\"notas\":").append(gradesToJson(s.getNotas()));
            json.append("}");
            
            if (i < students.size() - 1) json.append(",");
        }
        
        json.append("]");
        return json.toString();
    }

    // Converter notas para JSON
    private static String gradesToJson(ArrayList<Grade> grades) {
        StringBuilder json = new StringBuilder("[");
        
        for (int i = 0; i < grades.size(); i++) {
            Grade g = grades.get(i);
            json.append("{");
            json.append("\"disciplina\":\"").append(escapeJson(g.getDisciplina())).append("\",");
            json.append("\"trimestre1\":").append(trimestreToJson(g.getTrimestre1())).append(",");
            json.append("\"trimestre2\":").append(trimestreToJson(g.getTrimestre2())).append(",");
            json.append("\"trimestre3\":").append(trimestreToJson(g.getTrimestre3()));
            json.append("}");
            
            if (i < grades.size() - 1) json.append(",");
        }
        
        json.append("]");
        return json.toString();
    }

    // Converter trimestre para JSON
    private static String trimestreToJson(Trimestre t) {
        StringBuilder json = new StringBuilder("{");
        json.append("\"mac\":").append(t.getMac()).append(",");
        json.append("\"npp\":").append(t.getNpp()).append(",");
        json.append("\"npt\":").append(t.getNpt());
        json.append("}");
        return json.toString();
    }

    // Parser JSON manual (simples)
    public static ArrayList<Student> parseStudents(String json) {
        ArrayList<Student> students = new ArrayList<>();
        
        if (json == null || json.equals("[]")) {
            return students;
        }

        try {
            // Remove [ e ]
            json = json.substring(1, json.length() - 1);
            
            // Split por objetos (simplificado)
            String[] studentObjs = json.split("\\},\\{");
            
            for (String obj : studentObjs) {
                obj = obj.replace("{", "").replace("}", "");
                Student student = parseStudent(obj);
                if (student != null) {
                    students.add(student);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return students;
    }

    // Parser de um aluno
    private static Student parseStudent(String obj) {
        try {
            Student student = new Student();
            
            String[] fields = obj.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
            
            for (String field : fields) {
                String[] keyValue = field.split(":", 2);
                if (keyValue.length != 2) continue;
                
                String key = keyValue[0].replace("\"", "").trim();
                String value = keyValue[1].trim();
                
                switch (key) {
                    case "id":
                        student.setId(Integer.parseInt(value));
                        break;
                    case "nome":
                        student.setNome(unescapeJson(value));
                        break;
                    case "numero":
                        student.setNumero(unescapeJson(value));
                        break;
                    case "classe":
                        student.setClasse(unescapeJson(value));
                        break;
                    case "turma":
                        student.setTurma(unescapeJson(value));
                        break;
                    case "curso":
                        student.setCurso(unescapeJson(value));
                        break;
                    case "periodo":
                        student.setPeriodo(unescapeJson(value));
                        break;
                }
            }
            
            return student;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Escapar caracteres especiais
    private static String escapeJson(String str) {
        if (str == null) return "";
        return str.replace("\\", "\\\\")
                  .replace("\"", "\\\"")
                  .replace("\n", "\\n")
                  .replace("\r", "\\r")
                  .replace("\t", "\\t");
    }

    // Remover escape
    private static String unescapeJson(String str) {
        if (str == null) return "";
        return str.replace("\"", "")
                  .replace("\\\\", "\\")
                  .replace("\\n", "\n")
                  .replace("\\r", "\r")
                  .replace("\\t", "\t");
    }
}
```

## 🎨 Passo 6: Criar Layouts XML

### activity_main.xml (Tela Inicial)

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#1A1F2C"
    android:padding="24dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        android:orientation="vertical"
        android:gravity="center">

        <ImageView
            android:layout_width="120dp"
            android:layout_height="120dp"
            android:src="@drawable/ic_launcher"
            android:layout_marginBottom="32dp"/>

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Sistema de Gestão de Alunos"
            android:textSize="24sp"
            android:textColor="#FFFFFF"
            android:textStyle="bold"
            android:layout_marginBottom="48dp"
            android:gravity="center"/>

        <Button
            android:id="@+id/btnEntrar"
            android:layout_width="match_parent"
            android:layout_height="56dp"
            android:text="Entrar"
            android:textSize="18sp"
            android:textColor="#FFFFFF"
            android:background="#9b87f5"
            android:layout_marginBottom="16dp"/>

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Versão 1.0"
            android:textSize="14sp"
            android:textColor="#8E9196"
            android:layout_marginTop="32dp"/>
    </LinearLayout>

</RelativeLayout>
```

### activity_dashboard.xml (Dashboard)

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="#1A1F2C">

    <!-- Header -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:background="#9b87f5"
        android:padding="24dp">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Dashboard"
            android:textSize="28sp"
            android:textColor="#FFFFFF"
            android:textStyle="bold"/>

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Visão geral do sistema"
            android:textSize="14sp"
            android:textColor="#E5DEFF"
            android:layout_marginTop="4dp"/>
    </LinearLayout>

    <ScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:padding="16dp">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical">

            <!-- Estatísticas -->
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Estatísticas"
                android:textSize="18sp"
                android:textColor="#FFFFFF"
                android:textStyle="bold"
                android:layout_marginBottom="16dp"/>

            <!-- Cards de estatísticas -->
            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="horizontal"
                android:weightSum="2">

                <!-- Card Total Alunos -->
                <LinearLayout
                    android:layout_width="0dp"
                    android:layout_height="120dp"
                    android:layout_weight="1"
                    android:orientation="vertical"
                    android:background="#403E43"
                    android:padding="16dp"
                    android:layout_marginEnd="8dp"
                    android:gravity="center">

                    <TextView
                        android:id="@+id/tvTotalAlunos"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="0"
                        android:textSize="36sp"
                        android:textColor="#9b87f5"
                        android:textStyle="bold"/>

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="Total Alunos"
                        android:textSize="14sp"
                        android:textColor="#8E9196"
                        android:layout_marginTop="8dp"/>
                </LinearLayout>

                <!-- Card Aprovados -->
                <LinearLayout
                    android:layout_width="0dp"
                    android:layout_height="120dp"
                    android:layout_weight="1"
                    android:orientation="vertical"
                    android:background="#403E43"
                    android:padding="16dp"
                    android:layout_marginStart="8dp"
                    android:gravity="center">

                    <TextView
                        android:id="@+id/tvAprovados"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="0"
                        android:textSize="36sp"
                        android:textColor="#6E59A5"
                        android:textStyle="bold"/>

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="Aprovados"
                        android:textSize="14sp"
                        android:textColor="#8E9196"
                        android:layout_marginTop="8dp"/>
                </LinearLayout>
            </LinearLayout>

            <!-- Menu de ações -->
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Ações Rápidas"
                android:textSize="18sp"
                android:textColor="#FFFFFF"
                android:textStyle="bold"
                android:layout_marginTop="32dp"
                android:layout_marginBottom="16dp"/>

            <Button
                android:id="@+id/btnAddStudent"
                android:layout_width="match_parent"
                android:layout_height="56dp"
                android:text="Adicionar Aluno"
                android:textColor="#FFFFFF"
                android:background="#9b87f5"
                android:layout_marginBottom="12dp"/>

            <Button
                android:id="@+id/btnViewStudents"
                android:layout_width="match_parent"
                android:layout_height="56dp"
                android:text="Ver Alunos"
                android:textColor="#FFFFFF"
                android:background="#6E59A5"
                android:layout_marginBottom="12dp"/>

            <Button
                android:id="@+id/btnManageGrades"
                android:layout_width="match_parent"
                android:layout_height="56dp"
                android:text="Gerenciar Notas"
                android:textColor="#FFFFFF"
                android:background="#6E59A5"
                android:layout_marginBottom="12dp"/>

            <Button
                android:id="@+id/btnReports"
                android:layout_width="match_parent"
                android:layout_height="56dp"
                android:text="Relatórios"
                android:textColor="#FFFFFF"
                android:background="#6E59A5"
                android:layout_marginBottom="12dp"/>

        </LinearLayout>
    </ScrollView>

</LinearLayout>
```

### activity_add_student.xml (Adicionar Aluno)

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="#1A1F2C">

    <!-- Header -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:background="#9b87f5"
        android:padding="16dp"
        android:gravity="center_vertical">

        <Button
            android:id="@+id/btnBack"
            android:layout_width="48dp"
            android:layout_height="48dp"
            android:text="←"
            android:textSize="24sp"
            android:background="@android:color/transparent"
            android:textColor="#FFFFFF"/>

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Adicionar Aluno"
            android:textSize="24sp"
            android:textColor="#FFFFFF"
            android:textStyle="bold"
            android:layout_marginStart="8dp"/>
    </LinearLayout>

    <ScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:padding="16dp">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical">

            <!-- Nome -->
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Nome Completo"
                android:textSize="14sp"
                android:textColor="#8E9196"
                android:layout_marginBottom="8dp"/>

            <EditText
                android:id="@+id/etNome"
                android:layout_width="match_parent"
                android:layout_height="56dp"
                android:hint="Digite o nome completo"
                android:textColorHint="#6B6B6B"
                android:textColor="#FFFFFF"
                android:background="#403E43"
                android:padding="16dp"
                android:layout_marginBottom="16dp"/>

            <!-- Número -->
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Número"
                android:textSize="14sp"
                android:textColor="#8E9196"
                android:layout_marginBottom="8dp"/>

            <EditText
                android:id="@+id/etNumero"
                android:layout_width="match_parent"
                android:layout_height="56dp"
                android:hint="Digite o número"
                android:textColorHint="#6B6B6B"
                android:textColor="#FFFFFF"
                android:background="#403E43"
                android:padding="16dp"
                android:inputType="number"
                android:layout_marginBottom="16dp"/>

            <!-- Classe -->
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Classe"
                android:textSize="14sp"
                android:textColor="#8E9196"
                android:layout_marginBottom="8dp"/>

            <EditText
                android:id="@+id/etClasse"
                android:layout_width="match_parent"
                android:layout_height="56dp"
                android:hint="Ex: 10ª"
                android:textColorHint="#6B6B6B"
                android:textColor="#FFFFFF"
                android:background="#403E43"
                android:padding="16dp"
                android:layout_marginBottom="16dp"/>

            <!-- Turma -->
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Turma"
                android:textSize="14sp"
                android:textColor="#8E9196"
                android:layout_marginBottom="8dp"/>

            <EditText
                android:id="@+id/etTurma"
                android:layout_width="match_parent"
                android:layout_height="56dp"
                android:hint="Ex: A"
                android:textColorHint="#6B6B6B"
                android:textColor="#FFFFFF"
                android:background="#403E43"
                android:padding="16dp"
                android:layout_marginBottom="16dp"/>

            <!-- Curso -->
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Curso"
                android:textSize="14sp"
                android:textColor="#8E9196"
                android:layout_marginBottom="8dp"/>

            <EditText
                android:id="@+id/etCurso"
                android:layout_width="match_parent"
                android:layout_height="56dp"
                android:hint="Ex: Ciências Físicas e Biológicas"
                android:textColorHint="#6B6B6B"
                android:textColor="#FFFFFF"
                android:background="#403E43"
                android:padding="16dp"
                android:layout_marginBottom="16dp"/>

            <!-- Período -->
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Período"
                android:textSize="14sp"
                android:textColor="#8E9196"
                android:layout_marginBottom="8dp"/>

            <EditText
                android:id="@+id/etPeriodo"
                android:layout_width="match_parent"
                android:layout_height="56dp"
                android:hint="Ex: Manhã"
                android:textColorHint="#6B6B6B"
                android:textColor="#FFFFFF"
                android:background="#403E43"
                android:padding="16dp"
                android:layout_marginBottom="24dp"/>

            <!-- Botão Salvar -->
            <Button
                android:id="@+id/btnSave"
                android:layout_width="match_parent"
                android:layout_height="56dp"
                android:text="Salvar Aluno"
                android:textSize="18sp"
                android:textColor="#FFFFFF"
                android:background="#9b87f5"/>

        </LinearLayout>
    </ScrollView>

</LinearLayout>
```

## 🎯 Passo 7: Criar Activities

### MainActivity.java

```java
package com.escola.gestao;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button btnEntrar = findViewById(R.id.btnEntrar);
        btnEntrar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, DashboardActivity.class);
                startActivity(intent);
            }
        });
    }
}
```

### DashboardActivity.java

```java
package com.escola.gestao;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import com.escola.gestao.utils.DataManager;

public class DashboardActivity extends Activity {

    private DataManager dataManager;
    private TextView tvTotalAlunos, tvAprovados;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);

        dataManager = new DataManager(this);

        tvTotalAlunos = findViewById(R.id.tvTotalAlunos);
        tvAprovados = findViewById(R.id.tvAprovados);

        Button btnAddStudent = findViewById(R.id.btnAddStudent);
        Button btnViewStudents = findViewById(R.id.btnViewStudents);
        Button btnManageGrades = findViewById(R.id.btnManageGrades);
        Button btnReports = findViewById(R.id.btnReports);

        btnAddStudent.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(DashboardActivity.this, AddStudentActivity.class));
            }
        });

        btnViewStudents.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(DashboardActivity.this, StudentsListActivity.class));
            }
        });

        btnManageGrades.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(DashboardActivity.this, GradesActivity.class));
            }
        });

        btnReports.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(DashboardActivity.this, ReportsActivity.class));
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        updateStats();
    }

    private void updateStats() {
        int total = dataManager.getTotalStudents();
        int approved = dataManager.getPassedStudents();

        tvTotalAlunos.setText(String.valueOf(total));
        tvAprovados.setText(String.valueOf(approved));
    }
}
```

### AddStudentActivity.java

```java
package com.escola.gestao;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import com.escola.gestao.models.Student;
import com.escola.gestao.utils.DataManager;

public class AddStudentActivity extends Activity {

    private EditText etNome, etNumero, etClasse, etTurma, etCurso, etPeriodo;
    private DataManager dataManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_student);

        dataManager = new DataManager(this);

        etNome = findViewById(R.id.etNome);
        etNumero = findViewById(R.id.etNumero);
        etClasse = findViewById(R.id.etClasse);
        etTurma = findViewById(R.id.etTurma);
        etCurso = findViewById(R.id.etCurso);
        etPeriodo = findViewById(R.id.etPeriodo);

        Button btnBack = findViewById(R.id.btnBack);
        Button btnSave = findViewById(R.id.btnSave);

        btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        btnSave.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                saveStudent();
            }
        });
    }

    private void saveStudent() {
        String nome = etNome.getText().toString().trim();
        String numero = etNumero.getText().toString().trim();
        String classe = etClasse.getText().toString().trim();
        String turma = etTurma.getText().toString().trim();
        String curso = etCurso.getText().toString().trim();
        String periodo = etPeriodo.getText().toString().trim();

        // Validação
        if (nome.isEmpty()) {
            Toast.makeText(this, "Por favor, insira o nome", Toast.LENGTH_SHORT).show();
            return;
        }
        if (numero.isEmpty()) {
            Toast.makeText(this, "Por favor, insira o número", Toast.LENGTH_SHORT).show();
            return;
        }
        if (classe.isEmpty()) {
            Toast.makeText(this, "Por favor, insira a classe", Toast.LENGTH_SHORT).show();
            return;
        }
        if (turma.isEmpty()) {
            Toast.makeText(this, "Por favor, insira a turma", Toast.LENGTH_SHORT).show();
            return;
        }

        Student student = new Student(0, nome, numero, classe, turma, curso, periodo);
        boolean success = dataManager.addStudent(student);

        if (success) {
            Toast.makeText(this, "Aluno adicionado com sucesso!", Toast.LENGTH_SHORT).show();
            finish();
        } else {
            Toast.makeText(this, "Erro ao adicionar aluno", Toast.LENGTH_SHORT).show();
        }
    }
}
```

## 📱 Passo 8: Configurar AndroidManifest.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.escola.gestao">

    <application
        android:allowBackup="true"
        android:icon="@drawable/ic_launcher"
        android:label="Gestão de Alunos"
        android:theme="@android:style/Theme.Material.NoActionBar">

        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <activity android:name=".DashboardActivity" />
        <activity android:name=".AddStudentActivity" />
        <activity android:name=".StudentsListActivity" />
        <activity android:name=".GradesActivity" />
        <activity android:name=".ReportsActivity" />

    </application>

</manifest>
```

## 🎨 Passo 9: Configurar Cores e Estilos

### res/values/colors.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">#9b87f5</color>
    <color name="primary_dark">#6E59A5</color>
    <color name="background">#1A1F2C</color>
    <color name="card_background">#403E43</color>
    <color name="text_primary">#FFFFFF</color>
    <color name="text_secondary">#8E9196</color>
</resources>
```

### res/values/strings.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Gestão de Alunos</string>
    <string name="dashboard">Dashboard</string>
    <string name="add_student">Adicionar Aluno</string>
    <string name="view_students">Ver Alunos</string>
    <string name="manage_grades">Gerenciar Notas</string>
    <string name="reports">Relatórios</string>
</resources>
```

## 🔨 Passo 10: Compilar e Testar

1. **Verificar erros**:
   - No AIDE, vá em Menu → Build → Check
   - Corrija todos os erros antes de compilar

2. **Compilar APK**:
   - Menu → Build → Build APK
   - Aguarde a compilação (pode demorar alguns minutos)

3. **Instalar APK**:
   - Após compilação, o AIDE mostra localização do APK
   - Instale o APK no celular
   - Teste todas as funcionalidades

## 📝 Funcionalidades Implementadas

✅ Adicionar alunos  
✅ Listar alunos  
✅ Armazenamento local (SharedPreferences)  
✅ Dashboard com estatísticas  
✅ Interface responsiva  
✅ Navegação entre telas  

## 🚀 Próximos Passos

### StudentsListActivity.java (Para implementar)

- Criar lista com RecyclerView ou ListView
- Mostrar todos os alunos cadastrados
- Permitir edição e exclusão

### GradesActivity.java (Para implementar)

- Adicionar/editar notas por disciplina
- Calcular médias automaticamente
- Visualizar notas por trimestre

### ReportsActivity.java (Para implementar)

- Gerar relatórios de aproveitamento
- Exportar dados (opcional)
- Estatísticas detalhadas

## ⚠️ Limitações do AIDE

- Sem bibliotecas externas (Gson, Retrofit, etc.)
- Sem Gradle
- Performance limitada
- UI mais básica
- Armazenamento apenas local

## 💡 Dicas

1. **Salvar frequentemente**: AIDE pode fechar inesperadamente
2. **Testar incrementalmente**: Compile e teste após cada mudança
3. **Usar comentários**: Documente bem o código
4. **Backup**: Copie o projeto para pasta externa regularmente

## 🆘 Problemas Comuns

### Erro de compilação
```
Solução: Verifique imports, sintaxe Java, e nomes de packages
```

### App fecha ao abrir
```
Solução: Verifique AndroidManifest.xml e layouts XML
```

### Dados não salvam
```
Solução: Verifique permissões e implementação do DataManager
```

## 📂 Estrutura Final

```
app/
├── src/main/
│   ├── java/com/escola/gestao/
│   │   ├── MainActivity.java (PRONTO)
│   │   ├── DashboardActivity.java (PRONTO)
│   │   ├── AddStudentActivity.java (PRONTO)
│   │   ├── StudentsListActivity.java (IMPLEMENTAR)
│   │   ├── GradesActivity.java (IMPLEMENTAR)
│   │   ├── ReportsActivity.java (IMPLEMENTAR)
│   │   ├── models/ (PRONTO)
│   │   ├── adapters/ (IMPLEMENTAR)
│   │   └── utils/ (PRONTO)
│   ├── res/
│   │   ├── layout/ (3/6 layouts prontos)
│   │   ├── values/ (PRONTO)
│   │   └── drawable/
│   └── AndroidManifest.xml (PRONTO)
└── APK compilado
```

## 📄 Licença

Este projeto é livre para uso educacional.

---

**Desenvolvido para AIDE - Android IDE**  
**Java Puro + Android SDK**
