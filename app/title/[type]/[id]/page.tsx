import { StreamingApp } from "@/components/streaming-app";

export default async function TitlePage({ params }: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await params;
  return <StreamingApp view="stremio" mediaType={decodeURIComponent(type)} mediaId={decodeURIComponent(id)} />;
}
