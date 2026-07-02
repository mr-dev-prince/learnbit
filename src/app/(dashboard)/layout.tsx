import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col bg-background md:ml-0">
        <Header />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
