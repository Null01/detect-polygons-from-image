from PIL import Image

file_tile = "../../wp-admin/img/lineasherrajessimulador.png"

# Load the original image:

origin_x = 190
origin_y = 155

width = 520
height = 455
index_img = 1

img = Image.open(file_tile)
print(img.format, img.size, img.mode)

#new_image = img.crop(( origin_x, height + 60 , width, height + 360))
#new_image.save("../../wp-admin/img/icono-taller/tile_awesome_" + str(index_img) + ".png")


n = 8
m = 7
for i in range(1, m + 1):
	for j in range(1, n + 1):
		new_image = img.crop(( origin_x, origin_y, width, height))
		new_image.save("../../wp-admin/img/icono-taller/tile_awesome_" + str(index_img) + ".png")
		index_img += 1
		origin_x = width
		width = width + 330
		#print origin_x
		#print 'w:' + str(width)
	origin_y = height + 60
	height = height + 360
	origin_x = 190
	width = 520

	