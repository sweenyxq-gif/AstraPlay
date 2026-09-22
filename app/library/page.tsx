import type { Metadata } from "next";
import { StreamingApp } from "@/components/streaming-app";
export const metadata: Metadata = { title: "Library" };
export default function LibraryPage() { return <StreamingApp view="library" />; }
