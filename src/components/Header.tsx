"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from "@/helpers/auth";
import Link from "next/link";

export default function Header() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const pathname = usePathname();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const { authenticated } = useAuth();
            if (authenticated) {
                setIsLoggedIn(true);
            }
            else {
                setIsLoggedIn(false);
            }
        }
    }, [pathname, router]);
    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    }

    return (
        <header className="header bg-[rgb(103, 186, 103)] p-[20px]">
            <nav className="nav flex justify-between items-center">
                <div className="logo ml-5">
                    <Link href="/"><h1>AUTH APP</h1></Link>
                </div>

                <ul>
                    {isLoggedIn ? (
                        <>
                            <li>
                                <Link href="/about">About Us</Link>
                            </li>
                            <li>
                                <Link href="/page1">Page 1</Link>
                            </li>
                            <li>
                                <Link href="/page2">Page 2</Link>
                            </li>
                            <li>
                                <Link href="/page3">Page 3</Link>
                            </li>
                            <li>
                                <Link href="/page4">Page 4</Link>
                            </li>
                            <li>
                                <Link href="/profile">Profile</Link>
                            </li>
                            <li>
                                <Link href="/" onClick={logout}>
                                    Logout
                                </Link>
                            </li>

                        </>
                    ) : (
                        <>
                            <li>
                                <Link href="/about">About Us</Link>
                            </li>
                            <li>
                                <Link href="/login">Login</Link>
                            </li>
                            <li>
                                <Link href="/register">Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}
