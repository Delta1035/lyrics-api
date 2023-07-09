import axios from "axios";
import express from "express";
import { QQSong } from "./model/qq-response.model";

const app = express();

function buildSearchUrl(keyword: string) {
  return `https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?key=${encodeURIComponent(
    keyword
  )}&format=json`;
}

async function searchlyrics(id: string) {
  try {
    const QQurl = `https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?nobase64=1&g_tk=5381&musicid=${id}&format=json`;
    const result = await axios.get<QQSong>(QQurl, {
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

// 通过音乐名称,歌手等信息查询音乐id
async function search(keyword: string) {
  try {
    const result = await axios.get<QQSong>(buildSearchUrl(keyword), {
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
app.get("/", (req, res) => {
  res.json("ok");
});
// 给外部访问的接口
app.get("/lyrics", async (req, res) => {
  try {
    const { title, artist, album } = req.query;
    const r: any = await search(title as string);
    const songList = r.data.song.itemlist;
    console.log(r, songList);
    let song;
    if (artist) {
      song = songList.find((song: any) => {
        return song.singer.indexOf(artist) !== -1;
      });
      if (!song) {
        song = songList[0];
      }
    } else {
      song = songList[0];
    }
    console.log(song);
    const lyrics: any = await searchlyrics(song.id);
    // res.json({
    //   title,
    //   artist,
    //   album,
    //   song,
    //   songList,
    //   lyrics,
    // });
    console.log(lyrics);

    if (lyrics) {
      res.json(lyrics.lyric);
    } else {
      res.status(404);
    }
  } catch (error) {
    res.json(error);
  }
});
const port = 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("start :>> http://127.0.0.1:" + port);
});
