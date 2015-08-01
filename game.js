(function() {
  // 2. This code loads the IFrame Player API code asynchronously.
  function loadScript(src, callback)
  {
    var s,
        r,
        t;
    r = false;
    s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    s.onload = s.onreadystatechange = function() {
      //console.log( this.readyState ); //uncomment this line to see which ready states are called.
      if ( !r && (!this.readyState || this.readyState == 'complete') )
      {
        r = true;
        callback();
      }
    };
    t = document.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(s, t);
  }
  var dom;
  var successMsgs = ['Good job.', 'Nice work.', 'Good eye.', 'Well done.', 'Nicely done.'];
  var pauseMsgs = ['Looks fine there.', 'Seems ok.', 'All clear there.', 'Just splashing around.'];

  function init() {
    loadScript('http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js', function() {
      loadScript('observable.js', function() {
        wireDom();
        youtubeInit(onPlayerReady, onPlayerStateChange);
      });
    });


    loadScript('share.min.js', function() {
      new Share('.share', {
        title: 'Spot The Drowning Child',
        description: 'An interactive PSA about the instinctive drowning response.',
        url: 'http://spotthedrowningchild.com'
      });
    });
  }
  init();

  function onPlayerReady(event) {
    setupItem(gameState);
    if (gameState.frameRefresh)
      clearInterval(gameState.frameRefresh);
    gameState.frameRefresh = setInterval(function gameFrame() {
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
    if (window.playerReady) {
      onPlayerReady();
    } else {
      window.player.addEventListener('onReady', onPlayerReady);
    }
    window.player.addEventListener('onStateChange', onPlayerStateChange);
  }

  function wireDom() {
    dom = {
      findBox: $('#box'),
      statusBox: document.getElementById('status'),
      infoBox: document.getElementById('info'),
      winInfoBox: document.getElementById('wininfo'),
      scoreBox: document.getElementById('scorebox'),
      creatorLink: document.getElementById('creator-link'),
      cursorLooks: $('.cursor-look'),
      cursorDot: $('#cursor-dot'),
      showStatus: function showStatus(text) {
        this.statusBox.textContent = text;
      },
      showInfo: function showInfo() {
        this.infoBox.setAttribute('style', 'display: block; -webkit-animation: info-fade 4s; animation: info-fade 4s; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards;');
      },
      showWinInfo: function showWinInfo() {
        this.winInfoBox.setAttribute('style', 'display: block; -webkit-animation: wininfo-fade 4s; animation: wininfo-fade 4s; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards;');
        loadScript('buoy.js', function() {});
      },
      showTime: function showTime(time) {
        var timeStr = time.toPrecision(2);
        if (time > 0) {
          timeStr = '+'+timeStr;
          this.scoreBox.className += ' win-hue';
          this.creatorLink.setAttribute('style', 'display: inline-block');
        }
        timeStr += 's';
        this.scoreBox.textContent = timeStr;
      },
      showCursorDot: function showCursorDot(x, y, win) {
        var positionStyle = 'display: block; position: absolute; top:'+(y-5)+'px;left:'+(x-5)+'px;';
        this.cursorDot.attr('style', positionStyle+'-webkit-animation: cursor-throb 1s infinite ease; animation: cursor-throb 1s infinite ease;');
        if (win) {
          this.cursorDot.addClass('win-hue');
          this.cursorDot.attr('style', positionStyle+'-webkit-animation: fadeout 10s; animation: fadeout 10s; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards;');
        }
      },
      hideCursorDot: function hideCursorDot() {
        this.cursorDot.attr('style', 'display: none;');
      },
      isMobile: function isMobile() {
        return navigator.userAgent.match(/(iPod|iPhone|iPad)/);
      }
    };

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
          if (!gameState.winTime) {
            dom.showCursorDot(e.pageX, e.pageY);
          }
        }
        player.pauseVideo();
      }
      ga('send', 'event', gameState.videoId, 'click', 'video clicked', {'dimension1': gameState.videoId});
    });

    dom.cursorDot.click(function() {
      player.playVideo();
    });
  }

  function setupItem(nextItem) {
    nextItem.status = observable();
    nextItem.status('ok');
    nextItem.pauseCount = 0;
    player.cueVideoById(nextItem.videoId, undefined, 'large');
    dom.findBox.attr('style', nextItem.findBoxStyle);
    player.playVideo();

    ga('set', 'dimension1', nextItem.videoId);
    ga('send', 'event', 'game', 'setup', nextItem.videoId);

    gameState.status(function(newStatus) {
      if (newStatus === 'drowning') {
        dom.findBox.attr('style', 'display: block;' + nextItem.findBoxStyle);
        setTimeout(function() {
          if (!gameState.winTime) {
            dom.showStatus('Spot the drowning child. Click the video to help the lifeguard.');
          }
        }, 10*1000);
      } else if (newStatus === 'saved') {
        if (gameState.frameRefresh)
          clearInterval(gameState.frameRefresh);
      } else if (newStatus === 'spotted') {
        end();
      }
    });
  }

  function success() {
    gameState.winTime = player.getCurrentTime();
    ga('send', 'event', 'game', 'success', gameState.videoId);
    ga('send', 'event', gameState.videoId, 'win', 'game time', gameState.winTime);

    var status = gameState.status();
    gameState.status('spotted');
    if (!dom.isMobile()) {
      if (status === 'drowning') {
        player.seekTo(gameState.whistleSecs);
      }
      player.setPlaybackRate(2);
      player.playVideo();
    } else {
      setTimeout(function() {
        if (status === 'drowning') {
          player.seekTo(gameState.whistleSecs);
        }
        player.playVideo();
      }, 1000);
    }


    var time = gameState.whistleSecs - gameState.winTime;
    var msg = pickRandom(successMsgs);
    dom.showStatus(msg);
    dom.showTime(time);

    dom.showWinInfo();
  }

  function end() {
    ga('send', 'event', 'game', 'end', gameState.videoId);
    dom.showInfo();
  }

  // 4. The API will call this function when the video player is ready.


  function onPlayerStateChange(event) {
    var status = gameState.status();
    if (event.data === YT.PlayerState.ENDED) {
      end();
    } else if (event.data === YT.PlayerState.PAUSED) {
      gameState.pauseCount += 1;
      ga('send', 'event', 'game', 'paused', gameState.videoId, gameState.pauseCount);
      dom.cursorLooks.hide();
      if (status === 'drowning' || status === 'ok') {
        if (!dom.isMobile() || gameState.pauseCount > 1) {
          var pauseMsg = pickRandom(pauseMsgs);
          dom.showStatus(pauseMsg + ' Keep looking.');
        }
      } else if (status === 'spotted' || status === 'saved') {
        end();
      }
    } else if (event.data === YT.PlayerState.PLAYING) {
      ga('send', 'event', 'game', 'played', gameState.videoId);
      if (!dom.isMobile())
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
