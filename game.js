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

    loadScript('http://code.jquery.com/jquery-1.11.3.min.js', function() {
      loadScript('observable.min.js', function() {
        wireDom();
        youtubeInit(onPlayerReady, onPlayerStateChange);

        loadScript('share.min.js', function() {
          new Share('.share', {
            title: 'Spot The Drowning Child',
            description: 'Can you spot the drowning child in this crowded wave pool?',
            url: 'http://spotthedrowningchild.com',
            ui: { button_text: '', flyout: 'top left'}
          });
          $('.status .share span').on('click', function() {
            amplitude.logEvent("video share clicked");
          });
        });
      });
    });
  }
  init();

  function onPlayerReady(event) {
    setupGame(gameState);
  }

  function youtubeInit(onPlayerReady, onPlayerStateChange) {
    Videos.getYoutubePlayer().then(
      function(player_gameState) {
        player = player_gameState[0];
        gameState = player_gameState[1];
        player.addEventListener('onStateChange', onPlayerStateChange);
        onPlayerReady();
      },
      function(error_event) {
        dom.showStatus('Sorry, there was an error playing this video, refresh to try again.');
        amplitude.logEvent("video error", {'error_data': error_event.data});
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
      statusLink: $('.statuslink'),
      scoreBox: $('#scorebox'),
      cursorLooks: $('.cursor-look'),
      cursorDot: $('#cursor-dot'),
      article: $('#article'),
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
        this.playAgain.show();
        this.statusLink.attr('style', '-webkit-animation: fadein 4s; animation: fadein 4s; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards;');

        this.playAgain.on('click', function() {
          amplitude.logEvent("video playagain clicked");
        });
      },
      showTryAgain: function showTryAgain() {
        this.tryAgain.attr('href', '#');
        this.tryAgain.show();
        this.statusLink.attr('style', '-webkit-animation: fadein 4s; animation: fadein 4s; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards;');

        this.tryAgain.on('click', function() {
          reset();
          amplitude.logEvent("video replay clicked");
        });
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
    dom.findBox.attr('style', gameState.findBoxStyle);
    player.playVideo();

    ga('set', 'dimension1', gameState.videoId);
    ga('send', 'event', 'game', 'setup', gameState.videoId);
    amplitude.setUserProperties({videoId: gameState.videoId});
    amplitude.logEvent("game setup");

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
        if (!gameState.winTime) {
          // Just show the play again link, player can't click anymore.
          dom.showStatus('Try again.');
          amplitude.logEvent("game over", {'pauses': gameState.pauseCount});
        }
      } else if (newStatus === 'spotted') {
        if (!gameState.winTime) {
          gameState.ongoingPlayStatus = 'Spot the drowning child.';
          dom.showStatus(gameState.ongoingPlayStatus);
        }
        end();
      }
    });

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

  function reset() {
    dom.article.hide();
    player.setPlaybackRate(1);
    player.seekTo(0);
    dom.scoreBox.removeClass('win-hue'); // Dim previous win time.
    dom.cursorDot.removeClass('win-hue');
    dom.statusBox.removeClass('end');
    gameState.winTime = undefined;
    gameState.pauseCount = 0;
    gameState.ended = false;
    Article.getDom(dom).then(function(dom) {
      dom.winInfoBox.setAttribute('style', 'display: none;');
    });
    setupGame(gameState);

  }

  function success() {
    gameState.winTime = player.getCurrentTime();
    ga('send', 'event', 'game', 'success', gameState.videoId);
    ga('send', 'event', gameState.videoId, 'win', 'game time', gameState.winTime);
    amplitude.logEvent("drowner spotted", {'time': gameState.winTime, 'pauses': gameState.pauseCount});

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
    dom.article.show();
    loadScript('article.js', function() {
      Article.getDom(dom).then(function(dom) {
        amplitude.logEvent("shown wininfo");
        dom.showWinInfo(time < 0);
      });
    });
  }

  function end() {
    if (gameState.ended)
      return;
    gameState.ended = true;
    function showPlayAgain() { dom.showPlayAgain(); }
    function showTryAgain() { dom.showTryAgain(); }
    ga('send', 'event', 'game', 'end', gameState.videoId);
    dom.statusBox.addClass('end');
    dom.article.show();
    loadScript('article.js', function() {
      Article.getDom(dom).then(function(dom) {
        amplitude.logEvent("shown info");
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
