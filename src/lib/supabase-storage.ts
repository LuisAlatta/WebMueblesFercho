import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY son requeridos");
    _client = createClient(url, key);
  }
  return _client;
}

export const BUCKET = "imagenes";

export async function uploadImage(
  file: Buffer,
  fileName: string,
  mimeType: string,
  folder: string = "productos"
): Promise<{ url: string; path: string }> {
  const path = `${folder}/${Date.now()}-${fileName}`;

  const client = getClient();
  const { error } = await client.storage
    .from(BUCKET)
    .upload(path, file, { contentType: mimeType, upsert: false });

  if (error) throw new Error(error.message);

  const { data } = client.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteStorageImage(path: string): Promise<void> {
  await getClient().storage.from(BUCKET).remove([path]);
}
