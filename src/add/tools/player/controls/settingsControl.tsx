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
  const getStoredBoolean = (key: string, defaultValue = false): boolean => {
    const saved = localStorage.getItem(key);
    return saved !== null ? saved === "true" : defaultValue;
  };

  const [shuffle, setShuffle] = useState<boolean>(() =>
    getStoredBoolean("isShuffle")
  );
  const [repeatOne, setRepeatOne] = useState<boolean>(() =>
    getStoredBoolean("isRepeatOne")
  );

  const settingHandlers = {
    isShuffle: (value: boolean) => {
      localStorage.setItem("isShuffle", JSON.stringify(value));
      setShuffle(value);
      setIsShuffle(value);
    },
    isRepeatOne: (value: boolean) => {
      localStorage.setItem("isRepeatOne", JSON.stringify(value));
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
