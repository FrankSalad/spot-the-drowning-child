(function() {
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
  }, {
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
	}];

function pickRandom(items) {
  return items[Math.floor(Math.random()*items.length)];
}

function youtubeInit() {
	window.gameState = pickRandom(videos);
  window.onYouTubeIframeAPIReady = function() {
    window.player = new YT.Player('player', {
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
      	'onReady': function youtubeReady() {
      		window.playerReady = true;
      	}
      }
    });
  };
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
youtubeInit();

})();
