"use client";
import { useState } from 'react';

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default function Users() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');

  const fetchUsers = async () => {
    try {
      const query = new URLSearchParams({
        username,
        first_name: firstName,
        last_name: lastName,
        email
      });

      const response = await fetch(`http://127.0.0.1:8000/users?${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
      setError('');
    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setUsers([]);
    }

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Filter Users</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="mb-4 p-2 border rounded w-full"
        />
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          className="mb-4 p-2 border rounded w-full"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          className="mb-4 p-2 border rounded w-full"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="mb-4 p-2 border rounded w-full"
        />
        <button
          onClick={fetchUsers}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Search
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>

      <div className="mt-4 w-full max-w-md">
        {users.length > 0 ? (
          <ul className="bg-white rounded shadow-md p-6">
            {users.map((user) => (
              <li key={user.id} className="mb-4">
                <p>Username: {user.username}</p>
                <p>First Name: {user.first_name}</p>
                <p>Last Name: {user.last_name}</p>
                <p>Email: {user.email}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4">No users found</p>
        )}
      </div>
    </div>
  );
}
