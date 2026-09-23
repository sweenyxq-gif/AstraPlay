import type { Metadata } from "next";
import { StreamingApp } from "@/components/streaming-app";
import { resolveTitleMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}): Promise<Metadata> {
  const { type, id } = await params;
  return resolveTitleMetadata(type, id, "Watching: ");
}

export default async function WatchPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  return (
    <StreamingApp
      view="remote-watch"
      mediaType={decodeURIComponent(type)}
      mediaId={decodeURIComponent(id)}
    />
  );
}
