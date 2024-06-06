"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/helpers/auth";

export default function Home() {
    const router = useRouter();
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [user, setUser] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
            } else {
                const { authenticated, user } = useAuth();
                if (!authenticated) {
                    router.push('/login');
                } else {
                    setIsAuthChecked(true);
                    if (user) {
                        setUser(user);
                    }
                }
            }
        }
    }, [router]);

    if (!isAuthChecked) {
        return <p>Loading...</p>;
    }

    return (
        <div className="profile flex justify-between p-[25px]">
            <h1>Welcome to the Profile page! {user}</h1>
        </div>
    );
}
