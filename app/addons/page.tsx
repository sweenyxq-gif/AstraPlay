import type { Metadata } from "next";
import { StreamingApp } from "@/components/streaming-app";
export const metadata: Metadata = { title: "Addons" };
export default function AddonsPage() { return <StreamingApp view="addons" />; }
