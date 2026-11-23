'use client'

import {useEffect, useState} from "react";
import {api} from "@/lib/api";
import {useRouter} from "next/navigation";
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

export default function HomePage() {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const [username, setUsername] = useState<string>('');
    const [isSetUp, setIsSetUp] = useState<boolean>(false);

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

        const getUsername = async () => {
            setError('');
            setLoading(true);

            try {
                const response: AxiosXHR<any> = await api.get('/user/get-user');

                if(!response || response.status !== 200) {
                    setError(`Could not get username: ${response}`);
                    setUsername('User!');
                    return;
                } else {
                    if(response.data.payload) {
                        setUsername(response.data.payload.username);
                    } else {
                        setUsername('User!');
                    }
                }
            } catch (e) {
                setError('Error occurred while trying to get your username');
                setUsername('User!')
            } finally {
                setLoading(false);
            }
        }

        const isSetUpComplete = async () => {
            setError('');

            try {
                const response: AxiosXHR<any> = await api.get('/user/check-setup', { withCredentials: true });

                if(!response || response.status !== 200) {
                    setError('Unexpected error occurred while checking setup');
                    return;
                } else {
                    if(response.data.setup) {
                        setIsSetUp(true);
                    } else {
                        setIsSetUp(false);
                    }
                }
            } catch (e) {
                setError(`Error occurred while checking your account: ${e instanceof Error ? e.message : 'Unknown error'}`)
            }
        }

        const addReminder = async () => {
            setError('');
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

            console.log(timeZone);

            try {
                const response: AxiosXHR<any> = await api.post('/notifications/check-training', {
                    timeZone,
                }, { withCredentials: true });

                if(!response || response.status !== 201) {
                    return setError(response.data.message)
                } else {
                    console.log('Reminder Added!');
                }
            } catch (e) {
                setError(`Error occurred while trying to add training reminder: ${e instanceof Error ? e.message : 'Unknown error'}`)
            }
        }

        checkAuthStatus().then(() => getUsername());
        isSetUpComplete();
        addReminder();
    }, []);

    return (
        <div>
            <h1 className="text-4xl font-bold">Welcome back! {username}</h1>

            {!isSetUp && (
                <div>
                    <h1 className="text-2xl">Let's first set up your account!</h1>

                    <button className={"button button-primary cursor-pointer"} onClick={() => router.push('/set-up')}>Set Up!</button>
                </div>
            )}

            {error && <p>{error}</p>}
            {loading && <p>Loading...</p>}
        </div>
    )
}