import { Home, Users, FileText, GraduationCap, UserPlus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { id: "/", label: "Dashboard", icon: Home },
  { id: "/students", label: "Gestão de Alunos", icon: Users },
  { id: "/add-student", label: "Cadastrar Aluno", icon: UserPlus },
  { id: "/grades", label: "Notas", icon: FileText },
  { id: "/reports", label: "Relatórios", icon: GraduationCap },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <h1 className="font-bold text-lg text-foreground truncate">
              Escola Nova Geração
            </h1>
            <p className="text-sm text-muted-foreground truncate">
              Sistema de Gestão
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={isCollapsed ? item.label : undefined}
                      onClick={() => navigate(item.id)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Logo wrapper */}
      <div className="flex items-center justify-center p-4">
        <img 
          src="/logo-escolar/wrapper.png" 
          alt="Logo Escola" 
          className="w-full max-w-[200px] h-auto object-contain select-none pointer-events-none group-data-[collapsible=icon]:hidden"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>

      {/* Footer */}
      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="text-xs text-muted-foreground">Sistema Offline</p>
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()}
              </p>
            </div>
            <div className="hidden group-data-[collapsible=icon]:block">
              <div className="w-2 h-2 bg-success rounded-full mx-auto" title="Sistema Online" />
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}