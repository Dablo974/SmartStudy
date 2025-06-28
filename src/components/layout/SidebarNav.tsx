
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpenText, UploadCloud, ListChecks, FilePlus2, Wand2, HelpCircle, ClipboardCheck } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/study', label: 'Study Session', icon: BookOpenText },
  { href: '/manage-questions', label: 'Manage Questions', icon: ListChecks },
  { href: '/exam-mode', label: 'Mode Examen', icon: ClipboardCheck },
  {
    "group": "Creation",
    "items": [
      { href: '/upload', label: 'Upload MCQs', icon: UploadCloud },
      { href: '/create-mcqs', label: 'Create MCQs', icon: FilePlus2 },
      { href: '/generate-from-pdf', label: 'Generate with AI', icon: Wand2 },
    ]
  },
  { href: '/tutorial', label: 'Tutoriel', icon: HelpCircle },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item, index) => {
        if ("group" in item) {
          return (
            <div key={item.group} className="px-2 pt-2">
                <p className="text-xs font-semibold text-sidebar-foreground/70">{item.group}</p>
                 <div className="pt-2">
                    {item.items.map(subItem => (
                        <SidebarMenuItem key={subItem.href}>
                             <SidebarMenuButton
                                asChild
                                isActive={pathname === subItem.href}
                                className={cn(
                                "justify-start w-full",
                                pathname === subItem.href ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )}
                                tooltip={{ children: subItem.label, side: 'right', align: 'center' }}
                            >
                                <Link href={subItem.href}>
                                    <subItem.icon className="h-5 w-5" />
                                    <span>{subItem.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                 </div>
            </div>
          )
        }
        return (
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
        )
       })}
    </SidebarMenu>
  );
}
