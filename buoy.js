(function() {

var buoys = [
  '<a href="http://www.amazon.com/gp/product/B00FGJ86MO/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00FGJ86MO&linkCode=as2&tag=spothedrochi-20&linkId=GXSJRDOURPQ7JMJ6"><img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00FGJ86MO&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=spothedrochi-20" ></a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=spothedrochi-20&l=as2&o=1&a=B00FGJ86MO" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
  '<a href="http://www.amazon.com/gp/product/B0014495UM/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B0014495UM&linkCode=as2&tag=spothedrochi-20&linkId=DNTO55Q5SBG7323H"><img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0014495UM&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=spothedrochi-20" ></a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=spothedrochi-20&l=as2&o=1&a=B0014495UM" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
  '<a href="http://www.amazon.com/gp/product/B000MTXZGK/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B000MTXZGK&linkCode=as2&tag=spothedrochi-20&linkId=KYOM4NST5MU5U4LE"><img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B000MTXZGK&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=spothedrochi-20" ></a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=spothedrochi-20&l=as2&o=1&a=B000MTXZGK" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
  '<a href="http://www.amazon.com/gp/product/B000URPEX6/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B000URPEX6&linkCode=as2&tag=spothedrochi-20&linkId=WMIQJI2AR3SQIL7W"><img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B000URPEX6&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=spothedrochi-20" ></a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=spothedrochi-20&l=as2&o=1&a=B000URPEX6" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
  '<a href="http://www.amazon.com/gp/product/B003P8J1KE/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B003P8J1KE&linkCode=as2&tag=spothedrochi-20&linkId=T3FFY3OMVG2TW6MA"><img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B003P8J1KE&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=spothedrochi-20" ></a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=spothedrochi-20&l=as2&o=1&a=B003P8J1KE" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
  '<a href="http://www.amazon.com/gp/product/B008MOM4KK/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B008MOM4KK&linkCode=as2&tag=spothedrochi-20&linkId=VKLUB5LHHZSUJNFB"><img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B008MOM4KK&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=spothedrochi-20" ></a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=spothedrochi-20&l=as2&o=1&a=B008MOM4KK" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
  '<a href="http://www.amazon.com/gp/product/B001PGWZDS/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B001PGWZDS&linkCode=as2&tag=spothedrochi-20&linkId=LLNUWEXLMEXOPVST"><img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B001PGWZDS&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=spothedrochi-20" ></a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=spothedrochi-20&l=as2&o=1&a=B001PGWZDS" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />'
];

function pickRandom(items) {
  return items[Math.floor(Math.random()*items.length)];
}

var buoyContainer = $('.buoy');
var buoy = pickRandom(buoys);
buoyContainer.html(buoy);
buoyContainer.attr('style', 'display: inline');
})();