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

    if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        window.location.href = '/login';
        throw new Error('Session expirée, veuillez vous reconnecter');
    }

    return response;
}

export { API_BASE_URL };