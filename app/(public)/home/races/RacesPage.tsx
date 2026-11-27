'use client'

import {useEffect, useState} from "react";
import {DistanceType, RaceType} from "@/app/(public)/home/races/(types)/races.type";
import {api} from "@/lib/api";
import AxiosXHR = Axios.AxiosXHR;

export default function RacesPage() {
    const [competitions, setCompetitions] = useState<RaceType[]>([]);
    const [competitionName, setCompetitionName] = useState<string>('');
    const [distances, setDistances] = useState<DistanceType[]>([{
        distance: '', time: ''
    }]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [date, setDate] = useState<string>('');

    useEffect(() => {
        const getCompetitions = async () => {
            setError('');

            try {
                const response: AxiosXHR<any> = await api.get('/races/get', { withCredentials: true });

                if(!response || response.status !== 200) {
                    return setError(response.data.message);
                } else {
                    setCompetitions(response.data.competitions);
                }
            } catch (e) {
                setError(`Error occurred while trying to get your competitions: ${e instanceof Error ? e.message : 'Unknown error'}`);
            }
        }

        getCompetitions();
    }, [])

    const updateDistance = (
        index: number,
        field: keyof DistanceType,
        value: string,
    ) => {
        setDistances(current =>
            current.map((item, i) =>
                i === index ? { ...item, [field]: value } : item,
            ),
        );
    };

    const addDistance = () => {
        setDistances(current => [...current, { distance: '', time: '' }]);
    };

    const removeDistance = (index: number) => {
        setDistances(current => current.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setError('');
        setLoading(true);
        e.preventDefault();

        try {
            const response: AxiosXHR<any> = await api.post('/races/create', {
                competitionName,
                distances,
                date
            }, { withCredentials: true });

            if(!response || response.status !== 201) {
                return setError(response.data.message);
            } else {
                setCompetitions(response.data.competitions);
            }
        } catch (e) {
            setError(`Error occurred while trying to add your competition: ${e instanceof Error ? e.message : 'Unknown error'}`)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
                <form onSubmit={handleSubmit}>
                    <h1>Add Competitions</h1>
                    <hr />

                    <label>
                        Competition Name: 
                        <input
                            type="text"
                            value={competitionName}
                            placeholder="Competition name: "
                            onChange={event => setCompetitionName(event.target.value)}
                        />
                    </label>

                    <p>Add Distances</p>

                    <div className="add-distances">
                        {distances.map((item, index) => (
                            <div className="distance-row" key={index}>
                                <input
                                    type="text"
                                    aria-label={`Distance ${index + 1}`}
                                    placeholder="Distance (e.g. 5 km or 100m breakstroke)"
                                    value={item.distance}
                                    onChange={event =>
                                        updateDistance(index, 'distance', event.target.value)
                                    }
                                />

                                <input
                                    type="text"
                                    aria-label={`Time for distance ${index + 1}`}
                                    placeholder="Time (e.g. 25:30)"
                                    value={item.time}
                                    onChange={event =>
                                        updateDistance(index, 'time', event.target.value)
                                    }
                                />

                                {distances.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeDistance(index)}
                                        aria-label={`Remove distance ${index + 1}`}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}

                        <button type="button" onClick={addDistance} aria-label="Add distance">
                            + Add distance
                        </button>
                </div>
                    <label>
                        Competition Date
                        <input
                            type="date"
                            placeholder="Competition date: "
                            onChange={event => setDate(event.target.value)}
                        />
                    </label>

                    <button className={"button button-primary"} disabled={loading}>
                        {loading ? <p>Loading...</p> : <p>Submit</p>}
                    </button>
            </form>

            <div className={"competitions"}>
                {competitions.length > 0 ? (<div>
                    {competitions.map((el) => (
                        <div key={el.id}>
                            <hr />
                            <h1>{el.name}</h1>

                            {el.distances.map((el, index) => (
                                <div key={index}>
                                    <h2>{el.distance}</h2>
                                    <h3>{el.time}</h3>
                                    <hr />
                                </div>
                            ))}
                            <p>{el.date}</p>
                        </div>
                    ))}
                </div>) : (<div>
                    <h3 className={"text-xl font-bold"}>Nothing Here Yet...</h3>
                </div>)}
            </div>

            {error && <p>{error}</p>}
        </div>
    )
}