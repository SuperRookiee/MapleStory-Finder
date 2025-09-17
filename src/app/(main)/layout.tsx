import { Analytics } from "@vercel/analytics/next";
import MainLayout from '../layout/MainLayout';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <MainLayout>
            {children}
            <Analytics />
        </MainLayout>
    )
}

export default Layout
