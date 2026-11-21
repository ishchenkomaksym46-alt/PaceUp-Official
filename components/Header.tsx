'use client'

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {api} from "@/lib/api";

function Logo() {
    return (
        <a className="brand" href="/" aria-label="PaceUp — home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <path d="M7 21.5 13.1 8l2.2 7.1 5.2-4.2L17 24l-2.2-7.1L7 21.5Z" fill="currentColor" />
          <path d="M5 26.5h22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
            <span>Pace<span className="brand-accent">Up</span></span>
        </a>
    );
}

function ArrowIcon() {
    return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4.2 10h11.6m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

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

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuthStatus = async () => {
            setLoading(true);
            setError('');

            try {
                await api.post('/auth/valid', { withCredentials: true });
                setIsLoggedIn(true);

            } catch (validError) {
                if (!hasResponseStatus(validError, 401)) {
                    setError(`Could not check auth status: ${validError instanceof Error ? validError.message : 'Unknown error'}`);
                    return;
                }

                try {
                    await api.post('/auth/refresh', { withCredentials: true });
                    setIsLoggedIn(true);
                } catch (refreshError) {
                    if (hasResponseStatus(refreshError, 401)) {
                        return;
                    }

                    setError(`Could not refresh session: ${refreshError instanceof Error ? refreshError.message : 'Unknown error'}`);
                }
            } finally {
                setLoading(false);
                router.refresh();
            }
        }

        checkAuthStatus();

        const handleAuthChange = (event: Event) => {
            setIsLoggedIn((event as CustomEvent<boolean>).detail);
        };

        window.addEventListener('auth-state-changed', handleAuthChange);
        return () => window.removeEventListener('auth-state-changed', handleAuthChange);
    }, [])

    const logout = async () => {
        try {
            const response = await api.post('/auth/logout', { withCredentials: true });

            if(!response || response.status !== 201) {
                console.error('Error occurred while logging you out')
            } else {
                console.log('Logout successful!');
                window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: false }));
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <header className="site-header">
            <div className="container nav-content">
                <Logo />
                <nav className="main-nav" aria-label="Main navigation">
                    <a href="#possibilities">Features</a><a href="#how-it-works">How it works</a>
                </nav>

                {isLoggedIn ? (<div>
                    <button className={"nav-cta bg-red-600 cursor-pointer"} onClick={() => logout()}>Logout</button>
                </div>) : (<div className="header-buttons">
                    <a className="nav-cta cursor-pointer" href="/auth/signin">Sign In <ArrowIcon /></a>
                    <a className="button button-primary cursor-pointer" href="/auth/signup">Sign Up <ArrowIcon /></a>
                </div>)}
            </div>
        </header>
    )
}