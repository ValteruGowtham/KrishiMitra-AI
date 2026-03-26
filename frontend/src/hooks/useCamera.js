import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for camera access and photo capture
 * Supports both camera capture and file upload
 */
export function useCamera({
  onPhotoCapture,
  onError,
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
} = {}) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photo, setPhoto] = useState(null); // { file, preview, base64 }
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPermission, setHasPermission] = useState(null); // null = not checked, true/false = permission status
  const [isSupported, setIsSupported] = useState(true);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  // Check for browser support and secure context
  const checkSupport = useCallback(() => {
    // Check for secure context (HTTPS or localhost)
    if (!window.isSecureContext) {
      setIsSupported(false);
      setError({
        type: 'INSECURE_CONTEXT',
        message: 'Camera access requires a secure connection (HTTPS) or localhost.',
      });
      return false;
    }

    // Check for mediaDevices support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
      setError({
        type: 'NOT_SUPPORTED',
        message: 'Camera access is not supported in this browser. Please use a modern browser.',
      });
      return false;
    }

    return true;
  }, []);

  // Check camera permission status
  const checkPermission = useCallback(async () => {
    try {
      if (!navigator.permissions) {
        setHasPermission(null);
        return null;
      }

      const result = await navigator.permissions.query({ name: 'camera' });
      setHasPermission(result.state === 'granted');
      
      result.onchange = () => {
        setHasPermission(result.state === 'granted');
      };

      return result.state === 'granted';
    } catch (err) {
      console.error('Error checking camera permission:', err);
      setHasPermission(null);
      return null;
    }
  }, []);

  // Open camera
  const openCamera = useCallback(async () => {
    if (!checkSupport()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsCameraOpen(true);
      setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);
      setHasPermission(false);

      let errorType = 'UNKNOWN';
      let errorMessage = 'Failed to access camera';

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorType = 'PERMISSION_DENIED';
        errorMessage = 'Camera permission denied. Please allow camera access in your browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorType = 'NO_CAMERA';
        errorMessage = 'No camera found. Please connect a camera.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorType = 'CAMERA_IN_USE';
        errorMessage = 'Camera is being used by another application.';
      } else if (err.name === 'OverconstrainedError') {
        errorType = 'CONSTRAINT_ERROR';
        errorMessage = 'Camera constraints could not be satisfied.';
      } else if (err.name === 'TypeError') {
        errorType = 'SECURITY_ERROR';
        errorMessage = 'Security error. Please ensure you are on HTTPS or localhost.';
      }

      const errorObj = { type: errorType, message: errorMessage, originalError: err };
      setError(errorObj);
      setIsCameraOpen(false);

      if (onError) {
        onError(errorObj);
      }
    }
  }, [checkSupport, onError]);

  // Close camera
  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraOpen(false);
  }, []);

  // Capture photo from camera
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !streamRef.current) {
      setError({ type: 'NO_VIDEO', message: 'Camera is not active' });
      return null;
    }

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvasRef.current = canvas;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError({ type: 'CAPTURE_ERROR', message: 'Failed to capture photo' });
            setIsProcessing(false);
            return;
          }

          const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
          const preview = URL.createObjectURL(blob);
          
          // Convert to base64 for API submission
          const reader = new FileReader();
          reader.onloadend = () => {
            const photoData = {
              file,
              preview,
              base64: reader.result,
              width: canvas.width,
              height: canvas.height,
            };

            setPhoto(photoData);
            closeCamera();
            setIsProcessing(false);

            if (onPhotoCapture) {
              onPhotoCapture(photoData);
            }
          };
          reader.readAsDataURL(blob);
        },
        'image/jpeg',
        0.9
      );

      return true;
    } catch (err) {
      const errorObj = { type: 'CAPTURE_ERROR', message: 'Failed to capture photo', originalError: err };
      setError(errorObj);
      setIsProcessing(false);

      if (onError) {
        onError(errorObj);
      }
      return false;
    }
  }, [closeCamera, onPhotoCapture, onError]);

  // Handle file upload
  const handleFileUpload = useCallback((file) => {
    setError(null);

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      const errorObj = {
        type: 'INVALID_TYPE',
        message: `Invalid file type. Please upload JPG, PNG, or WebP images.`,
      };
      setError(errorObj);
      if (onError) onError(errorObj);
      return false;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      const errorObj = {
        type: 'FILE_TOO_LARGE',
        message: `File is too large. Maximum size is ${maxFileSize / 1024 / 1024}MB.`,
      };
      setError(errorObj);
      if (onError) onError(errorObj);
      return false;
    }

    setIsProcessing(true);

    const preview = URL.createObjectURL(file);
    const reader = new FileReader();

    reader.onloadend = () => {
      const photoData = {
        file,
        preview,
        base64: reader.result,
      };

      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        photoData.width = img.width;
        photoData.height = img.height;
        setPhoto(photoData);
        setIsProcessing(false);

        if (onPhotoCapture) {
          onPhotoCapture(photoData);
        }
      };
      img.src = reader.result;
    };

    reader.onerror = () => {
      const errorObj = { type: 'READ_ERROR', message: 'Failed to read file' };
      setError(errorObj);
      setIsProcessing(false);
      if (onError) onError(errorObj);
    };

    reader.readAsDataURL(file);
    return true;
  }, [allowedTypes, maxFileSize, onPhotoCapture, onError]);

  // Clear photo
  const clearPhoto = useCallback(() => {
    if (photo?.preview) {
      URL.revokeObjectURL(photo.preview);
    }
    setPhoto(null);
    setError(null);
  }, [photo]);

  // Cleanup on unmount
  useState(() => {
    return () => {
      closeCamera();
      if (photo?.preview) {
        URL.revokeObjectURL(photo.preview);
      }
    };
  });

  return {
    isCameraOpen,
    isProcessing,
    photo,
    error,
    isSupported,
    hasPermission,
    videoRef,
    openCamera,
    closeCamera,
    capturePhoto,
    handleFileUpload,
    clearPhoto,
    checkSupport,
    checkPermission,
  };
}

export default useCamera;
