import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterPetEquipment } from '@/interface/character/ICharacter';

interface PetProps {
    pet?: ICharacterPetEquipment | null;
    loading?: boolean;
}

export const Pet = ({ pet, loading }: PetProps) => {
    if (loading || !pet) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>펫</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex space-x-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-16 w-16" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const petData = pet as Record<string, string>;
    const pets = [1, 2, 3]
        .map((i) => ({
            name: petData[`pet_${i}_name`],
            icon: petData[`pet_${i}_icon`],
        }))
        .filter((p) => p.name);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>펫</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex space-x-4">
                    {pets.map((p) => (
                        <div key={p.name} className="flex flex-col items-center text-xs space-y-1">
                            {p.icon && <Image src={p.icon} alt={p.name} width={64} height={64} />}
                            <span>{p.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default Pet;
