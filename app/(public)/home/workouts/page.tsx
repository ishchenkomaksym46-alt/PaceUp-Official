import WorkoutsPage from "@/app/(public)/home/workouts/WorkoutsPage";

export default function Workouts() {
    return (
        <div>
            <h1 className="paceup-dashboard">PACEUP DASHBOARD</h1>
            <p className="workouts-description">
                Review your workouts and track progress!
            </p>

            <WorkoutsPage />
        </div>
    )
}