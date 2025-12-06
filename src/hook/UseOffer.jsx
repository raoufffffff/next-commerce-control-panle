import { useState, useEffect } from 'react';
import axios from 'axios';

const UseOffer = () => {
    const [Offers, setOffer] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchOffer = async () => {
        try {
            const res = await axios.get(`https://next-dashoard-api.vercel.app/`);
            setOffer(res.data.result);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to fetch user");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOffer();
    }, []);
    const AcceptsOffer = async (offerId, body) => {
        try {
            await axios.put(`https://next-dashoard-api.vercel.app/${offerId}`, {
                status: "approved",
            });
            await axios.put(`https://next-dashoard-api.vercel.app/user/${body.userId}`, {
                isPaid: true,
                dateOfPay: body.dateOfPay,
                dateOfExpire: body.dateOfExpire,
            });
            fetchOffer(); // Refresh the list after acceptance
        }
        catch (err) {
            setError(err.response?.data?.message || "Failed to accept offer");
        }
    };

    const refuseOffer = async (offerId) => {
        try {
            await axios.put(`https://next-dashoard-api.vercel.app/${offerId}`, {
                status: "rejected",
            });
            fetchOffer(); // Refresh the list after refusal
        }
        catch (err) {
            setError(err.response?.data?.message || "Failed to refuse offer");
        }
    }
    const postOffer = async (body) => {
        try {
            await axios.post(`https://next-dashoard-api.vercel.app/manual`, body);
            fetchOffer(); // Refresh the list after refusal
        }
        catch (err) {
            setError(err.response?.data?.message || "Failed to refuse offer");
        }
    }
    return {
        Offers,
        loading,
        error,
        fetchOffer,
        AcceptsOffer,
        refuseOffer,
        postOffer
    };
};

export default UseOffer;
