import { supabase } from '@components/lib/supabaseClient';
import { toast } from 'sonner';


export const uploadSignFileToSupabase = async (
  SignFile: File | null,
  credential_level: string | null,
  credentialApplicationId: string | null,
  applicantId: string | null
): Promise<string> => { // Changed return type to Promise<string>
  if (!SignFile) {
    throw new Error('No signature file found.');
  }
  if (!applicantId) {
    throw new Error('Applicant ID is missing. Cannot generate filename.');
  }
  if (!credentialApplicationId) {
    throw new Error('Credential Application ID is missing. This is required for some file naming conventions or tracking.');
  }

  let folderName: string;
  let label: string;

  switch (credential_level) {
    case "pemimpin kumpulan":
      folderName = "pemimpin-kumpulan";
      label = "pk";
      break;
    case "negeri":
      folderName = "pj-ppm-negeri";
      label = "pjn";
      break;
    case "daerah":
      folderName = "su-ppm-daerah";
      label = "sud";
      break;
    default:
      throw new Error(`Unknown credential level: ${credential_level}. Cannot determine upload folder or file label.`);
  }

  // Get current date and format it for the filename (e.g., YYYYMMDD_HHMMSS)
  const now = new Date();
  const dateString = now.toISOString()
                         .replace(/[:.-]/g, '') // Remove colons, dots, and hyphens
                         .replace('T', '_')    // Replace 'T' with underscore
                         .split('+')[0]        // Remove timezone info (assuming UTC or irrelevant for filename)
                         .split('Z')[0];       // Remove 'Z' if present

  // Create the new unique file name: {label}_applicantId_date
  const fileExtension = SignFile.name.split('.').pop();
  const fileName = `${label}_${applicantId}_${dateString}.${fileExtension}`;
  const filePath = `${folderName}/${fileName}`;
  const bucketName = 'pengesahan-tauliah-files';

  try {
    toast.info("Memproses menyimpan fail tandatangan...");
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, SignFile, {
        cacheControl: '3600', // Cache for 1 hour
        upsert: false, // Do not overwrite existing files with the same name
      });

    if (error) {
      console.error('Supabase upload error:', error);
      toast.error("Gagal menyimpan fail tandatangan");
      throw new Error(`File upload failed: ${error.message}`);
    }

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    if (publicUrlData && publicUrlData.publicUrl) {
        toast.success("Fail tandatangan berjaya disimpan!"); // Corrected toast message for success
        return publicUrlData.publicUrl; // Return the URL here
    } else {
        toast.error("Gagal mendapatkan URL awam selepas memuat naik."); // Corrected toast message
        throw new Error('Failed to get public URL after upload.');
    }

  } catch (error: any) {
    toast.error("Gagal menyimpan fail tandatangan");
    console.error("Error during file upload process:", error);
    throw error; // Re-throw to be handled by the calling component
  }
};