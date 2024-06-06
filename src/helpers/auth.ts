import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
    const token = localStorage.getItem('token');

    // If token doesn't exist, user is not authenticated
    if (!token) {
        return { authenticated: false };
    }

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        // Check if token is expired
        if (decodedToken.exp && decodedToken.exp < currentTime) {
            localStorage.removeItem('token');
            return { authenticated: false };
        }

        // Token is valid and not expired, user is authenticated
        return { authenticated: true, user: decodedToken.name }; // Optionally, you can return decodedToken as user data
    } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        return { authenticated: false, error: 'Token verification failed' };
    }
};
