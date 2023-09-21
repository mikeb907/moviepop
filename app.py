from flask import Flask, send_from_directory, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random
import os
from datetime import datetime, timedelta
import logging
import redis
from rq import Queue
import json


app = Flask(__name__, static_folder="frontend/build", template_folder="frontend/build")

# PostgreSQL connection configuration
DATABASE_URL = os.environ.get('DATABASE_URL', 'postgresql://postgres:Sfogliatelle1209!@localhost/postgres')

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL

# Setup Redis
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
redis_conn = redis.from_url(redis_url)
q = Queue(connection=redis_conn)

# Initialize CORS to allow all origins
CORS(app, resources={r"/*": {"origins": "*"}})

db = SQLAlchemy(app)

logging.basicConfig(level=logging.DEBUG)

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    still_url = db.Column(db.String(500), nullable=False)
    last_shown = db.Column(db.DateTime, default=None)
    is_active = db.Column(db.Boolean, default=False)
    options = db.relationship('MovieOption', backref='movie', lazy=True)


class MovieOption(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)
    option_title = db.Column(db.String(200), nullable=False)

class GameHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)
    date_shown = db.Column(db.DateTime, nullable=False)


# Global variables for caching
daily_movies_cache = None
last_updated_date = None

def get_daily_movies():
    # Get the date
    today = datetime.utcnow().date().strftime('%Y-%m-%d')
    
    # Try to get movies data from Redis
    movies_data = redis_conn.get(today)
    
    # If found in Redis, decode and return it
    if movies_data:
        return json.loads(movies_data)

    # If not found in Redis, then compute the movies
    week_ago = datetime.utcnow() - timedelta(days=7)
    
    # Filter movies that were not shown in the past week and are not active.
    movies = Movie.query.filter((Movie.last_shown < week_ago) | (Movie.last_shown == None), Movie.is_active == False).all()
    all_titles = [movie.title for movie in Movie.query.all()]  # Fetch all movie titles

    if len(movies) < 3:
        return None

    selected_movies = random.sample(movies, 3)
    movies_data = []

    for selected_movie in selected_movies:
        random_titles = random.sample([title for title in all_titles if title != selected_movie.title], 2)
        random_titles.append(selected_movie.title)
        random.shuffle(random_titles)

        correct_url = "https://concessionstand.nyc3.digitaloceanspaces.com/concessionstand/" + selected_movie.still_url.split('/')[-1]

        movies_data.append({
            "title": selected_movie.title,
            "still_url": correct_url,
            "options": random_titles
        })

    # Update the movies' last_shown date and set them as active.
    for movie in selected_movies:
        movie.last_shown = datetime.utcnow()
        movie.is_active = True

    db.session.commit()

    # Store the movies data in Redis for today
    redis_conn.set(today, json.dumps(movies_data))

    return movies_data




@app.route('/')
def index():
    return send_from_directory('frontend/build', 'index.html')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return send_from_directory('frontend/build', path if path else 'index.html')


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
