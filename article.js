/*global window: false */
(function(Videos, ShareConfig) {
"use strict";
if (window.Article)
  return;
window.Article = {};

function getDom(parentDom) {
  if (window.Article._articlePromise)
    return window.Article._articlePromise;

  var promise = new Promise(function(resolve, reject) {
    $('#article').load('article.html', undefined, function loaded() {
      var dom = {
        infoBox: $('#info'),
        winInfoBox: $('#wininfo'),
        creatorLink: $('#creator-link'),
        playAgain: $('.play-again'),
        tryAgain: $('.try-again'),
        winStatus: $('.win-status'),
        setupShareButton: function setupShareButton() {
          if (this._shareSetup === true)
            return;
          this._shareSetup = true;

          new Share('#wininfo .share', ShareConfig('wininfo'));
          new Share('#info .share', ShareConfig('info'));
          $('#wininfo .share label').on('click', function() {
            amplitude.logEvent("wininfo share clicked");
          });
          $('#info .share label').on('click', function() {
            amplitude.logEvent("info share clicked");
          });
        },
        showWinStatus: function showWinStatus(status) {
          this.winStatus.text(status);
        },
        showInfo: function showInfo() {
          this.setupShareButton();
          var dom = this;
          dom.infoBox.fadeIn('slow').animate({
              'bottom': '54%'
              }, {duration: 'slow', queue: false}, function() {
              // Animation complete.
          });
        },
        showWinInfo: function showWinInfo(creatorLink) {
          this.setupShareButton();
          parentDom.statusBox.addClass('win');
          var dom = this;
          dom.winInfoBox.fadeIn('slow').animate({
              'bottom': '54%'
              }, {duration: 'slow', queue: false}, function() {
              // Animation complete.
          });
          loadScript('buoy.js', function() {});

          //if (creatorLink) {
            this.creatorLink.attr('style', 'display: inline-block');
          //}
        },
      };

      $('#wininfo .play-again').on('click', function() {
        amplitude.logEvent("wininfo playagain clicked");
      });
      $('#info .play-again').on('click', function() {
        amplitude.logEvent("info playagain clicked");
      });

      dom.creatorLink.on('click', function() {
        amplitude.logEvent("creator link clicked");
      });



      // Set up the play-again links:
      Videos.getYoutubePlayer().then(
        function(player_gameState) {
          var gameState = player_gameState[1];
          var nextGame = gameState.next();

          dom.playAgain.attr('href', window.location.pathname + '?' + $.param({'g':nextGame.index}));
          if (history.pushState) {
              // If we refresh, don't choose the same video
              var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
              window.history.pushState({path:newurl},'',newurl);
          }
        }
      );

      resolve(dom);
    });
  });
  window.Article._articlePromise = promise;
  return promise;
}

window.Article.getDom = getDom;
})(window.Videos, window.ShareConfig);
