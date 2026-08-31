/**
 * Utility to compress and resize images before saving to browser storage.
 * Prevents LocalStorage QuotaExceededError (5MB limit) by converting
 * large multi-megabyte photos (3MB-12MB) into lightweight, high-quality images (40KB-90KB).
 */

export async function compressImageFile(
  file: File, 
  maxWidth: number = 1000, 
  maxHeight: number = 1000, 
  quality: number = 0.82
): Promise<string> {
  return new Promise((resolve) => {
    // If not an image, fallback to standard read
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          // Calculate aspect ratio
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              maxHeight = Math.round((height * maxWidth) / width);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string || '');
            return;
          }

          // Fill white background for transparent PNGs converted to JPEG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);

          // Draw scaled image
          ctx.drawImage(img, 0, 0, width, height);

          // Export compressed JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch {
          // Fallback to original data url
          resolve(e.target?.result as string || '');
        }
      };

      img.onerror = () => {
        resolve(e.target?.result as string || '');
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
