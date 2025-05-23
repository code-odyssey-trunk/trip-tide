import { createClient } from '@/utils/supabase/client';

export async function uploadTripImage(file: File): Promise<string> {
  const supabase = createClient();
  
  // Generate a unique file name
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `trip-images/${fileName}`;

  // Upload the file
  const { error: uploadError } = await supabase.storage
    .from('trips')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('trips')
    .getPublicUrl(filePath);

  return publicUrl;
} 