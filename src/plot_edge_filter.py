"""
==============
Edge operators
==============

Edge operators are used in image processing within edge detection algorithms.
They are discrete differentiation operators, computing an approximation of the
gradient of the image intensity function.

"""
import numpy as np
import matplotlib.pyplot as plt

from skimage.data import camera
from skimage.filters import roberts, sobel, scharr, prewitt

from scipy import misc
from skimage import color
from skimage import measure
from skimage.measure import find_contours, approximate_polygon


#image = camera()
file_tile = "tile_colorizer_05.png"
fimg = misc.imread("../web/img/"+file_tile)

image = color.colorconv.rgb2grey(fimg)

contours = measure.find_contours(image, 0.75)
coords = approximate_polygon(contours[0], tolerance=0.02)


edge_roberts = roberts(image)
print edge_roberts
edge_sobel = sobel(image)


fig, ax = plt.subplots(ncols=2, sharex=True, sharey=True,
                       figsize=(8, 4))


ax[0].imshow(edge_roberts, cmap=plt.cm.gray)
ax[0].set_title('Roberts Edge Detection')

ax[1].imshow(edge_sobel, cmap=plt.cm.gray)
ax[1].set_title('Sobel Edge Detection')

for a in ax:
    a.axis('off')

plt.tight_layout()
plt.show()

######################################################################
# Different operators compute different finite-difference approximations of
# the gradient. For example, the Scharr filter results in a less rotational
# variance than the Sobel filter that is in turn better than the Prewitt
# filter [1]_ [2]_ [3]_. The difference between the Prewitt and Sobel filters
# and the Scharr filter is illustrated below with an image that is the
# discretization of a rotation- invariant continuous function. The
# discrepancy between the Prewitt and Sobel filters, and the Scharr filter is
# stronger for regions of the image where the direction of the gradient is
# close to diagonal, and for regions with high spatial frequencies. For the
# example image the differences between the filter results are very small and
# the filter results are visually almost indistinguishable.
#
# .. [1] https://en.wikipedia.org/wiki/Sobel_operator#Alternative_operators
#
# .. [2] B. Jaehne, H. Scharr, and S. Koerkel. Principles of filter design.
#        In Handbook of Computer Vision and Applications. Academic Press,
#        1999.
#
# .. [3] https://en.wikipedia.org/wiki/Prewitt_operator
