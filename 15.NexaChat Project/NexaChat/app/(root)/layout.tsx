import { requireAuth } from "@/modules/auth/actions";
import ChatSidebar from "@/modules/chat/components/chat-sidebar";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import Header from "@/components/header";
import React from "react";

// Client component to handle layout state
function LayoutContent({ children, user }: { children: React.ReactNode; user: any }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar user={user} />
      <main className="flex-1 overflow-hidden flex flex-col min-w-0 transition-all duration-200">
        <Header />
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await requireAuth();

  return (
    <SidebarProvider>
      <LayoutContent user={session?.user}>
        {children}
      </LayoutContent>
    </SidebarProvider>
  );
};

export default Layout;
