import { useState, useEffect } from 'react';
import axios from 'axios';

const useUser = () => {
    const [users, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchUser = async () => {
        try {
            const res = await axios.get(`https://true-fit-dz-api.vercel.app/user`);
            setUser(res.data.result);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to fetch user");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);

    const EndSubscription = async (userId) => {
        try {
            await axios.put(`https://true-fit-dz-api.vercel.app/user/${userId}`, {
                isPaid: false,
                orders: 0
            });
            fetchUser(); // Refresh the list after ending subscription
        } catch (err) {
            setError(err.response?.data?.message || "Failed to end subscription");
        }
    }
    return {
        users,
        loading,
        error,
        fetchUser,
        EndSubscription
    };
};

export default useUser;
