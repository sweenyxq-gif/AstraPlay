import { StreamingApp } from "@/components/streaming-app";
export default async function WatchPage({ params }: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await params;
  return <StreamingApp view="remote-watch" mediaType={decodeURIComponent(type)} mediaId={decodeURIComponent(id)} />;
}

