'use client'

import {useState} from "react";
import {api} from "@/lib/api";
import {useRouter} from "next/navigation";

export default function SigninPage() {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [count, setCount] = useState<number>(1);
    const router = useRouter();

    const nextStep = (data: string) => {
        setLoading(true);

        if(!data) {
            setError('Please fill in all fields');
        } else {
            setCount(count + 1);
            setLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if(!email || !password) {
            return setError('Please fill in all fields!')
        }

        try {
            const response = await api.post('/auth/signin', {
                email,
                password,
            });
            console.log(1);

            if(!response || response.status !== 201) {
                setError('Error occurred while signing up. Please try again.');
                console.log(2)
            } else {
                console.log('Sign in successful!')
                window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: true }));
                router.push('/home')
                console.log(4)
            }
        } catch (e) {
            setError('An error occurred while signing in. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Sign In</h1>

            <form onSubmit={handleSubmit}>
                {count === 1 && (
                    <>
                        <p>Please Enter Your Email: </p>
                        <input type={"text"} placeholder={"Your Email"} onChange={(e) => setEmail(e.target.value)} required/>
                        <button type={"button"} onClick={() => nextStep(email)}>Next</button>
                    </>
                )}
                {count === 2 && (
                    <>
                        <p>Please Enter Your Password: </p>
                        <input type={"password"} placeholder={"Your Password"} onChange={(e) => setPassword(e.target.value)} required/>
                        <button disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
                    </>
                )}
                {error && <p>{error}</p>}

            </form>
        </div>
    )
}