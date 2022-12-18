import re
import requests

filecontents = []
with open("genshin-item-list.html", "r") as file:
    filecontents = file.readlines()

imgs = []

for line in filecontents:
    search = re.search(r'src="(http.+)" data-ca', line)

    if search is not None:
        imgs.append(search.group(1))


files = []
for img in imgs:
    match = re.search(r'Item_(.+)\.', img)
    if match is not None:
        filename = re.sub(r'%[0-9][0-9]', '', match.group(1)) + '.png'
        img_data = requests.get(img).content
        with open('./images/' + filename, 'wb') as handler:
            handler.write(img_data)
