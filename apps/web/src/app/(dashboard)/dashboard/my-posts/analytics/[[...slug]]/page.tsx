import ViewsGraph from '@/components/Charts/ViewsGraph/ViewsGraph'
import StatCards from '@/components/Charts/StatsCards/StatsCards'
import AccountRetention from '@/components/Charts/AccountRetention/AccountRetention'
import DeviceSessions from '@/components/Charts/DeviceSessions/DeviceSessions'
import CommentTypes from '@/components/Charts/CommentType/CommentType'
import ExpenseHistory from '@/components/Charts/ExpenseHistory/ExpenseHistory'
import StorageReport from '@/components/Charts/StorageReport/StorageReport'
import StorageSummary from '@/components/Charts/StorageSummary/StorageSummary'
import UserLocation from '@/components/Charts/UserLocation/UserLocation'

function AnalyticsPage() {
    return (
        <div className="grid pt-6 grid-cols-1 gap-6 4xl:grid-cols-2 7xl:grid-cols-12 3xl:gap-8">
            <div className="mb-6">
                {/* @ts-ignore */}
                <StatCards className="2xl:grid-cols-3 3xl:gap-6 4xl:col-span-2 7xl:col-span-8" />
            </div>
            <div className="mb-6">
                <ViewsGraph />
            </div>
            <div className="mb-6">
                <div className="md:grid md:grid-cols-2 md:gap-x-6 md:items-center">
                    <div className="mb-6">
                        <DeviceSessions className="@7xl:col-span-4" />
                    </div>
                    <div className="mb-6">
                        <AccountRetention className="@7xl:col-span-12 @[90rem]:col-span-5 @[112rem]:col-span-4" />
                    </div>
                </div>
            </div>
            <div className="mb-6">
                <div className="md:grid md:grid-cols-2 md:gap-x-6 md:items-center">
                    <div className="mb-6">
                        <ExpenseHistory />
                    </div>
                    <div className="mb-6">
                        <CommentTypes />
                    </div>
                </div>
            </div>
            <div className="mb-6">
                <div className="md:grid md:grid-cols-3 md:gap-x-6 md:items-center">
                    <div className="mb-6 md:col-span-1">
                        <StorageSummary />
                    </div>
                    <div className="mb-6 md:col-span-2">
                        <StorageReport />
                    </div>
                </div>
            </div>
            <div className="mb-6">
                <UserLocation />
            </div>
        </div>
    )
}

export default AnalyticsPage
