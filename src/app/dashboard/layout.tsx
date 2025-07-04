import type React from "react"
import { cookies } from "next/headers"
import { SidebarProvider } from "../../components/ui/sidebar"
import { AppSidebar } from "../../components/app-sidebar"
import Header from "../../components/ui/header"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-auto">
            <main className="container mx-auto p-4 max-w-full">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
