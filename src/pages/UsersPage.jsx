import React, { useState } from 'react';
import useUser from '../hook/UseUser';
import {
    User,
    Mail,
    Phone,
    Globe,
    ShoppingBag,
    BarChart3,
    Search,
    Loader2,
    Calendar,
    Clock,
    Copy,
    ExternalLink,
    AlertTriangle, // Changed from AlertCircle for better impact
    XCircle,
    X,
    CheckCircle
} from 'lucide-react';
import moment from 'moment';

const UsersPage = () => {
    const { users, loading, error, EndSubscription } = useUser();
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    // State for the Confirmation Popup
    const [modalData, setModalData] = useState({ isOpen: false, user: null });

    // Filter Logic
    const filteredUsers = users ? users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.repoName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    // Helper: Copy ID
    const handleCopyId = (id) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Helper: Handle the click on "End Subscription"
    const initiateEndSubscription = (user) => {
        setModalData({ isOpen: true, user: user });
    };

    // Helper: Confirm the action
    const confirmEndSubscription = () => {
        if (modalData.user) {
            EndSubscription(modalData.user._id);
            setModalData({ isOpen: false, user: null });
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading user data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-red-600 text-center mx-4 mt-8">
                <p>Failed to load users: {error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto relative">
            {/* --- Header Section --- */}
            <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <User className="w-6 h-6 text-purple-600" />
                        User Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {filteredUsers.length} active {filteredUsers.length === 1 ? 'user' : 'users'} found
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* --- Grid Layout --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredUsers.map((user) => {
                    const isExpired = user.isPaid && moment().isAfter(moment(user.dateOfExpire));

                    return (
                        <div
                            key={user._id}
                            className={`group bg-white rounded-xl border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden ${isExpired ? 'border-red-200' : 'border-gray-200'
                                }`}
                        >

                            {/* Card Header */}
                            <div className="p-5 flex justify-between items-start border-b border-gray-50 bg-gradient-to-b from-gray-50/50 to-white">
                                <div className="flex gap-4">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-purple-600 text-white border-2 border-white shadow-md flex items-center justify-center text-lg font-bold shrink-0">
                                        {user.name?.charAt(0).toUpperCase() || '?'}
                                    </div>

                                    {/* Name & ID */}
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-gray-900 leading-tight truncate">{user.name}</h3>
                                        <button
                                            onClick={() => handleCopyId(user._id)}
                                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-purple-600 transition-colors mt-1 group/id"
                                            title="Click to copy ID"
                                        >
                                            <span className="font-mono truncate max-w-[100px]">
                                                {user._id}
                                            </span>
                                            {copiedId === user._id ? (
                                                <CheckCircle className="w-3 h-3 text-teal-500" />
                                            ) : (
                                                <Copy className="w-3 h-3 opacity-0 group-hover/id:opacity-100" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border shrink-0 ${user.isPaid
                                    ? isExpired
                                        ? 'bg-red-50 text-red-700 border-red-100 animate-pulse' // Expired styling
                                        : 'bg-teal-50 text-teal-700 border-teal-100' // Premium styling
                                    : 'bg-gray-100 text-gray-600 border-gray-200' // Free styling
                                    }`}>
                                    {user.isPaid ? (isExpired ? 'Expired' : 'Premium') : 'Free'}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 space-y-5 flex-1">
                                {/* Contact Info */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span>{user.phone || 'No phone'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                                        <a
                                            href={`https://${user.link}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-1 truncate font-medium"
                                        >
                                            {user.repoName}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>

                                {/* Stats Dashboard */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-center hover:bg-teal-50 hover:border-teal-100 transition-colors group/stat">
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                                            <ShoppingBag className="w-3 h-3" /> Orders
                                        </div>
                                        <span className="text-xl font-bold text-gray-900 group-hover/stat:text-teal-700 transition-colors">{user.orders || 0}</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-center hover:bg-purple-50 hover:border-purple-100 transition-colors group/stat">
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                                            <BarChart3 className="w-3 h-3" /> Visits
                                        </div>
                                        <span className="text-xl font-bold text-gray-900 group-hover/stat:text-purple-700 transition-colors">{user.visit?.length || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Area */}
                            <div className="bg-gray-50/50 border-t border-gray-100">
                                {isExpired && user.isPaid ? (
                                    <div className="p-3 bg-red-50/30">
                                        <div className="flex justify-between items-center text-xs mb-3 px-1">
                                            <span className="text-red-600 font-bold flex items-center gap-1">
                                                <AlertTriangle className="w-3.5 h-3.5" />
                                                Action Required
                                            </span>
                                            <span className="text-gray-400">
                                                Exp: {moment(user.dateOfExpire).format('MMM DD')}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => initiateEndSubscription(user)}
                                            className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 py-2.5 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm active:scale-95"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            End Subscription
                                        </button>
                                    </div>
                                ) : (
                                    // Standard Footer
                                    <div className="px-5 py-3 flex justify-between items-center text-xs">
                                        <div>
                                            {user.isPaid ? (
                                                <div className="flex items-center gap-1.5 font-medium text-teal-700 bg-teal-50 px-2 py-1 rounded">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{moment(user.dateOfExpire).format('MMM DD, YYYY')}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>Lifetime Free</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-gray-400" title={moment(user.updatedAt).format('LLLL')}>
                                            {moment(user.updatedAt).fromNow(true)} ago
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- Empty State --- */}
            {filteredUsers.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-200 border-dashed p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No users found</h3>
                    <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                        We couldn't find any users matching "{searchTerm}".
                    </p>
                    <button
                        onClick={() => setSearchTerm('')}
                        className="mt-4 text-teal-600 font-medium hover:text-teal-800 hover:underline"
                    >
                        Clear search
                    </button>
                </div>
            )}

            {/* --- Confirmation Modal (Popup) --- */}
            {modalData.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setModalData({ isOpen: false, user: null })}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
                        {/* Close Button */}
                        <button
                            onClick={() => setModalData({ isOpen: false, user: null })}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-6 text-center">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">End Subscription?</h3>
                            <p className="text-gray-500 text-sm mb-6">
                                You are about to end the subscription for <span className="font-bold text-gray-900">{modalData.user?.name}</span>.
                                This user will return to the Free plan.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setModalData({ isOpen: false, user: null })}
                                    className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmEndSubscription}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-bold shadow-md hover:bg-red-700 shadow-red-200 transition-all"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;