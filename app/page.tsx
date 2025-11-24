'use client';

import { useState } from 'react';
import { DateTime } from 'luxon';
import { GeoLocation } from 'kosher-zmanim';
import LocationInput from '@/components/LocationInput';
import DatePicker from '@/components/DatePicker';
import ZmanimDisplay from '@/components/ZmanimDisplay';
import { createGeoLocation } from '@/lib/location';
import { DEFAULT_LOCATION, UI_TEXT } from '@/lib/constants';

export default function Home() {
  const [geoLocation, setGeoLocation] = useState<GeoLocation>(
    createGeoLocation(DEFAULT_LOCATION)
  );
  const [selectedDate, setSelectedDate] = useState<DateTime>(DateTime.now());

  const handleLocationChange = (
    latitude: number,
    longitude: number,
    timeZone: string
  ) => {
    const newLocation = createGeoLocation({
      latitude,
      longitude,
      timeZone,
      elevation: 0,
      name: `Custom (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
    });
    setGeoLocation(newLocation);
  };

  const handleDateChange = (date: DateTime) => {
    setSelectedDate(date);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section - Apple Style */}
      <div className="bg-white border-b border-apple-gray-200">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-4 animate-fade-in">
              <span className="text-5xl md:text-6xl">🌅</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold text-apple-gray-900 mb-4 tracking-tight animate-slide-up">
              Alos Hashachar
            </h1>
            <p className="text-lg md:text-xl text-apple-gray-600 mb-8 animate-slide-up font-normal">
              Dawn time calculated at 16.1° below the horizon
            </p>
            <div className="flex flex-wrap justify-center gap-3 animate-slide-up">
              <div className="flex items-center bg-apple-gray-100 rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-apple-blue rounded-full mr-2"></span>
                <span className="text-sm font-medium text-apple-gray-700">Solar Depression Angle</span>
              </div>
              <div className="flex items-center bg-apple-gray-100 rounded-full px-4 py-2">
                <span className="text-sm font-medium text-apple-gray-700">16.1° Method</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          <LocationInput onLocationChange={handleLocationChange} />
          <DatePicker onDateChange={handleDateChange} />
        </div>

        {/* Results Section */}
        <ZmanimDisplay geoLocation={geoLocation} date={selectedDate} />
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-apple-gray-200 bg-white">
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-sm text-apple-gray-600 mb-2">
            Powered by{' '}
            <a
              href="https://github.com/BehindTheMath/KosherZmanim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-apple-blue hover:underline"
            >
              kosher-zmanim
            </a>
          </p>
          <p className="text-xs text-apple-gray-500">
            Times are calculated based on astronomical and halachic methods.
            <br />
            Consult your local rabbi for practical halachic guidance.
          </p>
        </div>
      </footer>
    </main>
  );
}
