import CharacterDetail from "@/components/characterDetail";

export default function CharacterPage({ params }: { params: { ocid: string } }) {
  return <CharacterDetail ocid={params.ocid} />;
}
