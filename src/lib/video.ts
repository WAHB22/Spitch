export type Video = { kind: "youtube"; id: string } | { kind: "file"; src: string };

/** YouTube (watch, youtu.be, shorts or embed links) or a direct video file such as .mp4. */
export function parseVideo(url: string): Video | null {
  const u = url.trim();
  if (!u) return null;
  const yt = u.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { kind: "youtube", id: yt[1] };
  return { kind: "file", src: u };
}
