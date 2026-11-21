'use client'

import Link from "next/link";
import {usePathname} from "next/navigation";

const navigation = [
    { label: "Overview", href: "/home" },
    { label: "Workouts", href: "/home/workouts" },
    { label: "Progress", href: "/home/progress" },
    { label: "Competitions", href: "/home/races" },
    { label: "Settings", href: "/home/settings" },
];

export default function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <aside className="dashboard-sidebar">
            <nav aria-label="Dashboard navigation">
                {navigation.map((item) => {
                    const isActive = item.href === "/home"
                        ? pathname === "/home"
                        : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link${isActive ? " active" : ""}`}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
