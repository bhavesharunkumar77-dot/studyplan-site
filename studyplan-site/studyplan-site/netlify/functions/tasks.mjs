import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("studyplan");
  const h = { "content-type": "application/json", "cache-control": "no-store" };

  if (req.method === "GET") {
    const data = await store.get("state", { type: "json" });
    return new Response(JSON.stringify(data || { brand: "#39ff88", tasks: [] }), { headers: h });
  }
  if (req.method === "POST") {
    if (req.headers.get("x-admin-key") !== Netlify.env.get("ADMIN_PASSWORD")) {
      return new Response('{"error":"unauthorized"}', { status: 401, headers: h });
    }
    await store.setJSON("state", await req.json());
    return new Response('{"ok":true}', { headers: h });
  }
  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/tasks" };
