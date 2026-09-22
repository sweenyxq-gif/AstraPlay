import type { Metadata } from "next";
import { StreamingApp } from "@/components/streaming-app";
export const metadata: Metadata = { title: "Discover" };
export default function DiscoverPage() { return <StreamingApp view="discover" />; }
