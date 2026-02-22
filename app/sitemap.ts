import { MetadataRoute } from "next";

const YT_API_KEY = process.env.YT_API_KEY;
const CHANNEL_ID = "UCid_-IfUqAz0zER2HBNlwqQ";

async function getAllVideoIds(): Promise<string[]> {
  try {
    let allItems: string[] = [];
    let pageToken = "";

    do {
      const url =
        `https://www.googleapis.com/youtube/v3/search` +
        `?key=${YT_API_KEY}` +
        `&channelId=${CHANNEL_ID}` +
        `&part=id` +
        `&order=date` +
        `&maxResults=50` +
        `&type=video` +
        (pageToken ? `&pageToken=${pageToken}` : "");

      const res = await fetch(url, { next: { revalidate: 3600 } });

      if (!res.ok) break;

      const data = await res.json();

      if (data.items) {
        const newItems = data.items.map((item: { id: { videoId: string } }) => item.id.videoId);
        allItems = [...allItems, ...newItems];
      }

      pageToken = data.nextPageToken || "";
    } while (pageToken);

    return allItems;
  } catch {
    return [];
  }
}

const SERIES_SLUGS = [
  "cambodia",
  "thailand",
  "vietnam",
  "laos",
  "indonesia",
  "malaysia",
  "myanmar",
  "philippines",
  "southeast-asia",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://remorqable.com";

  const videoIds = await getAllVideoIds();

  const videoUrls = videoIds.map((id) => ({
    url: `${baseUrl}/videos/${id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const seriesUrls = SERIES_SLUGS.map((slug) => ({
    url: `${baseUrl}/series/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/map`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...seriesUrls,
    ...videoUrls,
  ];
}
