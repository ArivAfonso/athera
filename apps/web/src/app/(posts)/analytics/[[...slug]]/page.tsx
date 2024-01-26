import LikesCommentsGraph from '@/components/Charts/LikesCommmentsGraph/LikesCommentsGraph'
import OperatingSystemsPie from '@/components/Charts/OperatingSystemsPie/OperatingSystemsPie'
import StatsSection from '@/components/Charts/StatsSection/StatsSection'
import ViewsGraph from '@/components/Charts/ViewsGraph/ViewsGraph'
import VisitorViewBar from '@/components/Charts/VisitorViewBar/VisitorViewBar'
import CommentsDoughtnut from '@/components/Charts/CommentsDoughnut/CommentsDoughnut'
import ReadingTimeRadial from '@/components/Charts/ReadingTimeRadial/ReadingTimeRadial'
import SocialMedia from '@/components/Charts/SocialMedia/SocialMedia'
import LocationGraph from '@/components/Charts/LocationGraph/LocationGraph'

const OverviewData = [
    {
        id: 1,
        type: 'primary',
        icon: 'briefcase.svg',
        label: 'Total Products',
        total: '100',
        suffix: '+',
        prefix: '',
        status: 'growth',
        statusRate: '25.36',
        decimel: 0,
        dataPeriod: 'Since last month',
    },
    {
        id: 2,
        type: 'info',
        icon: 'shopping-cart.svg',
        label: 'Total Orders',
        total: '30825',
        suffix: '',
        prefix: '',
        status: 'growth',
        statusRate: '25.36',
        decimels: 0,
        separator: ',',
        dataPeriod: 'Since last month',
    },
    {
        id: 3,
        type: 'secondary',
        icon: 'dollar-circle.svg',
        label: 'Total Sales',
        total: '30825',
        suffix: '',
        prefix: '$',
        status: 'down',
        statusRate: '25.36',
        decimels: 0,
        separator: ',',
        dataPeriod: 'Since last month',
    },
    {
        id: 4,
        type: 'warning',
        icon: 'users-alt.svg',
        label: 'New Customers',
        total: '30825',
        suffix: '+',
        prefix: '',
        status: 'growth',
        statusRate: '25.36',
        decimels: 0,
        separator: ',',
        dataPeriod: 'Since last month',
    },
    {
        id: 5,
        type: 'primary',
        icon: 'arrow-growth.svg',
        label: 'Total Traffic',
        total: '30825',
        suffix: '',
        prefix: '',
        status: 'growth',
        statusRate: '25.36',
        decimels: 0,
        separator: ',',
        dataPeriod: 'Since last month',
    },
    {
        id: 6,
        type: 'secondary',
        icon: 'users-alt.svg',
        label: 'New Customers',
        total: '2850',
        suffix: '',
        prefix: '',
        status: 'growth',
        statusRate: '9.87',
        decimels: 0,
        dataPeriod: 'Since last month',
    },
    {
        id: 7,
        type: 'success',
        icon: 'dollar-circle.svg',
        label: 'Sales',
        total: '529',
        suffix: '',
        prefix: '',
        status: 'down',
        statusRate: '12.36',
        decimels: 0,
        dataPeriod: 'Since last month',
    },
    {
        id: 8,
        type: 'info',
        icon: 'speed-meter.svg',
        label: 'Performance',
        total: '28.50',
        suffix: '%',
        prefix: '',
        status: 'growth',
        statusRate: '9.87',
        decimels: 2,
        dataPeriod: 'Since last month',
    },
]

function AnalyticsPage() {
    return (
        <>
            <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24">
                <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
                    <div className="grid grid-cols-1 ">
                        <div className="mb-6">
                            {/* @ts-ignore */}
                            <StatsSection OverviewData={OverviewData} />
                        </div>
                        <div className="mb-6">
                            <ViewsGraph />
                        </div>
                        <div className="mb-6">
                            <LikesCommentsGraph />
                        </div>
                        <div className="mb-6">
                            <LocationGraph />
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-x-6 md:items-center">
                            <div className="mb-6">
                                <VisitorViewBar />
                            </div>
                            <div className="mb-6">
                                <CommentsDoughtnut />
                            </div>
                        </div>
                        <div className="mb-6">
                            <div className="md:grid md:grid-cols-2 md:gap-x-6 md:items-center">
                                <div className="mb-6">
                                    <OperatingSystemsPie />
                                </div>
                                <div className="mb-6">
                                    <ReadingTimeRadial />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AnalyticsPage
