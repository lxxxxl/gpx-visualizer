#!/usr/bin/env python

import os
import logging
import gpxpy
from flask import Flask, flash, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'gpx'}

app = Flask(__name__)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def gpx2jsarray(gpxfile):
    """Convert Track info from GPX file to Javasctipt array string"""
    gpx = gpxpy.parse(gpxfile)
    js_array = ''

    for track in gpx.tracks:
        for segment in track.segments:
            previous_point = None
            for point in segment.points:
                time_difference = 0
                if previous_point:
                    time_difference = (point.time - previous_point.time).total_seconds() * 1000 # convert to milliseconds
                js_array += '[{0}, {1}, {2}],\n'.format(point.latitude, point.longitude, round(time_difference))
                previous_point = point
    
    return js_array

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            data = file.read()
            track_array = gpx2jsarray(data.decode('utf-8'))
            return render_template('map.html', yandex_maps_api_key=os.environ['YANDEX_MAPS_API_KEY'], track_array=track_array)
    return render_template('upload.html')


logging.basicConfig(level=logging.DEBUG)