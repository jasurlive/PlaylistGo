import { useEffect, useState } from "react";
import { firestore } from "../api/Firebase";
import { TfiStatsUp } from "react-icons/tfi";
import { FaUsersViewfinder, FaUserSecret } from "react-icons/fa6";
import { RiLoader2Fill } from "react-icons/ri";
import {
  doc,
  setDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  getDoc,
  deleteDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import "../../css/online.css";
import { UAParser } from "ua-parser-js";
import { UserStatus } from "../types/interface";

function Online() {
  const [onlineUsers, setOnlineUsers] = useState<UserStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [allTimeVisitors, setAllTimeVisitors] = useState(0);

  useEffect(() => {
    let heartbeatInterval: number;
    let unsubscribeSnapshot: (() => void) | undefined;

    const fetchUserData = async () => {
      const parser = new UAParser();
      const { name: browser = "unknown" } = parser.getResult().browser;
      const { name: os = "unknown" } = parser.getResult().os;
      const { model: device = "Desktop" } = parser.getResult().device;

      let ip = localStorage.getItem("userIP") || "";
      let city = localStorage.getItem("userCity") || "";
      let country = localStorage.getItem("userCountry") || "";

      if (!ip || !city || !country) {
        const geoRes = await fetch("https://get.geojs.io/v1/ip/geo.json");
        const geoData = await geoRes.json();
        ip = geoData.ip || "unknown";
        city = geoData.city || "Unknown";
        country = geoData.country || "Unknown";

        localStorage.setItem("userIP", ip);
        localStorage.setItem("userCity", city);
        localStorage.setItem("userCountry", country);
      }

      const docId = `${ip}-${browser}-${device}-${os}`
        .toLowerCase()
        .replace(/ /g, "-");
      const userRef = doc(firestore, "djmusic", docId);

      const setOnline = () =>
        setDoc(
          userRef,
          {
            state: "online",
            last_changed: serverTimestamp(),
            last_active: serverTimestamp(),
            browser,
            os,
            device,
            ip,
            city,
            country,
          },
          { merge: true }
        );

      const setOffline = () =>
        setDoc(
          userRef,
          { state: "offline", last_changed: serverTimestamp() },
          { merge: true }
        );

      await setOnline();

      heartbeatInterval = window.setInterval(setOnline, 60_000);

      const usersCol = collection(firestore, "djmusic");
      unsubscribeSnapshot = onSnapshot(usersCol, (snapshot) => {
        const now = Date.now();
        const twentyMinutesAgo = now - 20 * 60 * 1000;
        const activeUsers = snapshot.docs
          .map((d) => d.data() as UserStatus)
          .filter(
            (u) =>
              u.state === "online" &&
              u.last_active &&
              (u.last_active.toDate?.()?.getTime() ??
                new Date(u.last_active).getTime()) > twentyMinutesAgo
          );
        setOnlineUsers(activeUsers);
      });

      window.addEventListener("beforeunload", setOffline);

      return setOffline;
    };

    const updateVisitorCount = async () => {
      const visitorsRef = doc(firestore, "alltimeVisitors", "DJvisitorCount");
      const visitorDoc = await getDoc(visitorsRef);
      const currentCount = visitorDoc.exists()
        ? visitorDoc.data()?.count || 0
        : 0;

      await setDoc(visitorsRef, { count: currentCount + 1 }, { merge: true });
      const updatedDoc = await getDoc(visitorsRef);
      setAllTimeVisitors(updatedDoc.data()?.count || 0);
    };

    const cleanOldUsers = async () => {
      const twoWeeksAgo = Timestamp.fromDate(new Date(Date.now() - 12096e5));
      const usersCol = collection(firestore, "djmusic");
      const oldQuery = query(usersCol, where("last_changed", "<", twoWeeksAgo));
      const snapshot = await getDocs(oldQuery);
      snapshot.forEach((d) => deleteDoc(d.ref));
    };

    const init = async () => {
      const setOffline = await fetchUserData();
      await updateVisitorCount();
      await cleanOldUsers();
      setLoading(false);

      return () => {
        clearInterval(heartbeatInterval);
        unsubscribeSnapshot?.();
        window.removeEventListener("beforeunload", setOffline);
        setOffline();
      };
    };

    init();
  }, []);

  if (loading) {
    return (
      <div className="container-online-users">
        <TfiStatsUp />
        <h1>
          <FaUserSecret />
          Total visitors: <RiLoader2Fill className="loading-icon" />
        </h1>
        <h1>
          <FaUsersViewfinder />
          Online: <RiLoader2Fill className="loading-icon" />
        </h1>
      </div>
    );
  }

  return (
    <div className="container-online-users">
      <TfiStatsUp />
      <h1>
        <FaUserSecret />
        Total visitors: {allTimeVisitors}
      </h1>
      <h1>
        <FaUsersViewfinder /> Online: {onlineUsers.length}
      </h1>
    </div>
  );
}

export default Online;
