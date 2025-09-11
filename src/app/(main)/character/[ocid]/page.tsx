import CharacterDetail from "@/components/Character/CharacterDetail";

const CharacterPage = ({ params }: { params: { ocid: string } }) => {
    return <CharacterDetail ocid={params.ocid}/>;
};

export default CharacterPage;

