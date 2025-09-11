import CharacterDetail from "@/components/Character/CharacterDetail";

const CharacterPage = async ({ params }: { params: Promise<{ ocid: string }> }) => {
    const { ocid } = await params;
    return <CharacterDetail ocid={ocid}/>;
};

export default CharacterPage;