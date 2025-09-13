import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface JsonSectionProps {
    title: string;
    data?: unknown;
    loading?: boolean;
}

export const JsonSection = ({ title, data, loading }: JsonSectionProps) => {
    if (loading || data == null) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
        );
    }

    const entries = Array.isArray(data)
        ? data.map((v, i) => [String(i), v])
        : Object.entries(data as Record<string, unknown>);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                {entries.map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-2">
                        <span className="font-medium">{key}</span>
                        <span className="text-right break-words">
                            {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

