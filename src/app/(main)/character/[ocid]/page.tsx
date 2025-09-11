import CharacterDetail from "@/components/Character/CharacterDetail";

export default function CharacterPage({ params }: { params: { ocid: string } }) {
    return <CharacterDetail ocid={params.ocid}/>;
}
