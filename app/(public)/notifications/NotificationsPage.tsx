'use client'

import CheckAuthStatus from "@/components/CheckAuthStatus";
import {useEffect, useState} from "react";
import {NotificationType} from "@/app/(public)/notifications/(types)/types";
import {api} from "@/lib/api";
import AxiosXHR = Axios.AxiosXHR;

const TRAINING_REMINDER_TITLE =
    "Hey! It's Seems Like You Have Training Today!";

function showFirstTrainingReminderPerDay(items: NotificationType[]) {
    const seenDays = new Set<string>();

    return [...items]
        .sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
        )
        .filter((item) => {
            if (item.title !== TRAINING_REMINDER_TITLE) return true;

            const date = new Date(item.createdAt);
            const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

            if (seenDays.has(dayKey)) return false;

            seenDays.add(dayKey);
            return true;
        })
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );
}

export default function NotificationsPage() {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<NotificationType[]>([]);

    useEffect(() => {
        const getNotifications = async () => {
            setError('');
            setLoading(true);

            try {
                const response: AxiosXHR<any> = await api.get('/notifications/get', { withCredentials: true });

                if(!response || response.status !== 200) {
                    return setError(`Error occurred while fetching notifications: ${response.data}`);
                } else {
                    setNotifications(showFirstTrainingReminderPerDay(response.data.data));
                }
            } catch (e) {
                setError(`Error occurred while getting notifications: ${e instanceof Error ? e.message : 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        }

        getNotifications();
    }, [])

    return (
        <div>
            <CheckAuthStatus />
            <h1>Notifications: </h1>

            <div className={"notifications"}>
                {notifications.map((el: NotificationType) => (
                    <div key={el.id}>
                        <h1 className="text-2xl">{el.title}</h1>
                        <h2 className="text-xl">{el.description}</h2>
                        <p>{new Date(el.createdAt).toLocaleString()}</p>
                    </div>
                ))}
            </div>
            {error && <p>{error}</p>}
            {loading && <p>Loading...</p>}
        </div>
    )
}