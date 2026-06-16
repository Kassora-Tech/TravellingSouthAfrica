import { initializeFirebase } from '@/firebase';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

const { storage } = initializeFirebase();

/**
 * Uploads an image file to Firebase Storage
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} - Public download URL of the uploaded image
 * @throws {Error} - If upload fails
 */
export async function uploadBlogImage(file) {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Create a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `blog-images/${filename}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    console.log('Image uploaded successfully:', snapshot.ref.fullPath);

    // Get and return the download URL
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading blog image:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

/**
 * Deletes an image from Firebase Storage using its download URL
 * @param {string} imageUrl - Public download URL of the image to delete
 * @returns {Promise<void>}
 * @throws {Error} - If deletion fails
 */
export async function deleteBlogImage(imageUrl) {
  try {
    if (!imageUrl) {
      throw new Error('No image URL provided');
    }

    // Extract the storage path from the download URL
    // Download URLs follow the pattern: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media&token={token}
    const urlParts = imageUrl.split('/o/');
    if (urlParts.length < 2) {
      throw new Error('Invalid image URL format');
    }

    // Decode the path (URL-encoded)
    const encodedPath = urlParts[1].split('?')[0];
    const decodedPath = decodeURIComponent(encodedPath);

    // Create a reference to the file and delete it
    const fileRef = ref(storage, decodedPath);
    await deleteObject(fileRef);
    console.log('Image deleted successfully:', decodedPath);
  } catch (error) {
    console.error('Error deleting blog image:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}
