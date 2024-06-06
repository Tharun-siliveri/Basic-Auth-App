"use client";
import Link from "next/link";
import { useAuth } from "@/helpers/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { saveAs } from 'file-saver';

export default function Page2() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [fileUrl, setFileUrl] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [msg, setMsg] = useState<string>('');

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
        setFileName(e.target.value);
    };

    const fetchFile = async () => {
        if (!fileName) {
            setError('Please enter a file name');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/blob?file_name=${fileName}`, {
                method: 'GET',
            });

            if (!response.ok) {
                if (response.status === 404) {
                    setError('File not found');
                } else {
                    setError('Failed to fetch file');
                }
                return;
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setFileUrl(url);
            setError(''); // Clear any previous error
            console.log(url);
            saveAs(blob, fileName); // Automatically trigger the download
            setMsg('File downloaded successfully');
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while fetching the file');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Page 2</h1>

            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <input
                    type="text"
                    value={fileName}
                    onChange={handleInputChange}
                    placeholder="Enter file name"
                    className="mb-4 p-2 border rounded w-full"
                />
                <button
                    onClick={fetchFile}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                >
                    Download File
                </button>
                {msg && <p className="mt-4 text-green-500">{msg}</p>}
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>

            <Link href="/page3" className="mt-4 text-blue-500 hover:underline">
                Go to Page 3
            </Link>
        </div>
    );
}
