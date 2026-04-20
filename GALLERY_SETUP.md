// FIRESTORE GALLERY SETUP GUIDE
// ============================
// This file contains helper code to populate your Firestore gallery collection

// Option 1: Manual Setup via Firebase Console
// ============================================
// 1. Go to: https://console.firebase.google.com/
// 2. Select your project
// 3. Go to Firestore Database
// 4. Create a new Collection called "gallery"
// 5. Add documents with the following structure:
/*
{
  "url": "https://ik.imagekit.io/your-project/image1.jpg",
  "title": "Rice Harvest 2024",
  "description": "Our successful harvest from the 2024 farming season",
  "category": "farming",
  "createdAt": 1713607200000,
  "createdBy": "userId"
}
*/


// Option 2: Add Test Data via Firebase Console
// ============================================
// Copy documents with this structure:

/*
{
  "url": "https://picsum.photos/400/400?random=1",
  "title": "Rice Field Overview",
  "description": "Our main rice farming field",
  "category": "farming",
  "createdAt": 1713607200000
}
*/


// Option 3: Using ImageKit URLs (Recommended for Production)
// ===========================================================
// If you have ImageKit URLs, use them like this:
/*
{
  "url": "https://ik.imagekit.io/YOUR_IMAGEKIT_ID/your-image.jpg",
  "title": "Image Title",
  "category": "farming",
  "createdAt": 1713607200000,
  "createdBy": "userId"
}
*/

// Common ImageKit URL format:
// https://ik.imagekit.io/{YOUR_IMAGEKIT_ID}/path/to/image.jpg
// https://ik.imagekit.io/{YOUR_IMAGEKIT_ID}/path/to/image.jpg?w=400&h=400&q=80

// You can also add transformations:
// https://ik.imagekit.io/YOUR_IMAGEKIT_ID/image.jpg?tr=w-400,h-400,q-80

export {};
