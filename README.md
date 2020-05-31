# gpx-visualizer
Visualize your GPX tracks on map with walk animation

## Installation
Clone repository and install required dependencies:
```sh
git clone https://github.com/lxxxxl/gpx-visualizer.git
cd gpx-visualizer
pip install -r requirements.txt
```

## Setup
App uses [Yandex Maps API](https://tech.yandex.ru/maps/jsapi/).  
To obtain API key go to [Yandex Developer Console](https://developer.tech.yandex.ru/) and press __Obtain Key__.  In popup window choose "JavaScript API and HTTP Geogoder".  
  
More info can be found [here](https://tech.yandex.ru/maps/jsapi/doc/2.1/quick-start/index-docpage/#get-api-key).  
API key should be passed in `YANDEX_MAPS_API_KEY` environment variable.

## Run
```sh
YANDEX_MAPS_API_KEY="YOUR_API_KEY" \
FLASK_APP=app.py \
flask run
```