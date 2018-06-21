import { RepeatModes, SongList, Song } from './types';
import { Subject } from 'rxjs/Subject';
import {Observable} from "rxjs/Observable";

export interface IPLMessage {
    message: string;
    song: Song;
    index: number;
}

export class Playlist {
    private itemName: string = "mp3::songs";
    private metaName: string = "mp3::songs::meta";
    private sub: any;
    public Stream;

    private list: SongList = JSON.parse(
        localStorage.getItem(this.itemName) || "[]"
    );

    private meta = {
        playingAt: 0,
        index: 0
    }

    private repeatMode: RepeatModes = RepeatModes.ALL;

    get List() {
        return this.list;
    }

    get Meta() {
        return this.meta;
    }

    get RepeatMode(): RepeatModes { return this.repeatMode }

    constructor() {
        this.Stream = new Subject();
    }

    removeSong(index: number) {
        if (this.list[index]) {
            this.list.splice(index, 1);
            this.Stream.next({message: 'songDeleted', song: this.list[index], index})
        }
    }

    playSong(index, playingAt: number = 0) {
        if (playingAt == null) {
            playingAt = 0;
        }

        
        if (this.repeatMode == RepeatModes.ONE) {
            // dont do anything.
            // 
        } else if (this.repeatMode == RepeatModes.ALL) {
            index++;
            if (!this.list[index]) {
                index = 0;
            }
        } else {
            index++;
            if (!this.list[index]) {
                return;
            }
        }

        this.Stream.next({message: 'songUpdated', song: this.list[index], index});
        
        // player.src = list[index].loc;
        // player.currentTime = playingAt;
    }
}

window['Playlist'] = Playlist;