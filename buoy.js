(function() {
"use strict";

var buoys = [
  '<img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00FGJ86MO&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=spothedrochi-20" >',
  '<img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0014495UM&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=spothedrochi-20" >',
  '<img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B000MTXZGK&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=spothedrochi-20" >',
  '<img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B000URPEX6&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=spothedrochi-20" >',
  '<img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B003P8J1KE&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=spothedrochi-20" >',
  '<img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B008MOM4KK&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=spothedrochi-20" >',
  '<img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B001PGWZDS&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=spothedrochi-20" >'
];

function pickRandom(items) {
  return items[Math.floor(Math.random()*items.length)];
}

var buoyContainer = $('.buoy');
var buoy = pickRandom(buoys);
buoyContainer.html(buoy);
buoyContainer.attr('style', 'display: inline');
})();
