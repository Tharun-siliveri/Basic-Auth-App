"use client";
import Link from "next/link";
import { useAuth } from "@/helpers/auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Page1() {
    const router = useRouter();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>('');
    const [msg, setMsg] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            const { authenticated } = useAuth();
            if (!authenticated) {
                router.push('/login');
            }
        }
    }, [router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(''); // Clear any previous error
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleFileRemove = (fileToRemove: File) => {
        const updatedFiles = selectedFiles.filter(file => file !== fileToRemove);
        setSelectedFiles(updatedFiles);

        // Reset the input field
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // Reset the input field with the remaining files
        const dataTransfer = new DataTransfer();
        updatedFiles.forEach(file => dataTransfer.items.add(file));
        if (fileInputRef.current) {
            fileInputRef.current.files = dataTransfer.files;
        }
    };

    const uploadFiles = async () => {
        if (selectedFiles.length === 0) {
            setError('Please select files to upload');
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await fetch('http://127.0.0.1:8000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to upload files');
            }

            const data = await response.json();
            setError(''); // Clear any previous error
            setMsg('Files uploaded successfully');
            setSelectedFiles([]); // Clear selected files after successful upload

            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset the input field
            }

        } catch (error: any) {
            console.error('Error:', error);
            setError(error.message || 'An error occurred while uploading the files');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Page 1</h1>

            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="mb-4 p-2 border rounded w-full"
                />
                <div className="mb-4">
                    {selectedFiles.map(file => (
                        <div key={file.name} className="flex justify-between items-center mb-2">
                            <span>{file.name}</span>
                            <button
                                onClick={() => handleFileRemove(file)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    onClick={uploadFiles}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                >
                    Upload Files
                </button>
                {msg && <p className="mt-4 text-green-500">{msg}</p>}
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>

            <Link href="/page2" className="mt-4 text-blue-500 hover:underline">
                Go to Page 2
            </Link>
        </div>
    );
}
