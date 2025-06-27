
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpenText, UploadCloud, ListChecks, FilePlus2, Wand2, HelpCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/study', label: 'Study Session', icon: BookOpenText },
  { href: '/upload', label: 'Upload MCQs', icon: UploadCloud },
  { href: '/manage-questions', label: 'Manage Questions', icon: ListChecks },
  { href: '/create-mcqs', label: 'Create MCQs', icon: FilePlus2 },
  { href: '/generate-from-pdf', label: 'Generate with AI', icon: Wand2 },
  { href: '/tutorial', label: 'Tutoriel', icon: HelpCircle },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            className={cn(
              "justify-start w-full",
              pathname === item.href ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            tooltip={{ children: item.label, side: 'right', align: 'center' }}
          >
            <Link href={item.href}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
