'use client'

import {useEffect, useState} from "react";
import CheckAuthStatus from "@/components/CheckAuthStatus";
import {api} from "@/lib/api";
import AxiosXHR = Axios.AxiosXHR;
import {TrainingsType} from "@/app/(public)/home/workouts/(types)/types";

export default function WorkoutsPage() {
    const [trainingDescription, setTrainingDescription] = useState<string>('');
    const [training, setTraining] = useState<TrainingsType[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getTrainings = async () => {
            setError('');
            setLoading(true);

            try {
                const response: AxiosXHR<any> = await api.get('/workouts/get', { withCredentials: true });

                if(!response || response.status !== 200) {
                    return setError('Trainings not found');
                } else {
                    return setTraining(response.data.trainings);
                }
            } catch (e) {
                setError(`Error occurred while trying to get your trainings: ${e instanceof Error ? e.message : 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        }

        getTrainings();
    }, []);

    const handleSubmit = async () => {
        setError('')
        setLoading(true)

        try {
            const response: AxiosXHR<any> = await api.post('/workouts/create', { trainingDescription }, { withCredentials: true });

            if(!response || response.status !== 201) {
                return setError(response.data.message);
            } else {
                setTraining(response.data.trainings)
            }
        } catch (e) {
            return setError(`Error occurred while trying to save your training: ${e instanceof Error ? e.message : 'Unknown error'}`)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="workouts-page">
            <CheckAuthStatus />
            <form className={"main-workout-form"} onSubmit={handleSubmit}>
                <textarea className={"training-description"} placeholder={"Tell Me About Your Training: "}
                onChange={(e) => setTrainingDescription(e.target.value)}/>
                <button>Submit</button>
            </form>

            {training.length > 0 ? (
                <div>
                    {training.map((el: TrainingsType) => (
                        <div key={el.id}>
                            <p className={"text-xl"}>{el.trainingDescription}</p>
                            <p>{new Date(el.createdAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <h1 className={"text-xl font-bold"}>Nothing Here Yet...</h1>
                </div>
            )}

            {error && <p>{error}</p>}
            {loading && <p>Loading...</p>}
        </div>
    )
}