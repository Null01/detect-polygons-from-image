'''
This program illustrates the use of findContours and drawContours.
The original image is put up along with the image of drawn contours.
Usage:
    contours.py
A trackbar is put up which controls the contour level from -3 to 3
'''

import numpy as np
import cv2


name_file_tile = "0.45-nd.png"
file_tile = "../../wp-admin/img/" + name_file_tile

img = cv2.imread(file_tile)
h, w = img.shape[:2]
imgray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
ret, thresh = cv2.threshold(imgray, 127, 255, 0)
_, contours0, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
contours = [cv2.approxPolyDP(cnt, 3, True) for cnt in contours0]

#def update(levels):
vis = np.zeros((h, w, 3), np.uint8)
levels = 0
#cv2.drawContours( vis, contours, (-1, 2)[levels <= 0], (128,255,255), 3, , hierarchy, abs(levels) )
#drawContours( vis, contours, -1, (255,255,255), 3)
cv2.drawContours( vis, contours, -1, (255, 255, 255), 1, 1, hierarchy );
cv2.imshow('contours', vis)
#update(3)
#cv2.createTrackbar( "levels+3", "contours", 3, 7, update )
#cv2.imshow('image', img)
cv2.waitKey()
cv2.destroyAllWindows()