from scipy import misc
from skimage import color
from skimage import measure
from skimage.measure import find_contours, approximate_polygon

import matplotlib.pyplot as plt
import json
import numpy as np

def polygon_area(points):  
    area = 0
    q = points[-1]
    for p in points:
        area += p[0] * q[1] - p[1] * q[0]
        q = p
    return area / 2


id_file = 2
#name_file_tile = "tile_awesome_" + str(id_file) + ".png"
#name_file_tile = "" + str(id_file) + ".png"
name_file_tile = "0.45-nd.png"
#file_tile = "../../wp-admin/img/" + "icono-taller/" + name_file_tile
file_tile = "../../wp-admin/img/" + name_file_tile
fimg = misc.imread(file_tile)

gimg = color.colorconv.rgb2grey(fimg)

contours = measure.find_contours(gimg, 0.0)

# Build Json object
data = {}
data['shape'] = []
id_poly = 1
coords = {}
for n, contour in enumerate(contours):
	coords = approximate_polygon(contour, tolerance=0)
	#plt.plot(contour[:, 1], contour[:, 0], linewidth=0.5)
	#print('--------------------------------')
	#print("Number of coordinates:", len(contour), len(coords), coords)
	s = ""
	points = [];
	for x in coords:
		for y in x:
			points.append(y);
	l = []
	value = 0.0
	flag = True
	for i in points:
		if flag:
			value = i
		else:
			l.append([value, i])
		flag = not flag
	area = polygon_area(l)
	#print('Irregular polygon area: {}'.format(area))
	data['shape'].append({'_id': id_poly, 'points': points, 'area':abs(area) })
	id_poly = id_poly + 1

print("Edge [", str(id_poly),"]")
file = '../../wp-admin/data/simulator_tile/' + name_file_tile + '.json'
with open(file, 'w') as outfile:  
    json.dump(data, outfile, indent=3)


plt.show()