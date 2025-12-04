import React, { useState } from 'react';
import {
    Package,
    Filter,
    Calendar,
    CheckCircle,
    XCircle,
    CreditCard,
    Zap,
    Download,
    AlertTriangle,
    X,
    Search
} from 'lucide-react';
import moment from 'moment';

const OffersContainer = ({ offers, AcceptsOffer, refuseOffer }) => {
    // 1. State for Filtering (Default to 'pending')
    const [currentFilter, setCurrentFilter] = useState('pending');

    // 2. State for Modal
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: null, // 'approve' or 'reject'
        offer: null
    });

    // Helper: Filter the offers based on state
    const filteredOffers = offers ? offers.filter(offer => {
        if (currentFilter === 'all') return true;
        return offer.status.toLowerCase() === currentFilter.toLowerCase();
    }) : [];

    // Helper: Format Date
    const formatDate = (dateString) => moment(dateString).format('YYYY-MM-DD');

    // Helper: Handle opening the confirmation modal
    const initiateAction = (offer, type) => {
        setModalConfig({
            isOpen: true,
            type: type,
            offer: offer
        });
    };

    // Helper: Execute the action after confirmation
    const handleConfirmAction = () => {
        const { type, offer } = modalConfig;

        if (type === 'approve') {
            AcceptsOffer(offer._id, {
                userId: offer.userId,
                dateOfPay: formatDate(offer.date),
                dateOfExpire: offer.OfferTypeValue,
            });
        } else if (type === 'reject') {
            refuseOffer(offer._id);
        }

        // Close modal
        setModalConfig({ isOpen: false, type: null, offer: null });
    };

    // Helper: Get color based on status
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-6 relative">
            {/* --- Header & Filters --- */}
            <div className="flex flex-col gap-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Upgrade Requests</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage subscription proofs and verify payments.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            <Download className="w-4 h-4" /> Export
                        </button>
                    </div>
                </div>

                {/* Custom Tab Filter */}
                <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-1">
                    {['pending', 'approved', 'rejected', 'all'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setCurrentFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${currentFilter === status
                                ? 'bg-gray-900 text-white shadow-md' // Active State
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100' // Inactive State
                                }`}
                        >
                            {status}
                            <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-full ${currentFilter === status ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                {/* Count logic */}
                                {status === 'all'
                                    ? offers?.length || 0
                                    : offers?.filter(o => o.status.toLowerCase() === status).length || 0}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Grid Layout --- */}
            {filteredOffers.length === 0 ? (
                // Empty State
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

                            {/* Card Header */}
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

                                {/* Plan Info */}
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

                                {/* Receipt Image & Date */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>Submitted: {formatDate(offer.date)}</span>
                                    </div>

                                    <a
                                        href={offer.PaymentImage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block group/image"
                                    >
                                        <div className="relative h-32 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group-hover/image:border-indigo-300 transition-colors">
                                            {offer.PaymentImage ? (
                                                <img
                                                    src={offer.PaymentImage}
                                                    alt="Receipt"
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <CreditCard className="w-8 h-8 text-gray-300" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-200">
                                                <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                                    <Search className="w-3 h-3" /> Inspect
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* --- Action Buttons (Only show if Pending) --- */}
                            {offer.status.toLowerCase() === 'pending' ? (
                                <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => initiateAction(offer, 'approve')}
                                        className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-2.5 px-4 rounded-lg text-sm font-bold hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-95"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => initiateAction(offer, 'reject')}
                                        className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all active:scale-95"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            ) : (
                                // Read Only Footer for processed items
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
            {modalConfig.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setModalConfig({ isOpen: false, type: null, offer: null })}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                        <div className={`p-6 text-center ${modalConfig.type === 'approve' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${modalConfig.type === 'approve' ? 'bg-emerald-100' : 'bg-red-100'
                                }`}>
                                {modalConfig.type === 'approve' ? (
                                    <CheckCircle className={`w-8 h-8 ${modalConfig.type === 'approve' ? 'text-emerald-600' : 'text-red-600'}`} />
                                ) : (
                                    <AlertTriangle className="w-8 h-8 text-red-600" />
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {modalConfig.type === 'approve' ? 'Approve Upgrade?' : 'Reject Upgrade?'}
                            </h3>
                            <p className="text-gray-500 text-sm px-4">
                                You are about to <span className="font-bold">{modalConfig.type}</span> the request for user
                                <span className="font-bold text-gray-900"> {modalConfig.offer?.userName}</span>.
                                {modalConfig.type === 'approve'
                                    ? " This will grant them premium access immediately."
                                    : " This will mark the request as rejected."}
                            </p>
                        </div>

                        {/* Summary of Action */}
                        <div className="px-6 py-4 bg-white border-t border-gray-100">
                            <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                                <span className="text-gray-500">Amount:</span>
                                <span className="font-bold text-gray-900">${modalConfig.offer?.price}</span>
                            </div>
                            <div className="flex justify-between text-sm py-2">
                                <span className="text-gray-500">Plan:</span>
                                <span className="font-bold text-gray-900">{modalConfig.offer?.offerTitle}</span>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 flex gap-3">
                            <button
                                onClick={() => setModalConfig({ isOpen: false, type: null, offer: null })}
                                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAction}
                                className={`flex-1 px-4 py-2.5 text-white rounded-lg font-bold shadow-md transition-all transform active:scale-95 ${modalConfig.type === 'approve'
                                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                                    : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                                    }`}
                            >
                                Confirm {modalConfig.type === 'approve' ? 'Approval' : 'Rejection'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OffersContainer;