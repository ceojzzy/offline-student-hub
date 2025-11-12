# Guia Completo: Compilar APK Nativo via Termux

Este guia mostra como compilar o sistema de gestão de alunos como APK nativo usando apenas o celular Android com Termux.

## 📋 Pré-requisitos

- Celular Android (versão 7.0 ou superior)
- Pelo menos 4GB de espaço livre
- Conexão com internet estável
- Paciência (processo pode demorar)

## 🔧 Passo 1: Instalar Termux

1. Baixe o Termux do F-Droid (NÃO da Play Store):
   - Site: https://f-droid.org/packages/com.termux/
   - Ou baixe direto: https://f-droid.org/repo/com.termux_118.apk

2. Instale o APK e abra o Termux

## 📦 Passo 2: Configurar Termux

```bash
# Atualizar pacotes do Termux
pkg update && pkg upgrade -y

# Instalar ferramentas essenciais
pkg install -y git nodejs python build-essential

# Verificar instalações
node --version
npm --version
git --version
```

## 🔐 Passo 3: Configurar Armazenamento

```bash
# Permitir acesso ao armazenamento do celular
termux-setup-storage

# Criar pasta de trabalho
cd ~/storage/shared
mkdir projetos
cd projetos
```

## 📥 Passo 4: Clonar o Projeto

```bash
# Clonar do GitHub (se já estiver lá)
git clone https://github.com/SEU-USUARIO/offline-student-hub.git
cd offline-student-hub

# OU criar do zero:
mkdir offline-student-hub
cd offline-student-hub
npm init -y
```

## 🏗️ Passo 5: Estrutura do Projeto

Se estiver criando do zero, crie esta estrutura:

```
offline-student-hub/
├── public/
│   ├── logo-escolar/
│   │   ├── logo100.png
│   │   └── wrapper.png
│   └── ra.webp
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── StatsCards.tsx
│   │   ├── forms/
│   │   │   ├── ComboboxField.tsx
│   │   │   └── StudentForm.tsx
│   │   ├── layout/
│   │   │   └── Sidebar.tsx
│   │   ├── students/
│   │   │   ├── ClassGroup.tsx
│   │   │   ├── GradeEditDialog.tsx
│   │   │   └── StudentCard.tsx
│   │   └── ui/
│   │       └── (componentes shadcn)
│   ├── contexts/
│   │   └── StudentsContext.tsx
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── pages/
│   │   ├── AddStudentPage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── GradesPage.tsx
│   │   ├── Index.tsx
│   │   ├── NotFound.tsx
│   │   ├── ReportsPage.tsx
│   │   └── StudentsPage.tsx
│   ├── types/
│   │   └── student.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── capacitor.config.ts
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 📦 Passo 6: Instalar Dependências

```bash
# Instalar todas as dependências do projeto
npm install

# Dependências principais
npm install react react-dom react-router-dom
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-accordion
npm install @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-label
npm install @radix-ui/react-popover @radix-ui/react-scroll-area @radix-ui/react-separator
npm install @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-toast
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install react-hook-form @hookform/resolvers zod
npm install date-fns cmdk sonner

# Dependências de desenvolvimento
npm install -D @types/react @types/react-dom @types/node
npm install -D @vitejs/plugin-react typescript
npm install -D tailwindcss postcss autoprefixer tailwindcss-animate
npm install -D vite
```

## 📱 Passo 7: Instalar Capacitor

```bash
# Instalar Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npm install @capacitor/ios

# Inicializar Capacitor
npx cap init
```

Quando solicitado:
- **App name**: Offline Student Hub
- **App ID**: app.lovable.ab90a6131af14a86adacbb4bd79322a6
- **Web directory**: dist

## ⚙️ Passo 8: Configurar Capacitor

Crie/edite `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ab90a6131af14a86adacbb4bd79322a6',
  appName: 'offline-student-hub',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
```

## 🔨 Passo 9: Instalar Android Studio (Termux)

```bash
# Instalar Java Development Kit
pkg install openjdk-17

# Instalar Gradle
pkg install gradle

# Adicionar Android platform
npx cap add android
```

## 🏗️ Passo 10: Compilar o Projeto

```bash
# Compilar o projeto web
npm run build

# Sincronizar com Capacitor
npx cap sync android

# Copiar assets
npx cap copy android
```

## 📱 Passo 11: Compilar APK

```bash
# Navegar para pasta Android
cd android

# Compilar APK de debug
./gradlew assembleDebug

# APK estará em:
# android/app/build/outputs/apk/debug/app-debug.apk
```

## 📦 Passo 12: Instalar o APK

```bash
# Copiar APK para pasta de downloads
cp app/build/outputs/apk/debug/app-debug.apk ~/storage/shared/Download/

# Instalar através do gerenciador de arquivos do celular
# Navegue até Downloads e instale o APK
```

## 🔄 Para Atualizar o App

```bash
# 1. Fazer mudanças no código
# 2. Recompilar
npm run build
npx cap sync android

# 3. Gerar novo APK
cd android
./gradlew assembleDebug
```

## ⚠️ Problemas Comuns

### Erro de memória
```bash
# Aumentar heap do Gradle
export GRADLE_OPTS="-Xmx1024m"
```

### Erro de permissões
```bash
chmod +x android/gradlew
```

### Erro de SDK Android
```bash
# Instalar SDK manualmente via pkg
pkg install android-tools
```

## 📂 Caminhos Importantes

- **Código fonte**: `~/storage/shared/projetos/offline-student-hub/src/`
- **Build web**: `~/storage/shared/projetos/offline-student-hub/dist/`
- **Projeto Android**: `~/storage/shared/projetos/offline-student-hub/android/`
- **APK compilado**: `~/storage/shared/projetos/offline-student-hub/android/app/build/outputs/apk/debug/app-debug.apk`

## 🎯 Comandos Rápidos

```bash
# Build completo
npm run build && npx cap sync android && cd android && ./gradlew assembleDebug && cd ..

# Copiar APK para Downloads
cp android/app/build/outputs/apk/debug/app-debug.apk ~/storage/shared/Download/student-hub.apk
```

## 📝 Notas Importantes

1. **Tempo de compilação**: Pode levar 30-60 minutos na primeira vez
2. **Espaço**: Precisa de ~4GB livres
3. **Bateria**: Mantenha o celular carregando durante compilação
4. **Termux**: Não feche o app durante o processo
5. **Internet**: Primeira compilação baixa muitas dependências

## 🆘 Suporte

- Documentação Capacitor: https://capacitorjs.com/docs
- Documentação Termux: https://wiki.termux.com
- Issues do projeto: [seu-repositorio]/issues

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ via Lovable & Termux**
