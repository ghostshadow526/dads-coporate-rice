import { useState, useEffect } from 'react';
import { db, collection, query, onSnapshot, orderBy } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, AlertCircle, Image } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../services/errorService';
import { toast } from 'sonner';

interface GalleryImage {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  category?: string;
  createdAt?: any;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('=== GALLERY COMPONENT MOUNTED ===');
    console.log('Fetching images from Firestore gallery collection...');
    
    // Fetch gallery images from Firestore
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('✅ Gallery collection fetched, document count:', snapshot.docs.length);
      const data = snapshot.docs.map(doc => {
        const docData = doc.data();
        console.log('📷 Gallery item ID:', doc.id);
        console.log('   - imageUrl:', docData.imageUrl);
        console.log('   - title:', docData.title);
        console.log('   - category:', docData.category);
        return { 
          id: doc.id, 
          ...docData
        } as GalleryImage;
      });
      setImages(data);
      setLoading(false);
      if (data.length === 0) {
        console.warn('⚠️ No images found in gallery collection');
        setError('No images found in the gallery. Please add images to the gallery collection in Firestore.');
      } else {
        console.log('✅ Successfully loaded', data.length, 'images');
        setError(null);
      }
    }, (error: any) => {
      console.error('❌ Gallery fetch error:', error);
      console.error('   Error code:', error.code);
      console.error('   Error message:', error.message);
      handleFirestoreError(error, OperationType.LIST, 'gallery');
      setError(error.message || 'Failed to load gallery. Check console for details.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Get unique categories for filtering
  const categories = ['all', ...new Set(images.map(img => img.category || 'uncategorized'))];

  // Filter images based on selected category
  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => (img.category || 'uncategorized') === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  const handleImageError = (imageId: string) => {
    console.error('Image failed to load:', imageId);
    setImageErrors(prev => new Set(prev).add(imageId));
    toast.error('Failed to load one or more images');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-yellow-800 font-semibold text-sm">{error}</p>
              <div className="text-yellow-700 text-xs mt-2 space-y-2">
                <p><strong>📝 Setup Instructions:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-1">
                  <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-900">Firebase Console</a></li>
                  <li>Select your project → Firestore Database</li>
                  <li>Create new collection: <code className="bg-yellow-100 px-1.5 py-0.5 rounded">gallery</code></li>
                  <li>Add document with: <code className="bg-yellow-100 px-1.5 py-0.5 rounded">imageUrl</code>, <code className="bg-yellow-100 px-1.5 py-0.5 rounded">title</code>, <code className="bg-yellow-100 px-1.5 py-0.5 rounded">category</code>, <code className="bg-yellow-100 px-1.5 py-0.5 rounded">createdAt</code></li>
                </ol>
                <p className="mt-2"><strong>💡 Tip:</strong> Use ImageKit URLs or any publicly accessible image URL</p>
                <p className="text-[10px] text-yellow-600 mt-1">Check browser console for detailed debug info</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight uppercase">
            Gallery
          </h1>
          <p className="text-gray-600 text-base mb-8">
            Explore our collection of moments and memories from our agricultural operations and community events
          </p>

          {/* Category Filter */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(category)}
                  className={`px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider transition-all ${
                    filter === category
                      ? 'bg-brand-green text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'uncategorized' ? 'Other' : category}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <AnimatePresence mode="wait">
          {filteredImages.length > 0 ? (
            filteredImages.map((image, index) => {
              const isErrored = imageErrors.has(image.id);
              return (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl bg-gray-100 aspect-square cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                  onClick={() => !isErrored && setSelectedImage(image)}
                >
                  {/* Image Container */}
                  <div className="relative w-full h-full overflow-hidden">
                    {isErrored ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
                        <Image className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-gray-500 text-xs text-center px-2">Image failed to load</p>
                        <p className="text-gray-400 text-[10px] text-center px-2 mt-1 break-all">{image.imageUrl?.substring(0, 30)}...</p>
                      </div>
                    ) : (
                      <>
                        <img
                          src={image.imageUrl}
                          alt={image.title || 'Gallery image'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          onError={() => handleImageError(image.id)}
                          crossOrigin="anonymous"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-full p-4"
                          >
                            <ZoomIn className="w-6 h-6 text-brand-green" />
                          </motion.div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Title and Category */}
                  {image.title && !isErrored && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-white font-bold text-sm">{image.title}</h3>
                      {image.category && (
                        <p className="text-gray-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          {image.category}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-semibold">No images in this category</p>
              <p className="text-gray-400 text-sm mt-2">Try selecting a different category or add more images</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[80vh] bg-black rounded-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white p-3 rounded-full transition-all"
              >
                <X className="w-6 h-6 text-black" />
              </button>

              {/* Image */}
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title || 'Gallery image'}
                className="w-full h-full object-contain"
              />

              {/* Image Info */}
              {(selectedImage.title || selectedImage.description) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                  {selectedImage.title && (
                    <h2 className="text-white text-xl font-bold mb-2">{selectedImage.title}</h2>
                  )}
                  {selectedImage.description && (
                    <p className="text-gray-200 text-sm">{selectedImage.description}</p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
