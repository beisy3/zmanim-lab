'use client';

import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { GeoLocation, ComplexZmanimCalendar } from 'kosher-zmanim';
import { UI_TEXT } from '@/lib/constants';

interface ZmanimDisplayProps {
  geoLocation: GeoLocation;
  date: DateTime;
}

type SunriseMethod = 'elevation' | 'sealevel';
type SunsetMethod = 'elevation' | 'sealevel';
type ShaahZmanisMethod = 'gra' | 'mga' | '16.1degrees' | '18degrees' | '19.8degrees' | '90min' | '96min' | '120min';

export default function ZmanimDisplay({ geoLocation, date }: ZmanimDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [alosTime, setAlosTime] = useState<DateTime | null>(null);
  const [sofZmanShma, setSofZmanShma] = useState<DateTime | null>(null);
  const [sofZmanTefillah, setSofZmanTefillah] = useState<DateTime | null>(null);
  const [chatzos, setChatzos] = useState<DateTime | null>(null);
  const [minchaGedolah, setMinchaGedolah] = useState<DateTime | null>(null);
  const [minchaKetanah, setMinchaKetanah] = useState<DateTime | null>(null);
  const [plagHamincha, setPlagHamincha] = useState<DateTime | null>(null);
  const [sunset, setSunset] = useState<DateTime | null>(null);
  const [tzeis, setTzeis] = useState<DateTime | null>(null);
  const [chatzosHalailah, setChatzosHalailah] = useState<DateTime | null>(null);
  const [sunrise, setSunrise] = useState<DateTime | null>(null);
  const [shaahZmanis, setShaahZmanis] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Calculation method selections
  const [sunriseMethod, setSunriseMethod] = useState<SunriseMethod>('elevation');
  const [sunsetMethod, setSunsetMethod] = useState<SunsetMethod>('elevation');
  const [shaahZmanisMethod, setShaahZmanisMethod] = useState<ShaahZmanisMethod>('gra');

  useEffect(() => {
    calculateTimes();
  }, [geoLocation, date, sunriseMethod, sunsetMethod, shaahZmanisMethod]);

  const calculateTimes = () => {
    setIsLoading(true);
    setError(null);

    try {
      const calendar = new ComplexZmanimCalendar(geoLocation);
      const jsDate = date.toJSDate();
      calendar.setDate(jsDate);

      // Get sunrise based on selected method
      const sunriseTime = sunriseMethod === 'sealevel'
        ? calendar.getSeaLevelSunrise()
        : calendar.getSunrise();
      setSunrise(sunriseTime);

      // Get sunset based on selected method
      const sunsetTime = sunsetMethod === 'sealevel'
        ? calendar.getSeaLevelSunset()
        : calendar.getSunset();
      setSunset(sunsetTime);

      // Calculate shaah zmanis based on selected method
      let shaahZmanisMinutes = 0;
      if (sunriseTime && sunsetTime) {
        switch (shaahZmanisMethod) {
          case 'gra':
            const dayLengthMinutes = sunsetTime.diff(sunriseTime, 'minutes').minutes;
            shaahZmanisMinutes = dayLengthMinutes / 12;
            break;
          case 'mga':
            const shaahZmanisMGA = calendar.getShaahZmanisMGA();
            if (shaahZmanisMGA) {
              shaahZmanisMinutes = shaahZmanisMGA / (1000 * 60); // Convert milliseconds to minutes
            }
            break;
          case '16.1degrees':
            const shaahZmanis161 = calendar.getShaahZmanis16Point1Degrees();
            if (shaahZmanis161) {
              shaahZmanisMinutes = shaahZmanis161 / (1000 * 60);
            }
            break;
          case '18degrees':
            const shaahZmanis18 = calendar.getShaahZmanis18Degrees();
            if (shaahZmanis18) {
              shaahZmanisMinutes = shaahZmanis18 / (1000 * 60);
            }
            break;
          case '19.8degrees':
            const shaahZmanis198 = calendar.getShaahZmanis19Point8Degrees();
            if (shaahZmanis198) {
              shaahZmanisMinutes = shaahZmanis198 / (1000 * 60);
            }
            break;
          case '90min':
            const shaahZmanis90 = calendar.getShaahZmanis90Minutes();
            if (shaahZmanis90) {
              shaahZmanisMinutes = shaahZmanis90 / (1000 * 60);
            }
            break;
          case '96min':
            const shaahZmanis96 = calendar.getShaahZmanis96Minutes();
            if (shaahZmanis96) {
              shaahZmanisMinutes = shaahZmanis96 / (1000 * 60);
            }
            break;
          case '120min':
            const shaahZmanis120 = calendar.getShaahZmanis120Minutes();
            if (shaahZmanis120) {
              shaahZmanisMinutes = shaahZmanis120 / (1000 * 60);
            }
            break;
        }
        setShaahZmanis(shaahZmanisMinutes);
      }

      // Calculate Alos 16.1°
      const alos = calendar.getAlos16Point1Degrees();
      setAlosTime(alos);

      // Calculate Sof Zman Shma GRA
      const shma = calendar.getSofZmanShmaGRA();
      setSofZmanShma(shma);

      // Calculate Sof Zman Tefillah GRA
      const tefillah = calendar.getSofZmanTfilaGRA();
      setSofZmanTefillah(tefillah);

      // Calculate Chatzos (solar noon)
      const chatzosTime = calendar.getChatzos();
      setChatzos(chatzosTime);

      // Calculate Mincha Gedolah
      const mGedolah = calendar.getMinchaGedola30Minutes();
      setMinchaGedolah(mGedolah);

      // Calculate Mincha Ketanah (9.5 shaos zmaniyos after sunrise)
      const mKetanah = calendar.getMinchaKetana(sunriseTime, sunsetTime);
      setMinchaKetanah(mKetanah);

      // Calculate Plag HaMincha (10.75 shaos zmaniyos after sunrise)
      const plag = calendar.getPlagHamincha(sunriseTime, sunsetTime);
      setPlagHamincha(plag);

      // Calculate Tzeis (8.5 degrees)
      const tzeis85 = calendar.getTzaisGeonim8Point5Degrees();
      setTzeis(tzeis85);

      // Calculate Chatzos HaLailah (midnight)
      const chatzosNight = calendar.getSolarMidnight();
      setChatzosHalailah(chatzosNight);
    } catch (err) {
      console.error('Error calculating zmanim:', err);
      setError('Failed to calculate times. Please check your location and date.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dt: DateTime | null): string => {
    if (!dt) return 'N/A';
    return dt.toLocaleString(DateTime.TIME_24_WITH_SECONDS);
  };

  const getMinutesBeforeSunrise = (): string => {
    if (!alosTime || !sunrise) return '';
    const diff = Math.round(sunrise.diff(alosTime, 'minutes').minutes);
    return `${diff} minutes before sunrise`;
  };

  const getMinutesAfterSunrise = (): string => {
    if (!sofZmanShma || !sunrise) return '';
    const diff = Math.round(sofZmanShma.diff(sunrise, 'minutes').minutes);
    return `${diff} minutes after sunrise`;
  };

  const getChatzosRelativeTime = (): string => {
    if (!chatzos || !sunrise) return '';
    const diff = Math.round(chatzos.diff(sunrise, 'minutes').minutes);
    return `${diff} minutes after sunrise`;
  };

  const getTefillahRelativeTime = (): string => {
    if (!sofZmanTefillah || !sunrise) return '';
    const diff = Math.round(sofZmanTefillah.diff(sunrise, 'minutes').minutes);
    return `${diff} minutes after sunrise`;
  };

  const getMinchaGedolahRelativeTime = (): string => {
    if (!minchaGedolah || !chatzos) return '';
    const diff = Math.round(minchaGedolah.diff(chatzos, 'minutes').minutes);
    return `${diff} minutes after Chatzos`;
  };

  const getMinchaKetanahRelativeTime = (): string => {
    if (!minchaKetanah || !chatzos) return '';
    const diff = Math.round(minchaKetanah.diff(chatzos, 'minutes').minutes);
    return `${diff} minutes after Chatzos`;
  };

  const getPlagRelativeTime = (): string => {
    if (!plagHamincha || !sunset) return '';
    const diff = Math.round(sunset.diff(plagHamincha, 'minutes').minutes);
    return `${diff} minutes before sunset`;
  };

  const getTzeisRelativeTime = (): string => {
    if (!tzeis || !sunset) return '';
    const diff = Math.round(tzeis.diff(sunset, 'minutes').minutes);
    return `${diff} minutes after sunset`;
  };

  const getChatzosHalailahRelativeTime = (): string => {
    if (!chatzosHalailah || !sunset) return '';
    const diff = Math.round(chatzosHalailah.diff(sunset, 'minutes').minutes);
    return `${diff} minutes after sunset`;
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 mx-auto text-apple-blue mb-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-apple-gray-600 font-medium">
            {UI_TEXT.calculating}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Base Calculations Section */}
      <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-apple-xl border border-white/20 overflow-hidden max-w-7xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-apple-gray-900 mb-2">
              Base Calculations
            </h2>
            <p className="text-apple-gray-600">
              Fundamental astronomical values used to calculate all zmanim
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sunrise */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-apple-gray-900">Sunrise (Netz)</h3>
                  <p className="text-3xl font-bold text-orange-600">{formatTime(sunrise)}</p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-apple-gray-700 mb-2">Calculation Method</label>
                <select
                  value={sunriseMethod}
                  onChange={(e) => setSunriseMethod(e.target.value as SunriseMethod)}
                  className="w-full px-3 py-2 text-sm bg-white border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="elevation">Elevation-Adjusted</option>
                  <option value="sealevel">Sea-Level</option>
                </select>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-apple-gray-900 mb-1">Mathematical Calculation</h4>
                  <p className="text-apple-gray-700 leading-relaxed">
                    Sunrise occurs when the sun's center is 0.833° below the horizon (accounting for atmospheric refraction and the sun's radius).
                  </p>
                </div>
                <div className="bg-white/80 rounded-xl p-3">
                  <p className="font-mono text-xs text-apple-gray-800 mb-2">
                    cos(H) = [sin(-0.833°) - sin(lat) × sin(δ)] / [cos(lat) × cos(δ)]
                  </p>
                  <ul className="text-xs text-apple-gray-700 space-y-1">
                    <li>• <strong>H</strong> = Hour angle (converted to time)</li>
                    <li>• <strong>lat</strong> = Latitude: {geoLocation.getLatitude().toFixed(4)}°</li>
                    <li>• <strong>δ</strong> = Solar declination (varies daily)</li>
                  </ul>
                </div>
                <p className="text-xs text-apple-gray-600 italic">
                  The hour angle is converted to local time by dividing by 15° per hour, then adjusted for longitude and the equation of time.
                </p>
              </div>
            </div>

            {/* Sunset */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4m0 0l4-4m-4 4l4 4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-apple-gray-900">Sunset (Shkiah)</h3>
                  <p className="text-3xl font-bold text-red-600">{formatTime(sunset)}</p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-apple-gray-700 mb-2">Calculation Method</label>
                <select
                  value={sunsetMethod}
                  onChange={(e) => setSunsetMethod(e.target.value as SunsetMethod)}
                  className="w-full px-3 py-2 text-sm bg-white border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="elevation">Elevation-Adjusted</option>
                  <option value="sealevel">Sea-Level</option>
                </select>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-apple-gray-900 mb-1">Mathematical Calculation</h4>
                  <p className="text-apple-gray-700 leading-relaxed">
                    Sunset occurs when the sun's center is 0.833° below the horizon, same calculation as sunrise but for the western horizon.
                  </p>
                </div>
                <div className="bg-white/80 rounded-xl p-3">
                  <p className="font-mono text-xs text-apple-gray-800 mb-2">
                    cos(H) = [sin(-0.833°) - sin(lat) × sin(δ)] / [cos(lat) × cos(δ)]
                  </p>
                  <ul className="text-xs text-apple-gray-700 space-y-1">
                    <li>• Same formula as sunrise</li>
                    <li>• Calculated for evening hour angle</li>
                    <li>• <strong>Long</strong> = Longitude: {geoLocation.getLongitude().toFixed(4)}°</li>
                  </ul>
                </div>
                <p className="text-xs text-apple-gray-600 italic">
                  The western hour angle gives us the time after solar noon when the sun sets.
                </p>
              </div>
            </div>

            {/* Day Length */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-apple-gray-900">Day Length</h3>
                  {sunrise && sunset && (
                    <p className="text-3xl font-bold text-blue-600">
                      {formatDuration(sunset.diff(sunrise, 'minutes').minutes)}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-apple-gray-900 mb-1">Mathematical Calculation</h4>
                  <p className="text-apple-gray-700 leading-relaxed">
                    The total duration from sunrise to sunset, representing the halachic day.
                  </p>
                </div>
                <div className="bg-white/80 rounded-xl p-3">
                  <p className="font-mono text-xs text-apple-gray-800 mb-2">
                    Day Length = Sunset - Sunrise
                  </p>
                  {sunrise && sunset && (
                    <ul className="text-xs text-apple-gray-700 space-y-1">
                      <li>• <strong>Sunrise:</strong> {formatTime(sunrise)}</li>
                      <li>• <strong>Sunset:</strong> {formatTime(sunset)}</li>
                      <li>• <strong>Duration:</strong> {Math.round(sunset.diff(sunrise, 'minutes').minutes)} minutes</li>
                    </ul>
                  )}
                </div>
                <p className="text-xs text-apple-gray-600 italic">
                  This is the foundation for all shaos zmaniyos (proportional hours) calculations.
                </p>
              </div>
            </div>

            {/* Shaah Zmanis */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-apple-gray-900">Shaah Zmanis</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {formatDuration(shaahZmanis)}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-apple-gray-700 mb-2">Calculation Method</label>
                <select
                  value={shaahZmanisMethod}
                  onChange={(e) => setShaahZmanisMethod(e.target.value as ShaahZmanisMethod)}
                  className="w-full px-3 py-2 text-sm bg-white border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="gra">GRA (Sunrise to Sunset)</option>
                  <option value="mga">MGA (72-min Alos to Tzeis)</option>
                  <option value="16.1degrees">16.1° Alos to Tzeis</option>
                  <option value="18degrees">18° Alos to Tzeis</option>
                  <option value="19.8degrees">19.8° Alos to Tzeis</option>
                  <option value="90min">90-min Alos to Tzeis</option>
                  <option value="96min">96-min Alos to Tzeis</option>
                  <option value="120min">120-min Alos to Tzeis</option>
                </select>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-apple-gray-900 mb-1">Mathematical Calculation</h4>
                  <p className="text-apple-gray-700 leading-relaxed">
                    A halachic "hour" (shaah zmanis) divides the day into 12 equal parts, regardless of the actual clock duration.
                  </p>
                </div>
                <div className="bg-white/80 rounded-xl p-3">
                  <p className="font-mono text-xs text-apple-gray-800 mb-2">
                    Shaah Zmanis = Day Length ÷ 12
                  </p>
                  {sunrise && sunset && (
                    <ul className="text-xs text-apple-gray-700 space-y-1">
                      <li>• <strong>Day Length:</strong> {Math.round(sunset.diff(sunrise, 'minutes').minutes)} minutes</li>
                      <li>• <strong>÷ 12 hours =</strong> {Math.round(shaahZmanis)} minutes per hour</li>
                      <li>• <strong>Exact:</strong> {shaahZmanis.toFixed(2)} minutes</li>
                    </ul>
                  )}
                </div>
                <p className="text-xs text-apple-gray-600 italic">
                  All time-based zmanim (Shema, Tefillah, Mincha, etc.) are calculated using multiples of this value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All zmanim cards - responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Alos Hashachar Card */}
        <div className="bg-white rounded-3xl shadow-apple-lg border border-apple-gray-200 overflow-hidden">
          <div className="h-1.5 bg-apple-blue"></div>
          <div className="p-8 md:p-10 text-center">
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-2">
              Alos Hashachar
            </h2>
            <p className="text-sm text-apple-gray-500 mb-8">
              Dawn at 16.1° below horizon
            </p>

            <div className="mb-6">
              <div className="text-5xl md:text-6xl font-semibold text-apple-gray-900 tracking-tight mb-2">
                {formatTime(alosTime)}
              </div>
              {alosTime && sunrise && (
                <p className="text-base text-apple-gray-600 font-medium">
                  {getMinutesBeforeSunrise()}
                </p>
              )}
            </div>

            <div className="bg-apple-gray-50 rounded-2xl p-6 text-left">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Calculation Method
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    Sun at 16.1° below the horizon
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Description
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    Dawn calculated when the sun is 16.1 degrees below the horizon. This is a commonly used halachic calculation method.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Mathematical Calculation
                  </h3>
                  <p className="text-sm text-apple-gray-600 leading-relaxed space-y-2">
                    <span className="block">
                      The time is calculated using the solar depression angle formula. When the sun is at 16.1° below the geometric horizon,
                      the solar altitude angle is -16.1°.
                    </span>
                    <span className="block mt-2">
                      <strong>Formula:</strong> The hour angle (H) is calculated using the spherical trigonometry equation:
                      <code className="block mt-1 bg-white px-2 py-1 rounded text-xs font-mono">
                        cos(H) = [sin(-16.1°) - sin(latitude) × sin(declination)] / [cos(latitude) × cos(declination)]
                      </code>
                    </span>
                    <span className="block mt-2">
                      Where:
                    </span>
                    <ul className="text-xs ml-4 mt-1 space-y-1">
                      <li>• <strong>Latitude:</strong> {geoLocation.getLatitude().toFixed(4)}°</li>
                      <li>• <strong>Longitude:</strong> {geoLocation.getLongitude().toFixed(4)}°</li>
                      <li>• <strong>Declination:</strong> Solar declination varies daily based on Earth's axial tilt</li>
                      <li>• <strong>Hour Angle (H):</strong> Converted to time units (15° = 1 hour)</li>
                    </ul>
                    <span className="block mt-2">
                      The result gives us the time before solar noon when the sun reaches -16.1°. This is then adjusted for
                      the equation of time and local longitude to get the actual clock time for Alos Hashachar.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sof Zman Krias Shema GRA Card */}
        <div className="bg-white rounded-3xl shadow-apple-lg border border-apple-gray-200 overflow-hidden">
          <div className="h-1.5" style={{ backgroundColor: '#5856D6' }}></div>
          <div className="p-8 md:p-10 text-center">
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-2">
              Sof Zman Krias Shema
            </h2>
            <p className="text-sm text-apple-gray-500 mb-8">
              Latest time to recite Shema (GRA)
            </p>

            <div className="mb-6">
              <div className="text-5xl md:text-6xl font-semibold text-apple-gray-900 tracking-tight mb-2">
                {formatTime(sofZmanShma)}
              </div>
              {sofZmanShma && sunrise && (
                <p className="text-base text-apple-gray-600 font-medium">
                  {getMinutesAfterSunrise()}
                </p>
              )}
            </div>

            <div className="bg-apple-gray-50 rounded-2xl p-6 text-left">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Calculation Method
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    3 shaos zmaniyos (halachic hours) after sunrise
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Description
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    According to the Vilna Gaon (GRA), the latest time to recite the morning Shema is the end of the third halachic hour of the day.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Mathematical Calculation
                  </h3>
                  <p className="text-sm text-apple-gray-600 leading-relaxed space-y-2">
                    <span className="block">
                      The calculation uses shaos zmaniyos (proportional/halachic hours), where the day is divided into 12 equal parts
                      from sunrise to sunset.
                    </span>
                    <span className="block mt-2">
                      <strong>Formula:</strong>
                      <code className="block mt-1 bg-white px-2 py-1 rounded text-xs font-mono">
                        Sof Zman Shma = Sunrise + (3 × Shaah Zmanis)
                      </code>
                      <code className="block mt-1 bg-white px-2 py-1 rounded text-xs font-mono">
                        Shaah Zmanis = (Sunset - Sunrise) / 12
                      </code>
                    </span>
                    <span className="block mt-2">
                      Current values:
                    </span>
                    <ul className="text-xs ml-4 mt-1 space-y-1">
                      <li>• <strong>Sunrise:</strong> {formatTime(sunrise)}</li>
                      <li>• <strong>Sunset:</strong> {formatTime(sunset)}</li>
                      {sunrise && sunset && (
                        <li>• <strong>Day Length:</strong> {formatDuration(sunset.diff(sunrise, 'minutes').minutes)}</li>
                      )}
                      <li>• <strong>Shaah Zmanis:</strong> {formatDuration(shaahZmanis)}</li>
                      <li>• <strong>3 Shaos:</strong> {formatDuration(shaahZmanis * 3)}</li>
                    </ul>
                    <span className="block mt-2">
                      This means each "hour" is {Math.round(shaahZmanis)} minutes. The latest time for Shema is at the end
                      of the 3rd halachic hour, which equals {Math.round(shaahZmanis * 3)} minutes ({formatDuration(shaahZmanis * 3)}) after sunrise.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chatzos Hayom Card */}
        <div className="bg-white rounded-3xl shadow-apple-lg border border-apple-gray-200 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-orange-400 to-orange-500"></div>
          <div className="p-8 md:p-10 text-center">
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-2">
              Chatzos Hayom
            </h2>
            <p className="text-sm text-apple-gray-500 mb-8">
              Solar noon / Midday
            </p>

            <div className="mb-6">
              <div className="text-5xl md:text-6xl font-semibold text-apple-gray-900 tracking-tight mb-2">
                {formatTime(chatzos)}
              </div>
              {chatzos && sunrise && (
                <p className="text-base text-apple-gray-600 font-medium">
                  {getChatzosRelativeTime()}
                </p>
              )}
            </div>

            <div className="bg-apple-gray-50 rounded-2xl p-6 text-left">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Calculation Method
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    Midpoint between sunrise and sunset (solar noon)
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Description
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    Chatzos Hayom is the exact middle of the day when the sun reaches its highest point (zenith) in the sky.
                    This marks the midpoint between sunrise and sunset.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Mathematical Calculation
                  </h3>
                  <p className="text-sm text-apple-gray-600 leading-relaxed space-y-2">
                    <span className="block">
                      Chatzos is calculated as the exact midpoint between sunrise and sunset, which also corresponds to solar noon
                      when the sun reaches its maximum altitude (zenith).
                    </span>
                    <span className="block mt-2">
                      <strong>Formula:</strong>
                      <code className="block mt-1 bg-white px-2 py-1 rounded text-xs font-mono">
                        Chatzos = Sunrise + (Day Length / 2)
                      </code>
                      <code className="block mt-1 bg-white px-2 py-1 rounded text-xs font-mono">
                        Chatzos = Sunrise + (6 × Shaah Zmanis)
                      </code>
                    </span>
                    <span className="block mt-2">
                      Current values:
                    </span>
                    <ul className="text-xs ml-4 mt-1 space-y-1">
                      <li>• <strong>Sunrise:</strong> {formatTime(sunrise)}</li>
                      <li>• <strong>Sunset:</strong> {formatTime(sunset)}</li>
                      {sunrise && sunset && (
                        <>
                          <li>• <strong>Day Length:</strong> {formatDuration(sunset.diff(sunrise, 'minutes').minutes)}</li>
                          <li>• <strong>Half Day:</strong> {formatDuration(sunset.diff(sunrise, 'minutes').minutes / 2)}</li>
                        </>
                      )}
                      <li>• <strong>6 Shaos Zmaniyos:</strong> {formatDuration(shaahZmanis * 6)}</li>
                    </ul>
                    <span className="block mt-2">
                      At this time, the sun is at its highest point in the sky for the day. It occurs exactly halfway through
                      the day ({formatDuration(shaahZmanis * 6)}) after sunrise, or 6 halachic hours into the 12-hour day.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sof Zman Tefillah Card */}
        <div className="bg-white rounded-3xl shadow-apple-lg border border-apple-gray-200 overflow-hidden">
          <div className="h-1.5" style={{ backgroundColor: '#34C759' }}></div>
          <div className="p-8 md:p-10 text-center">
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-2">
              Sof Zman Tefillah
            </h2>
            <p className="text-sm text-apple-gray-500 mb-8">
              Latest time for morning prayer (GRA)
            </p>

            <div className="mb-6">
              <div className="text-5xl md:text-6xl font-semibold text-apple-gray-900 tracking-tight mb-2">
                {formatTime(sofZmanTefillah)}
              </div>
              {sofZmanTefillah && sunrise && (
                <p className="text-base text-apple-gray-600 font-medium">
                  {getTefillahRelativeTime()}
                </p>
              )}
            </div>

            <div className="bg-apple-gray-50 rounded-2xl p-6 text-left">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Calculation Method
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    4 shaos zmaniyos after sunrise
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Description
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    According to the GRA, the latest time for Shacharis (morning prayer) is the end of the fourth halachic hour.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Mathematical Calculation
                  </h3>
                  <p className="text-sm text-apple-gray-600 leading-relaxed space-y-2">
                    <span className="block">
                      Similar to Sof Zman Shma, this uses shaos zmaniyos where the day is divided into 12 equal parts.
                    </span>
                    <span className="block mt-2">
                      <strong>Formula:</strong>
                      <code className="block mt-1 bg-white px-2 py-1 rounded text-xs font-mono">
                        Sof Zman Tefillah = Sunrise + (4 × Shaah Zmanis)
                      </code>
                    </span>
                    <span className="block mt-2">
                      Current values:
                    </span>
                    <ul className="text-xs ml-4 mt-1 space-y-1">
                      <li>• <strong>4 Shaos:</strong> {formatDuration(shaahZmanis * 4)}</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mincha Gedolah Card */}
        <div className="bg-white rounded-3xl shadow-apple-lg border border-apple-gray-200 overflow-hidden">
          <div className="h-1.5" style={{ backgroundColor: '#FF9500' }}></div>
          <div className="p-8 md:p-10 text-center">
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-2">
              Mincha Gedolah
            </h2>
            <p className="text-sm text-apple-gray-500 mb-8">
              Earliest time for afternoon prayer
            </p>

            <div className="mb-6">
              <div className="text-5xl md:text-6xl font-semibold text-apple-gray-900 tracking-tight mb-2">
                {formatTime(minchaGedolah)}
              </div>
              {minchaGedolah && chatzos && (
                <p className="text-base text-apple-gray-600 font-medium">
                  {getMinchaGedolahRelativeTime()}
                </p>
              )}
            </div>

            <div className="bg-apple-gray-50 rounded-2xl p-6 text-left">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Calculation Method
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    30 minutes after Chatzos
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Description
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    The earliest time to pray Mincha (afternoon prayer). It begins half a shaah zmanis after Chatzos, commonly calculated as 30 minutes.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Mathematical Calculation
                  </h3>
                  <p className="text-sm text-apple-gray-600 leading-relaxed space-y-2">
                    <span className="block">
                      Mincha Gedolah begins half a shaah zmanis after solar noon (Chatzos).
                    </span>
                    <span className="block mt-2">
                      <strong>Formula:</strong>
                      <code className="block mt-1 bg-white px-2 py-1 rounded text-xs font-mono">
                        Mincha Gedolah = Chatzos + 30 minutes
                      </code>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mincha Ketanah Card */}
        <div className="bg-white rounded-3xl shadow-apple-lg border border-apple-gray-200 overflow-hidden">
          <div className="h-1.5" style={{ backgroundColor: '#FF2D55' }}></div>
          <div className="p-8 md:p-10 text-center">
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-2">
              Mincha Ketanah
            </h2>
            <p className="text-sm text-apple-gray-500 mb-8">
              Preferred time for afternoon prayer
            </p>

            <div className="mb-6">
              <div className="text-5xl md:text-6xl font-semibold text-apple-gray-900 tracking-tight mb-2">
                {formatTime(minchaKetanah)}
              </div>
              {minchaKetanah && chatzos && (
                <p className="text-base text-apple-gray-600 font-medium">
                  {getMinchaKetanahRelativeTime()}
                </p>
              )}
            </div>

            <div className="bg-apple-gray-50 rounded-2xl p-6 text-left">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Calculation Method
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    9.5 shaos zmaniyos after sunrise
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Description
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    The preferred time to begin Mincha. It occurs 2.5 shaos zmaniyos before sunset.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Mathematical Calculation
                  </h3>
                  <p className="text-sm text-apple-gray-600 leading-relaxed space-y-2">
                    <span className="block">
                      Mincha Ketanah is calculated as 9.5 halachic hours after sunrise.
                    </span>
                    <span className="block mt-2">
                      <strong>Formula:</strong>
                      <code className="block mt-1 bg-white px-2 py-1 rounded text-xs font-mono">
                        Mincha Ketanah = Sunrise + (9.5 × Shaah Zmanis)
                      </code>
                    </span>
                    <span className="block mt-2">
                      Current values:
                    </span>
                    <ul className="text-xs ml-4 mt-1 space-y-1">
                      <li>• <strong>9.5 Shaos:</strong> {formatDuration(shaahZmanis * 9.5)}</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plag HaMincha Card */}
        <div className="bg-white rounded-3xl shadow-apple-lg border border-apple-gray-200 overflow-hidden">
          <div className="h-1.5" style={{ backgroundColor: '#AF52DE' }}></div>
          <div className="p-8 md:p-10 text-center">
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-2">
              Plag HaMincha
            </h2>
            <p className="text-sm text-apple-gray-500 mb-8">
              Transition time for evening prayers
            </p>

            <div className="mb-6">
              <div className="text-5xl md:text-6xl font-semibold text-apple-gray-900 tracking-tight mb-2">
                {formatTime(plagHamincha)}
              </div>
              {plagHamincha && sunset && (
                <p className="text-base text-apple-gray-600 font-medium">
                  {getPlagRelativeTime()}
                </p>
              )}
            </div>

            <div className="bg-apple-gray-50 rounded-2xl p-6 text-left">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Calculation Method
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    10.75 shaos zmaniyos after sunrise
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Description
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    The "division" of Mincha. Some communities can start Maariv (evening prayer) after this time, while others wait until after sunset.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Mathematical Calculation
                  </h3>
                  <p className="text-sm text-apple-gray-600 leading-relaxed space-y-2">
                    <span className="block">
                      Plag HaMincha is 1.25 shaos zmaniyos before sunset, or 10.75 shaos after sunrise.
                    </span>
                    <span className="block mt-2">
                      <strong>Formula:</strong>
                      <code className="block mt-1 bg-white px-2 py-1 rounded text-xs font-mono">
                        Plag HaMincha = Sunrise + (10.75 × Shaah Zmanis)
                      </code>
                    </span>
                    <span className="block mt-2">
                      Current values:
                    </span>
                    <ul className="text-xs ml-4 mt-1 space-y-1">
                      <li>• <strong>10.75 Shaos:</strong> {formatDuration(shaahZmanis * 10.75)}</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shkiah (Sunset) Card */}
        <div className="bg-white rounded-3xl shadow-apple-lg border border-apple-gray-200 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-orange-500 to-red-500"></div>
          <div className="p-8 md:p-10 text-center">
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-2">
              Shkiah
            </h2>
            <p className="text-sm text-apple-gray-500 mb-8">
              Sunset
            </p>

            <div className="mb-6">
              <div className="text-5xl md:text-6xl font-semibold text-apple-gray-900 tracking-tight mb-2">
                {formatTime(sunset)}
              </div>
            </div>

            <div className="bg-apple-gray-50 rounded-2xl p-6 text-left">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Calculation Method
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    When sun's upper edge touches the horizon
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Description
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    The moment when the upper edge of the sun touches the western horizon. This marks the end of the halachic day.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Mathematical Calculation
                  </h3>
                  <p className="text-sm text-apple-gray-600 leading-relaxed space-y-2">
                    <span className="block">
                      Sunset is calculated when the sun's geometric center is 0.833° below the horizon (accounting for refraction and solar radius).
                    </span>
                    <span className="block mt-2">
                      <strong>Formula:</strong>
                      <code className="block mt-1 bg-white px-2 py-1 rounded text-xs font-mono">
                        cos(H) = [sin(-0.833°) - sin(latitude) × sin(declination)] / [cos(latitude) × cos(declination)]
                      </code>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tzeis Hakochavim Card */}
        <div className="bg-white rounded-3xl shadow-apple-lg border border-apple-gray-200 overflow-hidden">
          <div className="h-1.5" style={{ backgroundColor: '#1E3A8A' }}></div>
          <div className="p-8 md:p-10 text-center">
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-2">
              Tzeis Hakochavim
            </h2>
            <p className="text-sm text-apple-gray-500 mb-8">
              Nightfall at 8.5° below horizon
            </p>

            <div className="mb-6">
              <div className="text-5xl md:text-6xl font-semibold text-apple-gray-900 tracking-tight mb-2">
                {formatTime(tzeis)}
              </div>
              {tzeis && sunset && (
                <p className="text-base text-apple-gray-600 font-medium">
                  {getTzeisRelativeTime()}
                </p>
              )}
            </div>

            <div className="bg-apple-gray-50 rounded-2xl p-6 text-left">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Calculation Method
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    Sun at 8.5° below the horizon
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Description
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    The emergence of three stars (nightfall). Calculated using the Geonim's position of 8.5° below the horizon.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Mathematical Calculation
                  </h3>
                  <p className="text-sm text-apple-gray-600 leading-relaxed space-y-2">
                    <span className="block">
                      Tzeis is calculated when the sun reaches 8.5° below the geometric horizon.
                    </span>
                    <span className="block mt-2">
                      <strong>Formula:</strong>
                      <code className="block mt-1 bg-white px-2 py-1 rounded text-xs font-mono">
                        cos(H) = [sin(-8.5°) - sin(latitude) × sin(declination)] / [cos(latitude) × cos(declination)]
                      </code>
                    </span>
                    <span className="block mt-2">
                      The hour angle is converted to time after sunset to determine when the sun reaches this depression angle.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chatzos HaLailah Card */}
        <div className="bg-white rounded-3xl shadow-apple-lg border border-apple-gray-200 overflow-hidden">
          <div className="h-1.5" style={{ backgroundColor: '#1C1C1E' }}></div>
          <div className="p-8 md:p-10 text-center">
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-2">
              Chatzos HaLailah
            </h2>
            <p className="text-sm text-apple-gray-500 mb-8">
              Solar midnight
            </p>

            <div className="mb-6">
              <div className="text-5xl md:text-6xl font-semibold text-apple-gray-900 tracking-tight mb-2">
                {formatTime(chatzosHalailah)}
              </div>
              {chatzosHalailah && sunset && (
                <p className="text-base text-apple-gray-600 font-medium">
                  {getChatzosHalailahRelativeTime()}
                </p>
              )}
            </div>

            <div className="bg-apple-gray-50 rounded-2xl p-6 text-left">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Calculation Method
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    Midpoint between sunset and sunrise
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Description
                  </h3>
                  <p className="text-sm text-apple-gray-600">
                    The exact middle of the night when the sun is at its lowest point (nadir). This is solar midnight.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-apple-gray-900 mb-1">
                    Mathematical Calculation
                  </h3>
                  <p className="text-sm text-apple-gray-600 leading-relaxed space-y-2">
                    <span className="block">
                      Chatzos HaLailah is calculated as the exact midpoint between sunset and the following sunrise.
                    </span>
                    <span className="block mt-2">
                      <strong>Formula:</strong>
                      <code className="block mt-1 bg-white px-2 py-1 rounded text-xs font-mono">
                        Chatzos HaLailah = Sunset + (Night Length / 2)
                      </code>
                    </span>
                    <span className="block mt-2">
                      This represents the time when the sun is at its lowest point below the horizon (180° from solar noon).
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sunrise Reference */}
      {sunrise && (
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-apple p-6 text-white max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <svg
                className="w-8 h-8 mr-3 opacity-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <div>
                <p className="text-sm opacity-90 font-medium">Sunrise</p>
                <p className="text-xl font-semibold">
                  {formatTime(sunrise)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90 font-medium">Location</p>
              <p className="text-base font-semibold">{geoLocation.getLocationName()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
