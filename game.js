// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var successMsgs = ['Good job.', 'Nice work.', 'Good eye.', 'Well done.', 'Nicely done.'];
var pauseMsgs = ['Looks fine there.', 'Seems ok.', 'All clear there.', 'Just splashing around.'];

var videos = [{
  videoId: '4sFuULOY5ik',
  drowningStartSecs: 12.2,
  whistleSecs: 14.5,
  swimmerSavedSecs: 25,
  findBoxStyle: "left: 455px; top: -365px; position: relative; width: 50px; height: 34px;"
}, {
  videoId: 'JYQ9AwsTkAw',
  drowningStartSecs: 18.4,
  whistleSecs: 21,
  swimmerSavedSecs: 28.5,
  findBoxStyle: "left: 383px; top: -326px; position: relative; width: 80px; height: 65px;"
}, {
  videoId: 'PuAfTA2wf7o',
  drowningStartSecs: 37.3,
  whistleSecs: 45.1,
  swimmerSavedSecs: 50.5,
  findBoxStyle: "left: 329px; top: -385px; position: relative; width: 103px; height: 37px;"
}, {
  videoId: 'T5mDQeDkca0',
  drowningStartSecs: 54.0,
  whistleSecs: 56.5,
  swimmerSavedSecs: 62.8,
  findBoxStyle: "left: 606px; top: -265px; position: relative; width: 102px; height: 102px;",
}];

var currentItem = videos[Math.floor(Math.random()*videos.length)]; // Pick one at random.
var findBox = document.getElementById('box');
var statusBox = document.getElementById('status');
var infoBox = document.getElementById('info');

setInterval(function() {
  if (!player || !player.getCurrentTime || player.getPlayerState() !== YT.PlayerState.PLAYING)
      return;
  var time = player.getCurrentTime();
  if (time > currentItem.swimmerSavedSecs && currentItem.status() === 'spotted') {
      currentItem.status('saved');
  } else if (time > currentItem.whistleSecs && currentItem.status() === 'drowning') {
      currentItem.status('spotted');
  } else if (time > currentItem.drowningStartSecs && currentItem.status() === 'ok') {
      currentItem.status('drowning');
  }
}, 100);

function setupItem(nextItem) {
  nextItem.status = observable();
  nextItem.status('ok');
  player.cueVideoById(nextItem.videoId, undefined, 'large');
  findBox.setAttribute('style', nextItem.findBoxStyle);
  player.playVideo();

  currentItem.status(function(newStatus) {
    if (newStatus === 'saved') {
      end();
    }
  });
}

function success() {
  var msg = pickRandom(successMsgs);
  showStatus(msg);
}

function end() {
  infoBox.setAttribute('style', 'display: block; -webkit-animation: example 4s; animation: example 4s; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards;');
}

findBox.addEventListener('click', function() {
  if (currentItem.status() === 'drowning' || currentItem.status() === 'spotted') {
    findBox.setAttribute('style', 'display: none;');
    success();
    if (currentItem.status() === 'drowning') {
      player.seekTo(currentItem.whistleSecs);
    }
    currentItem.status('spotted');
    player.setPlaybackRate(2);
  }
});

function pickRandom(items) {
  return items[Math.floor(Math.random()*items.length)];
}

function showStatus(text) {
  statusBox.textContent = text;
}


// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '480',
    width: '854',
    videoId: currentItem.videoId,
    playerVars: {
      controls: 0,
      rel: 0,
      showinfo: 0,
      playsinline: 1,
      modestbranding: 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  setupItem(currentItem);
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
function onPlayerStateChange(event) {
  var status = currentItem.status();
  if (event.data === YT.PlayerState.ENDED) {
    end();
  } else if (event.data === YT.PlayerState.PAUSED) {
    if (status === 'drowning' || status === 'ok') {
      var pauseMsg = pickRandom(pauseMsgs);
      showStatus(pauseMsg + ' Keep looking.');
    } else if (status === 'spotted' || status === 'saved') {
      end();
    }
  } else if (event.data === YT.PlayerState.PLAYING &&
      (status === 'drowning' || status === 'ok')) {
    showStatus('Spot the drowning child.');
  }
}
function stopVideo() {
  player.stopVideo();
}
