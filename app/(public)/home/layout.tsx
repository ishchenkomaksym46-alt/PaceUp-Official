import {Suspense} from "react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function HomeLayout({
                                       children,
                                       }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="dashboard-layout">
            <Suspense fallback={<aside className="dashboard-sidebar" />}>
                <DashboardSidebar />
            </Suspense>

            <main className="dashboard-main">
                {children}
            </main>
        </div>
    );
}