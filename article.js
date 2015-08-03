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
        setupShareButton: function setupShareButton() {
          if (this._shareSetup === true)
            return;
          this._shareSetup = true;
          loadScript('share.min.js', function() {
              new Share('.share', {
              title: 'Spot The Drowning Child',
              description: 'An interactive PSA about the instinctive drowning response.',
              url: 'http://spotthedrowningchild.com'
            });
          });
        },
        showInfo: function showInfo() {
          this.setupShareButton();
          this.infoBox.setAttribute('style', 'display: block; -webkit-animation: info-fade 4s; animation: info-fade 4s; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards;');
        },
        showWinInfo: function showWinInfo(creatorLink) {
          this.setupShareButton();
          parentDom.statusBox.addClass('win');
          this.winInfoBox.setAttribute('style', 'display: block; -webkit-animation: wininfo-fade 4s; animation: wininfo-fade 4s; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards;');
          loadScript('buoy.js', function() {});

          if (creatorLink) {
            this.creatorLink.setAttribute('style', 'display: inline-block');
          }
        },
      };

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
