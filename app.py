from flask import Flask, send_from_directory, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random
import os
from datetime import datetime, timedelta
import logging
import boto3

app = Flask(__name__, static_folder="frontend/build/static", template_folder="frontend/build")

# PostgreSQL connection configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://postgres:Sfogliatelle1209!@localhost/postgres')

# Initialize CORS to allow all origins
CORS(app, resources={r"/*": {"origins": "*"}})

db = SQLAlchemy(app)

logging.basicConfig(level=logging.DEBUG)

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    still_url = db.Column(db.String(500), nullable=False)
    last_shown = db.Column(db.DateTime, default=None)  # Track when the movie was last shown

def generate_presigned_url(bucket_name, object_name, expiration=3600):
    s3_client = boto3.client('s3')
    try:
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=expiration)
    except Exception as e:
        logging.error(e)
        return None

    return response

def get_daily_movies():
    # Fetch all movies that haven't been shown in the past week or never shown
    week_ago = datetime.utcnow() - timedelta(days=7)
    movies = Movie.query.filter((Movie.last_shown < week_ago) | (Movie.last_shown == None)).all()

    all_titles = [movie.title for movie in Movie.query.all()]  # Fetch all movie titles

    if len(movies) < 3:
        # Not enough movies in the pool, consider resetting some dates or adding more movies
        return None

    selected_movies = random.sample(movies, 3)
    movies_data = []  # <-- Initialize movies_data

    for selected_movie in selected_movies:
        random_titles = random.sample([title for title in all_titles if title != selected_movie.title], 2)
        random_titles.append(selected_movie.title)
        random.shuffle(random_titles)

        # Adjust the URL to include the correct path segment
        correct_url = "https://concessionstand.nyc3.digitaloceanspaces.com/concessionstand/" + selected_movie.still_url.split('/')[-1]

        movies_data.append({
            "title": selected_movie.title,
            "still_url": correct_url,
            "options": random_titles
        })
    
    return movies_data

# @app.route('/test')
# def test():
#     return "Flask is running!"


@app.route('/')
def index():
    return send_from_directory('frontend/build', 'index.html')

@app.route('/get-movies')
def get_movies():
    logging.info('Fetching movies...')
    movies_data = get_daily_movies()
    if not movies_data:
        logging.error('Not enough movies to play the game!')
        return {"error": "Not enough movies to play the game!"}, 404
    return jsonify({ 'movies': movies_data })

@app.route('/game/setup/manual', methods=['POST'])
def manual_game_setup():
    get_daily_movies()
    return jsonify({"message": "Game setup completed!"})

with app.app_context():
    db.create_all()  

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True, threaded=True)
