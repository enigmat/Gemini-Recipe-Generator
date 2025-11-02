import React, { useState, useEffect } from 'react';
import * as imageStore from '../services/imageStore';

interface StoredImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
}

const StoredImage: React.FC<StoredImageProps> = ({ src, ...props }) => {
  const [resolvedSrc, setResolvedSrc] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const resolveImage = async () => {
      setIsLoading(true);
      if (!src) {
        if (isMounted) {
          setResolvedSrc(undefined);
          setIsLoading(false);
        }
        return;
      }

      if (src.startsWith('indexeddb:')) {
        const id = src.split(':')[1].split('?')[0];
        try {
          const imageData = await imageStore.getImage(id);
          if (isMounted) {
            setResolvedSrc(imageData || undefined);
          }
        } catch (error) {
          console.error("Failed to load image from IndexedDB", error);
          if (isMounted) setResolvedSrc(undefined);
        }
      } else {
        setResolvedSrc(src);
      }
      if (isMounted) {
          setIsLoading(false);
      }
    };

    resolveImage();
    
    return () => {
      isMounted = false;
    };
  }, [src]);

  if (isLoading || !resolvedSrc) {
    // A simple placeholder so layout doesn't jump
    return <div className={`bg-slate-200 animate-pulse ${props.className}`}></div>;
  }

  return <img src={resolvedSrc} {...props} />;
};

export default StoredImage;
