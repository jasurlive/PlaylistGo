import { useEffect, useState } from "react";
import { Video } from "../../types/interface";

export const usecustomList = () => {
  const [customList, setcustomList] = useState<Video[]>([]);

  useEffect(() => {
    const savedcustomList = localStorage.getItem("customList");
    if (savedcustomList) {
      setcustomList(JSON.parse(savedcustomList));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("customList", JSON.stringify(customList));
  }, [customList]);

  return { customList, setcustomList };
};
