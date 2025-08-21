import React, { useEffect, useState } from "react";

export const blacklistedCities: {
  country: string;
  city: string;
  ips?: string[];
}[] = [
  {
    country: "Kazakhstan",
    city: "Almaty",
    ips: ["104.28.193", "37.99.26", "173.244"],
  },
  {
    country: "Kazakhstan",
    city: "Shymkent",
    ips: ["104.28.193", "37.99.26", "173.244"],
  },
];

// Block if city matches, city is "All", or IP prefix matches in entry
export const isCityBlacklisted = (
  countryName: string,
  cityName: string,
  ip?: string
): boolean => {
  return blacklistedCities.some(
    (entry) =>
      entry.country.toLowerCase() === countryName.toLowerCase() &&
      (entry.city.toLowerCase() === "all" ||
        entry.city.toLowerCase() === cityName.toLowerCase() ||
        (ip && entry.ips && entry.ips.some((prefix) => ip.startsWith(prefix))))
  );
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
        if (country && isCityBlacklisted(country, city, ip)) {
          isBlocked = true;
          const entry = blacklistedCities.find(
            (e) =>
              e.country.toLowerCase() === country.toLowerCase() &&
              e.city.toLowerCase() === "all"
          );
          if (entry) {
            reason = `country (${country})`;
          } else {
            const ipEntry = blacklistedCities.find(
              (e) =>
                e.country.toLowerCase() === country.toLowerCase() &&
                e.city.toLowerCase() === city.toLowerCase() &&
                e.ips &&
                e.ips.some((prefix) => ip.startsWith(prefix))
            );
            if (ipEntry) {
              reason = `IP (${ip}) in ${city}, ${country}`;
            } else {
              reason = `city (${city}, ${country})`;
            }
          }
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
      Access denied for {blockedReason ? blockedReason : `${city}, ${country}`}{" "}
      🚫
    </div>
  ) : (
    <div style={{ color: "green", fontWeight: "bold" }}>
      Welcome from {city ? `${city}, ` : ""}
      {country} ✅
    </div>
  );
};

export default CountryBlacklist;
