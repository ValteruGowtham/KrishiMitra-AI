/**
 * KrishiMitra AI API Service
 * Handles all backend API communication
 */

import axios from 'axios';

// API Base URL - using port 8001 for FastAPI backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout for AI responses
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging/debugging
api.interceptors.request.use(
  (config) => {
    console.log('[API Request]', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('[API Error]', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ============================================================================
// Advisory API
// ============================================================================

/**
 * Submit advisory query (text only)
 * @param {Object} data - Advisory request data
 * @param {string} data.text_input - User's query text
 * @param {string} data.language - Language code (e.g., 'hi-IN', 'en-IN')
 * @param {string} data.farmer_id - Farmer ID (optional)
 * @returns {Promise<Object>} Advisory response
 */
export const submitAdvisory = async (data) => {
  const response = await api.post('/advisory', {
    farmer_id: data.farmer_id || 'demo_farmer',
    text_input: data.text_input,
    language: 'hi', // Short language label for backend
    language_code: data.language || 'hi-IN', // BCP-47 code
  });
  return response.data;
};

/**
 * Submit advisory query with photo
 * @param {Object} data - Advisory request data
 * @param {string} data.text_input - User's query text
 * @param {File} data.photo - Photo file
 * @param {string} data.language - Language code
 * @param {string} data.farmer_id - Farmer ID
 * @returns {Promise<Object>} Advisory response
 */
export const submitAdvisoryWithPhoto = async (data) => {
  const formData = new FormData();
  formData.append('farmer_id', data.farmer_id || 'demo_farmer');
  formData.append('text_input', data.text_input || '');
  formData.append('photo', data.photo);
  formData.append('language', 'hi'); // Short language label
  formData.append('language_code', data.language || 'hi-IN'); // BCP-47 code

  const response = await api.post('/advisory/with-photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// ============================================================================
// Health & Status API
// ============================================================================

/**
 * Check backend health status
 * @returns {Promise<Object>} Health status with agents online
 */
export const getHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

// ============================================================================
// Farmer Profile API
// ============================================================================

/**
 * Register a new farmer
 * @param {Object} farmerData - Farmer profile data
 * @returns {Promise<Object>} Created farmer profile
 */
export const registerFarmer = async (farmerData) => {
  const response = await api.post('/farmer/register', farmerData);
  return response.data;
};

/**
 * Get farmer profile by ID
 * @param {string} farmerId - Farmer ID
 * @returns {Promise<Object>} Farmer profile
 */
export const getFarmerProfile = async (farmerId) => {
  const response = await api.get(`/farmer/${farmerId}`);
  return response.data;
};

// ============================================================================
// Audit Trail API
// ============================================================================

/**
 * Get audit record by ID
 * @param {string} auditId - Audit record ID
 * @returns {Promise<Object>} Full audit record
 */
export const getAuditRecord = async (auditId) => {
  const response = await api.get(`/audit/${auditId}`);
  return response.data;
};

/**
 * Get last 10 advisories for a farmer
 * @param {string} farmerId - Farmer ID
 * @returns {Promise<Array>} List of advisory records
 */
export const getFarmerAdvisories = async (farmerId) => {
  const response = await api.get(`/audit/farmer/${farmerId}`);
  return response.data;
};

// ============================================================================
// Government Schemes API
// ============================================================================

/**
 * Get filtered list of government schemes
 * @param {Object} filters - Filter options
 * @param {string} filters.category - Scheme category
 * @param {string} filters.state - State filter
 * @returns {Promise<Array>} List of schemes
 */
export const getSchemes = async (filters = {}) => {
  const response = await api.get('/schemes', { params: filters });
  return response.data;
};

// ============================================================================
// Speech Services API
// ============================================================================

/**
 * Convert speech to text
 * @param {Blob} audioBlob - Audio blob
 * @param {string} language - Language code
 * @returns {Promise<Object>} Transcribed text
 */
export const speechToText = async (audioBlob, language = 'hi-IN') => {
  const formData = new FormData();
  formData.append('audio', audioBlob);
  formData.append('language', language);

  const response = await api.post('/stt', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Convert text to speech
 * @param {string} text - Text to convert
 * @param {string} language - Language code
 * @returns {Promise<Blob>} Audio blob
 */
export const textToSpeech = async (text, language = 'hi-IN') => {
  const response = await api.post('/tts', {
    text,
    language,
  }, {
    responseType: 'blob',
  });
  return response.data;
};

// ============================================================================
// Market Rates API
// ============================================================================

/**
 * Get live mandi prices
 * @param {Object} filters - Filter options
 * @param {string} filters.crop - Crop name to search
 * @param {string} filters.state - State filter
 * @returns {Promise<Object>} List of mandi prices with MSP
 */
export const getMandiPrices = async (filters = {}) => {
  const response = await api.get('/mandi/prices', { params: filters });
  return response.data;
};

/**
 * Get MSP list
 * @returns {Promise<Object>} MSP data for all crops
 */
export const getMSPList = async () => {
  const response = await api.get('/mandi/msp');
  return response.data;
};

/**
 * Get available states
 * @returns {Promise<Object>} List of states
 */
export const getAvailableStates = async () => {
  const response = await api.get('/mandi/states');
  return response.data;
};

/**
 * Get available crops
 * @returns {Promise<Object>} List of crops
 */
export const getAvailableCrops = async () => {
  const response = await api.get('/mandi/crops');
  return response.data;
};

// ============================================================================
// Weather API
// ============================================================================

/**
 * Get 5-day weather forecast with farming advisory
 * @param {string} state - State name
 * @param {string} district - District name
 * @returns {Promise<Object>} Weather forecast data
 */
export const getWeatherForecast = async (state, district) => {
  const response = await api.get('/weather/forecast', {
    params: { state, district },
  });
  return response.data;
};

/**
 * Get current weather conditions
 * @param {string} state - State name
 * @param {string} district - District name
 * @returns {Promise<Object>} Current weather data
 */
export const getCurrentWeather = async (state, district) => {
  const response = await api.get('/weather/current', {
    params: { state, district },
  });
  return response.data;
};

// ============================================================================
// Export default
// ============================================================================

export default api;
