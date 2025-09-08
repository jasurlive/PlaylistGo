import React, { useState } from "react";
import Player from "./Player";
import UpDown from "./add/tools/basic/UpDown";
import SnowFall from "./add/tools/basic/SnowFall";
import Online from "./add/tools/basic/Online";
import Footer from "./add/tools/basic/Footer";
import Header from "./add/tools/basic/Header";
import Social from "./add/tools/basic/Social";
import CountryBlacklist from "./add/tools/api/BlackList";

function MusicPlayer() {
  const [accessChecked, setAccessChecked] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [country, setCountry] = useState<string | null>(null);
  const [blockedReason, setBlockedReason] = useState<string | null>(null);

  // Callback for CountryBlacklist to report status
  const handleAccessCheck = (
    isBlocked: boolean,
    countryName: string | null,
    reason?: string | null
  ) => {
    setBlocked(isBlocked);
    setCountry(countryName);
    setBlockedReason(reason || null);
    setAccessChecked(true);
  };

  // Only render CountryBlacklist until access is checked
  if (!accessChecked) {
    return <CountryBlacklist onAccessCheck={handleAccessCheck} />;
  }

  if (blocked) {
    return <div></div>;
  }
  return (
    <div>
      <Player />
      <SnowFall />
      <Online />
    </div>
  );
}

export default MusicPlayer;
