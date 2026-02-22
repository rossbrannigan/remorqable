import { NextResponse } from "next/server";

const YT_API_KEY = process.env.YT_API_KEY;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;

    const url = `https://www.googleapis.com/youtube/v3/videos?key=${YT_API_KEY}&id=${videoId}&part=snippet,statistics,contentDetails`;

    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour

    if (!res.ok) {
      const err = await res.json();
      console.error("YouTube API error:", err);
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const video = data.items[0];
    const snippet = video.snippet;
    const statistics = video.statistics;
    const contentDetails = video.contentDetails;

    // Parse duration (ISO 8601)
    const duration = contentDetails.duration; // e.g., PT4M13S

    // Simple duration parser
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    const formattedDuration = `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const videoData = {
      id: video.id,
      title: snippet.title,
      description: snippet.description,
      publishedAt: snippet.publishedAt,
      thumbnails: snippet.thumbnails,
      channelTitle: snippet.channelTitle,
      tags: snippet.tags || [],
      viewCount: statistics.viewCount,
      likeCount: statistics.likeCount,
      duration: formattedDuration,
      durationISO: duration,
      totalSeconds,
    };

    return NextResponse.json(videoData);
  } catch (err) {
    console.error("Failed to fetch video:", err);
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 });
  }
}