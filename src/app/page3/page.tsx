"use client";
import Link from "next/link";
import { useAuth } from "@/helpers/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page3() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [presignedUrl, setPresignedUrl] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        setToken(token);
        if (!token) {
            router.push('/login');
        } else {
            const { authenticated } = useAuth();
            if (!authenticated) {
                router.push('/login');
            }
        }
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPresignedUrl('');
        setFileName(e.target.value);
    };

    const fetchPresignedUrl = async () => {
        if (!fileName) {
            setError('Please enter a file name');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/download?file_name=${fileName}`, {
                method: 'GET',
            });

            if (!response.ok) {
                if (response.status === 404) {
                    setError('File not found');
                } else {
                    setError('Failed to fetch presigned URL');
                }
                return;
            }

            const data = await response.json();
            setPresignedUrl(data.url);
            setError(''); // Clear any previous error
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while fetching the presigned URL');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Page 3</h1>

            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <input
                    type="text"
                    value={fileName}
                    onChange={handleInputChange}
                    placeholder="Enter file name"
                    className="mb-4 p-2 border rounded w-full"
                />
                <button
                    onClick={fetchPresignedUrl}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                >
                    Get Presigned URL
                </button>
                {error && <p className="mt-4 text-red-500">{error}</p>}
                {presignedUrl && (
                    <a href={presignedUrl} className="mt-4 text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                        {fileName}
                    </a>
                )}
            </div>

            <Link href="/page1" className="mt-4 text-blue-500 hover:underline">
                Go to Page 1
            </Link>
        </div>
    );
}
