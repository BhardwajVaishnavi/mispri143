/**
 * Utility for handling image uploads to cPanel
 */

interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Uploads an image to cPanel hosting
 * @param file The file to upload
 * @param folder The folder to upload to (e.g., 'products', 'categories')
 * @returns Promise with upload result
 */
export async function uploadImageToCPanel(
  file: File,
  folder: string = 'products'
): Promise<UploadResponse> {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    // Send to your API endpoint that handles the upload to cPanel
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload image');
    }

    return {
      success: true,
      url: data.url,
    };
  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Deletes an image from cPanel hosting
 * @param imageUrl The URL of the image to delete
 * @returns Promise with deletion result
 */
export async function deleteImageFromCPanel(imageUrl: string): Promise<UploadResponse> {
  try {
    // Extract the path from the URL
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    
    // Send to your API endpoint that handles the deletion
    const response = await fetch('/api/upload', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete image');
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Image deletion error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
