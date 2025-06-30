"use client";

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { StreakDisplay } from '@/components/gamification/StreakDisplay';
import { LevelDisplay } from '@/components/gamification/LevelDisplay';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { preselectedAvatars, defaultAvatar } from '@/lib/avatars';

interface HeaderProps {
  title: string;
}

const LOCAL_STORAGE_AVATAR_KEY = 'smartStudyProUserAvatar';
const LOCAL_STORAGE_USERNAME_KEY = 'smartStudyProUsername';

export function Header({ title }: HeaderProps) {
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatar.url);
  const [username, setUsername] = useState('Smart Student');

  useEffect(() => {
    const handleStorageChange = () => {
      const storedAvatarUrl = localStorage.getItem(LOCAL_STORAGE_AVATAR_KEY);
      setAvatarUrl(storedAvatarUrl || defaultAvatar.url);

      const storedUsername = localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);
      setUsername(storedUsername || 'Smart Student');
    };

    handleStorageChange(); // Initial load

    window.addEventListener('avatarChange', handleStorageChange);
    window.addEventListener('usernameChange', handleStorageChange);

    return () => {
      window.removeEventListener('avatarChange', handleStorageChange);
      window.removeEventListener('usernameChange', handleStorageChange);
    };
  }, []);

  const currentAvatarHint = preselectedAvatars.find(a => a.url === avatarUrl)?.hint || defaultAvatar.hint;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 py-2 backdrop-blur md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <LevelDisplay />
        <StreakDisplay />
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage src={avatarUrl} alt="User Avatar" data-ai-hint={currentAvatarHint} />
              <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
