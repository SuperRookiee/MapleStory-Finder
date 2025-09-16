import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

    const pets = [
        { name: pet.pet_1_name, icon: pet.pet_1_icon },
        { name: pet.pet_2_name, icon: pet.pet_2_icon },
        { name: pet.pet_3_name, icon: pet.pet_3_icon },
    ].filter((p) => p.name);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>펫</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex space-x-4">
                    {pets.map((p) => (
                        <div key={p.name} className="flex flex-col items-center text-xs space-y-1">
                            {p.icon && <Image src={p.icon} alt={p.name} width={64} height={64} className='h-auto' />}
                            <span>{p.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default Pet;
