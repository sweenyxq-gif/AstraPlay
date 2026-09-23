import { StreamingApp } from "@/components/streaming-app";
export default async function RemoteWatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StreamingApp view="remote-watch" mediaId={decodeURIComponent(id)} />;
}

