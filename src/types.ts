export interface Song {
    name: string;
    loc: string;
    hash: string;
}

export interface SongList extends Array<Song> { }

export enum RepeatModes {
    ONE = 'mode_one',
    ALL = 'mode_all',
    OFF = 'mode_off',
}