// hooks/handleRightClick.tsx
import { useCallback } from "react";
import { arrayMove } from "@dnd-kit/sortable";

// ==================================================
// Reusable hook for playlist song items' right click actions
// ==================================================

export const useHandleRightClick = (
  songs: any[],
  setSongs?: React.Dispatch<React.SetStateAction<any[]>>,
  currentVideoId?: string
) => {
  const handleSongAction = useCallback(
    (action: "playNext" | "duplicate" | "reorder", payload: any) => {
      if (!setSongs) return;

      setSongs((items) => {
        let updatedSongs = [...items];

        switch (action) {
          case "playNext": {
            const idx = updatedSongs.findIndex((s) => s.id === payload);
            const curIdx = updatedSongs.findIndex(
              (s) => s.id === currentVideoId
            );

            if (idx === -1 || curIdx === -1 || idx === curIdx) return items;

            const [song] = updatedSongs.splice(idx, 1);

            // If song was before current song, current index shifts left by 1
            const insertIndex = idx < curIdx ? curIdx : curIdx + 1;

            updatedSongs.splice(insertIndex, 0, song);
            break;
          }

          case "duplicate": {
            const idx = updatedSongs.findIndex((s) => s.id === payload);
            if (idx === -1) return items;
            const song = updatedSongs[idx];
            const newSong = { ...song, id: song.id + "_copy_" + Date.now() };
            updatedSongs.splice(idx + 1, 0, newSong);
            break;
          }

          case "reorder": {
            const { activeId, overId } = payload;
            if (!overId || activeId === overId) return items;
            const oldIndex = updatedSongs.findIndex(
              (item) => item.id === activeId
            );
            const newIndex = updatedSongs.findIndex(
              (item) => item.id === overId
            );
            updatedSongs = arrayMove(updatedSongs, oldIndex, newIndex);
            break;
          }
        }

        return updatedSongs;
      });
    },
    [setSongs, currentVideoId] // dependencies
  );

  return { handleSongAction };
};
