export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex"><aside className="w-64 bg-slate-900 text-white min-h-screen p-4">Sidebar</aside><main className="flex-1 p-8">{children}</main></div>;
}
