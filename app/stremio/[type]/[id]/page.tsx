import type { Metadata } from "next";
import { StreamingApp } from "@/components/streaming-app";
import { resolveTitleMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}): Promise<Metadata> {
  const { type, id } = await params;
  return resolveTitleMetadata(type, id);
}

export default async function StremioTitlePage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  return (
    <StreamingApp
      view="stremio"
      mediaType={decodeURIComponent(type)}
      mediaId={decodeURIComponent(id)}
    />
  );
}
