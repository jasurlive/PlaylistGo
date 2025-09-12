import { useEffect, useState } from "react";

export interface SettingsControlProps {
  isShuffle: boolean;
  setIsShuffle: (value: boolean) => void;
  isRepeatOne: boolean;
  setIsRepeatOne: (value: boolean) => void;
}

export const useSettingsControl = ({
  setIsShuffle,
  setIsRepeatOne,
}: Omit<SettingsControlProps, "isShuffle" | "isRepeatOne">) => {
  //load simple "true"/"false" from localStorage
  const getStoredBoolean = (key: string, defaultValue = false): boolean => {
    const saved = localStorage.getItem(key);
    return saved !== null ? saved === "true" : defaultValue;
  };

  // state initialized from localStorage
  const [shuffle, setShuffle] = useState<boolean>(() =>
    getStoredBoolean("isShuffle")
  );
  const [repeatOne, setRepeatOne] = useState<boolean>(() =>
    getStoredBoolean("isRepeatOne")
  );

  // setting handlers (store plain "true"/"false")
  const settingHandlers = {
    isShuffle: (value: boolean) => {
      localStorage.setItem("isShuffle", String(value));
      setShuffle(value);
      setIsShuffle(value);
    },
    isRepeatOne: (value: boolean) => {
      localStorage.setItem("isRepeatOne", String(value));
      setRepeatOne(value);
      setIsRepeatOne(value);
    },
  };

  useEffect(() => {
    setIsShuffle(shuffle);
    setIsRepeatOne(repeatOne);
  }, []); // runs only once on mount

  return {
    shuffle,
    repeatOne,
    toggleShuffle: () => settingHandlers.isShuffle(!shuffle),
    toggleRepeatOne: () => settingHandlers.isRepeatOne(!repeatOne),
    setShuffle: settingHandlers.isShuffle,
    setRepeatOne: settingHandlers.isRepeatOne,
  };
};
