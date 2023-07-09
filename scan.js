const path = require("path");
const config = require("./config");
const fs = require("fs");
module.exports = function scanLyrics() {
  const lyricsPath = path.join(__dirname, config.lyricsPath);
  fs.stat(lyricsPath, (err, stats) => {
    // console.log(stats.isDirectory());
    // console.log(stats);
  });
  console.log(lyricsPath, config);
  const lyrics = fs.readdirSync(lyricsPath).map((_path) => {
    const [song, suffix] = _path.split(".lri");
    const [singer, title] = song.split(" - ");
    // console.log(_path);
    return {
      title: (title ?? "").trim(),
      singer: (singer ?? "").trim(),
      path: path.join(__dirname, config.lyricsPath, _path),
    };
  });

  fs.writeFileSync(config.lyricsCacheFileName, JSON.stringify(lyrics));
};
