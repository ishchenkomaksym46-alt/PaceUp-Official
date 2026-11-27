import RacesPage from "@/app/(public)/home/races/RacesPage";
import CheckAuthStatus from "@/components/CheckAuthStatus";

export default function Races() {
    return (
        <div>
            <CheckAuthStatus />
            <h1 className="paceup-dashboard">PACEUP DASHBOARD</h1>
            <p className="workouts-description">
                Review your competitions and track progress!
            </p>

            <RacesPage />
        </div>
    )
}