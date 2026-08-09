import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />
      <div className="flex-1 md:pl-64 flex flex-col pt-16 md:pt-0 min-h-screen max-w-full overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
