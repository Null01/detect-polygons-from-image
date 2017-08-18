
//---------------------------------------------------
// Init - Draw html
//--------------------------------------------------- 
function init_draw_html(){
  var list_imgs = $('#panel-image ul');
  var n = 4;
  for (var id_img = 1; id_img <= (3 * n); id_img++) {    
    list_imgs.append('<li id="card-' + id_img + '" class="card-of-list" > <img data-toggle="magnify" class="img-responsive" src="/img/icono-taller/tile_awesome_' + id_img + '.png" > </li>');
  }
  stroll.bind('#panel-image ul');
}
//---------------------------------------------------
// Actions / Events  - html
//---------------------------------------------------
$( document ).ready(function() {
  $("#btn-repeat").click(function(event) {
    if(file_tile != null){
      console.log('rotate');
      var ctx = canvas01.getContext('2d');
      ctx.clearRect(0, 0, canvas01.width, canvas01.height);
      ctx.rotate(90 * Math.PI / 180.0);
      ctx.translate(100, 100);
      print_tile_origin();
    }
  })
  $(".card-of-list").click(function(event) {
    var id_element = ($(this.id).selector).replace('card-','');
    console.log(id_element);
    file_tile = "tile_awesome_" + id_element + ".png.json";
    init();
  })
});
/*
function action_image_selected(element){
  var id_element = "#" + element.id;
  $(id_element).effect('bounce', {}, 500, setTimeout(function() {
    $(id_element).removeAttr('style').hide().fadeIn();
  }, 500));
  id_element = id_element.replace('#card-','');
  file_tile = "tile_awesome_" + id_element +".png.json"
  init();
}
*/
//---------------------------------------------------
// Init
//---------------------------------------------------
var canvas01 = document.getElementById('canvas01');
var canvas02 = document.getElementById('canvas02');
var shape; // Tree of shape
var file_tile = "tile_awesome_1.png.json"; // Name of file_json

//---------------------------------------------------
// Prototypes events
//---------------------------------------------------
canvas01.addEventListener('click', function(evt) {
  if(shape != null){
    var click = action_clic(canvas01, evt);
    draw_polygon_inside_of_click(click);  
  }  
}, false);

//---------------------------------------------------
// Events
//---------------------------------------------------
function action_clic(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left, y: evt.clientY - rect.top
  };
}

//---------------------------------------------------
// Function
//---------------------------------------------------
function init(){
  if(file_tile != null){
    if (canvas01.getContext) {
      shape = new Shape();
      var ctx = canvas01.getContext('2d');
      ctx.clearRect(0, 0, canvas01.width, canvas01.height);
      //ctx.translate(0, 0);
      ctx.save();
      var ctx_02 = canvas02.getContext('2d');
      ctx_02.clearRect(0, 0, canvas02.width, canvas02.height);
      ctx_02.save();
      $.getJSON("/data/simulator_tile/" + file_tile,  null)
      .done(function( data ) {
        for(var it in data.shape){
          var polygonJSON = data.shape[it];
          var polygon = new Polygon(polygonJSON._id, polygonJSON.area, {x:10, y:10}, polygonJSON.points, '#FFFFFF', 1);
          polygon.draw_polygon(ctx, null, polygonJSON.points, 0.9);
          shape.add_polygon(polygon);
        }
        shape.polygons.sort(function(a, b){ return a.area - b.area; });
        print_board_of_tiles();
        console.log('Configuration initial simulator - success');
      })
      .fail(function() {
        console.error('Json file [' + file_tile + '] not found.');
        file_tile = null;
        shape = null;
      });
    }else
    console.error('Browser not support canvas - init()');
  }
}
//***************************************************
function print_board_of_tiles(){
  var ctx = canvas02.getContext('2d');
  var origin = {x:10, y:10};
  var polygons = shape.polygons;
  var n = 6, m = 8, v = 6, step = 282, scale = 0.45;

  ctx.lineWidth = 0.7;
  ctx.strokeStyle = "#000000";
  ctx.stroke();

  for(var i = 1; i <= n; i++){
    for(var j = 1; j <= m; j++){
      print_tile_empty(ctx, {x:origin.x, y:origin.y}, step, step, scale);
      origin.x += (step * scale);
    }
    origin.x = 10;
    origin.y += (step * scale);
  }
  print_tile_empty(ctx, {x:origin.x, y:origin.y}, step, step, scale);

  var flag_position = {x:10, y:10};
  origin = {x:4 + step + flag_position.x, y:5 + step + flag_position.y};
  for(var i = 1; i <= (4 * v); i++){
    for(var it = polygons.length - 1; it >= 0; it--){
      var polygon = polygons[it];
      polygon.draw_polygon(ctx, {x:origin.x, y:origin.y}, null, scale);
    }
    origin.x += step;
    if(i % v == 0){
      origin.x = 4 + step + flag_position.x;
      origin.y += step;
    }
  }
  ctx.save();
}
//***************************************************
function print_tile_empty(ctx, origin, w, h, scale){
  ctx.lineWidth = 0.8;
  ctx.strokeStyle = "#000000";
  ctx.stroke();
  ctx.rect(origin.x, origin.y, (w * scale), (h * scale));
}
//***************************************************
function print_tile_origin(){
  var ctx = canvas01.getContext('2d');
  var polygons = shape.polygons;
  for(var it = polygons.length - 1; it >= 0; it--){
    var polygon = polygons[it];
    polygon.draw_polygon(ctx, null, null, 0.9);
  } 
}
//***************************************************
function draw_polygon_inside_of_click(click){
  var polygons = shape.polygons;
  var inside = false;
  for(var it in polygons){
    var polygon = polygons[it];
    inside = polygon.inside_my_polygon({x:click.x, y:click.y});
    if(inside){
      console.log('polygon fined. [' + inside + ']  id [' + polygon.id + ']');
      polygon.color = 'red';
      print_tile_origin();
      print_board_of_tiles();
      break;
    }
  }
  if(!inside)
    console.log('Click not inside of any polygon. [' + inside + ']');
}

//---------------------------------------------------
// Objects
//---------------------------------------------------
class Shape{
  constructor() {
    this._polygons = [];
  }

  add_polygon(polygon) {
    this._polygons.push(polygon);
  }

  get polygons(){
    return this._polygons;
  }

  toString() {
    return '[' + this._polygons + ']';
  }
}
//***************************************************
class Polygon{

  constructor(id, area, origin, points2D, color, scale) {
    this._id = id;
    this._area = area;
    this._originX = origin.x;
    this._originY = origin.y;
    this._points2D_XY = this.convert_points2D(points2D);
    this._points2D = points2D;
    this._color = color;
    this._scale = scale;    
  }

  convert_points2D(points2D){
    var list = [];
    for(var i = 0; i < points2D.length; i+=2){
      list.push({ x: points2D[i], y: points2D[i+1] });
    }
    return list;
  }

  draw_polygon(ctx, origin, points2D, scale){
    if(origin === undefined || origin == null)
      origin = { x:this._originX, y:this._originY };
    if(points2D === undefined || points2D == null)
      points2D = this._points2D;
    if(scale === undefined || scale == null)
      scale = this._scale;
    
    ctx.moveTo(origin.x, origin.y);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.beginPath();
    for(var i = 0; i < points2D.length; i+= 2){
      var px = (origin.x + points2D[i]) * scale;
      var py = (origin.y + points2D[i+1]) * scale;
      ctx.lineTo(px,py);
    }
    ctx.closePath();
    ctx.fillStyle = this._color;
    ctx.fill(); 
  }

  inside_my_polygon(point) {
    var xi, xj, yi, yj, intersect, inside = false;
    var x = point.x, y = point.y;
    var vs = this._points2D_XY;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      xi = (this._originX + vs[i].x) * this._scale,
      yi = (this._originY + vs[i].y) * this._scale,
      xj = (this._originX + vs[j].x) * this._scale,
      yj = (this._originY + vs[j].y) * this._scale,
      intersect = ((yi > y) != (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  get id(){
    return this._id;
  }

  get area(){
    return this._area;
  }

  set color(color){
    this._color =  color;
  }

  get color(){
    return this._color;
  }

  get points2D(){
    return this._points2D;
  }

  toString() {
    return '[' + this._points2D + ']';
  }
}
