const path = require("path");
const config = require("./config");
const fs = require("fs");

const pathCache = [];
const lyrics = [];
function readFilesWithLriExtension(directoryPath) {
  const items = fs.readdirSync(directoryPath);
  items.forEach((item) => {
    const itemPath = path.join(directoryPath, item);
    const isDirectory = fs.statSync(itemPath).isDirectory();
    if (isDirectory) {
      readFilesWithLriExtension(itemPath);
    } else {
      if (path.extname(item) === ".lrc") {
        pathCache.push(path.join(directoryPath, item));
        const [song, suffix] = item.split(".lri");
        const [singer, title] = song.split(" - ");
        lyrics.push({
          title: (title ?? "").trim(),
          singer: (singer ?? "").trim(),
          path: path.join(directoryPath, item),
        });
      }
    }
  });
}

module.exports = function scanLyrics() {
  const lyricsPath = path.join(__dirname, config.lyricsPath);
  readFilesWithLriExtension(lyricsPath);
  fs.writeFileSync(config.lyricsCacheFileName, JSON.stringify(lyrics));
};
