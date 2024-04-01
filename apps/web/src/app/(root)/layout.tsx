import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-neutral-800 unique-scrollbar">
            <Header />
            {children}
            <Footer />
        </div>
    )
}
