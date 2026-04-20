import { useState, useEffect } from 'react';
import { db, collection, query, onSnapshot, orderBy } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../services/errorService';

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

  useEffect(() => {
    // Fetch gallery images from Firestore
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as GalleryImage));
      setImages(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'gallery');
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

  return (
    <div className="max-w-7xl mx-auto">
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
        </motion.div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <AnimatePresence mode="wait">
          {filteredImages.length > 0 ? (
            filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-2xl bg-gray-100 aspect-square cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                onClick={() => setSelectedImage(image)}
              >
                {/* Image Container */}
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.title || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
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
                </div>

                {/* Title and Category */}
                {image.title && (
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
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No images found in this category</p>
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
