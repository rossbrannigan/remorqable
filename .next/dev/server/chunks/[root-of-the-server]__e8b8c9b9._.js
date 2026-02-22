module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/videos/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const YT_API_KEY = process.env.YT_API_KEY || "AIzaSyBTg6E3vRp5l6Gb1FIrV_WDjosfvCc3-ac";
const CHANNEL_ID = "UCid_-IfUqAz0zER2HBNlwqQ";
function guessLocation(text) {
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
async function GET() {
    try {
        let allItems = [];
        let pageToken = "";
        do {
            const url = `https://www.googleapis.com/youtube/v3/search` + `?key=${YT_API_KEY}` + `&channelId=${CHANNEL_ID}` + `&part=snippet` + `&order=date` + `&maxResults=50` + `&type=video` + (pageToken ? `&pageToken=${pageToken}` : "");
            const res = await fetch(url, {
                next: {
                    revalidate: 3600
                }
            });
            if (!res.ok) {
                const err = await res.json();
                console.error("YouTube API error:", err);
                break;
            }
            const data = await res.json();
            if (data.items) {
                const newItems = data.items.map((item)=>({
                        id: item.id.videoId,
                        title: item.snippet.title,
                        location: guessLocation(item.snippet.title + " " + item.snippet.description)
                    }));
                allItems = [
                    ...allItems,
                    ...newItems
                ];
            }
            pageToken = data.nextPageToken || "";
        }while (pageToken)
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            videos: allItems,
            count: allItems.length
        });
    } catch (err) {
        console.error("Failed to fetch videos:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            videos: [],
            count: 0,
            error: "Failed to fetch"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e8b8c9b9._.js.map