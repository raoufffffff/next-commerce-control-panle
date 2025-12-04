import React from 'react';
import {
    Home,
    Package,
    Users,
} from 'lucide-react';
import moment from 'moment';

const StatsCards = ({ users, offers, items }) => {

    // Helper to get Total and Today's stats
    const getStats = (data, isRevenue = false, user = false) => {
        const startOfToday = moment().startOf('month');

        // Filter for items created Today
        let todayData;
        if (user) {
            todayData = data.filter(item =>
                moment(item.createdAt).isSameOrAfter(startOfToday)
            );
        } else {
            todayData = data.filter(item =>
                moment(item.date).isSameOrAfter(startOfToday)
            );
        }


        let totalValue = 0;
        let todayValue = 0;

        if (isRevenue) {
            // Sum prices for Revenue
            totalValue = data.reduce((acc, curr) => acc + curr.price, 0);
            todayValue = todayData.reduce((acc, curr) => acc + curr.price, 0);
        } else {
            // Count items for Users/Products
            totalValue = data.length;
            todayValue = todayData.length;
        }

        return {
            total: totalValue,
            today: todayValue
        };
    };

    // 1. Calculate Revenue (Only successful offers)
    const successOffers = offers.filter(offer => offer.status === 'approved');
    const revenueStats = getStats(successOffers, true);

    // 2. Calculate Users
    const userStats = getStats(users, false, true);

    // 3. Calculate Items
    const itemStats = getStats(items);

    const cardsData = [
        {
            title: "Total Users",
            value: userStats.total,
            todayLabel: `+${userStats.today} Joined this month`,
            icon: Users,
            color: "bg-teal-500",
            textColor: "text-teal-600"
        },
        {
            title: "Active Items",
            value: itemStats.total,
            todayLabel: `+${itemStats.today} Added this month`,
            icon: Package,
            color: "bg-purple-500",
            textColor: "text-purple-600"
        },
        {
            title: "Revenue",
            value: `${revenueStats.total.toLocaleString()} DA`,
            todayLabel: `+${revenueStats.today.toLocaleString()} DA Earned this month`,
            icon: Home,
            color: "bg-indigo-500",
            textColor: "text-indigo-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cardsData.map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <p className="text-2xl font-bold mt-1">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                            <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                        </div>
                    </div>

                    {/* Updated Bottom Section: Shows absolute today value */}
                    <div className="mt-4 flex items-center text-sm font-medium text-green-600">
                        <span className="bg-green-50 px-2 py-1 rounded-md">
                            {stat.todayLabel}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StatsCards;