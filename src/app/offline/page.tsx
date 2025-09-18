import type { Metadata } from "next";
import OfflineContent from "./OfflineContent";

export const metadata: Metadata = {
    title: "Offline | Finder",
    description:
        "Stay connected to Finder even without a network connection. You're offline, but recently visited pages may still be available.",
};

const OfflinePage = () => {
    return <OfflineContent />;
};

export default OfflinePage;
