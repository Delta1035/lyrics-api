const axios = require("axios");
const express = require("express");
const app = express();
const scanLyrics = require("./scan");
const config = require("./config");
const fs = require("fs");
const path = require("path");
let lyricsCache;
function buildSearchUrl(keyword) {
  return `https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?key=${encodeURIComponent(
    keyword
  )}&format=json`;
}

async function searchlyrics(id) {
  try {
    const QQurl = `https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?nobase64=1&g_tk=5381&musicid=${id}&format=json`;
    const result = await axios.get(QQurl, {
      headers: {
        Referer: "http://y.qq.com/",
      },
    });
    return result.data;
  } catch (error) {
    console.log("error :>> ", error);
    return error;
  }
}

function searchLocal({ title, singer }) {
  lyricsCache = fs.readFileSync(
    path.join(__dirname, config.lyricsCacheFileName),
    {
      encoding: "utf8",
    }
  );
  const lyricsList = JSON.parse(lyricsCache);
  const songList = lyricsList.filter((song) => {
    return (
      (song.title ?? "").indexOf(title) !== -1 ||
      (title ?? "").indexOf(song.title) !== -1
    );
  });
  let result;
  if ((singer ?? "").trim() === "") {
    result = songList;
  } else {
    result = songList.filter((song) => {
      return (
        (song.singer ?? "").indexOf(singer) !== -1 ||
        (singer ?? "").indexOf(song.singer) !== -1
      );
    });
  }
  return result;
}

// 通过音乐名称,歌手等信息查询音乐id
async function search(keyword) {
  try {
    const result = await axios.get(buildSearchUrl(keyword), {
      headers: {
        Referer: "http://y.qq.com/",
      },
    });

    return result.data;
  } catch (error) {
    return error;
  }
}
app.get("/", (req, res) => {
  res.json("ok");
});
// 给外部访问的接口
app.get("/lyrics", async (req, res) => {
  try {
    const { title, artist, album } = req.query;
    const result = searchLocal({ title, singer: artist });
    if (result.length > 0) {
      const lyrics = fs.readFileSync(result[0].path, "utf8");
      res.json(lyrics);
    } else {
      res.json("骚瑞,没在你本地找到歌词呀!");
    }
    // else {
    //   const r = await search(title);
    //   const songList = r.data.song.itemlist;
    //   let song;
    //   if (artist) {
    //     song = songList.find((song) => {
    //       return song.singer.indexOf(artist) !== -1;
    //     });
    //     if (!song) {
    //       song = songList[0];
    //     }
    //   } else {
    //     song = songList[0];
    //   }
    //   const lyrics = await searchlyrics(song.id);
    //   if (lyrics) {
    //     res.json(lyrics.lyric);
    //   } else {
    //     res.status(404);
    //   }
    // }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});
const port = config.port ?? 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("start :>> http://127.0.0.1:" + port);
  scanLyrics();
});
