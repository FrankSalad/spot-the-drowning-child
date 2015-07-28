(function() {
  // 2. This code loads the IFrame Player API code asynchronously.
  var dom = {
    findBox: document.getElementById('box'),
    statusBox: document.getElementById('status'),
    infoBox: document.getElementById('info'),
    scoreBox: document.getElementById('scorebox'),
    creatorLink: document.getElementById('creator-link'),
    showStatus: function showStatus(text) {
      this.statusBox.textContent = text;
    },
    showInfo: function showInfo() {
      this.infoBox.setAttribute('style', 'display: block; -webkit-animation: example 4s; animation: example 4s; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards;');
    },
    showTime: function showTime(time) {
      var timeStr = time.toPrecision(2);
      if (time > 0) {
        timeStr = '+'+timeStr;
        this.scoreBox.className += ' win-hue';
        this.creatorLink.setAttribute('style', 'display: inline');
      }
      timeStr += 's';
      this.scoreBox.textContent = timeStr;
    }
  };
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

  var gameState = pickRandom(videos);
  var player;

  function init() {
    youtubeInit(onPlayerReady, onPlayerStateChange);
    wireDom(dom);
  }
  init();

  function onPlayerReady(event) {
    setupItem(gameState);

    setInterval(function gameFrame() {
      if (!player || !player.getCurrentTime || player.getPlayerState() !== YT.PlayerState.PLAYING)
          return;
      var time = player.getCurrentTime();
      // State transitions: ok -> drowning -> spotted -> saved
      if (time > gameState.swimmerSavedSecs && gameState.status() === 'spotted') {
          gameState.status('saved');
      } else if (time > gameState.whistleSecs && gameState.status() === 'drowning') {
          gameState.status('spotted');
      } else if (time > gameState.drowningStartSecs && gameState.status() === 'ok') {
          gameState.status('drowning');
      }
    }, 100);
  }

  function youtubeInit(onPlayerReady, onPlayerStateChange) {
    window.onYouTubeIframeAPIReady = function() {
      player = new YT.Player('player', {
        height: '480',
        width: '854',
        videoId: gameState.videoId,
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
    };
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  function wireDom(dom) {
    dom.findBox.addEventListener('click', function() {
      if (gameState.status() === 'drowning' || gameState.status() === 'spotted') {
        success();
        dom.findBox.setAttribute('style', 'display: none;');
      }
    });
  }

  function setupItem(nextItem) {
    nextItem.status = observable();
    nextItem.status('ok');
    player.cueVideoById(nextItem.videoId, undefined, 'large');
    dom.findBox.setAttribute('style', nextItem.findBoxStyle);
    player.playVideo();

    gameState.status(function(newStatus) {
      if (newStatus === 'drowning') {
        dom.findBox.setAttribute('style', 'display: block;' + nextItem.findBoxStyle);
      } else if (newStatus === 'saved') {
        end();
      } else if (newStatus === 'spotted') {
        if (!gameState.winTime) {
          dom.showStatus('Spot the drowning child. Click the video to help the lifeguard.');
        }
      }
    });
  }

  function success() {
    gameState.winTime = player.getCurrentTime();

    if (gameState.status() === 'drowning') {
      player.seekTo(gameState.whistleSecs);
    }
    gameState.status('spotted');
    player.setPlaybackRate(2);

    var time = gameState.whistleSecs - gameState.winTime;
    var msg = pickRandom(successMsgs);
    dom.showStatus(msg);
    dom.showTime(time);
  }

  function end() {
    dom.showInfo();
  }



  // 4. The API will call this function when the video player is ready.

  function onPlayerStateChange(event) {
    var status = gameState.status();
    if (event.data === YT.PlayerState.ENDED) {
      end();
    } else if (event.data === YT.PlayerState.PAUSED) {
      if (status === 'drowning' || status === 'ok') {
        var pauseMsg = pickRandom(pauseMsgs);
        dom.showStatus(pauseMsg + ' Keep looking.');
      } else if (status === 'spotted' || status === 'saved') {
        end();
      }
    } else if (event.data === YT.PlayerState.PLAYING &&
        (status === 'drowning' || status === 'ok')) {
      dom.showStatus('Spot the drowning child.');
    }
  }

  function pickRandom(items) {
    return items[Math.floor(Math.random()*items.length)];
  }
})();