import { Link } from 'react-router-dom';
import { useState } from 'react';

function Navbar({ setIsAddModalOpen }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="bg-white/5 backdrop-blur-sm border-b border-white/10 mb-8">
            <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold">StockAlert</h1>
                <button
                    onClick={toggleMenu}
                    className="flex flex-col gap-1.5 p-2 hover:bg-white/10 rounded-lg transition-all hover:scale-110 hover:shadow-lg hover:shadow-white/20"
                    aria-label="Menu"
                >
                    <div className={`w-6 h-0.5 bg-white transform-gpu transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                    <div className={`w-6 h-0.5 bg-white transform-gpu transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${isMenuOpen ? 'opacity-0 scale-0 rotate-180' : ''}`}></div>
                    <div className={`w-6 h-0.5 bg-white transform-gpu transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                </button>
            </div>

            <div className={`
                bg-white/10 backdrop-blur-sm border-t border-white/10
                overflow-hidden transition-all duration-500 ease-out
                ${isMenuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
            `}>
                <div className="py-4">
                    <div className="max-w-7xl mx-auto px-4 flex flex-col gap-2">
                        <Link
                            to="/"
                            onClick={() => setIsMenuOpen(false)}
                            className="px-4 py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3"
                        >
                            📊 Dashboard
                        </Link>
                        <button
                            onClick={() => { setIsAddModalOpen(true); setIsMenuOpen(false); }}
                            className="px-4 py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3"
                        >
                            ➕ Ajouter un produit
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;