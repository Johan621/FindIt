/**
 * Optimizes a Cloudinary image URL by injecting transformation parameters.
 * E.g., changes /upload/ to /upload/c_fill,w_500,q_auto,f_auto/
 * 
 * @param {string} url - The original Cloudinary URL
 * @param {string} options - Cloudinary transformation flags (default: 'c_fill,w_500,q_auto,f_auto')
 * @returns {string} - The optimized URL
 */
export const optimizeImage = (url, options = 'c_fill,w_500,q_auto,f_auto') => {
  if (!url) return '';
  
  // Check if it's a valid Cloudinary URL
  if (!url.includes('cloudinary.com') || !url.includes('/upload/')) {
    return url; // Return original if not cloudinary or already modified strangely
  }

  // Prevent double-optimizing if it already has transformations right after /upload/
  if (url.includes('/upload/c_') || url.includes('/upload/w_') || url.includes('/upload/q_')) {
      return url;
  }

  // Split and inject transformations
  const parts = url.split('/upload/');
  return `${parts[0]}/upload/${options}/${parts[1]}`;
};
