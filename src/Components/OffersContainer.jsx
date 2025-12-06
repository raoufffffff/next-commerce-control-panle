import React, { useState } from 'react';
import {
    Package,
    CheckCircle,
    XCircle,
    CreditCard,
    Zap,
    Download,
    AlertTriangle,
    Calendar,
    Plus,
    Loader2 // Added loader icon
} from 'lucide-react';
import moment from 'moment';

const OffersContainer = ({ offers, AcceptsOffer, refuseOffer, postOffer }) => {
    // --- State Management ---
    const [currentFilter, setCurrentFilter] = useState('pending');
    const [loading, setLoading] = useState(false);

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: null, // 'approve' | 'reject'
        offer: null
    });

    // Create Offer Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createFormData, setCreateFormData] = useState({
        phone: '',
        day: '',
        month: '',
        year: '',
        price: ''
    });

    // --- Helpers ---
    const formatDate = (dateString) => moment(dateString).format('YYYY-MM-DD');

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    // Filter Logic
    const filteredOffers = offers ? offers.filter(offer => {
        if (currentFilter === 'all') return true;
        return offer.status.toLowerCase() === currentFilter.toLowerCase();
    }) : [];

    // --- Handlers: Confirmation Actions ---
    const initiateAction = (offer, type) => {
        setConfirmModal({ isOpen: true, type, offer });
    };

    const handleConfirmAction = () => {
        const { type, offer } = confirmModal;
        if (!offer) return;

        if (type === 'approve') {
            AcceptsOffer(offer._id, {
                userId: offer.userId,
                dateOfPay: formatDate(offer.date),
                dateOfExpire: offer.OfferTypeValue,
            });
        } else if (type === 'reject') {
            refuseOffer(offer._id);
        }
        setConfirmModal({ isOpen: false, type: null, offer: null });
    };

    // --- Handlers: Create Offer Form ---
    const handleCreateChange = (e) => {
        const { name, value } = e.target;
        setCreateFormData(prev => ({ ...prev, [name]: value }));
    };

    const submitNewOffer = async () => {
        if (!createFormData.phone || !createFormData.price) return; // Basic validation

        setLoading(true);
        try {
            // Construct date string (MM-DD-YYYY based on your snippet, though YYYY-MM-DD is standard)
            const fullDate = `${createFormData.month}-${createFormData.day}-${createFormData.year}`;

            const body = {
                phone: createFormData.phone,
                price: createFormData.price,
                OfferTypeValue: fullDate,
                offerTitle: "Whatsapp message offer" // Fixed typo "whatsup"
            };

            await postOffer(body);

            // Reset and Close
            setIsCreateModalOpen(false);
            setCreateFormData({ phone: '', day: '', month: '', year: '', price: '' });
        } catch (error) {
            console.error("Failed to post offer", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 relative">
            {/* --- Header & Toolbar --- */}
            <div className="flex flex-col gap-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Upgrade Requests</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage subscription proofs and verify payments.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm hover:shadow-indigo-200 transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4" /> Make Offer
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            <Download className="w-4 h-4" /> Export
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-1">
                    {['pending', 'approved', 'rejected', 'all'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setCurrentFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${currentFilter === status
                                ? 'bg-gray-900 text-white shadow-md'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {status}
                            <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-full ${currentFilter === status ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                {status === 'all'
                                    ? offers?.length || 0
                                    : offers?.filter(o => o.status.toLowerCase() === status).length || 0}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Content Grid --- */}
            {filteredOffers.length === 0 ? (
                <div className="bg-white p-16 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <Package className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-gray-900 font-bold text-xl">No {currentFilter} requests</h3>
                    <p className="text-gray-500 mt-2">There are no items to display in this category right now.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOffers.map((offer) => (
                        <div key={offer._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group relative">
                            {/* Card Body */}
                            <div className="p-5 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                            {offer.userName?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{offer.userName}</p>
                                            <p className="text-xs text-gray-400 font-mono">ID: {offer.userId?.substring(0, 8)}...</p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(offer.status)}`}>
                                        {offer.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                                        {offer.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                        {offer.status.toUpperCase()}
                                    </span>
                                </div>

                                <div className="mb-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Zap className="w-4 h-4 text-purple-600 fill-current" />
                                        <h4 className="text-sm font-bold text-gray-800">{offer.offerTitle}</h4>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded border border-gray-200">
                                            {offer.OfferTypeValue}
                                        </span>
                                        <span className="text-lg font-bold text-indigo-600">${offer.price}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>Submitted: {formatDate(offer.date)}</span>
                                    </div>
                                    <a href={offer.PaymentImage} target="_blank" rel="noopener noreferrer" className="block group/image">
                                        <div className="relative h-32 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group-hover/image:border-indigo-300 transition-colors">
                                            {offer.PaymentImage ? (
                                                <img src={offer.PaymentImage} alt="Receipt" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <CreditCard className="w-8 h-8 text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* Card Actions */}
                            {offer.status.toLowerCase() === 'pending' ? (
                                <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => initiateAction(offer, 'approve')}
                                        className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-2.5 px-4 rounded-lg text-sm font-bold hover:bg-emerald-600 transition-all active:scale-95"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Approve
                                    </button>
                                    <button
                                        onClick={() => initiateAction(offer, 'reject')}
                                        className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
                                    >
                                        <XCircle className="w-4 h-4" /> Reject
                                    </button>
                                </div>
                            ) : (
                                <div className={`px-5 py-3 border-t flex justify-center items-center gap-2 text-sm font-medium ${offer.status === 'approved' ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700' : 'bg-red-50/50 border-red-100 text-red-700'
                                    }`}>
                                    {offer.status === 'approved' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                    Offer {offer.status}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* --- Confirmation Modal --- */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setConfirmModal({ isOpen: false, type: null, offer: null })}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className={`p-6 text-center ${confirmModal.type === 'approve' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${confirmModal.type === 'approve' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                                {confirmModal.type === 'approve' ? <CheckCircle className="w-8 h-8 text-emerald-600" /> : <AlertTriangle className="w-8 h-8 text-red-600" />}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{confirmModal.type === 'approve' ? 'Approve Upgrade?' : 'Reject Upgrade?'}</h3>
                            <p className="text-gray-500 text-sm px-4">
                                You are about to <span className="font-bold">{confirmModal.type}</span> the request for <span className="font-bold text-gray-900">{confirmModal.offer?.userName}</span>.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 flex gap-3">
                            <button onClick={() => setConfirmModal({ isOpen: false, type: null, offer: null })} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">Cancel</button>
                            <button onClick={handleConfirmAction} className={`flex-1 px-4 py-2.5 text-white rounded-lg font-bold shadow-md ${confirmModal.type === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Create Offer Modal --- */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => !loading && setIsCreateModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-900">Create New Offer</h3>
                            <p className="text-sm text-gray-500 mt-1">Enter the details below to create a custom offer.</p>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Phone Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={createFormData.phone}
                                    onChange={handleCreateChange}
                                    disabled={loading}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>

                            {/* Date Inputs */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiration Date</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="day"
                                            value={createFormData.day}
                                            onChange={handleCreateChange}
                                            disabled={loading}
                                            placeholder="DD"
                                            min="1" max="31"
                                            className="w-full px-4 py-2.5 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <span className="absolute right-2 top-2.5 text-xs text-gray-400 pointer-events-none">Day</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="month"
                                            value={createFormData.month}
                                            onChange={handleCreateChange}
                                            disabled={loading}
                                            placeholder="MM"
                                            min="1" max="12"
                                            className="w-full px-4 py-2.5 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <span className="absolute right-2 top-2.5 text-xs text-gray-400 pointer-events-none">Mo</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="year"
                                            value={createFormData.year}
                                            onChange={handleCreateChange}
                                            disabled={loading}
                                            placeholder="YYYY"
                                            min="2024"
                                            className="w-full px-4 py-2.5 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <span className="absolute right-2 top-2.5 text-xs text-gray-400 pointer-events-none">Yr</span>
                                    </div>
                                </div>
                            </div>

                            {/* Price Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Offer Price</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 text-lg">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="price"
                                        value={createFormData.price}
                                        onChange={handleCreateChange}
                                        disabled={loading}
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 bg-gray-50 flex gap-3 border-t border-gray-100">
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitNewOffer}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Offer"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OffersContainer;