# 🎧 DJ YouTube Music Player 🎵 (in TypeScript)

**Reinventing the bike 🚲 with beats and code!**

Welcome to **PlaylistGo**, an open-source, web-based music player built in **TypeScript** that lets you search and play songs directly from **YouTube** using a simple **Excel playlist sheet**. Whether you're here to vibe or to code, this project is for you! 🎉✅🔍♻️

<img width="1920" height="1035" alt="image" src="https://github.com/user-attachments/assets/6079e8de-1c57-4980-b3c2-660b1ad570e2" />

<img width="1920" height="1035" alt="image" src="https://github.com/user-attachments/assets/93eefc1c-2ccf-4887-9838-a399b1bc34e0" />

<img width="1918" height="889" alt="PlaylistGo UI" src="https://github.com/user-attachments/assets/ae79b29c-bd2d-4ca8-87de-72afaa01ec94" />

<img src="https://github.com/user-attachments/assets/a6fc2858-a750-40f1-b4c2-6518c5ad607d" alt="PlaylistGo UI" />

---

## 📜 Features

- 🎶 Search and play YouTube music tracks.
- 📄 Load playlists from an Excel sheet.
- 🔍 Uses YouTube Data API for song lookup.
- ⚡ TypeScript-based architecture.
- 🧩 Fully open to contributions and feature ideas.

---

## 📁 How It Works

1. **Excel Sheet as Playlist**  
   The app reads an Excel (`public/python/songs.xlsx`) file where each row represents a song with details like:

   - `Song Name`
   - `Artist`
   - `YouTube Link`

2. **YouTube Search**  
   If no direct link is provided, the app will automatically search YouTube using the song name and artist, and play the best result.

3. **Music Player UI**  
   Simple and intuitive player interface with custom playlist support.

---

## 🛠️ Setup & Run

**Pre-requisites:**

- Node.js
- YouTube API Key
- A `.xlsx` playlist file

```bash
git clone https://github.com/jasurlive/PlaylistGo.git
cd PlaylistGo
npm install
npm run dev
```

## 🧑‍💻 Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Make your changes and add comments.
4. Submit a Pull Request.

## 🐞 Reporting Bugs

Please report any issues through the Issues page.

---

## 📜 License

This project is licensed under the Apache-2.0 License.
