'use client'

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {api} from "@/lib/api";
import {TrainingsType} from "@/app/(public)/set-up/(types)/types";
import AxiosXHR = Axios.AxiosXHR;

function hasResponseStatus(error: unknown, status: number): boolean {
    if (typeof error !== "object" || error === null || !("response" in error)) {
        return false;
    }

    const response = error.response;
    return typeof response === "object"
        && response !== null
        && "status" in response
        && response.status === status;
}

const trainings: TrainingsType = {
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
}

export default function SetUpPage() {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuthStatus = async () => {
            setError('');
            setLoading(true);

            try {
                const response = await api.post('/auth/valid', { withCredentials: true });

                if(!response || response.status !== 201) {
                    return router.push('/login');
                } else {
                    console.log('User is authenticated')
                }
            } catch (validError) {
                if (!hasResponseStatus(validError, 401)) {
                    setError(`Could not check auth status: ${validError instanceof Error ? validError.message : 'Unknown error'}`);
                    return;
                }

                try {
                    await api.post('/auth/refresh');
                } catch (refreshError) {
                    if (hasResponseStatus(refreshError, 401)) {
                        router.push('/auth/signin');
                        return;
                    }

                    setError(`Could not refresh session: ${refreshError instanceof Error ? refreshError.message : 'Unknown error'}`);
                }
            } finally {
                setLoading(false);
            }
        }

        checkAuthStatus();
    }, [])

    const handleSubmitTraining = async () => {
        setError('');
        setLoading(true);

        try {
            const response: AxiosXHR<any> = await api.post('/user/add-trainings', { trainings }, { withCredentials: true });

            if(!response || response.status !== 201) {
                console.error(response);
                setError(response.data.message);
                return;
            } else {
                const isSetUpResponse: AxiosXHR<any> = await api.post('/user/setup-complete', {}, { withCredentials: true });

                if(!isSetUpResponse || isSetUpResponse.status !== 201) {
                    console.error(isSetUpResponse);
                    setError(isSetUpResponse.data.message);
                    return
                } else {
                    router.push('/home');
                }
            }
        } catch (e) {
            setError(`Error occurred while submitting your trainings info: ${e}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1 className={"text-4xl font-bold"}>Let's Set Up Your Account!</h1>

            <hr />

            <div className="grid grid-cols-1 gap-4">
                <p>What days do you have trainings?</p>

                <div className={"trainings-checks"}>
                    <h1>Monday</h1>
                    <input type={"checkbox"} onClick={() => trainings.Monday = !trainings.Monday}/>

                    <h1>Tuesday</h1>
                    <input type={"checkbox"} onClick={() => trainings.Tuesday = !trainings.Tuesday}/>

                    <h1>Wednesday</h1>
                    <input type={"checkbox"} onClick={() => trainings.Wednesday = !trainings.Wednesday}/>

                    <h1>Thursday</h1>
                    <input type={"checkbox"} onClick={() => trainings.Thursday = !trainings.Thursday}/>

                    <h1>Friday</h1>
                    <input type={"checkbox"} onClick={() => trainings.Friday = !trainings.Friday}/>

                    <h1>Saturday</h1>
                    <input type={"checkbox"} onClick={() => trainings.Saturday = !trainings.Saturday}/>

                    <h1>Sunday</h1>
                    <input type={"checkbox"} onClick={() => trainings.Sunday = !trainings.Sunday}/>

                    <button onClick={handleSubmitTraining}>Submit</button>
                </div>
            </div>
            {error && <p>{error}</p>}
            {loading && <p>Loading...</p>}
        </div>
    )
}