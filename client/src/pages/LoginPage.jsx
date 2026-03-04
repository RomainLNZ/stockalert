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
            onShowToast("Bienvenue " + data.email + "!", "success");

        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            onShowToast(error.message, 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">           {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-indigo-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Login Card */}
            <div className="relative w-full max-w-md">
                {/* Glow effect behind card */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 blur-xl"></div>

                {/* Main card */}
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 
                animate-in fade-in zoom-in-95 duration-700">

                    {/* Header */}
                    <div className="text-center mb-8 animate-in slide-in-from-top duration-700" style={{ animationDelay: '200ms' }}>
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                            Bienvenue
                        </h1>
                        <p className="text-blue-200/80 text-sm">
                            Connectez-vous à votre compte
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div className="animate-in slide-in-from-left duration-700" style={{ animationDelay: '400ms' }}>
                            <label className="block text-sm font-medium text-blue-100 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                   text-white placeholder-white/40
                   focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20
                   transition-all duration-300
                   hover:bg-white/10"
                                placeholder="vous@exemple.com"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="animate-in slide-in-from-left duration-700" style={{ animationDelay: '600ms' }}>
                            <label className="block text-sm font-medium text-blue-100 mb-2">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                   text-white placeholder-white/40
                   focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20
                   transition-all duration-300
                   hover:bg-white/10"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600
                 text-white font-semibold rounded-lg
                 hover:from-blue-600 hover:to-indigo-700
                 focus:outline-none focus:ring-2 focus:ring-blue-400/50
                 transform transition-all duration-300
                 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/50
                 active:scale-[0.98]
                 animate-in slide-in-from-bottom duration-700"
                            style={{ animationDelay: '800ms' }}
                        >
                            Se connecter
                        </button>
                    </form>

                    {/* Signup Link */}
                    <p className="mt-6 text-center text-sm text-blue-200/60 animate-in fade-in duration-700" style={{ animationDelay: '1000ms' }}>
                        Pas encore de compte ?{' '}
                        <Link
                            to="/signup"
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 hover:underline"
                        >
                            S'inscrire
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;