import re
import json

filecontents = []
with open("genshin-item-list.html", "r") as file:
    filecontents = file.readlines()

imgs = []

for line in filecontents:
    search = re.search(r'src="(http.+)" data-ca', line)

    if search is not None:
        imgs.append(search.group(1))


items = []
for img in imgs:
    img = re.sub(r'%[0-9][0-9]', '', img)
    item_name = re.search(r'Item_(.+)\.', img)
    if item_name is not None:
        item = {'src': img, 'item': item_name.group(1)}
        items.append(item)

with open(r'./genshin-item-list.json', 'w') as fp:
    fp.write(json.dumps(items))
