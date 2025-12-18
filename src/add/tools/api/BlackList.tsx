import React, { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";

export const blacklistedUsers: {
  country?: string;
  city?: string;
  ips?: string[];
  browser?: string;
  device?: string;
  os?: string;
}[] = [
  // { country: "Kazakhstan" }, // Block all from Kazakhstan
  // { country: "North Korea", city: "Pyongyang" }, // Block only New York, USA
  // { device: "iPhone", os: "ios" },
  // { browser: "Mobile Safari", os: "ios" },
];

const detectBrowserDeviceOs = () => {
  const parser = new UAParser();
  const uaResult = parser.getResult();
  const browser = uaResult.browser.name || "unknown";
  const os = uaResult.os.name || "unknown";
  // device.model may be undefined for desktop, so fallback
  const device = uaResult.device.model || "Desktop";
  return { browser, device, os };
};

// Block if ALL fields in a blacklist entry match the user (including city)
export const isUserBlacklisted = (
  country?: string,
  city?: string,
  ip?: string
): boolean => {
  const { browser, device, os } = detectBrowserDeviceOs();

  return blacklistedUsers.some((entry) => {
    if (
      (entry.country &&
        entry.country.toLowerCase() !== (country || "").toLowerCase()) ||
      (entry.city && entry.city.toLowerCase() !== (city || "").toLowerCase()) ||
      (entry.browser &&
        entry.browser.toLowerCase() !== browser.toLowerCase()) ||
      (entry.device && entry.device.toLowerCase() !== device.toLowerCase()) ||
      (entry.os && entry.os.toLowerCase() !== os.toLowerCase()) ||
      (entry.ips && ip && !entry.ips.some((prefix) => ip.startsWith(prefix)))
    ) {
      return false;
    }
    return true;
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
        if (isUserBlacklisted(country, city, ip)) {
          const { browser, device, os } = detectBrowserDeviceOs();
          isBlocked = true;
          reason = `Blocked by rule (country=${country}, city=${city}, browser=${browser}, device=${device}, os=${os})`;
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
