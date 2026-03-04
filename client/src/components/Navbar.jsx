import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ setIsAddModalOpen }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsMenuOpen(false);
        navigate('/login');
    };

    return (
        <nav className="relative mb-8">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="text-3xl">📦</div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            StockAlert
                        </h1>
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="relative p-3 rounded-xl bg-white/5 hover:bg-white/10 
                                border border-white/10 hover:border-white/20
                                transition-all duration-300 hover:scale-110 
                                hover:shadow-lg hover:shadow-blue-500/20 group z-50"
                        aria-label="Menu"
                    >
                        <div className="flex flex-col gap-1.5 w-6">
                            <div className={`h-0.5 bg-white rounded-full transform-gpu transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] 
                                        ${isMenuOpen ? 'rotate-45 translate-y-2' : 'group-hover:w-full'}`}></div>
                            <div className={`h-0.5 bg-white rounded-full transform-gpu transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] 
                                        ${isMenuOpen ? 'opacity-0 scale-0 rotate-180' : 'w-4 group-hover:w-full'}`}></div>
                            <div className={`h-0.5 bg-white rounded-full transform-gpu transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] 
                                        ${isMenuOpen ? '-rotate-45 -translate-y-2' : 'w-5 group-hover:w-full'}`}></div>
                        </div>
                    </button>

                    <div className={`
                        absolute top-full right-0 mt-2 w-80
                        bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl
                        overflow-hidden transition-all duration-500 ease-out origin-top-right
                        ${isMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
                    `}>
                        <div className="p-4 flex flex-col gap-2">
                            <Link
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                                className="group px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 
                                        border border-white/10 hover:border-blue-400/30
                                        transition-all duration-300 flex items-center gap-3
                                        hover:shadow-lg hover:shadow-blue-500/10
                                        hover:scale-[1.02]"
                            >
                                <span className="text-xl group-hover:scale-110 transition-transform">📊</span>
                                <span className="font-medium">Dashboard</span>
                            </Link>

                            <button
                                onClick={() => {
                                    setIsAddModalOpen(true);
                                    setIsMenuOpen(false);
                                }}
                                className="group px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 
                                        border border-white/10 hover:border-indigo-400/30
                                        transition-all duration-300 flex items-center gap-3
                                        hover:shadow-lg hover:shadow-indigo-500/10
                                        hover:scale-[1.02]"
                            >
                                <span className="text-xl group-hover:scale-110 transition-transform">➕</span>
                                <span className="font-medium">Ajouter un produit</span>
                            </button>

                            <button
                                onClick={handleLogout}
                                className="group px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 
                                        border border-red-400/20 hover:border-red-400/40
                                        transition-all duration-300 flex items-center gap-3
                                        text-red-400 hover:text-red-300
                                        hover:shadow-lg hover:shadow-red-500/10
                                        hover:scale-[1.02]"
                            >
                                <span className="text-xl group-hover:scale-110 transition-transform">🚪</span>
                                <span className="font-medium">Déconnexion</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;