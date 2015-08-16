/*global window: false */
/*jslint browser: true */
// Priority Queue: https://github.com/adamhooper/js-priority-queue
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.PriorityQueue=t()}}(function(){return function t(e,i,r){function o(n,s){if(!i[n]){if(!e[n]){var u="function"==typeof require&&require;if(!s&&u)return u(n,!0);if(a)return a(n,!0);var h=new Error("Cannot find module '"+n+"'");throw h.code="MODULE_NOT_FOUND",h}var p=i[n]={exports:{}};e[n][0].call(p.exports,function(t){var i=e[n][1][t];return o(i?i:t)},p,p.exports,t,e,i,r)}return i[n].exports}for(var a="function"==typeof require&&require,n=0;n<r.length;n++)o(r[n]);return o}({1:[function(t,e,i){var r,o,a,n,s,u={}.hasOwnProperty,h=function(t,e){function i(){this.constructor=t}for(var r in e)u.call(e,r)&&(t[r]=e[r]);return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t};r=t("./PriorityQueue/AbstractPriorityQueue"),o=t("./PriorityQueue/ArrayStrategy"),n=t("./PriorityQueue/BinaryHeapStrategy"),a=t("./PriorityQueue/BHeapStrategy"),s=function(t){function e(t){t||(t={}),t.strategy||(t.strategy=n),t.comparator||(t.comparator=function(t,e){return(t||0)-(e||0)}),e.__super__.constructor.call(this,t)}return h(e,t),e}(r),s.ArrayStrategy=o,s.BinaryHeapStrategy=n,s.BHeapStrategy=a,e.exports=s},{"./PriorityQueue/AbstractPriorityQueue":2,"./PriorityQueue/ArrayStrategy":3,"./PriorityQueue/BHeapStrategy":4,"./PriorityQueue/BinaryHeapStrategy":5}],2:[function(t,e,i){var r;e.exports=r=function(){function t(t){if(null==(null!=t?t.strategy:void 0))throw"Must pass options.strategy, a strategy";if(null==(null!=t?t.comparator:void 0))throw"Must pass options.comparator, a comparator";this.priv=new t.strategy(t),this.length=0}return t.prototype.queue=function(t){return this.length++,void this.priv.queue(t)},t.prototype.dequeue=function(t){if(!this.length)throw"Empty queue";return this.length--,this.priv.dequeue()},t.prototype.peek=function(t){if(!this.length)throw"Empty queue";return this.priv.peek()},t.prototype.clear=function(){return this.length=0,this.priv.clear()},t}()},{}],3:[function(t,e,i){var r,o;o=function(t,e,i){var r,o,a;for(o=0,r=t.length;r>o;)a=o+r>>>1,i(t[a],e)>=0?o=a+1:r=a;return o},e.exports=r=function(){function t(t){var e;this.options=t,this.comparator=this.options.comparator,this.data=(null!=(e=this.options.initialValues)?e.slice(0):void 0)||[],this.data.sort(this.comparator).reverse()}return t.prototype.queue=function(t){var e;return e=o(this.data,t,this.comparator),void this.data.splice(e,0,t)},t.prototype.dequeue=function(){return this.data.pop()},t.prototype.peek=function(){return this.data[this.data.length-1]},t.prototype.clear=function(){return void(this.data.length=0)},t}()},{}],4:[function(t,e,i){var r;e.exports=r=function(){function t(t){var e,i,r,o,a,n,s,u,h;for(this.comparator=(null!=t?t.comparator:void 0)||function(t,e){return t-e},this.pageSize=(null!=t?t.pageSize:void 0)||512,this.length=0,r=0;1<<r<this.pageSize;)r+=1;if(1<<r!==this.pageSize)throw"pageSize must be a power of two";for(this._shift=r,this._emptyMemoryPageTemplate=e=[],i=a=0,u=this.pageSize;u>=0?u>a:a>u;i=u>=0?++a:--a)e.push(null);if(this._memory=[],this._mask=this.pageSize-1,t.initialValues)for(h=t.initialValues,n=0,s=h.length;s>n;n++)o=h[n],this.queue(o)}return t.prototype.queue=function(t){return this.length+=1,this._write(this.length,t),void this._bubbleUp(this.length,t)},t.prototype.dequeue=function(){var t,e;return t=this._read(1),e=this._read(this.length),this.length-=1,this.length>0&&(this._write(1,e),this._bubbleDown(1,e)),t},t.prototype.peek=function(){return this._read(1)},t.prototype.clear=function(){return this.length=0,void(this._memory.length=0)},t.prototype._write=function(t,e){var i;for(i=t>>this._shift;i>=this._memory.length;)this._memory.push(this._emptyMemoryPageTemplate.slice(0));return this._memory[i][t&this._mask]=e},t.prototype._read=function(t){return this._memory[t>>this._shift][t&this._mask]},t.prototype._bubbleUp=function(t,e){var i,r,o,a;for(i=this.comparator;t>1&&(r=t&this._mask,t<this.pageSize||r>3?o=t&~this._mask|r>>1:2>r?(o=t-this.pageSize>>this._shift,o+=o&~(this._mask>>1),o|=this.pageSize>>1):o=t-2,a=this._read(o),!(i(a,e)<0));)this._write(o,e),this._write(t,a),t=o;return void 0},t.prototype._bubbleDown=function(t,e){var i,r,o,a,n;for(n=this.comparator;t<this.length;)if(t>this._mask&&!(t&this._mask-1)?i=r=t+2:t&this.pageSize>>1?(i=(t&~this._mask)>>1,i|=t&this._mask>>1,i=i+1<<this._shift,r=i+1):(i=t+(t&this._mask),r=i+1),i!==r&&r<=this.length)if(o=this._read(i),a=this._read(r),n(o,e)<0&&n(o,a)<=0)this._write(i,e),this._write(t,o),t=i;else{if(!(n(a,e)<0))break;this._write(r,e),this._write(t,a),t=r}else{if(!(i<=this.length))break;if(o=this._read(i),!(n(o,e)<0))break;this._write(i,e),this._write(t,o),t=i}return void 0},t}()},{}],5:[function(t,e,i){var r;e.exports=r=function(){function t(t){var e;this.comparator=(null!=t?t.comparator:void 0)||function(t,e){return t-e},this.length=0,this.data=(null!=(e=t.initialValues)?e.slice(0):void 0)||[],this._heapify()}return t.prototype._heapify=function(){var t,e,i;if(this.data.length>0)for(t=e=1,i=this.data.length;i>=1?i>e:e>i;t=i>=1?++e:--e)this._bubbleUp(t);return void 0},t.prototype.queue=function(t){return this.data.push(t),void this._bubbleUp(this.data.length-1)},t.prototype.dequeue=function(){var t,e;return e=this.data[0],t=this.data.pop(),this.data.length>0&&(this.data[0]=t,this._bubbleDown(0)),e},t.prototype.peek=function(){return this.data[0]},t.prototype.clear=function(){return this.length=0,void(this.data.length=0)},t.prototype._bubbleUp=function(t){for(var e,i;t>0&&(e=t-1>>>1,this.comparator(this.data[t],this.data[e])<0);)i=this.data[e],this.data[e]=this.data[t],this.data[t]=i,t=e;return void 0},t.prototype._bubbleDown=function(t){var e,i,r,o,a;for(e=this.data.length-1;;){if(i=(t<<1)+1,o=i+1,r=t,e>=i&&this.comparator(this.data[i],this.data[r])<0&&(r=i),e>=o&&this.comparator(this.data[o],this.data[r])<0&&(r=o),r===t)break;a=this.data[r],this.data[r]=this.data[t],this.data[t]=a,t=r}return void 0},t}()},{}]},{},[1])(1)});
// Observable: https://github.com/dominictarr/observable
!function(){"use strict";function n(n){return void 0===n}function t(n){return"function"!=typeof n}function o(n,t){for(var o in n)n[o](t)}function e(n,t){delete n[n.indexOf(t)]}function u(u){function i(n){n!==r&&o(c,r=n)}function f(o){return n(o)?r:t(o)?i(o):(c.push(o),o(r),function(){e(c,o)})}var r=u,c=[];return f.set=i,f}"object"==typeof module?module.exports=u:window.observable=u}();
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
  var gameEvents;

  function init() {

    loadScript('http://code.jquery.com/jquery-1.11.3.min.js', function() {
      wireDom();
      youtubeInit(onPlayerReady, onPlayerStateChange);
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

        var self = this;
        scheduleAt(function() {
          if (gameState.winTime) {
            self.playAgain.attr('style', 'display: inline-block; animation: 2s ease 0s reverse none infinite running link-throb; -webkit-animation: 2s ease 0s reverse none infinite running link-throb;');
          }
        }, gameState.swimmerSavedSecs); // Throb after lifeguard reaches.

        this.playAgain.on('click', function() {
          amplitude.logEvent("video playagain clicked", {'replays': gameState.replays});
        });
      },
      showTryAgain: function showTryAgain() {
        this.tryAgain.attr('href', '#');
        this.tryAgain.show();
        this.statusLink.attr('style', '-webkit-animation: fadein 4s; animation: fadein 4s; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards;');

        var self = this;
        scheduleAt(function() {
          if (!gameState.winTime) {
            self.tryAgain.attr('style', 'display: inline-block; animation: 2s ease 0s reverse none infinite running link-throb; -webkit-animation: 2s ease 0s reverse none infinite running link-throb;');
          }
        }, gameState.swimmerSavedSecs); // Throb after lifeguard reaches.

        this.tryAgain.on('click', function() {
          reset();
          amplitude.logEvent("video replay clicked", {'replays': gameState.replays});
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
    gameEvents = new PriorityQueue({comparator: function(a, b) { return a.time - b.time; }});
    gameState.status = observable();
    gameState.status('ok');

    gameState.pauseCount = 0;
    if (gameState.replays === undefined)
      gameState.replays = 0;
    gameState.ongoingPlayStatus = 'Spot the drowning child.';
    dom.findBox.attr('style', gameState.findBoxStyle);
    player.playVideo();

    ga('set', 'dimension1', gameState.videoId);
    ga('send', 'event', 'game', 'setup', gameState.videoId);
    amplitude.setUserProperties({videoId: gameState.videoId, 'replays': gameState.replays});
    amplitude.logEvent("game setup", {'replays': gameState.replays});

    gameState.status(function(newStatus) {
      if (newStatus === 'ok') {
        dom.findBox.attr('style', 'display: none;');
        gameState.ongoingPlayStatus = 'Spot the drowning child.';
        dom.showStatus(gameState.ongoingPlayStatus);
      }
      else if (newStatus === 'drowning') {
        dom.findBox.attr('style', 'display: block;' + gameState.findBoxStyle);
      }
      else if (newStatus === 'saved') {
        if (!gameState.winTime) {
          // Just show the play again link, player can't click anymore.
          if (dom.isMobile()) {
            dom.showStatus('Try again. Pause and tap the child in the video to help the lifeguard.');
          } else {
            dom.showStatus('Try again. Click the child during the video to help the lifeguard.');
          }
          amplitude.logEvent("game over", {'pauses': gameState.pauseCount, 'replays': gameState.replays});
        }
      }
      else if (newStatus === 'spotted') {
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
      if (time > gameState.swimmerSavedSecs) {
        gameState.status('saved');
      } else if (time > gameState.whistleSecs) {
        gameState.status('spotted');
      } else if (time > gameState.drowningStartSecs) {
        gameState.status('drowning');
      } else {
        gameState.status('ok');
      }
      while (gameEvents.length && gameEvents.peek().time <= time) {
        gameEvents.dequeue().callback();
      }
    }, 100);
  }

  function reset() {
    player.setPlaybackRate(1);
    player.seekTo(0);
    dom.scoreBox.removeClass('win-hue'); // Dim previous win time.
    dom.cursorDot.removeClass('win-hue');
    dom.statusBox.removeClass('end');
    gameState.winTime = undefined;
    gameState.pauseCount = 0;
    gameState.ended = false;
    gameState.replays += 1;
    gameState.videoEnded = false;
    dom.tryAgain.attr('style', 'display: inline-block;'); // Stop throbbing.
    dom.playAgain.attr('style', 'display: inline-block;'); // Stop throbbing.
    dom.showStatus(gameState.ongoingPlayStatus);
    Article.getDom(dom).then(function(dom) {
      dom.winInfoBox.hide();
      dom.infoBox.hide();
    });
    setupGame(gameState);

  }

  function schedule(callback, seconds) {
    scheduleAt(callback, seconds + player.getCurrentTime());
  }
  function scheduleAt(callback, seconds) {
    gameEvents.queue({callback: callback, time:seconds});
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
    amplitude.logEvent("drowner spotted", {'time': gameState.winTime, 'wtime': time, 'pauses': gameState.pauseCount, 'replays': gameState.replays});
    var msg = pickRandom(successMsgs);
    dom.showStatus(msg);
    dom.showTime(time);
    if (time <= 0) {
      ga('send', 'event', 'game', 'predicted', gameState.videoId);
    }
    loadScript('article.js', function() {
      Article.getDom(dom).then(function(dom) {
        amplitude.logEvent("shown wininfo", {'replays': gameState.replays});
        schedule(function() {
          dom.showWinInfo(time < 0);
          dom.showWinStatus(msg);
        }, 2);
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
    loadScript('article.js', function() {
      Article.getDom(dom).then(function(dom) {
        amplitude.logEvent("shown info", {'replays': gameState.replays});
        showPlayAgain();
        showTryAgain();
        schedule(function() {
          dom.showInfo();
        }, 2);
      });
    });
  }

  // 4. The API will call this function when the video player is ready.


  function onPlayerStateChange(event) {
    var status = gameState.status();
    if (event.data === YT.PlayerState.ENDED) {
      dom.cursorLooks.hide();
      end();
      gameState.videoEnded = true;
      if (gameState.frameRefresh)
        clearInterval(gameState.frameRefresh);
    } else if (event.data === YT.PlayerState.PAUSED) {
      gameState.pauseCount += 1;
      ga('send', 'event', 'game', 'paused', gameState.videoId, gameState.pauseCount);
      dom.cursorLooks.hide();
      if (status === 'drowning' || status === 'ok') {
        if (!dom.isMobile() || gameState.pauseCount > 1) {
          var pauseMsg = pickRandom(pauseMsgs);
          dom.showStatus(pauseMsg + ' Keep looking.');
        }
      }
      if (status === 'spotted') {
        dom.showStatus('Click the video to help the lifeguard.');
      }
      if (status === 'spotted' || status === 'saved') {
        end();
      }
    } else if (event.data === YT.PlayerState.PLAYING) {
      if (gameState.videoEnded) {
        reset();  // Reset on video loop.
      }
      ga('send', 'event', 'game', 'played', gameState.videoId);
      if (!dom.isMobile())
        dom.cursorLooks.show();
      if (status === 'drowning' || status === 'ok' || status === 'spotted') {
        if (status === 'drowning' || status === 'ok')
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
