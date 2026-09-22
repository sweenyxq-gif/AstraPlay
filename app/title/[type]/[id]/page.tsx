import { StreamingApp } from "@/components/streaming-app";

export default async function TitlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StreamingApp view="details" mediaId={id} />;
}
