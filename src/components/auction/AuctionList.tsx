"use client";

import { useEffect, useState } from "react";
import { findAuctionList } from "@/fetchs/auction.fetch";

const AuctionList = () => {
    const [data, setData] = useState<unknown>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await findAuctionList("환생의불꽃");
                setData(res.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            }
        };
        load();
    }, []);

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Auction</h1>
            {data ? (
                <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default AuctionList;
