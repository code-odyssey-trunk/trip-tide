import { createClient } from '@/utils/supabase/client';

export async function uploadTripImage(file: File, imageUrl: string): Promise<string> {
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

  if (imageUrl) {
    await deleteTripImage(imageUrl);
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('trips')
    .getPublicUrl(filePath);

  return publicUrl;
} 

export async function deleteTripImage(imageUrl: string): Promise<void> {
  const supabase = createClient();
  try {
    // Extract just the filename from the URL
    const fileName = imageUrl.split('/').pop();
    if (!fileName) {
      throw new Error('Invalid image URL: Could not extract filename');
    }
    // Construct the full path
    const filePath = `trip-images/${fileName}`;
    // Delete the file
    const { error: deleteError } = await supabase
      .storage
      .from('trips')
      .remove([filePath]);

    if (deleteError) {
      throw deleteError;
    }

  } catch (error) {
    throw error;
  }
}