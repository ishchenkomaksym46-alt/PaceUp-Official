'use client'

import {useState} from "react";
import {api} from "@/lib/api";
import {useRouter} from "next/navigation";
import {SignupFormData, SportOption} from "@/app/(public)/auth/(types)/types";

export default function SignupPage() {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [sport, setSport] = useState<SportOption>({ value: 'Swimming' });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const router = useRouter();
    const [count, setCount] = useState<number>(1);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post<SignupFormData>('/auth/signup', {
                username,
                email,
                password,
                sport: sport.value,
            }, { withCredentials: true });

            if(!response || response.status !== 201) {
                setError('Error signing up. No response from server');
            } else {
                console.log('Signup successful:', response.data);
                window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: true }));
                router.push('/home');
            }
        } catch (err) {
            setError('An error occurred while signing up. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const nextStep = (data: string) => {
        setLoading(true);

        if(!data) {
            setError('Please fill in all fields');
        } else {
            setCount(count + 1);
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Sign up</h1>

            <form onSubmit={handleSubmit}>
                {count === 1 && (
                    <>
                        <p>Username</p>
                        <input type="text" name="username" placeholder={"Username: "} minLength={3} maxLength={20}
                               onChange={(e) => setUsername(e.target.value)}
                               required/>
                        <button type={"button"} onClick={() => nextStep(username)} disabled={loading}>
                            Next
                        </button>
                    </>
                )}

                {count === 2 && (
                    <>
                        <p>Email</p>
                        <input type="email" name="email" placeholder={"Email: "} minLength={3} maxLength={100}
                               onChange={(e) => setEmail(e.target.value)}
                               required/>
                        <button type={"button"} onClick={() => nextStep(email)} disabled={loading}>
                            Next
                        </button>
                    </>
                )}
                {count === 3 && (
                    <>
                        <p>Password</p>
                        <input type="password" name="password" placeholder={"Password: "} minLength={6} maxLength={100}
                               onChange={(e) => setPassword(e.target.value)}
                               required/>
                        <button type={"button"} onClick={() => nextStep(password)} disabled={loading}>
                            Next
                        </button>
                    </>
                )}
                {count === 4 && (
                    <>
                        <p>Choose your sport</p>
                        <select onChange={(e) => setSport({ value: e.target.value as 'Swimming' | 'Running' })} required>
                            <option>Choose your sport</option>
                            <option value="Running">Running</option>
                            <option value="Swimming">Swimming</option>
                        </select>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Signing up...' : 'Sign up'}
                        </button>
                    </>
                )}
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    )
}