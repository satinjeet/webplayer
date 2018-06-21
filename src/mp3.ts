import { 
    Song, 
    SongList, 
    RepeatModes
} from "./types";
import { player } from "./player";
import { renderVisuals } from "./canvas";
import { Playlist, IPLMessage } from "./playlist";
import {filter} from "rxjs/internal/operators";

const itemName = "mp3::songs", 
    metaName = "mp3::songs::meta";
const localStorageList = localStorage.getItem(itemName) || "[]";

let meta;
let repeatLike = RepeatModes.ALL;
let list: SongList = <SongList>JSON.parse(localStorageList);
let index: number = 0;
let started: boolean = false;
let addButton: HTMLButtonElement = <HTMLButtonElement> document.querySelector('[add]');
var repeatButton = <HTMLButtonElement> document.querySelector('[repeat]');
var save = <HTMLButtonElement> document.querySelector('[save]');

var playList = <HTMLOListElement> document.querySelector('ol');
const load: HTMLInputElement = <HTMLInputElement> document.getElementById('add-playlist');
var fr: FileReader = new FileReader;
var ctx = new AudioContext();
var audioSrc = ctx.createMediaElementSource(player);
var analyser = ctx.createAnalyser();


audioSrc.connect(analyser);
audioSrc.connect(ctx.destination);

renderVisuals(analyser);

const pl = new Playlist();
pl.Stream.pipe(filter((message:IPLMessage) => message.message === 'songDeleted')).subscribe(() => {
    renderList();
})

function renderList()
{
    playList.innerHTML = '';
    for (let i: number = 0; i < pl.List.length; i++) {
        var li = document.createElement('li');
        
        li.innerHTML = pl.List[i].name + ' <a class="fa fa-trash"></a>';
        playList.appendChild(li);

        li.addEventListener('click', ((_index) => {
            return (event: MouseEvent) => {
                playSong(_index);
            }
        })(i));
        li.children[0].addEventListener('click', ((_index) => {
            return (event) => {
                pl.removeSong(_index);
            }
        })(i));
    }
}


function playSong(listIndex, playingAt: number = 0) {

    if (playingAt == null) {
        playingAt = 0;
    }

    if (listIndex >= 0) {
        index = listIndex;
    } else {
        if (repeatLike == RepeatModes.ONE) {
            // dont do anything.
            // 
        } else if (repeatLike == RepeatModes.ALL) {
            index++;
            if (!list[index]) {
                index = 0;
            }
        } else {
            index++;
            if (!list[index]) {
                return;
            }
        }
    }

    player.src = list[index].loc;
    player.currentTime = playingAt;
    // player.play();

    updateListState();
}

function rehashList()
{
    for (var i = list.length - 1; i >= 0; i--) {
        list[i].hash = btoa(list[i].name);
    }
    localStorage.setItem(itemName, JSON.stringify(list));
}

function updateListState()
{
    var allChildren = document.querySelectorAll('li')

    for (var j = 0; j < allChildren.length; j++) {
        if (index == j) {
            allChildren[j].classList.add('active');
        } else {
            allChildren[j].classList.remove('active');
        }
    }
}

player.addEventListener('ended', playSong);

addButton.addEventListener('click', function() {
    var loc = prompt('song http address ? ');
    var name = prompt('name ? ');

    if (!loc) {
        return;
    }

    if (!name) {
        name = loc;
    }

    list.push({name: name, loc: loc, hash: btoa(name)});
    localStorage.setItem(itemName, JSON.stringify(list));

    if (player.src == '') {
        playSong(0);
    }
    renderList();
    updateListState();
});

repeatButton.addEventListener('click', function() {
    renderList();
    updateListState();

});

save.addEventListener('click', function() {
    var content = btoa(JSON.stringify(list));
    window.open('data:text/csv;charset=utf-8,' + escape(content));
});

load.addEventListener('change', function() {
    if (load.files && load.files[0]) {
        fr.readAsText(load.files[0]);
    }
});

fr.onload = function() {
    const content = <SongList> JSON.parse(atob(fr.result));
    const backup = list;
    list = content;
    index = 0;
    playSong(0);
    renderList();
    updateListState();
}

rehashList();
renderList();
if (pl.Meta.index >=0 && pl.List.length) {
    index = pl.Meta.index;
    playSong(pl.Meta.index, pl.Meta.playingAt);

} else if (pl.List.length) {
    playSong(0);
}

setInterval(function() {
    pl.Meta.playingAt = player.currentTime;
    pl.Meta.index = index;

    localStorage.setItem(metaName, JSON.stringify(pl.Meta));
}, 1000);