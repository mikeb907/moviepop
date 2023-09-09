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
DATABASE_URL = os.environ.get('DATABASE_URL', 'postgresql://postgres:Sfogliatelle1209!@localhost/postgres')
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL

# Initialize CORS to allow all origins
CORS(app, resources={r"/*": {"origins": "*"}})

db = SQLAlchemy(app)

logging.basicConfig(level=logging.DEBUG)

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    still_url = db.Column(db.String(500), nullable=False)
    last_shown = db.Column(db.DateTime, default=None)  # Track when the movie was last shown

def get_daily_movies():
    # Fetch all movies that haven't been shown in the past week or never shown
    week_ago = datetime.utcnow() - timedelta(days=7)
    movies = Movie.query.filter((Movie.last_shown < week_ago) | (Movie.last_shown == None)).all()

    all_titles = [movie.title for movie in Movie.query.all()]  # Fetch all movie titles

    if len(movies) < 3:
        # Not enough movies in the pool, consider resetting some dates or adding more movies
        return None

    selected_movies = random.sample(movies, 3)
    movies_data = []

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

@app.route('/')
def index():
    return send_from_directory('frontend/build', 'index.html')

@app.route('/get-movies')
def get_movies():
    try:
        logging.info('Fetching movies...')
        movies_data = get_daily_movies()
        if not movies_data:
            logging.error('Not enough movies to play the game!')
            return {"error": "Not enough movies to play the game!"}, 404
        return jsonify({'movies': movies_data})
    except Exception as e:
        logging.error(f"Error while fetching movies: {e}")
        return {"error": "Internal Server Error"}, 500

@app.route('/game/setup/manual', methods=['POST'])
def manual_game_setup():
    get_daily_movies()
    return jsonify({"message": "Game setup completed!"})

@app.route('/initdb')
def initdb():
    """Create tables if they don't exist."""
    db.create_all()
    return 'Database tables created!', 200

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True, threaded=True)
