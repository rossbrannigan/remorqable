import { NextResponse } from "next/server";

const YT_API_KEY = process.env.YT_API_KEY || "AIzaSyBTg6E3vRp5l6Gb1FIrV_WDjosfvCc3-ac";
const CHANNEL_ID = "UCid_-IfUqAz0zER2HBNlwqQ";

function guessMood(title: string, description: string): string[] {
  const t = (title + " " + description).toLowerCase();
  const moods: string[] = [];
  if (t.includes("night") || t.includes("bar") || t.includes("nightlife") || t.includes("party")) moods.push("🌙 Night Life");
  if (t.includes("food") || t.includes("eat") || t.includes("market") || t.includes("restaurant") || t.includes("street food") || t.includes("noodle") || t.includes("cook") || t.includes("rice")) moods.push("🍜 Food & Markets");
  if (t.includes("budget") || t.includes("cheap") || t.includes("how much") || t.includes("affordable") || t.includes("cost") || t.includes("price") || t.includes("dollar")) moods.push("💰 Budget Travel");
  if (t.includes("cinematic") || t.includes("4k") || t.includes("drone") || t.includes("aerial") || t.includes("sunset") || t.includes("sunrise") || t.includes("timelapse")) moods.push("🎬 Cinematic");
  if (t.includes("adventure") || t.includes("trek") || t.includes("hike") || t.includes("motorbike") || t.includes("scooter") || t.includes("explore") || t.includes("jungle")) moods.push("🏍 Adventure");
  if (t.includes("coffee") || t.includes("café") || t.includes("cafe") || t.includes("relax") || t.includes("chill") || t.includes("slow") || t.includes("peaceful") || t.includes("quiet")) moods.push("☕ Slow Travel");
  return moods;
}

function guessLocation(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("cambodia") || t.includes("phnom penh") || t.includes("angkor") || t.includes("siem reap") || t.includes("koh rong")) return "Cambodia 🇰🇭";
  if (t.includes("thailand") || t.includes("bangkok") || t.includes("chiang mai") || t.includes("phuket") || t.includes("thai")) return "Thailand 🇹🇭";
  if (t.includes("vietnam") || t.includes("hanoi") || t.includes("ho chi minh") || t.includes("saigon")) return "Vietnam 🇻🇳";
  if (t.includes("laos") || t.includes("luang prabang")) return "Laos 🇱🇦";
  if (t.includes("indonesia") || t.includes("bali")) return "Indonesia 🇮🇩";
  if (t.includes("malaysia") || t.includes("kuala lumpur")) return "Malaysia 🇲🇾";
  if (t.includes("myanmar") || t.includes("burma")) return "Myanmar 🇲🇲";
  if (t.includes("philippines") || t.includes("manila")) return "Philippines 🇵🇭";
  return "Southeast Asia 🌏";
}

export async function GET() {
  try {
    let allItems: { id: string; title: string; location: string; mood: string[] }[] = [];
    let pageToken = "";

    do {
      const url =
        `https://www.googleapis.com/youtube/v3/search` +
        `?key=${YT_API_KEY}` +
        `&channelId=${CHANNEL_ID}` +
        `&part=snippet` +
        `&order=date` +
        `&maxResults=50` +
        `&type=video` +
        (pageToken ? `&pageToken=${pageToken}` : "");

      const res = await fetch(url, { next: { revalidate: 3600 } });

      if (!res.ok) {
        const err = await res.json();
        console.error("YouTube API error:", err);
        break;
      }

      const data = await res.json();

      if (data.items) {
        const newItems = data.items.map((item: {
          id: { videoId: string };
          snippet: { title: string; description: string };
        }) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          location: guessLocation(item.snippet.title + " " + item.snippet.description),
          mood: guessMood(item.snippet.title, item.snippet.description),
        }));
        allItems = [...allItems, ...newItems];
      }

      pageToken = data.nextPageToken || "";
    } while (pageToken);

    return NextResponse.json({ videos: allItems, count: allItems.length });
  } catch (err) {
    console.error("Failed to fetch videos:", err);
    return NextResponse.json({ videos: [], count: 0, error: "Failed to fetch" }, { status: 500 });
  }
}
