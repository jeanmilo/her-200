import Sidebar from "./_components/Sidebar";
import RightRail from "./_components/RightRail";
import { SessionProvider } from "./_components/session";
import PairUp from "./_components/PairUp";
import Search from "./_components/Search";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-surface px-8 py-4">
          <Search />
          <PairUp />
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-8 py-12">{children}</main>
      </div>
      <RightRail />
    </div>
    </SessionProvider>
  );
}
