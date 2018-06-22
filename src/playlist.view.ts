import {IPLMessage, Playlist} from "./playlist";
import {filter} from "rxjs/internal/operators";

class PlayListControls {
    private buttons: {[key: string]: HTMLButtonElement} = {
        add: <HTMLButtonElement> document.querySelector('[add]'),
        repeat: <HTMLButtonElement> document.querySelector('[repeat]'),
        save: <HTMLButtonElement> document.querySelector('[save]')
    };
}

export class PlayListView {
    list: Playlist;
    el: HTMLOListElement = <HTMLOListElement> document.querySelector('ol');

    constructor(list: Playlist) {
        this.list = list;
        this.list.Stream.pipe(filter((message:IPLMessage) => message.message === 'songDeleted')).subscribe(() => {
            this.render();
        });
        this.render();
    }

    public render()
    {
        this.el.innerHTML = '';
        for (let i: number = 0; i < this.list.List.length; i++) {
            var li = document.createElement('li');

            li.innerHTML = this.list.List[i].name + ' <a class="fa fa-trash"></a>';
            this.el.appendChild(li);

            li.addEventListener('click', ((_index) => {
                return (event: MouseEvent) => {
                    this.list.playSong(_index);
                }
            })(i));
            li.children[0].addEventListener('click', ((_index) => {
                return (event) => {
                    this.list.removeSong(_index);
                }
            })(i));
        }
    }
}