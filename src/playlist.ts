import { RepeatModes, SongList } from './types';
import { Observable, Subject, Observer } from 'rx';

export class Playlist {
    private observer: Observer<any>;
    private itemName: string = "mp3::songs";
    private metaName: string = "mp3::songs::meta";

    private list: SongList = JSON.parse(
        localStorage.getItem(this.itemName) || "[]"
    );

    private meta = {
        playingAt: 0,
        index: 0
    }

    private repeatMode: RepeatModes = RepeatModes.ALL;

    constructor(/*observer: Observer<any>*/) {
        // if (!observer) {
        //     throw new Error('Expected 1 argument, got nothing');
        // }

        // this.observer = observer;
    }

    get List() {
        return this.list;
    }

    get RepeatMode(): RepeatModes { return this.repeatMode }

    removeSong(index: number) {
        if (this.list[index]) {
            this.list.splice(index, 1);
        }
    }

    static getInstance() {
        const instance = new Playlist()
        const observable = Observable.from([instance], null, instance);
        return observable;
    }
}

window['Playlist'] = Playlist;