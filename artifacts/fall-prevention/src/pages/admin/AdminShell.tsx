import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, BookOpen, Users } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/courses", label: "Courses", icon: BookOpen, exact: false },
  { href: "/admin/members", label: "Members", icon: Users, exact: false },
];

function isActive(currentPath: string, href: string, exact: boolean): boolean {
  if (exact) return currentPath === href;
  return currentPath === href || currentPath.startsWith(href + "/");
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex-1 bg-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-60 shrink-0">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Demo Admin
              </p>
              <h2 className="font-serif text-xl font-bold">Open access</h2>
            </div>
            <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible -mx-2 px-2">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = isActive(location, item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold whitespace-nowrap transition-colors min-h-[48px] ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground/80 hover:bg-card hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
