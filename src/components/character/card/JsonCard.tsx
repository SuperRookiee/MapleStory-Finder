import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JsonCardProps {
  title: string;
  data: unknown;
}

export function JsonCard({ title, data }: JsonCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-sm bg-muted p-2 rounded overflow-x-auto">
          {data ? JSON.stringify(data, null, 2) : "-"}
        </pre>
      </CardContent>
    </Card>
  );
}
