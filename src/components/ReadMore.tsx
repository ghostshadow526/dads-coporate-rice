import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface ReadMoreProps {
  children: React.ReactNode;
  maxHeight?: string;
  className?: string;
  gradientColor?: string;
}

export const ReadMore: React.FC<ReadMoreProps> = ({ children, maxHeight = "100px", className = "", gradientColor = "from-white" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={`relative ${className}`}>
      <div 
        className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[2000px]' : `max-h-[${maxHeight}]`}`}
        style={{ maxHeight: isExpanded ? '2000px' : maxHeight }}
      >
        {children}
      </div>
      {!isExpanded && (
        <div className={`absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t ${gradientColor} to-transparent pointer-events-none`} />
      )}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-green-700 font-bold text-sm mt-2 hover:underline flex items-center"
      >
        {isExpanded ? 'Read Less' : 'Read More'}
        <ArrowRight className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? '-rotate-90' : 'rotate-0'}`} />
      </button>
    </div>
  );
};
