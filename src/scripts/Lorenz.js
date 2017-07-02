// Lorenz Strange Attractor
// Adapted from http://wow.techbrood.com/static/20151028/2960.html

window.Lorenz = function(selector, onclick, undefined){
  //Lorenz Attractor Parameters
  var dt = 0.001, // (δτ) Represents time. Draw curve - higher the value, straighter the lines
      p = 28, // (ρ) point of origin
      w = 10, // (σ)width of main element - higher the number, narrower the width
      beta = 8 / 3; // (β) points of equilibrium - this applied value results in the infinity symbol. higher values will break the equilibrium, causing the ends to separate and spread. When ρ = 28, σ = 10, and β = 8/3, the Lorenz system has chaotic solutions; it is this set of chaotic solutions that make up the Lorenz Attractor (the infinity symbol).  If ρ < 1 then there is only one equilibrium point, which is at the origin. This point corresponds to no convection. All orbits converge to the origin when ρ  < 1.  The 'fork' occurs occurs at ρ = 1, or ρ > 1 Try it. 

  var width, height, canvas = d3.select(selector);
  var context = canvas.node().getContext("2d");
  width = $(selector).outerWidth();
  height = $(selector).outerHeight();

  // set how the new images are drawn onto the existing image. 'lighter' will  display the new over the old
  context.globalCompositeOperation = "lighter";
  context.translate(width / 2, height / 2);
  context.scale(12, 8);
  context.lineWidth = 0.2;

  //Color Range
  var color = d3.scalePow()
                .domain([-1000000, 0, 8, 23, 55, 1000000])
                .range(["#699", "#699", "#099", "#069", "#009", "#009"])
                .exponent(1.5)
                .interpolate(d3.interpolateRgb);

  function spawnSprite(x, y) {
    //Generate x, y location from mouse (given), or else on the edges of the screen
    if(typeof x == "undefined" && typeof y == "undefined"){
      if(Math.random() > 0.5)
        x = width * Math.random(), y = (Math.random() > 0.5) * height;
      else
        y = height * Math.random(), x = (Math.random() > 0.5) * width;
    }

    //Account for scaling factor and centering
    x = (x - width/2) / 12;
    y = (y - height/2) / 8;

    var z = 10 + (Math.random() - 0.5) * 10,
        n = Math.random() * 3 + 1, //different speeds
        t1 = Math.random() * 5000 + 15000; // time (sec) it's allowed to swirl for


    var offset = Math.random() * 30; //to vary the colors more

    var t = d3.timer(function(t0) {
      for (var i = 0; i < n; ++i) {
        context.strokeStyle = color(z + offset);
        context.beginPath();
        context.moveTo(x, y);
        x += dt * w * (y - x);
        y += dt * (x * (p - z) - y);
        z += dt * (x * y - beta * z);
        context.lineTo(x, y);
        context.stroke();
      }
      if(t0 > t1)
        t.stop();
    });
  }
  
  //start black
  context.fillStyle = "rgb(0,0,0)";
  context.fillRect(-width/2, -height/2, width, height);
  
  //source-atop draws old image on top of the new image, eliminating the part of the old image that is outside of the new image range.
  context.globalCompositeOperation = "source-atop";
  context.fillStyle = "rgba(0,0,0,.05)";
  function fadeTick(){
    context.fillRect(-width/2, -height/2, width, height);
  }

  d3.interval(function(elapsedTime){spawnSprite();}, 1000);
  d3.interval(function(elapsedTime){fadeTick();}, 200);
  for(var i = 0; i < 20; i++)
    spawnSprite();

  return {
    onclicktouch: function(x, y){
      spawnSprite(x, y);
    }
  };
};
