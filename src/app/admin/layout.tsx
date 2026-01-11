"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/context/admin/SidebarContext";
import { ThemeProvider } from "@/context/admin/ThemeContext";
import { AdminAuthGuard } from "@/components/admin/auth/AdminAuthGuard";
import { ErrorBoundary } from "@/components/admin/ErrorBoundary";
import { NotificationProvider } from "@/components/admin/NotificationToast";
import AppHeader from "@/components/admin/layout/AppHeader";
import AppSidebar from "@/components/admin/layout/AppSidebar";
import Backdrop from "@/components/admin/layout/Backdrop";
import React from "react";

// #region agent log
fetch('http://127.0.0.1:7242/ingest/6acb7073-f940-4321-8607-c58da75d05e3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin/layout.tsx:imports',message:'Component imports check',data:{SidebarProvider:typeof SidebarProvider,ThemeProvider:typeof ThemeProvider,AdminAuthGuard:typeof AdminAuthGuard,ErrorBoundary:typeof ErrorBoundary,NotificationProvider:typeof NotificationProvider,AppHeader:typeof AppHeader,AppSidebar:typeof AppSidebar,Backdrop:typeof Backdrop},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
// #endregion

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSignInPage = pathname === '/admin/signin';

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/6acb7073-f940-4321-8607-c58da75d05e3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin/layout.tsx:render',message:'AdminLayout render start',data:{pathname,isSignInPage,childrenType:typeof children},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion

  // Don't wrap signin page with admin layout components
  if (isSignInPage) {
    return <>{children}</>;
  }

  // #region agent log
  const componentChecks = {
    ThemeProvider: typeof ThemeProvider,
    SidebarProvider: typeof SidebarProvider,
    AdminAuthGuard: typeof AdminAuthGuard,
    ErrorBoundary: typeof ErrorBoundary,
    NotificationProvider: typeof NotificationProvider,
    AppSidebar: typeof AppSidebar,
    Backdrop: typeof Backdrop,
    AppHeader: typeof AppHeader,
  };
  fetch('http://127.0.0.1:7242/ingest/6acb7073-f940-4321-8607-c58da75d05e3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin/layout.tsx:before-render',message:'Component types before render',data:componentChecks,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  return (
    <ThemeProvider>
      <SidebarProvider>
        <AdminAuthGuard>
          <ErrorBoundary>
            <NotificationProvider>
              <div className="min-h-screen xl:flex bg-gray-50 dark:bg-gray-900">
                <AppSidebar />
                <Backdrop />
                <div className="flex-1 transition-all duration-300 ease-in-out lg:ml-[90px]">
                  <AppHeader />
                  <div className="p-4 mx-auto max-w-screen-2xl md:p-6 lg:p-8">{children}</div>
                </div>
              </div>
            </NotificationProvider>
          </ErrorBoundary>
        </AdminAuthGuard>
      </SidebarProvider>
    </ThemeProvider>
  );
}

