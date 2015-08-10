/*global window: false */
(function(Videos) {
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
        infoBox: document.getElementById('info'),
        winInfoBox: document.getElementById('wininfo'),
        creatorLink: document.getElementById('creator-link'),
        playAgain: $('.play-again'),
        tryAgain: $('.try-again'),
        setupShareButton: function setupShareButton() {
          if (this._shareSetup === true)
            return;
          this._shareSetup = true;
          loadScript('share.min.js', function() {
              new Share('#article .share', {
              title: 'Spot The Drowning Child',
              description: 'Can you spot the drowning child in this crowded wave pool?',
              url: 'http://spotthedrowningchild.com'
            });
              $('#wininfo .share label').on('click', function() {
                amplitude.logEvent("wininfo share clicked");
              });
              $('#info .share label').on('click', function() {
                amplitude.logEvent("info share clicked");
              });
          });
        },
        showInfo: function showInfo() {
          this.setupShareButton();
          var dom = this;
          setTimeout(function() {
            dom.infoBox.setAttribute('style', 'display: block;');
          }, 3500);
        },
        showWinInfo: function showWinInfo(creatorLink) {
          this.setupShareButton();
          parentDom.statusBox.addClass('win');
          var dom = this;
          setTimeout(function() {
            dom.winInfoBox.setAttribute('style', 'display: block;');
          }, 3500);
          loadScript('buoy.js', function() {});

          if (creatorLink) {
            this.creatorLink.setAttribute('style', 'display: inline-block');
          }
        },
      };

      $('#wininfo .play-again').on('click', function() {
        amplitude.logEvent("wininfo playagain clicked");
      });
      $('#info .play-again').on('click', function() {
        amplitude.logEvent("info playagain clicked");
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
})(window.Videos);
