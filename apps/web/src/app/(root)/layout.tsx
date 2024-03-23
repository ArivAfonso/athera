import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-[#f8f8f8] dark:bg-neutral-900/95">
            <Header />
            <div className="overflow-y-auto" style={{ height: 'calc(100vh - var(--header-height))' }}>
                <div style={{ paddingTop: 'var(--header-height)' }}>
                    {children}
                    <Footer />
                </div>
            </div>
            <style>{`
                :root {
                    --header-height: 80px; /* Adjust the height as per your header */
                }
            `}</style>
        </div>
    );
}
