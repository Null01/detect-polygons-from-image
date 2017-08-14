import numpy as np
import matplotlib.pyplot as plt

from skimage import measure

from scipy import misc
from skimage import color


# Construct some test data
#x, y = np.ogrid[-np.pi:np.pi:100j, -np.pi:np.pi:100j]
#r = np.sin(np.exp((np.sin(x)**3 + np.cos(y)**2)))

fimg = misc.imread("img/baldosa_coloriser.png")

gimg = color.colorconv.rgb2grey(fimg)

# Find contours at a constant value of 0.8
contours = measure.find_contours(gimg, 0.7)

# Display the image and plot all contours found
fig, ax = plt.subplots()
ax.imshow(gimg, interpolation='nearest', cmap=plt.cm.gray)

for n, contour in enumerate(contours):
    ax.plot(contour[:, 1], contour[:, 0], linewidth=1)

ax.axis('image')
ax.set_xticks([])
ax.set_yticks([])
plt.show()