'use client';

import { Home, List, Cookie, BringToFront, Menu } from 'lucide-react';
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
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

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

// Mobile Header Component
function MobileHeader() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  // Don't show on home page
  if (pathname === '/') return null;

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
        <h1 className="text-lg font-semibold">Weaver Plate</h1>
      </div>
    </div>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (url: string) => pathname === url;

  if (pathname === '/') return null;

  return (
    <>
      {/* Mobile Header */}
      <MobileHeader />

      {/* Sidebar */}
      <Sidebar>
        <SidebarContent className="bg-[#0a1728] text-white relative">
          <SidebarGroup>
            <SidebarGroupLabel className="font-bold text-xl my-4 flex items-center text-white">
              <Link href="/" className="w-full">
                <Image
                  src="/logo.png"
                  alt="Weaver Plate"
                  className="w-1/2 mx-auto"
                  width={100}
                  height={100}
                />
              </Link>
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-5">
              <SidebarMenu>
                {items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link href={item.url} className="my-2">
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
    </>
  );
}
