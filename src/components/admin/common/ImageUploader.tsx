'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Trash2, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadImageToCPanel, deleteImageFromCPanel } from '@/lib/imageUpload';
import { toast } from 'react-hot-toast';

interface ImageUploaderProps {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  maxSize?: number; // in MB
  aspectRatio?: string; // e.g., '1:1', '16:9', '4:3'
  className?: string;
}

export default function ImageUploader({
  value,
  onChange,
  folder = 'products',
  maxSize = 5, // 5MB default
  aspectRatio = '1:1',
  className = '',
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Calculate aspect ratio for the container
  const getAspectRatioStyle = () => {
    if (!aspectRatio) return {};
    
    const [width, height] = aspectRatio.split(':').map(Number);
    const paddingTop = `${(height / width) * 100}%`;
    
    return { paddingTop };
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      setIsUploading(true);
      try {
        const result = await uploadImageToCPanel(file, folder);
        
        if (result.success && result.url) {
          onChange(result.url);
          toast.success('Image uploaded successfully');
        } else {
          throw new Error(result.error || 'Failed to upload image');
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to upload image');
        // Clear the preview on error
        setPreviewUrl(null);
      } finally {
        setIsUploading(false);
        // Clean up the preview URL
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      }
    },
    [onChange, folder]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': [],
    },
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    multiple: false,
  });

  const handleDelete = async () => {
    if (!value) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteImageFromCPanel(value);
      
      if (result.success) {
        onChange(null);
        setPreviewUrl(null);
        toast.success('Image deleted successfully');
      } else {
        throw new Error(result.error || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete image');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {!value && !previewUrl ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-400'
          }`}
          style={{ ...getAspectRatioStyle() }}
        >
          <input {...getInputProps()} />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            {isUploading ? (
              <Loader2 className="h-10 w-10 text-pink-500 animate-spin mb-2" />
            ) : (
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
            )}
            <p className="text-sm text-gray-500 text-center">
              {isDragActive
                ? 'Drop the image here'
                : isUploading
                ? 'Uploading...'
                : `Drag & drop an image, or click to select (max ${maxSize}MB)`}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden" style={{ ...getAspectRatioStyle() }}>
          <Image
            src={previewUrl || value || ''}
            alt="Uploaded image"
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
