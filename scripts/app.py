import flask
import os
import random
from flask import Flask, Response, request

app = Flask(__name__)

puzzlefiles = os.listdir('./puzzles/')
filenames = [os.path.join('./puzzles/', f) for f in puzzlefiles]
puzzles = [open(f).read() for f in filenames]


@app.route('/')
def random_puzzle():
    return Response(random.choice(puzzles))


if __name__ == '__main__':
    app.run(debug=True)