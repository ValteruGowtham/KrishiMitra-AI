import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for speech recognition using Web Speech API
 * Supports multiple Indian languages
 */
export function useSpeechRecognition({
  language = 'en-IN',
  onResult,
  onError,
} = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  // Check for browser support
  const checkSupport = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setError({
        type: 'NOT_SUPPORTED',
        message: 'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.',
      });
      return false;
    }

    // Check for secure context (HTTPS or localhost)
    if (!window.isSecureContext) {
      setIsSupported(false);
      setError({
        type: 'INSECURE_CONTEXT',
        message: 'Speech recognition requires a secure connection (HTTPS) or localhost.',
      });
      return false;
    }

    return true;
  }, []);

  // Start listening
  const startListening = useCallback(() => {
    if (!checkSupport()) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);

        if (finalTranscript && onResult) {
          onResult(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        let errorType = 'UNKNOWN';
        let errorMessage = 'An unknown error occurred';

        switch (event.error) {
          case 'no-speech':
            errorType = 'NO_SPEECH';
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorType = 'AUDIO_CAPTURE';
            errorMessage = 'No microphone found. Please connect a microphone.';
            break;
          case 'not-allowed':
            errorType = 'PERMISSION_DENIED';
            errorMessage = 'Microphone permission denied. Please allow microphone access in your browser settings.';
            break;
          case 'aborted':
            errorType = 'ABORTED';
            errorMessage = 'Recording was cancelled.';
            break;
          case 'network':
            errorType = 'NETWORK';
            errorMessage = 'Network error occurred. Please check your connection.';
            break;
          default:
            errorMessage = event.message || errorMessage;
        }

        setError({ type: errorType, message: errorMessage });
        setIsListening(false);

        if (onError) {
          onError({ type: errorType, message: errorMessage });
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.start();
    } catch (err) {
      const errorObj = {
        type: 'INIT_ERROR',
        message: err.message || 'Failed to start speech recognition',
      };
      setError(errorObj);
      setIsListening(false);

      if (onError) {
        onError(errorObj);
      }
    }
  }, [language, onResult, onError, checkSupport]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Cancel listening
  const cancelListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (err) {
        console.error('Error cancelling recognition:', err);
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setTranscript('');
  }, []);

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  // Cleanup on unmount
  useState(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (err) {
          // Ignore cleanup errors
        }
      }
    };
  });

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    cancelListening,
    clearTranscript,
    checkSupport,
  };
}

export default useSpeechRecognition;
