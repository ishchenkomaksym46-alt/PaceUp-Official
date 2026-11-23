'use client'

import {useEffect} from "react";
import {api} from "@/lib/api";
import {useRouter} from "next/navigation";

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

export default function CheckAuthStatus() {
    const router = useRouter();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await api.post('/auth/valid', { withCredentials: true });

                if(!response || response.status !== 201) {
                    return router.push('/login');
                } else {
                    console.log('User is authenticated')
                }
            } catch (validError) {
                if (!hasResponseStatus(validError, 401)) {
                    return;
                }

                try {
                    await api.post('/auth/refresh');
                } catch (refreshError) {
                    if (hasResponseStatus(refreshError, 401)) {
                        router.push('/auth/signin');
                        return;
                    }
                }
            }
        }

        checkAuthStatus();
    }, [])

    return null
}