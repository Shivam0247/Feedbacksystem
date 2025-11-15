import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-xl sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2 text-2xl font-bold hover:text-indigo-200 transition-colors">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                        </svg>
                        <span>FeedbackHub</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        {user ? (
                            <>
                                <Link to="/feedback" className="px-3 py-2 rounded-lg hover:bg-white/10 transition-all font-medium">
                                    All Feedback
                                </Link>
                                <Link to="/submit" className="px-3 py-2 rounded-lg hover:bg-white/10 transition-all font-medium">
                                    Submit Feedback
                                </Link>
                                <Link to="/my-feedback" className="px-3 py-2 rounded-lg hover:bg-white/10 transition-all font-medium">
                                    My Feedback
                                </Link>
                                {user.role === 'admin' && (
                                    <>
                                        <Link to="/admin" className="px-3 py-2 rounded-lg hover:bg-white/10 transition-all font-medium flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                            </svg>
                                            Dashboard
                                        </Link>
                                        <Link to="/admin/categories" className="px-3 py-2 rounded-lg hover:bg-white/10 transition-all font-medium">
                                            Categories
                                        </Link>
                                    </>
                                )}
                                <div className="flex items-center gap-3 pl-4 border-l border-white/20">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-semibold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium">{user.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all font-medium">
                                    Login
                                </Link>
                                <Link to="/signup" className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-all shadow-lg">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-2">
                        {user ? (
                            <>
                                <Link to="/feedback" className="block px-4 py-2 rounded-lg hover:bg-white/10">All Feedback</Link>
                                <Link to="/submit" className="block px-4 py-2 rounded-lg hover:bg-white/10">Submit Feedback</Link>
                                <Link to="/my-feedback" className="block px-4 py-2 rounded-lg hover:bg-white/10">My Feedback</Link>
                                {user.role === 'admin' && (
                                    <>
                                        <Link to="/admin" className="block px-4 py-2 rounded-lg hover:bg-white/10">Dashboard</Link>
                                        <Link to="/admin/categories" className="block px-4 py-2 rounded-lg hover:bg-white/10">Categories</Link>
                                    </>
                                )}
                                <div className="pt-4 border-t border-white/20">
                                    <div className="px-4 py-2 text-sm">Hello, {user.name}</div>
                                    <button onClick={handleLogout} className="w-full mt-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-4 py-2 rounded-lg hover:bg-white/10">Login</Link>
                                <Link to="/signup" className="block px-4 py-2 rounded-lg hover:bg-white/10">Sign Up</Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

