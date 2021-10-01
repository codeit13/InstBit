#!/usr/bin/python3.7
#
# Flask server, woo!
#

from flask import Flask, request, redirect, url_for, send_from_directory

# Setup Flask app.
app = Flask(__name__)

# Routes
@app.route('/')
def root():
  return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return send_from_directory('images', path)