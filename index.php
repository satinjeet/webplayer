<head>
    <link rel="stylesheet" type="text/css" href="bower_components/ink/dist/css/ink.min.css">
    <link rel="stylesheet" type="text/css" href="bower_components/ink/dist/css/font-awesome.min.css">
    <style>
        li.active {
            border-bottom: 1px solid #6495ED;
            color: #6495ED;
        }

        ol {
            width: 300px;
        }

        ol li {
            transition: all 0.3s ease;
            -webkit-transition: all 0.3s ease;
            cursor: pointer;
        }
        ol li:hover {
            cursor: pointer;
            padding-left: 10px;
            color: #9999FF;
        }

        ol li a.fa.fa-trash {
            float: right;
        }

        .hidden {
            display: none;
        }
    </style>
</head>


<audio controls>
    
</audio>

<div class>
    <button class="ink-button" add>Add <i class="fa fa-music"></i></button>
    <button class="ink-button" repeat>Repeat <i class="fa fa-repeat"></i></button>
    <button class="ink-button" save>
        Save
        <i class="fa fa-floppy-o"></i>
    </button>
    <button class="ink-button" save onclick="document.getElementById('add-playlist').click();">
        Open
        <i class="fa fa-cloud-upload"></i>
        <input type="file" id="add-playlist" class="hidden"/>
    </button>
</div>

<ol>
    
</ol>

<script>
    var itemName = "mp3::songs";
    var metaName = "mp3::songs::meta";
    var repeatModes = {
        one: 'mode_one',
        all: 'mode_all',
        off: 'mode_off',
    }
    var meta;

    var repeatLike = repeatModes.all;

    var list = localStorage.getItem(itemName) || "[]";

    if (confirm('play from last saved state ??')) {
        meta = JSON.parse(localStorage.getItem(metaName));
    }   else {
        meta = {
            playingAt: 0,
            index: 0,
        };
    }

    var list = JSON.parse(list);
    var index = 0;
    var started = false;

    var addButton = document.querySelector('[add]');
    var repeatButton = document.querySelector('[repeat]');
    var save = document.querySelector('[save]');
    var player = document.querySelector('audio');
    var playList = document.querySelector('ol');
    var load = document.getElementById('add-playlist');
    var fr = new FileReader;


    function shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }

    function renderList()
    {
        playList.innerHTML = '';
        for (var i = 0; i < list.length; i++) {
            var li = document.createElement('li');
            
            li.innerHTML = list[i].name + ' <a class="fa fa-trash"></a>';
            li.setAttribute('list-index', i);

            playList.appendChild(li);

            li.addEventListener('click', function() {
                playSong(this.getAttribute('list-index'));
            });
            li.children[0].addEventListener('click', function() {
                removeSong(this.parentElement.getAttribute('list-index'));
            });
        }
    }

    function removeSong(index) {
        if (index >= 0) {
            list.splice(index,1);
        } else {
            return;
        }
        renderList();
        updateListState();
        localStorage.setItem(itemName, JSON.stringify(list));
    }

    function playSong(listIndex, playingAt) {

        if (playingAt == null) {
            playingAt = 0;
        }

        if (listIndex >= 0) {
            index = listIndex;
        } else {
            if (repeatLike == repeatModes.one) {
                // dont do anything.
                // 
            } else if (repeatLike == repeatModes.all) {
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
        player.play();

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
        fr.readAsText(load.files[0]);
    });

    fr.onload = function() {
        content = JSON.parse(atob(fr.result));
        backup = list;
        list = content;
        index = 0;
        playSong(0);
        renderList();
        updateListState();
    }

    rehashList();
    renderList();
    if (meta.index >=0) {
        index = meta.index;
        playSong(meta.index, meta.playingAt);

    } else if (list.length) {
        playSong(0);
    }

    setInterval(function() {
        meta.playingAt = player.currentTime;
        meta.index = index;

        localStorage.setItem(metaName, JSON.stringify(meta));
    }, 1000);
</script>