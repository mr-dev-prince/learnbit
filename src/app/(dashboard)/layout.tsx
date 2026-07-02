import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <Sidebar />
      <div
        className="flex-1 ml-20 md:ml-0 flex flex-col min-h-screen"
        style={{ backgroundColor: '#0a0a0a' }}
      >
        <Header />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
