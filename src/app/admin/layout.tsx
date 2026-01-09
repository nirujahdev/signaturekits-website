"use client";

import { SidebarProvider } from "@/context/admin/SidebarContext";
import { ThemeProvider } from "@/context/admin/ThemeContext";
import { AdminAuthGuard } from "@/components/admin/auth/AdminAuthGuard";
import AppHeader from "@/components/admin/layout/AppHeader";
import AppSidebar from "@/components/admin/layout/AppSidebar";
import Backdrop from "@/components/admin/layout/Backdrop";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <AdminAuthGuard>
          <div className="min-h-screen xl:flex">
            <AppSidebar />
            <Backdrop />
            <div className="flex-1 transition-all duration-300 ease-in-out lg:ml-[90px]">
              <AppHeader />
              <div className="p-4 mx-auto max-w-screen-2xl md:p-6">{children}</div>
            </div>
          </div>
        </AdminAuthGuard>
      </SidebarProvider>
    </ThemeProvider>
  );
}

