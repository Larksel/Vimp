export async function toBlobUrl(
  artworkUrl: string | null,
): Promise<string | null> {
  if (!artworkUrl) return null;

  try {
    const response = await fetch(artworkUrl);
    const blob = await response.blob();
    const objectURL = URL.createObjectURL(blob);
    return objectURL;
  } catch {
    return null;
  }
}
