const API_BASE_URL = 'http://localhost:5000';

export async function fetchWithAuth(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const config = {
        ...options,
        headers: {
            ...options.headers,
            'Content-Type': 'application/json'
        }
    };

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    return response;
}

export { API_BASE_URL }; 