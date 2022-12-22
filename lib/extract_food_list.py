from bs4 import BeautifulSoup
import re
import json
import requests

lines = None
with open('genshin_food_list.html', 'r') as file:
    lines = file.readlines()


html_text = '\n'.join(lines)

soup = BeautifulSoup(html_text, 'html.parser')

rows = soup.find_all('tr')

dishes = []

for row in rows:
    dish = {}
    cells = row.find_all('td')
    img = cells[0].find('img')
    # children = [node for node in row.contents if node != '\n']
    if img is not None or img != -1:
        dish = {}
        src = img.get('src')
        data_src = img.get('data-src')
        if re.search(r'https', src) is not None:
            dish['src'] = re.sub(r'\s+', ' ', src.replace('\n', '')).strip()
        else:
            dish['src'] = re.sub(
                r'\s+', ' ', data_src.replace('\n', '')).strip()

    title = cells[1].find('a')
    if title is not None:
        dish['name'] = re.sub(
            r'\s+', ' ', title.text.replace('\n', '')).strip().replace(r'\\', '').replace('"', '')

    url = 'https://genshin-impact.fandom.com' + title.get('href')
    print(url)
    page = requests.get(url).content
    pagesoup = BeautifulSoup(page, "html.parser")
    recipe = pagesoup.find('div', {"class": "new_genshin_recipe_body"})
    if recipe is not None:
        yieldCard = recipe.find(
            'div', {'class': 'new_genshin_recipe_body_yield hidden'})
        if yieldCard is not None:
            yieldCard.decompose()
        ingredients = recipe.find_all('div', {"class": "card_with_caption"})

        dish['recipe'] = []
        for ingredient in ingredients:
            card_image = ingredient.find('div', {'class': 'card_image'})
            name = card_image.find("a").get("title")

            card_text = ingredient.find('div', {'class': 'card_text'})
            quantity = card_text.find('span', {'class': 'card_font'}).text

            dish['recipe'].append(
                {'ingredient': name.replace('\\', '').replace('"', ''), 'quantity': quantity})

    stars = cells[2].find('img')
    if stars is not None:
        dish['stars'] = re.sub(
            r'\s+', ' ', stars.get('alt').replace('\n', '')).strip()

    effect_title = cells[3].find('a')
    if effect_title is not None:
        dish['effect_title'] = re.sub(
            r'\s+', ' ', effect_title.get('title').replace('\n', '')).strip()

    type = cells[3].text
    dish['type'] = re.sub(r'\s+', ' ', type.replace('\n', '')).strip()

    description = cells[4].text
    dish['description'] = re.sub(
        r'\s+', ' ', description.replace('\n', '')).strip()

    dishes.append(dish)
    if dish['src'] is not None or dish['src'] != '':
        try:
            img_data = requests.get(dish['src']).content
            with open('./dishes/' + dish['name'] + '.png', 'wb') as handler:
                handler.write(img_data)
        except:
            print('skipping')


with open('genshin_food_list.json', 'w') as file:
    file.write(json.dumps(dishes, indent=4))
