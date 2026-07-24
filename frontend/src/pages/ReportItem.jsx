import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar } from 'lucide-react';
import API from '../api/axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
    locationfound(e) {
      if (!position) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      }
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function ReportItem() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'lost',
    location: '',
    lat: '',
    lng: '',
    date: ''
  });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const dateInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (photo) data.append('photo', photo);

      await API.post('/items', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Item reported successfully!');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      if (err.response?.status === 403) {
        setError(
          <span>
            {err.response?.data?.message || 'Failed to report item'}{' '}
            <a href="/contact-support" className="underline font-bold ml-1 text-indigo-200 hover:text-white">Contact Support</a>
          </span>
        );
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 3000);
      } else {
        setError(err.response?.data?.message || 'Failed to report item');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 dark:text-blue-400 hover:underline transition mb-6 inline-flex items-center gap-1 text-sm font-semibold"
        >
          ← Back
        </button>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white text-center">
            Report an Item
          </h2>

          {error && (
            <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-sm mb-4 py-2 px-3 rounded-md text-center font-medium">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 text-sm mb-4 py-2 px-3 rounded-md text-center font-medium">
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-2 border rounded-md py-3 cursor-pointer transition ${formData.type === 'lost' ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-semibold' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                <input
                  type="radio"
                  name="type"
                  value="lost"
                  checked={formData.type === 'lost'}
                  onChange={handleChange}
                  className="sr-only"
                />
                🔴 Lost Item
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 border rounded-md py-3 cursor-pointer transition ${formData.type === 'found' ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 font-semibold' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                <input
                  type="radio"
                  name="type"
                  value="found"
                  checked={formData.type === 'found'}
                  onChange={handleChange}
                  className="sr-only"
                />
                🟢 Found Item
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Item Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Blue Water Bottle, Black Leather Wallet"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white rounded-md px-4 py-2.5 outline-none transition duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Detailed Description
              </label>
              <textarea
                name="description"
                placeholder="Describe key features, brand, color, serial numbers, or contents..."
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white rounded-md px-4 py-2.5 outline-none transition duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                rows="3"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Electronics, Books"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white rounded-md px-4 py-2.5 outline-none transition duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Main Library, Room 204"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white rounded-md px-4 py-2.5 outline-none transition duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex justify-between">
                  <span>Pinpoint Location on Map</span>
                  <span className="text-xs text-slate-500 font-normal">Click to drop a pin</span>
                </label>
                <div className="h-64 w-full rounded-md overflow-hidden border border-slate-300 dark:border-slate-700 relative z-0">
                  <MapContainer 
                    center={[28.6139, 77.2090]} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker 
                      position={formData.lat ? { lat: formData.lat, lng: formData.lng } : null} 
                      setPosition={(pos) => setFormData({ ...formData, lat: pos.lat, lng: pos.lng })} 
                    />
                  </MapContainer>
                </div>
              </div>
              </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Date {formData.type === 'lost' ? 'Lost' : 'Found'}
              </label>
              <div className="relative">
                <input
                  ref={dateInputRef}
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  min="2000-01-01"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white rounded-md pl-11 pr-4 py-2.5 outline-none transition duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  required
                />
                <Calendar 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Photo (optional)
              </label>
              <div className="relative border border-dashed border-slate-300 dark:border-slate-700 rounded-md p-4 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 transition flex flex-col items-center justify-center cursor-pointer min-h-[90px]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium text-center">
                  {photo ? `📁 ${photo.name}` : '📷 Select image file or drag here'}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md transition duration-200 shadow-sm disabled:opacity-50 mt-6"
            >
              {submitting ? 'Submitting Report...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}