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
  "imageUrl": "https://ik.imagekit.io/your-project/image1.jpg",
  "title": "Rice Harvest 2024",
  "description": "Our successful harvest from the 2024 farming season",
  "category": "farming",
  "createdAt": 1713607200000  (Current timestamp in milliseconds)
}
*/


// Option 2: Add Test Data via Firebase Console Code Editor
// =========================================================
// Copy-paste the code below into your browser console when logged into Firebase:

/*
const db = firebase.firestore();

const galleryData = [
  {
    imageUrl: "https://picsum.photos/400/400?random=1",
    title: "Rice Field Overview",
    description: "Our main rice farming field during planting season",
    category: "farming",
    createdAt: new Date()
  },
  {
    imageUrl: "https://picsum.photos/400/400?random=2",
    title: "Harvesting Operations",
    description: "Team harvesting rice during the main season",
    category: "operations",
    createdAt: new Date()
  },
  {
    imageUrl: "https://picsum.photos/400/400?random=3",
    title: "Community Training",
    description: "Agricultural training session with local farmers",
    category: "training",
    createdAt: new Date()
  },
  {
    imageUrl: "https://picsum.photos/400/400?random=4",
    title: "Cooperative Meeting",
    description: "Monthly cooperative meeting and discussions",
    category: "events",
    createdAt: new Date()
  },
  {
    imageUrl: "https://picsum.photos/400/400?random=5",
    title: "Warehouse Storage",
    description: "Our state-of-the-art rice storage facility",
    category: "facilities",
    createdAt: new Date()
  },
  {
    imageUrl: "https://picsum.photos/400/400?random=6",
    title: "Packaging Line",
    description: "DAD'S RICE packaging at our processing plant",
    category: "facilities",
    createdAt: new Date()
  }
];

// Add to Firestore
galleryData.forEach(item => {
  db.collection('gallery').add(item)
    .then(() => console.log('Added:', item.title))
    .catch(error => console.error('Error:', error));
});
*/


// Option 3: Using ImageKit URLs (Recommended for Production)
// ===========================================================
// If you have ImageKit URLs, use them like this:
/*
{
  "imageUrl": "https://ik.imagekit.io/YOUR_IMAGEKIT_ID/your-image.jpg",
  "title": "Image Title",
  "category": "farming",
  "createdAt": 1713607200000
}
*/

// Common ImageKit URL format:
// https://ik.imagekit.io/{YOUR_IMAGEKIT_ID}/path/to/image.jpg
// https://ik.imagekit.io/{YOUR_IMAGEKIT_ID}/path/to/image.jpg?w=400&h=400&q=80

// You can also add transformations:
// https://ik.imagekit.io/YOUR_IMAGEKIT_ID/image.jpg?tr=w-400,h-400,q-80

export {};
