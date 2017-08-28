
//-----------------------------------------------------------------------------------
// Init - Draw html
//-----------------------------------------------------------------------------------
function init_draw_html(){
  var n = 55;
  var panel_selector = $('#panel-image');
  for (var id_img = 1; id_img <= n; id_img++) {
    panel_selector.append('<div class="card">' +
      '<div class="ui centered big image">' +
      '<img id="tile-' + id_img + '" src="' + CONTEXT_PAGE + '/img/simulator_tile/tile_awesome_' + id_img + '.png" class="image-selector" >' +
      '</div>' + 
      '</a>');
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
  $('#btn-repeat').popup({
    content: 'Seleccione para rotar la figura.'
  });
  $('#btn-clear').popup({
    content: 'Restaurar los valores por defecto.'
  });
  $('#btn-color-selected').popup({
    content: 'Textura seleccionada.'
  });
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
    console.log('clear()');
    file_tile = null;
    shape = null;
    board_shape = null;
    init();
  })
  $(".image img").click(function(event) {
    console.log('select_image()');
    var id_element = $(this).attr('id');
    var id_num = id_element.replace('tile-','');
    file_tile = "tile_awesome_" + id_num + ".png.json";
    board_shape = null;
    init();
  })
});
//-----------------------------------------------------------------------------------
// Init / Prototypes events
//-----------------------------------------------------------------------------------
var canvas01 = document.getElementById('canvas01');
var canvas02 = document.getElementById('canvas02');
var board_shape = null; // Board of shape
var shape = null; // Tree of shape
var file_tile = null; // Name of file_json
var color_selected = null;
var CONTEXT_PAGE =  "/wp-admin"; // Contexto hosting web
//var CONTEXT_PAGE =  ""; // Contexto hosting web

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
canvas02.addEventListener('click', function(evt) {
  if(shape != null){
    var action_clic = function (canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
    }
    var click = action_clic(canvas02, evt);
    draw_board_polygon_inside_of_click(click);  
  }  
}, false);

//-----------------------------------------------------------------------------------
// Function
//-----------------------------------------------------------------------------------
function init(){
  var ctx = canvas01.getContext('2d');
  ctx.clearRect(0, 0, canvas01.width, canvas01.height);
  ctx.save();
  if(file_tile != null){
    if (canvas01.getContext) {
      $.getJSON(CONTEXT_PAGE + "/data/simulator_tile/" + file_tile,  null)
      .done(function( data ) {
        shape = new Shape({x:(canvas01.width/20), y:(canvas01.height/12)}, data.properties.width, data.properties.height, 0, 0.6);
        ctx.translate(shape.origin.x, shape.origin.y);
        for(var it in data.polygons){
          var polygonJSON = data.polygons[it];
          var polygon = new Polygon(polygonJSON._id, polygonJSON.area, shape.origin, polygonJSON.points, null, shape.scale);
          polygon.draw_polygon(ctx, null, shape.scale);
          shape.add_polygon(polygon);
        }
        ctx.translate(-shape.origin.x, -shape.origin.y);
        shape.polygons.sort(function(a, b){ return a.area - b.area; });
        print_board_of_tiles(false);
        console.log('Configuration initial simulator - success');
      })
      .fail(function() {
        console.error('Json file [' + file_tile + '] not found.');
        file_tile = null;
        shape = null;
      });
    }else
    console.error('Browser not support canvas - init()');
  }else{
    ctx.fillStyle = "#000000";
    ctx.font = "16px Lato, Helvetica Neue, Arial, Helvetica, sans-serif";
    ctx.fillText("Seleccione una imagen.", (canvas01.width / 10), (canvas01.height / 2));
    print_board_of_tiles(true);
  }
}
//**********************************************************************************
function print_board_of_tiles(print_empty_grid){
  var ctx = canvas02.getContext('2d');
  ctx.clearRect(0, 0, canvas02.width, canvas02.height);
  ctx.save();
  ctx.lineWidth = 0.9;

  var columns = 8, rows = 7, step = 282, scale = 0.3;
  if(print_empty_grid){
    var fail = {x:72, y:3};
    for(var i = 1; i <= rows; i++){
      for(var j = 1; j <= columns; j++){
        ctx.beginPath();
        ctx.rect(fail.x, fail.y, (step * scale), (step * scale));
        ctx.closePath();
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#FFFFFF";
        ctx.stroke();
        ctx.fill();
        fail.x += (step * scale);
      }
      fail.x = 72;
      fail.y += (step * scale);
    }
  }else{
    var origin = {x:(canvas02.width / 4), y:0 };
    if(board_shape == null){
      board_shape = [];
      fail = {x:72, y:3};
      for(var i = 0; i < rows; i++){
        for(var j = 0; j < columns; j++){
          origin.x += step;
          var square = new Shape({x: fail.x, y:fail.y}, (step * scale), (step * scale), 0, scale);
          square.borders = [[{x:fail.x, y:fail.y}, {x:fail.x + square.width, y:fail.y}, {x:fail.x + square.width, y:fail.y + square.height}, {x:fail.x, y:fail.y + square.height}]];          
          for(var ii = 0; ii < shape.polygons.length; ii++){
            var polygon = shape.polygons[ii];
            square.add_polygon(new Polygon(ii, polygon.area, polygon.origin, polygon.points2D, null, polygon.scale));  
          }          
          square.origin_canvas = {x:origin.x ,y:origin.y};
          board_shape.push(square);
          fail.x += (step * scale);
        }
        fail.x = 72;
        fail.y += (step * scale);
        origin.x = (canvas02.width / 4);
        origin.y += step;
      }
    }

    origin = {x:(canvas02.width / 4), y:0 };
    for(var i = 0; i < board_shape.length; i++){
      var polygons = board_shape[i].polygons;
      var origin_polygon = board_shape[i].origin;

      for(var it = polygons.length - 1; it >= 0; it--){
        var polygon = polygons[it];
        polygon.color = shape.polygons[it].color;
        polygon.draw_polygon_board_tiles(ctx, {x:origin.x, y:origin.y}, scale);
      }
      origin.x += step;
      if((i + 1) % columns == 0){
        origin.x = (canvas02.width / 4);
        origin.y += step;        
      }
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
  shape.rotate_shape('ORIGIN_TILE');
  shape.translate_shape('ORIGIN_TILE');
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
//************************************************************************************
function isPointInPoly(poly, pt){
  for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
    ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
  && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
  && (c = !c);
  return c;
}
//************************************************************************************
function draw_board_polygon_inside_of_click(click){
  for(var i = 0; i < board_shape.length; i++){
    var square = board_shape[i];
    if(isPointInPoly(square.borders[0], click)){
      var angle_const = 90;
      board_shape[i].angle = (board_shape[i].angle + angle_const >= 360)? 0:square.angle + angle_const;
      board_shape[i].rotate_shape('BOARD_TILE');
      board_shape[i].translate_shape('BOARD_TILE');
      print_board_of_tiles(false);
      break;
    }
  }
}
//************************************************************************************
function draw_polygon_inside_of_click(click){
  var polygons = shape.polygons;
  var inside = false;
  for(var it in polygons){
    var polygon = polygons[it];
    inside = polygon.inside_my_polygon({x:click.x, y:click.y});
    if(inside){
      console.log('polygon fined. id_polygon [' + polygon.id + ']');
      shape.polygons[it].color =  color_selected;
      print_tile_origin();
      print_board_of_tiles(false);
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
    this._borders = [];
    this._width = width;
    this._height = height;
    this._angle = angle;
    this._scale = scale;
    this._origin_canvas = null;
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

  draw_shape_xy_board(ctx){
    var polygons = this._polygons;
    for(var it = polygons.length - 1; it >= 0; it--){
      var polygon = polygons[it];
      polygon.draw_polygon_board_tiles(ctx, this._origin_canvas, this._scale);
    }
  }

  translate_shape(translate_type){
    var point = null;
    if(translate_type === 'ORIGIN_TILE'){
      var translate_x = 2.5, translate_y = this._height + 7;    
      for(var it in this._polygons){
        var points2D_XY = this._polygons[it].points2D_XY;
        for(var jt in points2D_XY){
          point = this._polygons[it].points2D_XY[jt];
          this._polygons[it].points2D_XY[jt]= {x:point.x + translate_x, y:point.y + translate_y};
        }
      }
    }
    if(translate_type === 'BOARD_TILE'){
      //var translate_x = -3.5, translate_y = 278 + 15;
      //var translate_x = -3, translate_y = 297;
      var translate_x = -2.5, translate_y = 298;
      for(var it in this._polygons){
        var points2D = this._polygons[it].points2D_XY_BOARD;
        for(var jt = 0; jt < points2D.length; jt++){
          point = this._polygons[it].points2D_XY_BOARD[jt];
          this._polygons[it].points2D_XY_BOARD[jt]= {x:point.x + translate_x, y:point.y + translate_y};
        }
      }
    }
  }

  rotate_shape(rotation_type){
    var angle_const = 90;
    if(rotation_type === 'ORIGIN_TILE'){
      for(var it in this._polygons){
        var points2D = this._polygons[it].points2D_XY;
        for(var jt in points2D){
          var point_rotate = this.rotate_point({x:0, y:0}, {x:points2D[jt].x , y:points2D[jt].y }, angle_const);
          this._polygons[it].points2D_XY[jt] = {x: point_rotate.x, y:point_rotate.y};
        }
      }  
    }
    if(rotation_type === 'BOARD_TILE'){
      for(var it in this._polygons){
        var points2D = this._polygons[it].points2D_XY_BOARD;
        for(var jt in points2D){
          var point_rotate = this.rotate_point({x:0, y:0}, {x:points2D[jt].x , y:points2D[jt].y }, angle_const);
          this._polygons[it].points2D_XY_BOARD[jt] = {x: point_rotate.x, y:point_rotate.y};
        } 
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

  get borders(){
    return this._borders;
  }

  set borders(borders){
    this._borders = borders;
  }

  get polygons(){
    return this._polygons;
  }

  set polygons(polygons_copy){
    this._polygons = [];
    for (var i = 0; i < polygons_copy.length; i++) {
      this._polygons.push(polygons_copy[i]);
    }
  }

  get origin_canvas(){
    return this._origin_canvas;
  }

  set origin_canvas(origin_canvas){
    this._origin_canvas = origin_canvas;
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
    this._points2D_XY_BOARD = this.convert_points2D(points2D);
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
    ctx.strokeStyle = (this._color === null)? "#000000":this._color;
    ctx.beginPath();
    for(var i = 0; i < points2D_XY.length; i++){
      ctx.lineTo((points2D_XY[i].x) * scale, (points2D_XY[i].y) * scale);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = (this._color === null)? "#FFFFFF":this._color;
    ctx.fill();
  }

  draw_polygon_original(ctx, origin, scale){
    if(origin === undefined || origin == null)
      origin = { x:this._originX, y:this._originY };
    if(scale === undefined || scale == null)
      scale = this._scale;

    var points2D = this._points2D;
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = (this._color === null)? "#000000":this._color;
    ctx.beginPath();
    for(var i = 0; i < points2D.length; i+=2){
      ctx.lineTo((origin.x + points2D[i]) * scale, (origin.y + points2D[i + 1]) * scale);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = (this._color === null)? "#FFFFFF":this._color;
    ctx.fill();
  }

  draw_polygon_board_tiles(ctx, origin, scale){
    if(origin === undefined || origin == null)
      origin = { x:this._originX, y:this._originY };
    if(scale === undefined || scale == null)
      scale = this._scale;

    var points = this._points2D_XY_BOARD;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    for(var i = 0; i < points.length; i++){
      ctx.lineTo((origin.x + points[i].x) * scale, (origin.y + points[i].y) * scale);
    }
    ctx.closePath();
    ctx.strokeStyle = (this._color === null)? "#000000":this._color;
    ctx.fillStyle = (this._color === null)? "#FFFFFF":this._color;
    ctx.stroke();
    ctx.fill();
  }

  inside_my_polygon(point) {
    var xi, xj, yi, yj, intersect, inside = false;
    var x = point.x, y = point.y;
    var vs = this._points2D_XY;
    var flag = {x:10, y:10};
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      xi = (flag.x + this._originX + vs[i].x) * this._scale,
      yi = (flag.y + this._originY + vs[i].y) * this._scale,
      xj = (flag.x + this._originX + vs[j].x) * this._scale,
      yj = (flag.y + this._originY + vs[j].y) * this._scale,      
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

  get origin(){
    return {x:this._originX, y:this._originY};
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

  get points2D_XY_BOARD(){
    return this._points2D_XY_BOARD;
  }

  toString() {
    return '[' + this._points2D + ']';
  }
}