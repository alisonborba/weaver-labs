'use client';

import { Home, List, Cookie, BringToFront } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Recipes List',
    url: '/recipes',
    icon: BringToFront,
  },
  {
    title: 'Ingredients List',
    url: '/ingredients',
    icon: List,
  },
  {
    title: 'New Recipe',
    url: '/new-recipe',
    icon: Cookie,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (url: string) => pathname === url;

  if (pathname === '/') return null;

  return (
    <Sidebar>
      <SidebarContent className="bg-[#0a1728] text-white relative">
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-xl my-4 flex items-center text-white">
            Weaver Plate
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`my-2 ${isActive(item.url) ? 'underline font-semibold' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon size={22} />
                        <h2 className="text-lg">{item.title}</h2>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
