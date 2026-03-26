import { useState, useEffect, useCallback, useMemo } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react';
import { getWeatherForecast, getCurrentWeather } from '../services/api';

// Indian States and Districts mapping
const INDIA_STATES = {
  'Andhra Pradesh': ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Prakasam', 'Srikakulam', 'Nellore', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'],
  'Arunachal Pradesh': ['Tawang', 'West Kameng', 'East Kameng', 'Papum Pare', 'Kurung Kumey', 'Kra Daadi', 'Lower Subansiri', 'Upper Subansiri', 'West Siang', 'East Siang', 'Siang', 'Lower Siang', 'Upper Siang', 'Changlang', 'Tirap', 'Longding'],
  'Assam': ['Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Dima Hasao', 'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'],
  'Bihar': ['Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'],
  'Chhattisgarh': ['Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Gaurela Pendra Marwahi', 'Janjgir Champa', 'Jashpur', 'Kabirdham', 'Kanker', 'Kondagaon', 'Korba', 'Koriya', 'Mahasamund', 'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sukma', 'Surajpur', 'Surguja'],
  'Goa': ['North Goa', 'South Goa'],
  'Gujarat': ['Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'],
  'Haryana': ['Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'],
  'Himachal Pradesh': ['Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul Spiti', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'],
  'Jharkhand': ['Bokaro', 'Chatra', 'Deoghar', 'Dumka', 'East Singhbhum', 'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahibganj', 'Seraikela Kharsawan', 'Simdega', 'West Singhbhum'],
  'Karnataka': ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'],
  'Kerala': ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'],
  'Madhya Pradesh': ['Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad', 'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha'],
  'Maharashtra': ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'],
  'Manipur': ['Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam', 'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong', 'Tengnoupal', 'Thoubal', 'Ukhrul'],
  'Meghalaya': ['East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills', 'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'],
  'Mizoram': ['Aizawl', 'Champhai', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit', 'Saiha', 'Serchhip'],
  'Nagaland': ['Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon', 'Peren', 'Phek', 'Tuensang', 'Wokha', 'Zunheboto'],
  'Odisha': ['Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh'],
  'Punjab': ['Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Mansa', 'Moga', 'Mohali', 'Muktsar', 'Pathankot', 'Patiala', 'Rupnagar', 'Sangrur', 'Shaheed Bhagat Singh Nagar', 'Tarn Taran'],
  'Rajasthan': ['Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur'],
  'Sikkim': ['East Sikkim', 'North Sikkim', 'South Sikkim', 'West Sikkim'],
  'Tamil Nadu': ['Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'],
  'Telangana': ['Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam', 'Komaram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal Rural', 'Warangal Urban', 'Yadadri Bhuvanagiri'],
  'Tripura': ['Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura'],
  'Uttar Pradesh': ['Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'],
  'Uttarakhand': ['Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi'],
  'West Bengal': ['Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur', 'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'],
};

const DEFAULT_LOCATION = { state: 'Rajasthan', district: 'Ajmer' };
const STATE_NAMES = Object.keys(INDIA_STATES);

// Weather-based background gradients (subtle, non-distracting)
const WEATHER_BACKGROUNDS = {
  'Clear sky': 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
  'Hazy sunshine': 'linear-gradient(135deg, #FEF3C7 0%, #FCD34D 100%)',
  'Partly cloudy': 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
  'Cloudy': 'linear-gradient(135deg, #F1F5F9 0%, #CBD5E1 100%)',
  'Overcast': 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 100%)',
  'Thunderstorm likely': 'linear-gradient(135deg, #C7D2FE 0%, #818CF8 100%)',
  'Thunderstorm': 'linear-gradient(135deg, #C7D2FE 0%, #6366F1 100%)',
  'Rain': 'linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%)',
  'Light rain': 'linear-gradient(135deg, #E0F2FE 0%, #7DD3FC 100%)',
  'Clearing up': 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
  'Fog': 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
  'Mist': 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
};

// Weather icon mapping
const WEATHER_ICONS = {
  'Clear sky': <Sun className="w-8 h-8" />,
  'Hazy sunshine': <Sun className="w-8 h-8" />,
  'Partly cloudy': <Cloud className="w-8 h-8" />,
  'Thunderstorm likely': <CloudRain className="w-8 h-8" />,
  'Thunderstorm': <CloudRain className="w-8 h-8" />,
  'Clearing up': <Cloud className="w-8 h-8" />,
  'Rain': <CloudRain className="w-8 h-8" />,
  'Light rain': <CloudRain className="w-8 h-8" />,
  'Overcast': <Cloud className="w-8 h-8" />,
  'Cloudy': <Cloud className="w-8 h-8" />,
  'Fog': <Cloud className="w-8 h-8" />,
  'Mist': <Cloud className="w-8 h-8" />,
};

// Get day name from date offset
const getDayName = (offset) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  today.setDate(today.getDate() + offset);
  return days[today.getDay()];
};

const tryParseDate = (value) => {
  if (!value || typeof value !== 'string') return null;

  // Supports common formats from APIs: YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const dmYMatch = value.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmYMatch) {
    const [, day, month, year] = dmYMatch;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getForecastDayInfo = (day, index) => {
  const parsedDate = tryParseDate(day?.date);
  if (parsedDate) {
    return {
      shortDay: parsedDate.toLocaleDateString('en-IN', { weekday: 'short' }),
      dateLabel: parsedDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    };
  }

  if (typeof day?.date === 'string' && day.date.toLowerCase().includes('tomorrow')) {
    return {
      shortDay: getDayName(1).slice(0, 3),
      dateLabel: 'Tomorrow',
    };
  }

  const fallbackDate = new Date();
  fallbackDate.setDate(fallbackDate.getDate() + index + 1);
  return {
    shortDay: fallbackDate.toLocaleDateString('en-IN', { weekday: 'short' }),
    dateLabel: fallbackDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
  };
};

export default function WeatherPage() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('demo_data');
  const [stateInput, setStateInput] = useState(DEFAULT_LOCATION.state);
  const [districtInput, setDistrictInput] = useState(DEFAULT_LOCATION.district);
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const exactMatchedState = useMemo(() => {
    const normalized = stateInput.trim().toLowerCase();
    if (!normalized) return null;
    return STATE_NAMES.find((state) => state.toLowerCase() === normalized) || null;
  }, [stateInput]);

  const filteredStates = useMemo(() => {
    const normalized = stateInput.trim().toLowerCase();
    if (!normalized || exactMatchedState) return STATE_NAMES;
    return STATE_NAMES.filter((state) => state.toLowerCase().includes(normalized));
  }, [stateInput, exactMatchedState]);

  // Get districts for selected state
  const availableDistricts = useMemo(() => {
    return exactMatchedState ? INDIA_STATES[exactMatchedState] || [] : [];
  }, [exactMatchedState]);

  // Auto-update district when state changes
  useEffect(() => {
    const districts = exactMatchedState ? INDIA_STATES[exactMatchedState] || [] : [];
    if (districts.length > 0 && !districts.includes(districtInput)) {
      setDistrictInput(districts[0]);
    }
  }, [exactMatchedState, districtInput]);

  // Fetch weather data
  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [currentData, forecastData] = await Promise.all([
        getCurrentWeather(location.state, location.district),
        getWeatherForecast(location.state, location.district),
      ]);
      
      setCurrent(currentData.current);
      setForecast(forecastData.forecast || []);
      setSource(forecastData.source || 'demo_data');
    } catch (err) {
      console.error('Failed to fetch weather:', err);
      setError('Failed to load weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [location]);

  // Fetch on mount and location change
  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  // Handle state selection
  const handleStateSelect = (state) => {
    setStateInput(state);
    setShowStateDropdown(false);
    const districts = INDIA_STATES[state] || [];
    if (districts.length > 0) {
      setDistrictInput(districts[0]);
    }
  };

  // Handle location search
  const handleLocationChange = (e) => {
    e.preventDefault();
    if (exactMatchedState && districtInput) {
      setStateInput(exactMatchedState);
      setLocation({ state: exactMatchedState, district: districtInput });
    }
  };

  // Get background style for weather condition
  const getWeatherBackground = (condition) => {
    const conditionLower = condition?.toLowerCase() || '';
    for (const [key, value] of Object.entries(WEATHER_BACKGROUNDS)) {
      if (conditionLower.includes(key.toLowerCase()) || key.toLowerCase().includes(conditionLower)) {
        return value;
      }
    }
    return WEATHER_BACKGROUNDS['Partly cloudy']; // Default
  };

  return (
    <div className="page-wrap">
      {/* Header */}
      <div className="market-header-bg">
        <div className="mh-title">🌤️ Weather Forecast for Farmers</div>
        <div className="mh-sub">
          5-day forecast with farming-specific advisory
          {source === 'imd_api' && (
            <span style={{ marginLeft: '8px', opacity: 0.7, fontSize: '11px' }}>
              🟢 Live from IMD
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '20px 24px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {/* Location Selector */}
        <form onSubmit={handleLocationChange} style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          {/* State Dropdown with Search */}
          <div style={{ position: 'relative', minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Select State"
              value={stateInput}
              onChange={(e) => {
                setStateInput(e.target.value);
                setShowStateDropdown(true);
              }}
              onFocus={() => setShowStateDropdown(true)}
              onBlur={() => {
                setTimeout(() => setShowStateDropdown(false), 120);
              }}
              style={{
                padding: '10px 36px 10px 14px',
                border: '1.5px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '13px',
                width: '100%',
                cursor: 'pointer',
              }}
            />
            <ChevronDown 
              className="w-4 h-4" 
              style={{ 
                position: 'absolute', 
                right: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--color-muted)',
                pointerEvents: 'none',
              }} 
            />
            
            {/* State Dropdown */}
            {showStateDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'var(--color-surface)',
                border: '1.5px solid var(--color-border)',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                zIndex: 100,
                maxHeight: '300px',
                overflowY: 'auto',
                marginTop: '4px',
              }}>
                {filteredStates.map((state) => (
                  <div
                    key={state}
                    onClick={() => handleStateSelect(state)}
                    style={{
                      padding: '10px 14px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      borderBottom: '1px solid #F5F5F2',
                      background: state === stateInput ? '#F0F7F2' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (state !== stateInput) {
                        e.target.style.background = '#F9FAF9';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (state !== stateInput) {
                        e.target.style.background = 'transparent';
                      }
                    }}
                  >
                    {state}
                  </div>
                ))}
                {filteredStates.length === 0 && (
                  <div style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--color-muted)' }}>
                    No matching state found. Please choose a valid state.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* District Dropdown */}
          <div style={{ position: 'relative', minWidth: '200px' }}>
            <select
              value={districtInput}
              onChange={(e) => setDistrictInput(e.target.value)}
              disabled={availableDistricts.length === 0}
              style={{
                padding: '10px 14px',
                border: '1.5px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '13px',
                width: '100%',
                cursor: availableDistricts.length === 0 ? 'not-allowed' : 'pointer',
                background: 'var(--color-surface)',
                opacity: availableDistricts.length === 0 ? 0.7 : 1,
              }}
            >
              {availableDistricts.length === 0 && <option value="">Select a valid state first</option>}
              {availableDistricts.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              background: 'var(--color-gold)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Loading...' : '🔍 Get Weather'}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '12px 16px',
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            color: '#DC2626',
            fontSize: '12px',
            marginBottom: '16px',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Current Weather Card */}
        {current && !loading && (
          <div 
            className="result-card" 
            style={{ 
              marginBottom: '24px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div className="result-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                    {WEATHER_ICONS[current.condition] || <Cloud />}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '999px',
                      background: getWeatherBackground(current.condition),
                      border: '1px solid rgba(0,0,0,0.08)',
                      fontSize: '13px',
                    }}>
                      {current.condition}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                    {location.district}, {location.state}
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', borderRadius: '10px' }}>
                    <Thermometer className="w-5 h-5" style={{ color: '#92400E' }} />
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#78350F' }}>{current.temperature}°C</div>
                      <div style={{ fontSize: '10px', color: '#92400E' }}>Temperature</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', borderRadius: '10px' }}>
                    <Droplets className="w-5 h-5" style={{ color: '#1E40AF' }} />
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#1E3A8A' }}>{current.humidity}%</div>
                      <div style={{ fontSize: '10px', color: '#1E40AF' }}>Humidity</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', borderRadius: '10px' }}>
                    <Wind className="w-5 h-5" style={{ color: '#166534' }} />
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#14532D' }}>{current.wind_kmh} km/h</div>
                      <div style={{ fontSize: '10px', color: '#166534' }}>Wind</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', borderRadius: '10px' }}>
                    <Thermometer className="w-5 h-5" style={{ color: '#991B1B' }} />
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#7F1D1D' }}>{current.feels_like}°C</div>
                      <div style={{ fontSize: '10px', color: '#991B1B' }}>Feels like</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5-Day Forecast - Single Row */}
        {!loading && forecast.length > 0 && (
          <div>
            <h2 className="section-title serif" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📅 5-Day Forecast
            </h2>
            <div style={{ overflowX: 'auto', paddingBottom: '4px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(190px, 1fr))', gap: '12px', minWidth: '980px' }}>
              {forecast.map((day, i) => (
                <div key={i} className="sch-card" style={{ padding: '14px' }}>
                  {(() => {
                    const dayInfo = getForecastDayInfo(day, i);
                    return (
                  <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {dayInfo.shortDay}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--color-muted)', marginBottom: '2px' }}>
                      {dayInfo.dateLabel}
                    </div>
                    <div style={{ fontSize: '28px', margin: '6px 0' }}>
                      {day.icon || '☀️'}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '2px' }}>
                      {day.condition}
                    </div>
                  </div>
                    );
                  })()}
                  
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text)' }}>
                        {day.temp_max}°
                      </div>
                      <div style={{ fontSize: '9px', color: 'var(--color-muted)' }}>Max</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-muted)' }}>
                        {day.temp_min}°
                      </div>
                      <div style={{ fontSize: '9px', color: 'var(--color-muted)' }}>Min</div>
                    </div>
                  </div>
                  
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px', fontSize: '10px' }}>
                      <Droplets className="w-3 h-3" />
                      <span style={{ color: 'var(--color-muted)' }}>{day.humidity}%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px', fontSize: '10px' }}>
                      <Wind className="w-3 h-3" />
                      <span style={{ color: 'var(--color-muted)' }}>{day.wind_kmh} km/h</span>
                    </div>
                    {day.rain_mm > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px' }}>
                        <CloudRain className="w-3 h-3" />
                        <span style={{ color: 'var(--color-muted)' }}>{day.rain_mm}mm</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Farming Advisory - Compact */}
                  <div style={{
                    marginTop: '10px',
                    padding: '8px',
                    background: day.risk_level === 'High' ? '#FEF2F2' : day.risk_level === 'Medium' ? '#FEF3C7' : '#F0FDF4',
                    borderRadius: '6px',
                    border: `1px solid ${day.risk_level === 'High' ? '#FCA5A5' : day.risk_level === 'Medium' ? '#FCD34D' : '#86EFAC'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      {day.risk_level === 'High' ? (
                        <AlertTriangle className="w-2.5 h-2.5" style={{ color: '#DC2626' }} />
                      ) : (
                        <CheckCircle className="w-2.5 h-2.5" style={{ color: '#166534' }} />
                      )}
                      <span style={{
                        fontSize: '8px',
                        fontWeight: '700',
                        color: day.risk_level === 'High' ? '#DC2626' : day.risk_level === 'Medium' ? '#92400E' : '#166534',
                        textTransform: 'uppercase',
                      }}>
                        {day.risk_level}
                      </span>
                    </div>
                    <div style={{ fontSize: '9px', color: 'var(--color-text)', lineHeight: '1.3' }}>
                      {day.farming_action}
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            gap: '12px',
          }}>
            <div className="loading-ring"></div>
            <span style={{ color: 'var(--color-muted)', fontSize: '13px' }}>Fetching weather forecast...</span>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showStateDropdown && (
        <div 
          style={{ position: 'fixed', inset: 0, zIndex: 99 }} 
          onClick={() => setShowStateDropdown(false)}
        />
      )}
    </div>
  );
}
