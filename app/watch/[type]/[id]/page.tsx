import { StreamingApp } from "@/components/streaming-app";
export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StreamingApp view="watch" mediaId={id} />;
}
