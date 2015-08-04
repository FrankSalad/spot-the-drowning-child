/*global window: false */
/*jslint browser: true */
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

(function(Videos) {
"use strict";
  var dom;
  var successMsgs = ['Good job.', 'Nice work.', 'Good eye.', 'Well done.', 'Nicely done.'];
  var pauseMsgs = ['Looks fine there.', 'Seems ok.', 'All clear there.', 'Just splashing around.'];
  var player;
  var gameState;

  function init() {
    loadScript('https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js', function() {
      loadScript('observable.min.js', function() {
        wireDom();
        youtubeInit(onPlayerReady, onPlayerStateChange);
      });
    });
  }
  init();

  function onPlayerReady(event) {
    setupGame(gameState);
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
    Videos.getYoutubePlayer().then(
      function(player_gameState) {
        player = player_gameState[0];
        gameState = player_gameState[1];
        player.addEventListener('onStateChange', onPlayerStateChange);
        onPlayerReady();
      }
    );
  }

  function wireDom() {
    dom = {
      findBox: $('#box'),
      statusBox: $('.status'),
      statusText: $('#status'),
      playAgain: $('.play-again'),
      tryAgain: $('.try-again'),
      scoreBox: $('#scorebox'),
      cursorLooks: $('.cursor-look'),
      cursorDot: $('#cursor-dot'),
      showStatus: function showStatus(text) {
        this.statusText.text(text);
      },
      showTime: function showTime(time) {
        var timeStr = time.toPrecision(2);
        if (time > 0) {
          timeStr = '+'+timeStr;
        } else {
          this.scoreBox.addClass('win-hue');
        }
        timeStr += 's';
        this.scoreBox.text(timeStr);
      },
      showPlayAgain: function showPlayAgain() {
        this.playAgain.attr('style', 'display: inline; -webkit-animation: playagain-fade 4s; animation: playagain-fade 4s; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards;');
      },
      showTryAgain: function showTryAgain() {
        this.tryAgain.attr('href', window.location.pathname + '?g=' + gameState.index);
        this.tryAgain.attr('style', 'display: inline; -webkit-animation: playagain-fade 4s; animation: playagain-fade 4s; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards;');
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

  function setupGame(gameState) {
    gameState.status = observable();
    gameState.status('ok');
    gameState.pauseCount = 0;
    gameState.ongoingPlayStatus = 'Spot the drowning child.';
    player.cueVideoById(gameState.videoId, undefined, 'large');
    dom.findBox.attr('style', gameState.findBoxStyle);
    player.playVideo();

    ga('set', 'dimension1', gameState.videoId);
    ga('send', 'event', 'game', 'setup', gameState.videoId);

    gameState.status(function(newStatus) {
      if (newStatus === 'drowning') {
        dom.findBox.attr('style', 'display: block;' + gameState.findBoxStyle);
        setTimeout(function() {
          if (!gameState.winTime) {
            gameState.ongoingPlayStatus = 'Spot the drowning child.';
            dom.showStatus(gameState.ongoingPlayStatus);
          }
        }, (gameState.whistleSecs - gameState.drowningStartSecs) * Math.random() * 1000);
      } else if (newStatus === 'saved') {
        if (gameState.frameRefresh) {
          clearInterval(gameState.frameRefresh);
        }
        loadScript('jquery-scrollto.js', function() {
          setTimeout(function() {
            $('#bottomsquare').ScrollTo({
              duration: 1000
            });
          }, 4*1000);
        });
        if (!gameState.winTime) {
          // Just show the play again link, player can't click anymore.
          dom.showStatus('Try again.');
        }
      } else if (newStatus === 'spotted') {
        if (!gameState.winTime) {
          gameState.ongoingPlayStatus = 'Spot the drowning child.';
          dom.showStatus(gameState.ongoingPlayStatus);
        }
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


    var time = gameState.winTime - gameState.whistleSecs;
    var msg = pickRandom(successMsgs);
    dom.showStatus(msg);
    dom.showTime(time);
    if (time <= 0) {
      ga('send', 'event', 'game', 'predicted', gameState.videoId);
    }
    loadScript('article.js', function() {
      Article.getDom(dom).then(function(dom) {
        dom.showWinInfo(time < 0);
      });
    });
  }

  function end() {
    function showPlayAgain() { dom.showPlayAgain(); }
    function showTryAgain() { dom.showTryAgain(); }
    ga('send', 'event', 'game', 'end', gameState.videoId);
    loadScript('article.js', function() {
      Article.getDom(dom).then(function(dom) {
        showPlayAgain();
        showTryAgain();
        dom.showInfo();
      });
    });
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
        if (!gameState.winTime) {
          dom.showStatus(gameState.ongoingPlayStatus);
        }
      }
    }
  }

  function pickRandom(items) {
    return items[Math.floor(Math.random()*items.length)];
  }
})(window.Videos);
