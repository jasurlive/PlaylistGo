# PlaylistGo

PlaylistGo is a simple TypeScript web music player that uses YouTube to play songs from a CSV playlist.

The main idea is simple: keep the playlist in a CSV file, and the app handles the rest.

<img width="1918" height="889" alt="PlaylistGo UI" src="https://github.com/user-attachments/assets/ae79b29c-bd2d-4ca8-87de-72afaa01ec94" />
<img src="https://github.com/user-attachments/assets/a6fc2858-a750-40f1-b4c2-6518c5ad607d" alt="PlaylistGo UI" />

## Features

* Play songs from YouTube
* Search YouTube when a song has no URL
* Load songs from `public/python/songs.csv`
* Simple web player
* TypeScript
* Easy to update and contribute to

## Playlist

The playlist is stored here:

```text
public/python/songs.csv
```

The CSV has two columns:

```csv
title,url
Song Name,https://www.youtube.com/watch?v=example
Another Song,
```

### Adding songs

You do not need to change the code to add songs.

Just edit:

```text
public/python/songs.csv
```

Add your song, save the file, and create a pull request.

For example:

```csv
title,url
Coldplay - Yellow,https://www.youtube.com/watch?v=yKNxeF4KMsY
Adele - Hello,https://www.youtube.com/watch?v=YQHsXMglC9A
etc.
```

Please keep the CSV format valid and use the existing column names.

## Adding songs using python gui
In progress...

## Run locally

You need Node.js installed.

```bash
git clone https://github.com/jasurlive/PlaylistGo.git
cd PlaylistGo
npm install
npm run dev
```

You also need a YouTube API key if the project configuration requires YouTube search.

## Contributing

The easiest way to contribute is to add or update songs in:

```text
public/python/songs.csv
```

1. Fork the repository.
2. Edit `public/python/songs.csv`.
3. Add or update songs.
4. Commit your changes.
5. Open a pull request.

Code contributions are also welcome if you want to improve the player.

## Pull Requests

For playlist changes, please keep the PR simple and only include the songs you added or changed.

This makes it easier to review and merge playlist updates.

## License

Apache-2.0
