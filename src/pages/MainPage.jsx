import React from 'react'
import StatsCards from '../Components/StatsCards'
import useUser from '../hook/UseUser'
import UseOffer from '../hook/UseOffer'
import useItem from '../hook/UseItem'
import OffersContainer from '../Components/OffersContainer'

const MainPage = () => {
    const { users, loading: loadingUser } = useUser()
    const { Offers, loading: loadingOffer, AcceptsOffer, refuseOffer, postOffer } = UseOffer()
    const { Items, loading: loadingItem } = useItem()
    if (loadingUser || loadingOffer || loadingItem) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        </div>
    }
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Mock Content to show Header context */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Manage your platform and user accounts.</p>
                </div>

                {/* Mock Stats Cards */}
                <StatsCards users={users} items={Items} offers={Offers} />

                <OffersContainer
                    offers={Offers}
                    AcceptsOffer={AcceptsOffer}
                    refuseOffer={refuseOffer}
                    postOffer={postOffer}
                />
            </main>
        </div>
    )
}

export default MainPage