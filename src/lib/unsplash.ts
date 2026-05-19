/**
 * Minimal Unsplash search client used by the seed script and by tool creation.
 * Requires UNSPLASH_ACCESS_KEY in .env (get a free key at
 * https://unsplash.com/oauth/applications).
 */

type UnsplashPhoto = {
  id: string;
  urls: { regular: string; small: string };
  user: { name: string; links: { html: string } };
  links: { html: string };
};

type SearchResponse = { results: UnsplashPhoto[] };

const API = "https://api.unsplash.com";

export function hasUnsplashKey(): boolean {
  return Boolean(process.env.UNSPLASH_ACCESS_KEY);
}

export async function searchPhoto(query: string): Promise<string | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;
  const url = `${API}/search/photos?per_page=1&orientation=landscape&query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${key}`,
      "Accept-Version": "v1",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `Unsplash search failed for "${query}": ${res.status} ${res.statusText}`,
    );
  }
  const data = (await res.json()) as SearchResponse;
  return data.results[0]?.urls.regular ?? null;
}
