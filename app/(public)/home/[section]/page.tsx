import {Suspense} from "react";

const sectionTitles: Record<string, string> = {
    workouts: "Workouts",
    progress: "Progress",
    races: "Competitions",
    monitoring: "Monitoring (Premium)",
    settings: "Settings",
};

async function DashboardSection({
    params,
}: {
    params: Promise<{ section: string }>;
}) {
    const { section } = await params;
    const title = sectionTitles[section] ?? "Dashboard";

    return (
        <div>
            <p className="section-kicker">PACEUP DASHBOARD</p>
            <h1 className="dashboard-section-title">{title}</h1>
            <p className="dashboard-section-description">
                This section is ready for your {title.toLowerCase()} features.
            </p>
        </div>
    );
}

export default function DashboardSectionPage({
    params,
}: {
    params: Promise<{ section: string }>;
}) {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <DashboardSection params={params} />
        </Suspense>
    );
}
