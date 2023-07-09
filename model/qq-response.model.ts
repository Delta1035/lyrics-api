export interface QQResponse<T> {
  code: number;
  data: T;
  subcode: number;
}

export interface QQResponseData {
  album: any;
  mv: any;
  singer: any;
  song: QQSongData;
}

export interface QQSongData {
  count: number;
  itemlist: Array<QQSong>;
  name: string;
  order: number;
  type: number;
}

export class QQSong {
  docid: string;
  id: string;
  mid: string;
  name: string;
  singer: string;
  power?: number;
  constructor(entity: QQSong) {
    this.docid = entity.docid;
    this.id = entity.id;
    this.mid = entity.mid;
    this.name = entity.name;
    this.singer = entity.singer;
    this.power = entity.power;
  }
}
