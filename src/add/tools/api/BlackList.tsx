import React, { useEffect, useState } from "react";

export const blacklistedCities: {
  country?: string;
  city?: string;
  ips?: string[];
  browser?: string;
  device?: string;
}[] = [
  {
    country: "Kazakhstan",
    city: "All",
  },
  {
    browser: "Mobile Safari",
    device: "ios",
  },
];

const detectBrowserAndDevice = () => {
  const ua = navigator.userAgent.toLowerCase();

  let browser = "unknown";
  if (ua.includes("chrome") && !ua.includes("edg")) browser = "chrome";
  else if (ua.includes("firefox")) browser = "firefox";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "safari";
  else if (ua.includes("edg")) browser = "edge";

  let device = "unknown";
  if (/windows/i.test(ua)) device = "windows";
  else if (/macintosh|mac os x/i.test(ua)) device = "mac";
  else if (/android/i.test(ua)) device = "android";
  else if (/iphone|ipad|ipod/i.test(ua)) device = "ios";

  return { browser, device };
};

// ✅ Block if (country/city/ip) match OR (browser+device) match
export const isCityBlacklisted = (
  countryName: string,
  cityName: string,
  ip?: string
): boolean => {
  const { browser, device } = detectBrowserAndDevice();

  return blacklistedCities.some((entry) => {
    // Match by country/city/IP if provided
    const locationMatch =
      entry.country &&
      entry.city &&
      entry.country.toLowerCase() === countryName.toLowerCase() &&
      (entry.city.toLowerCase() === "all" ||
        entry.city.toLowerCase() === cityName.toLowerCase() ||
        (ip && entry.ips && entry.ips.some((prefix) => ip.startsWith(prefix))));

    // ✅ Match by browser+device if provided (even without country/city)
    const browserDeviceMatch =
      (!entry.browser || entry.browser.toLowerCase() === browser) &&
      (!entry.device || entry.device.toLowerCase() === device);

    // If entry defines country/city → require both location + browser/device match
    if (entry.country || entry.city || entry.ips) {
      return locationMatch && browserDeviceMatch;
    }

    // If entry ONLY defines browser/device → just check those
    return browserDeviceMatch;
  });
};

interface CountryBlacklistProps {
  onAccessCheck?: (
    blocked: boolean,
    country: string | null,
    reason?: string | null
  ) => void;
}

const CountryBlacklist: React.FC<CountryBlacklistProps> = ({
  onAccessCheck,
}) => {
  const [country, setCountry] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blockedReason, setBlockedReason] = useState<string | null>(null);
  const [ip, setIp] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      let ip: string = localStorage.getItem("userIP") ?? "";
      let city: string = localStorage.getItem("userCity") ?? "";
      let country: string = localStorage.getItem("userCountry") ?? "";

      try {
        if (!ip) {
          const response = await fetch("https://get.geojs.io/v1/ip.json");
          if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          ip = data.ip;
          localStorage.setItem("userIP", ip);
        }

        if (!city || !country) {
          const geoResponse = await fetch(
            `https://get.geojs.io/v1/ip/geo/${ip}.json`
          );
          if (!geoResponse.ok)
            throw new Error(`HTTP error! Status: ${geoResponse.status}`);
          const geoData = await geoResponse.json();
          city = geoData.city || "Unknown";
          country = geoData.country || "Unknown";
          localStorage.setItem("userCity", city);
          localStorage.setItem("userCountry", country);
        }

        setCountry(country);
        setCity(city);
        setIp(ip);

        let isBlocked = false;
        let reason = "";
        if (isCityBlacklisted(country, city, ip)) {
          isBlocked = true;
          const { browser, device } = detectBrowserAndDevice();
          reason = `Blocked by rule (country=${country}, city=${city}, browser=${browser}, device=${device})`;
        }

        setBlocked(isBlocked);
        setBlockedReason(isBlocked ? reason : null);
        if (onAccessCheck) {
          onAccessCheck(isBlocked, country, isBlocked ? reason : null);
        }
      } catch (err) {
        console.error("Failed to get country by IP:", err);
        setError("Unable to detect location");
        setBlocked(false);
        setBlockedReason(null);
        if (onAccessCheck) {
          onAccessCheck(false, null, null);
        }
      }
    };

    fetchLocation();
  }, [onAccessCheck]);

  if (onAccessCheck) {
    return null;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (country === null) {
    return <p>Checking location...</p>;
  }

  return blocked ? (
    <div style={{ color: "red", fontWeight: "bold" }}>
      Access denied for {blockedReason} 🚫
    </div>
  ) : (
    <div style={{ color: "green", fontWeight: "bold" }}>
      Welcome from {city ? `${city}, ` : ""}
      {country} ✅
    </div>
  );
};

export default CountryBlacklist;
