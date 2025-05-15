
import type { ReactNode } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';
import { SidebarNav } from './SidebarNav';
import { Logo } from '@/components/icons/Logo';
import { Header }
from './Header'; // Assuming Header is created in the same directory or imported correctly
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

export function AppLayout({ children, pageTitle }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon" side="left">
        <SidebarRail />
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-sidebar-primary" />
            <span className="text-xl font-semibold text-sidebar-foreground">SmartStudy</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        {/* SidebarFooter can be added here if needed */}
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <Header title={pageTitle} />
        <main className={cn(
          "flex-1 overflow-y-auto p-4 md:p-6 lg:p-8",
          "animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out"
        )}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
