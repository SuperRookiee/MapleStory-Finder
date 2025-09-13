import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterAndroidEquipment } from '@/interface/character/ICharacter';

interface AndroidProps {
    android?: ICharacterAndroidEquipment | null;
    loading?: boolean;
}

export const Android = ({ android, loading }: AndroidProps) => {
    if (loading || !android) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>안드로이드</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-16 w-16" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>안드로이드</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
                {android.android_icon && (
                    <Image src={android.android_icon} alt={android.android_name} width={64} height={64} />
                )}
                <div className="text-sm">
                    <p>{android.android_name}</p>
                    <p className="text-muted-foreground">{android.android_grade}등급</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default Android;
