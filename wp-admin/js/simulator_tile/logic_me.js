
//-----------------------------------------------------------------------------------
// Init - Draw html
//-----------------------------------------------------------------------------------
function init_draw_html(){
  var n = 15;
  var panel_selector = $('#panel-image');
  for (var id_img = 1; id_img <= (3 * n); id_img++) {
     panel_selector.append('<a class="card"> <div class="image"> <img id="tile-' + id_img + '" src="/img/icono-taller/tile_awesome_' + id_img + '.png" class="image-selector" > </div> </a>');
  }

  var colors = [
  ["202022","424244","6F6F70","939499","B8B8BC","E1E1E1","81A6A8","B8CDCC","FBFBFB"],
  ["004F78","2386B8","8AB1B6","037B90","0190B0","65C4D5","1A55A3","296AB3","6DC5F0"],
  ["89695C","8F7564","A08775","AE9D7B","B4AD97","EAE6DB","328BA3","6F91AE","8CA5BC"],
  ["314732","4F664F","54947D","494F2D","1B5934","659D63","708F5F","8C9666","BFDDB5"],
  ["553E46","633F43","754142","922931","B54147","ED8B91","D98688","F6B1B4","FBDCE5"],
  ["314E5E","2C4A61","554F62","9F8795","B597A1","D1B5B5","C0A9B4","E3CCD3","F8E4E8"],
  ["8F764F","877846","B99342","B49767","C0AC68","C5BB6A","FAD387","EBDC88","F9EA9D"],
  ["8B472B","A14F30","ECA27F","F39B37","F8B372","F2BC9E","FCC342","FDDC8F","FDF0BB"]
  ];

  var panel_colors = $('#panel-colors');
  for (var it = 0; it < colors.length ; it++) {
    for (var jt = 0; jt < colors[it].length ; jt++) {
      panel_colors.append('<div id="color-' + it + '-' + jt + '" style="background-color: #' + colors[it][jt] + '" class="block-color" ></div>');
    }
  }
}
//-----------------------------------------------------------------------------------
// Actions / Events  - html
//-----------------------------------------------------------------------------------
$( document ).ready(function() {
  $(".block-color").click(function(event) {
    var id_element = $(this).attr('id');
    var color = $(this).css("background-color");
    $("#btn-color-selected").css("background-color", color);
    color_selected = color;
  })
  $("#btn-repeat").click(function(event) {
    if(file_tile != null){
      console.log('rotate()');
      rotate_tile_origin();
    }
  })
  $("#btn-clear").click(function(event) {
    if(file_tile != null){
      console.log('clear()');
      init();
    }
  })
  $(".image img").click(function(event) {
    console.log('select_image()');
    var id_element = $(this).attr('id');
    var id_num = id_element.replace('tile-','');
    file_tile = "tile_awesome_" + id_num + ".png.json";
    init();
  })
});
//-----------------------------------------------------------------------------------
// Init / Prototypes events
//-----------------------------------------------------------------------------------
var canvas01 = document.getElementById('canvas01');
var canvas02 = document.getElementById('canvas02');
var shape = null; // Tree of shape
var file_tile = null; // Name of file_json
var color_selected = null;

canvas01.addEventListener('click', function(evt) {
  if(shape != null){
    var action_clic = function (canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
    }
    var click = action_clic(canvas01, evt);
    draw_polygon_inside_of_click(click);  
  }  
}, false);

//-----------------------------------------------------------------------------------
// Function
//-----------------------------------------------------------------------------------
function init(){
  if(file_tile != null){
    if (canvas01.getContext) {
      console.log('init()');
      
      var ctx = canvas01.getContext('2d');
      ctx.clearRect(0, 0, canvas01.width, canvas01.height);
      ctx.save();

      $.getJSON("/data/simulator_tile/" + file_tile,  null)
      .done(function( data ) {
        shape = new Shape({x:2, y:2}, data.properties.width, data.properties.height, 0, 1);

        ctx.translate(shape.origin.x, shape.origin.y);
        for(var it in data.polygons){
          var polygonJSON = data.polygons[it];
          var polygon = new Polygon(polygonJSON._id, polygonJSON.area, shape.origin, polygonJSON.points, '#FFFFFF', 1);
          polygon.draw_polygon(ctx, null, shape.scale);
          shape.add_polygon(polygon);
        }
        ctx.translate(-shape.origin.x, -shape.origin.y);
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
//**********************************************************************************
function print_board_of_tiles(){
  var ctx = canvas02.getContext('2d');
  ctx.clearRect(0, 0, canvas02.width, canvas02.height);
  ctx.save();

  var origin = {x:10, y:10};
  var polygons = shape.polygons;
  var n = 6, m = 8, v = 6, step = 282, scale = 0.4;

  ctx.lineWidth = 1.0;
  ctx.strokeStyle = "#000000";
  ctx.stroke();

  for(var i = 1; i <= n; i++){
    for(var j = 1; j <= m; j++){
      ctx.rect(origin.x, origin.y, (step * scale), (step * scale));
      origin.x += (step * scale);
    }
    origin.x = 10;
    origin.y += (step * scale);
  }

  var flag_position = {x:16, y:16};
  origin = {x:4 + step + flag_position.x, y:5 + step + flag_position.y};
  
  for(var i = 1; i <= (4 * v); i++){
    for(var it = polygons.length - 1; it >= 0; it--){
      var polygon = polygons[it];
      polygon.draw_polygon_original(ctx, {x:origin.x, y:origin.y}, scale);
    }
    origin.x += step;
    if(i % v == 0){
      origin.x = 4 + step + flag_position.x;
      origin.y += step;
    }
  }
  
}
//**********************************************************************************
function rotate_tile_origin(){
  var angle_const = 90;
  var ctx = canvas01.getContext('2d');
  ctx.clearRect(0, 0, canvas01.width, canvas01.height);
  ctx.save();
  shape.angle = (shape.angle + angle_const >= 360)? 0:shape.angle + angle_const;
  shape.rotate_shape();
  shape.translate_shape();
  print_tile_origin();
}
//**********************************************************************************
function print_tile_origin(){
  var ctx = canvas01.getContext('2d');
  ctx.clearRect(0, 0, canvas01.width, canvas01.height);
  ctx.save();
  ctx.translate(shape.origin.x, shape.origin.y);
  shape.draw_shape(ctx);
  ctx.translate(-shape.origin.x, -shape.origin.y);
}
//**********************************************************************************
function draw_polygon_inside_of_click(click){
  var polygons = shape.polygons;
  var inside = false;
  for(var it in polygons){
    var polygon = polygons[it];
    inside = polygon.inside_my_polygon({x:click.x, y:click.y});
    if(inside){
      console.log('polygon fined. [' + inside + ']  id [' + polygon.id + ']');
      polygon.color = color_selected;
      print_tile_origin();
      print_board_of_tiles();
      break;
    }
  }
  if(!inside)
    console.log('Click not inside of any polygon. [' + inside + ']');
}

//-----------------------------------------------------------------------------------
// Objects
//-----------------------------------------------------------------------------------
class Shape{
  constructor(origin, width, height, angle, scale) {
    this._origin = origin;
    this._polygons = [];
    this._width = width;
    this._height = height;
    this._angle = angle;
    this._scale = scale;
  }

  add_polygon(polygon) {
    this._polygons.push(polygon);
  }

  draw_shape(ctx){
    var polygons = this._polygons;
    for(var it = polygons.length - 1; it >= 0; it--){
      var polygon = polygons[it];
      polygon.draw_polygon(ctx, null, this._scale);
    }
  }

  translate_shape(){
    var translate_x = 2.5, translate_y = this._height + 7;    
    var point = null;
    for(var it in this._polygons){
      var points2D_XY = this._polygons[it].points2D_XY;
      for(var jt in points2D_XY){
        point = this._polygons[it].points2D_XY[jt];
        this._polygons[it].points2D_XY[jt]= {x:point.x + translate_x, y:point.y + translate_y};
      }
    }
  }

  rotate_shape(){
    var angle_const = 90;
    for(var it in this._polygons){
      var points2D_XY = this._polygons[it].points2D_XY;
      for(var jt in points2D_XY){
        var point_rotate = this.rotate_point({x:0, y:0}, {x:points2D_XY[jt].x , y:points2D_XY[jt].y }, angle_const);
        this._polygons[it].points2D_XY[jt] = {x: point_rotate.x, y:point_rotate.y};
      }
    }    
  }

  rotate_point(center, point, angle) {
    var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = (cos * (point.x - center.x)) + (sin * (point.y - center.y)) + center.x,
    ny = (cos * (point.y - center.y)) - (sin * (point.x - center.x)) + center.y;
    return {x:nx, y:ny};
  }

  get polygons(){
    return this._polygons;
  }

  get origin(){
    return this._origin;
  }

  set angle(angle){
    this._angle = angle;
  }

  get angle(){
    return this._angle;
  }

  get height(){
    return this._height;
  }

  get width(){
    return this._width;
  }

  get scale(){
    return this._scale;
  }

  toString() {
    return '[' + this._polygons + ']';
  }
}
//**********************************************************************************
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
    var points2D_XY = [];
    for(var i = 0; i < points2D.length; i+=2){
      points2D_XY.push({ x: points2D[i], y: points2D[i+1] });
    }
    return points2D_XY;
  }

  draw_polygon(ctx, origin, scale){
    if(origin === undefined || origin == null)
      origin = { x:this._originX, y:this._originY };
    if(scale === undefined || scale == null)
      scale = this._scale;
    var points2D_XY = this._points2D_XY;

    ctx.lineWidth = 1.0;
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.beginPath();
    for(var i = 0; i < points2D_XY.length; i++){
      ctx.lineTo(points2D_XY[i].x * scale, points2D_XY[i].y * scale);
    }
    ctx.closePath();
    ctx.fillStyle = this._color;
    ctx.fill();
  }

  draw_polygon_original(ctx, origin, scale){
    if(origin === undefined || origin == null)
      origin = { x:this._originX, y:this._originY };
    if(scale === undefined || scale == null)
      scale = this._scale;
    var points2D = this._points2D;

    ctx.lineWidth = 1.0;
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.beginPath();
    for(var i = 0; i < points2D.length; i+=2){
      ctx.lineTo( (origin.x + points2D[i]) * scale, (origin.y + points2D[i + 1]) * scale);
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

  get points2D_XY(){
    return this._points2D_XY;
  }

  toString() {
    return '[' + this._points2D + ']';
  }
}
