
/*
var stage = new Konva.Stage({
  container: 'container',
  width: 400,
  height: 400
});
var layer = new Konva.Layer();

file_tile = "tile_colorizer_02.png";
$.getJSON( "data/data_"+file_tile+".json",  null)
.done(function( data ) {
  for(var it in data.shape){
    //var color = '#' + Math.floor(Math.random()*16777215).toString(16);
    var shape = data.shape[it];
    var poly = new Konva.Line({
      points: shape.points,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 1.2,
      closed : true
    });
    // add the shape to the layer
    layer.add(poly);   
    console.log("pintame");
  }


  // add the layer to the stage
  stage.add(layer);  
});
*/

/*
var app = new PIXI.Application(800, 600, {backgroundColor : 0xffffff});
document.body.appendChild(app.view);

var container = new PIXI.Container();
app.stage.addChild(container);

file_tile = "tile_colorizer_01.png"
var texture = PIXI.Texture.fromImage('img/'+file_tile);
var tile = new PIXI.Sprite(texture);
app.stage.addChild(tile);

$.getJSON( "data/data_"+file_tile+".json",  null)
.done(function( data ) {
  var graphics = new PIXI.Graphics();
  // set a fill and line style 
  // graphics.beginFill(0xFF3300);
  //graphics.lineStyle(2, 0xffd900, 1);
  graphics.lineStyle(1, 0x000000, 1);

  for(var it in data.shape){
    var color = '0x' + Math.floor(Math.random()*16777215).toString(16);
    var shape = data.shape[it];
    graphics.drawPolygon(shape.points);
  }
  graphics.endFill();
  app.stage.addChild(graphics);
});

// Center on the screen
container.x = 0;
container.y = 0;
//container.x = (app.renderer.width - container.width) / 3;
//container.y = (app.renderer.height - container.height) / 3;
*/