import React, { useState } from 'react'
import {
    Home,
    Package,
    Users,
    Search,
    Bell,
    Menu,
    X,
    Settings,
    LogOut,
    ChevronDown,
    Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const navLinks = [
        { name: 'Home', icon: Home, href: '/' },
        { name: 'Users', icon: Users, href: '/users' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Left Side: Logo & Desktop Navigation */}
                    <div className="flex items-center gap-8">
                        {/* Brand Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 overflow-hidden rounded-lg flex items-center justify-center">
                                <img src='/logo.png'
                                    className='w-full h-full'
                                />
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight hidden md:block">
                                next   Commerce<span className="text-purple-600">Ctrl</span>
                            </span>
                        </div>

                        {/* Desktop Navigation Links */}

                    </div>

                    {/* Right Side: Search, Actions, Profile */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <nav className="hidden md:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                        {/* Search Bar (Hidden on small mobile) */}




                        {/* Profile Dropdown Trigger */}


                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-gray-600"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="px-4 pt-4 pb-2 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                            >
                                <link.icon className="w-5 h-5" />
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};



export default Header