import type { Metadata } from "next";
import { StreamingApp } from "@/components/streaming-app";
export const metadata: Metadata = { title: "Search" };
export default function SearchPage() { return <StreamingApp view="search" />; }
