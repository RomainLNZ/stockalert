import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";

function LoginPage({ onShowToast }) {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const URL = 'http://localhost:5000/api/auth/login';

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate("/");
            onShowToast("Bienvenue " + data.email + "!");

        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            alert("Erreur : " + error.message);
        }
    };

    return (
        <div>
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        required
                    />
                </div>

                <button type="submit">Se connecter</button>
            </form>
            <p>
                Pas encore de compte ? <Link to="/signup">S'inscrire</Link>
            </p>
        </div>
    );
}

export default LoginPage;