/*global window: false */
/*jslint browser: true */
(function() {
"use strict";
  window.videos = [{
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
  },
  {
    "videoId": "L0KTqPloUiU",
    "drowningStartSecs": 31.506069,
    "whistleSecs": 37.946069,
    "swimmerSavedSecs": 45.126069,
    "findBoxStyle": "left: 601px; top: -302px; position: relative; width: 203px; height: 136px;"
  },
  {
    "videoId": "iXFgOBjk860",
    "drowningStartSecs": 15.212946,
    "whistleSecs": 39.515772,
    "swimmerSavedSecs": 41.586436,
    "findBoxStyle": "left: 297px; top: -381px; position: relative; width: 118px; height: 97px;"
  },
  {
    "videoId": "NycwxaU4GPw",
    "drowningStartSecs": 28.168464,
    "whistleSecs": 36.457647,
    "swimmerSavedSecs": 48.531527,
    "findBoxStyle": "left: 665px; top: -437px; position: relative; width: 134px; height: 73px;"
  },
  {
    "videoId": "STY8N-33-tQ",
    "drowningStartSecs": 9.434103,
    "whistleSecs": 12.452573,
    "swimmerSavedSecs": 16.980278,
    "findBoxStyle": "left: 452px; top: -282px; position: relative; width: 110px; height: 68px;"
  },
  {
    "videoId": "aQ6h8U-rqZ4",
    "drowningStartSecs": 20.873072,
    "whistleSecs": 26.517484,
    "swimmerSavedSecs": 37.569728,
    "findBoxStyle": "left: 594px; top: -266px; position: relative; width: 134px; height: 85px;"
}];

function pickRandom(items) {
  return items[Math.floor(Math.random()*items.length)];
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getAnchorGame() {
  var qVal = parseInt(getParameterByName('g'));
  if (!isNaN(qVal) && qVal < videos.length) {
    return videos[qVal];
  }
  var hashVal = window.location.hash.substr(1);
  hashVal = parseInt(hashVal);
  if (!isNaN(hashVal) && hashVal < videos.length) {
    return videos[hashVal];
  }
}

function annotateVideos() {
  for (var i=0; i < videos.length; ++i) {
    (function(i) {
      videos[i].next = function next() {
        return videos[(i+1) % videos.length];
      };
      videos[i].index = i;
    })(i);
  }
}

function getYoutubePlayer() {
  if (window.Videos._playerPromise) {
    return window.Videos._playerPromise;
  }
  var player;
  var gameState = getAnchorGame() || pickRandom(videos);
  console.log(gameState.videoId);

  var promise = new Promise(function (resolve, reject) {
      window.onYouTubeIframeAPIReady = function() {
      player = new window.YT.Player('player', {
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
          'onReady': function youtubeReady(e) {
              resolve([player, gameState]);
          },
          'onError': function (e) {
              reject(e);
          }
        }
      });
    };
  });

  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  return promise;
}
annotateVideos();
window.Videos = {
  _playerPromise: undefined,
  getYoutubePlayer: getYoutubePlayer
};
window.Videos._playerPromise = getYoutubePlayer();

})();
