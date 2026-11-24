import {useState} from 'react';
import {Image as ImageIcon} from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function SafeImage({src, alt, className = '', fallbackLabel}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-slate-100 text-slate-500 border border-slate-200 p-6 text-center ${className}`}
      >
        <ImageIcon className="w-7 h-7 mb-2 text-slate-400" strokeWidth={1.5} />
        <span className="text-xs font-medium text-slate-600 max-w-xs">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
