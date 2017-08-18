import cv2
import numpy as np
import matplotlib.pyplot as plt

import json
from skimage.measure import approximate_polygon

name_file_tile = "0.45.png"
file_tile = "../../wp-admin/img/" + name_file_tile

img = cv2.imread(file_tile)

#gimg = color.colorconv.rgb2grey(fimg)
imgray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
ret, thresh = cv2.threshold(imgray, 127, 255, 0)
#im2, contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
img2, contours_temp, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
contours = [cv2.approxPolyDP(cnt, 10, True) for cnt in contours_temp]


data = {}
data['shape'] = []
id_poly = 1
print "init()"
for contour in enumerate(contours):
	#coords = approximate_polygon(contour, tolerance=0)
	#plt.plot(contour[:, 1], contour[:, 0], linewidth=0.5)
	#print('--------------------------------')
	#print("Number of coordinates:", len(contour), len(coords), coords)
	print contour
	s = ""
	area = 0.0
	points = [];
	data['shape'].append({'_id': id_poly, 'points': points, 'area':abs(area) })
	id_poly = id_poly + 1

print("number of edge [", str(id_poly),"]")
file = '../../wp-admin/data/simulator_tile/' + name_file_tile + '.json'
print "file_json:", file
#with open(fil#e, 'w') as outfile:
    #json.dump(data, outfile, indent=3) 



#for h,cnt in enumerate(contours):
#    mask = np.zeros(imgray.shape, np.uint8)
#    cv2.drawContours(mask,[cnt],0,255,-1)
#    mean = cv2.mean(img, mask = mask)

#cv2.drawContours(img, contours, -1, (0,255,0), 3)
#cv2.imshow("Keypoints", img)
print "Pre"
cv2.waitKey(0)
print "Finish"
#cnt = contours[0]
#M = cv2.moments(cnt)
#print M
#area = cv2.contourArea(cnt)
#print("area:", area)
#perimeter = cv2.arcLength(cnt,True)
#print("perimeter:", perimeter)
#epsilon = 0.1*cv2.arcLength(cnt, True)
#approx = cv2.approxPolyDP(cnt, epsilon, True)
#print approx
#https://media.readthedocs.org/pdf/opencv-python-tutroals/latest/opencv-python-tutroals.pdf

