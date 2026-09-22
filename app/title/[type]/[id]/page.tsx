import type { Metadata } from "next";
import { StreamingApp } from "@/components/streaming-app";
import { findMedia } from "@/mocks/media";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = findMedia(id);
  return { title: item.title, description: item.description };
}

export default async function TitlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StreamingApp view="details" mediaId={id} />;
}
