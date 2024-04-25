import MobileBar from '@/components/Header/MobileBar'
import DashboardLayout from './DashboardLayout'

export default async function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-white dark:bg-neutral-800 overflow-y-auto h-[100vh]">
            <DashboardLayout>{children}</DashboardLayout>
            <MobileBar />
        </div>
    )
}
