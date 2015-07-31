(function() {
  // 2. This code loads the IFrame Player API code asynchronously.
  var dom = {
    findBox: $('#box'),
    statusBox: document.getElementById('status'),
    infoBox: document.getElementById('info'),
    scoreBox: document.getElementById('scorebox'),
    creatorLink: document.getElementById('creator-link'),
    cursorLooks: $('.cursor-look'),
    cursorDot: document.getElementById('cursor-dot'),
    showStatus: function showStatus(text) {
      this.statusBox.textContent = text;
    },
    showInfo: function showInfo() {
      this.infoBox.setAttribute('style', 'display: block; -webkit-animation: info-fade 4s; animation: info-fade 4s; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards;');
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
    },
    showCursorDot: function showCursorDot(x, y, win) {
      var positionStyle = 'display: block; position: absolute; top:'+(y-5)+'px;left:'+(x-5)+'px;';
      this.cursorDot.setAttribute('style', positionStyle+'-webkit-animation: cursor-throb 1s infinite ease; animation: cursor-throb 1s infinite ease;');
      if (win) {
        this.cursorDot.className += ' win-hue';
        this.cursorDot.setAttribute('style', positionStyle+'-webkit-animation: fadeout 10s; animation: fadeout 10s; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards;');
      }
    },
    hideCursorDot: function hideCursorDot() {
      this.cursorDot.setAttribute('style', 'display: none;');
    }
  };
  var successMsgs = ['Good job.', 'Nice work.', 'Good eye.', 'Well done.', 'Nicely done.'];
  var pauseMsgs = ['Looks fine there.', 'Seems ok.', 'All clear there.', 'Just splashing around.'];

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
          modestbranding: 1,
          fs: 0,
          html5: 1,
          autoplay: 1
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
    dom.findBox.click(function(e) {
      if (gameState.status() === 'drowning' || gameState.status() === 'spotted') {
        dom.showCursorDot(e.pageX, e.pageY, true);
        success();
        dom.findBox.attr('style', 'display: none;');
      }
    });

    dom.cursorLooks.click(function(e) {
      if (player.getPlayerState() === YT.PlayerState.PAUSED) {
        player.playVideo();
      } else if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        var status = gameState.status();
        if (status === 'drowning' || status === 'ok' || status === 'spotted') {
          dom.showCursorDot(e.pageX, e.pageY);
        }
        player.pauseVideo();
      }
    });

    dom.cursorDot.click(function() {
      player.playVideo();
    });
  }

  function setupItem(nextItem) {
    nextItem.status = observable();
    nextItem.status('ok');
    player.cueVideoById(nextItem.videoId, undefined, 'large');
    dom.findBox.attr('style', nextItem.findBoxStyle);
    player.playVideo();

    ga('set', 'dimension1', nextItem.videoId);

    gameState.status(function(newStatus) {
      if (newStatus === 'drowning') {
        dom.findBox.attr('style', 'display: block;' + nextItem.findBoxStyle);
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
    player.playVideo();

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
      dom.cursorLooks.hide();
      if (status === 'drowning' || status === 'ok') {
        var pauseMsg = pickRandom(pauseMsgs);
        dom.showStatus(pauseMsg + ' Keep looking.');
      } else if (status === 'spotted' || status === 'saved') {
        end();
      }
    } else if (event.data === YT.PlayerState.PLAYING) {
      dom.cursorLooks.show();
      if (status === 'drowning' || status === 'ok') {
        dom.hideCursorDot();
        dom.showStatus('Spot the drowning child.');
        if (status === 'drowning' && player.getCurrentTime() - gameState.drowningStartSecs > 2) {
          dom.showStatus('Spot the drowning child. Click the video to help the lifeguard.');
        }
      }
    }
  }

  function pickRandom(items) {
    return items[Math.floor(Math.random()*items.length)];
  }
})();
