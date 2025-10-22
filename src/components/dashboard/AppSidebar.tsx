import { useState } from "react";
import { 
  LayoutDashboard, 
  Upload, 
  FolderOpen, 
  MessageSquare, 
  FileSignature, 
  BarChart3, 
  Settings, 
  CreditCard, 
  Trash2, 
  Crown,
  FileText,
  Target,
  TrendingUp,
  Brain,
  Users,
  Building,
  Shield,
  Key
} from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const mainNavItems = [
  { 
    title: "Dashboard", 
    tab: "overview",
    icon: LayoutDashboard,
    badge: null
  },
  { 
    title: "Upload Documents", 
    tab: "upload",
    icon: Upload,
    badge: "NEW"
  },
  { 
    title: "Document Gallery", 
    tab: "documents",
    icon: FolderOpen,
    badge: null
  },
  { 
    title: "AI Law Genius", 
    tab: "chat",
    icon: Brain,
    badge: "SMART"
  },
  { 
    title: "E-Signatures", 
    tab: "esignatures",
    icon: FileSignature,
    badge: "PRO"
  },
  { 
    title: "Analytics & Insights", 
    tab: "insights",
    icon: BarChart3,
    badge: null
  },
];

const accountItems = [
  { 
    title: "Account Settings", 
    url: "/profile", 
    icon: Settings,
    badge: null
  },
  { 
    title: "Subscriptions", 
    url: "/pricing", 
    icon: CreditCard,
    badge: null
  },
  { 
    title: "Trash", 
    url: "/profile?tab=trash", 
    icon: Trash2,
    badge: null
  },
];

const enterpriseItems = [
  { 
    title: "Team Management", 
    tab: "team",
    icon: Users,
    badge: null
  },
  { 
    title: "Organization", 
    tab: "organization",
    icon: Building,
    badge: null
  },
  { 
    title: "Security", 
    tab: "security",
    icon: Shield,
    badge: null
  },
  { 
    title: "API Access", 
    tab: "api",
    icon: Key,
    badge: "Included"
  },
];

const upgradeItems = [
  { 
    title: "Upgrade to Pro", 
    url: "/pricing", 
    icon: Crown,
    badge: "PRO"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const handleTabChange = (tab: string) => {
    navigate(`/dashboard?tab=${tab}`, { replace: true });
  };

  const isActive = (tab: string) => {
    return activeTab === tab;
  };

  const getNavClassName = (tab: string) => {
    const active = isActive(tab);
    return `
      flex items-center ${collapsed ? "justify-center px-2" : "gap-3 px-3"} py-2.5 rounded-lg transition-all duration-200 cursor-pointer w-full
      ${active 
        ? "bg-primary text-primary-foreground shadow-sm" 
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }
    `;
  };

  return (
    <Sidebar
      className={`transition-all duration-300 border-r ${collapsed ? "w-14" : "w-[278px]"} flex flex-shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}
      collapsible="icon"
    >
      {/* Logo Section */}
      <SidebarHeader className="border-b px-3 py-4">
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="relative flex-shrink-0">
            <img 
              alt="LegalDeep AI" 
              className={`object-contain rounded-lg transition-all duration-200 ${collapsed ? "h-6 w-6" : "h-8 w-8"}`}
              src="/lovable-uploads/dd1d70eb-890d-405e-af4a-dab180dc4bf5.png" 
            />
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent truncate">
              LegalDeep AI
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className={`flex flex-col gap-4 ${collapsed ? "p-2" : "p-4"} overflow-y-auto`}>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                     <div 
                      onClick={() => handleTabChange(item.tab)} 
                      className={getNavClassName(item.tab)}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className={`flex-shrink-0 ${collapsed ? "h-5 w-5" : "h-4 w-4"}`} />
                      {!collapsed && (
                        <div className="flex items-center justify-between w-full min-w-0">
                          <span className="text-sm font-medium truncate">{item.title}</span>
                          {item.badge && (
                            <Badge 
                              variant={item.badge === "NEW" ? "default" : "secondary"} 
                              className="text-xs px-1.5 py-0.5 flex-shrink-0"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Enterprise Section */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Enterprise
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {enterpriseItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                     <div 
                      onClick={() => handleTabChange(item.tab)} 
                      className={getNavClassName(item.tab)}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className={`flex-shrink-0 ${collapsed ? "h-5 w-5" : "h-4 w-4"}`} />
                      {!collapsed && (
                        <div className="flex items-center justify-between w-full min-w-0">
                          <span className="text-sm font-medium truncate">{item.title}</span>
                          {item.badge && (
                            <Badge 
                              variant="outline" 
                              className="text-xs px-1.5 py-0.5 text-muted-foreground flex-shrink-0"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Section */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                     <div 
                      onClick={() => navigate(item.url)}
                      className={`flex items-center ${collapsed ? "justify-center px-2" : "gap-3 px-3"} py-2.5 rounded-lg transition-all duration-200 cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground w-full`}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className={`flex-shrink-0 ${collapsed ? "h-5 w-5" : "h-4 w-4"}`} />
                      {!collapsed && (
                        <span className="text-sm font-medium truncate">{item.title}</span>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Upgrade Section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {upgradeItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                     <Button
                      onClick={() => navigate(item.url)}
                      className={`
                        w-full ${collapsed ? "justify-center px-2" : "justify-start gap-3 px-3"} bg-gradient-to-r from-amber-500 to-orange-500 
                        hover:from-amber-600 hover:to-orange-600 text-white border-0 py-2.5
                      `}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className={`flex-shrink-0 ${collapsed ? "h-5 w-5" : "h-4 w-4"}`} />
                      {!collapsed && (
                        <div className="flex items-center justify-between w-full min-w-0">
                          <span className="text-sm font-medium truncate">{item.title}</span>
                          <Badge variant="secondary" className="bg-white text-orange-600 text-xs flex-shrink-0">
                            {item.badge}
                          </Badge>
                        </div>
                      )}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Toggle for Desktop */}
      <SidebarFooter className="border-t p-2">
        <SidebarTrigger className="w-full justify-center" />
      </SidebarFooter>
    </Sidebar>
  );
}