from flask import Flask, send_from_directory, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random
import os
from datetime import datetime, timedelta
import logging
import redis
from urllib.parse import urlparse
from rq import Queue
import json
import ssl


app = Flask(__name__, static_folder="frontend/build", template_folder="frontend/build")

app.secret_key = 'Sfogliatelle120902061992!'


# PostgreSQL connection configuration
DATABASE_URL = os.environ.get('DATABASE_URL', 'postgresql://postgres:Sfogliatelle1209!@localhost/postgres')

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


# # Setup Redis

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")

env = os.environ.get('FLASK_ENV', 'development')

if env == 'staging':
    # Use the Redis connection setup that works for staging
    redis_conn = redis.from_url(redis_url, ssl_cert_reqs=ssl.CERT_NONE)
elif env == 'production':
    # Use the Redis connection setup that works for production
    url = urlparse(redis_url)
    if url.scheme == 'rediss':  # Indicates SSL
        pool = redis.ConnectionPool(
            host=url.hostname,
            port=url.port,
            password=url.password,
            ssl=True,
            ssl_cert_reqs=ssl.CERT_NONE
        )
    else:
        pool = redis.ConnectionPool(
            host=url.hostname,
            port=url.port,
            password=url.password
        )
    redis_conn = redis.Redis(connection_pool=pool)
else:
    # Default case for development
    redis_conn = redis.Redis(host='localhost', port=6379)



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
    try:
        today = datetime.utcnow().date().strftime('%Y-%m-%d')
        logging.info(f'Getting movies for date: {today}')
        
        movies_data = redis_conn.get(today)
        if movies_data:
            logging.info('Found movies in Redis cache')
            return json.loads(movies_data)

        logging.info('No cache found, querying database...')
        week_ago = datetime.utcnow() - timedelta(days=7)
        
        from sqlalchemy import or_
        
        # Log the query parameters
        logging.info(f'Querying for movies not shown since: {week_ago}')
        
        movies = Movie.query.filter(
            or_(Movie.last_shown < week_ago, Movie.last_shown == None),
            Movie.is_active == False
        ).all()
        
        logging.info(f'Found {len(movies)} eligible movies')
        
        if len(movies) < 3:
            logging.error(f'Not enough eligible movies found (only found {len(movies)})')
            return None

        selected_movies = random.sample(movies, 3)
        logging.info(f'Selected movies: {[movie.title for movie in selected_movies]}')
        
        movies_data = []
        for selected_movie in selected_movies:
            try:
                random_titles = random.sample([title for title in all_titles if title != selected_movie.title], 2)
                random_titles.append(selected_movie.title)
                random.shuffle(random_titles)
                
                # Log the URL construction
                original_url = selected_movie.still_url
                filename = original_url.split('/')[-1]
                correct_url = f"https://concessionstand.nyc3.digitaloceanspaces.com/concessionstand/{filename}"
                
                logging.info(f'Processing movie: {selected_movie.title}')
                logging.info(f'Original URL: {original_url}')
                logging.info(f'Constructed URL: {correct_url}')

                movies_data.append({
                    "title": selected_movie.title,
                    "still_url": correct_url,
                    "options": random_titles
                })
            except Exception as e:
                logging.error(f"Error processing movie {selected_movie.title}: {str(e)}")
                raise

        # Update movies in database
        for movie in selected_movies:
            movie.last_shown = datetime.utcnow()
            movie.is_active = True
        
        db.session.commit()
        
        # Store in Redis
        redis_conn.set(today, json.dumps(movies_data))
        
        return movies_data
        
    except Exception as e:
        logging.error(f"Error in get_daily_movies: {str(e)}")
        logging.error(f"Error type: {type(e)}")
        import traceback
        logging.error(f"Traceback: {traceback.format_exc()}")
        raise




@app.route('/')
def index():
    return send_from_directory('frontend/build', 'index.html')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if path != "" and os.path.exists(os.path.join("frontend/build", path)):
        return send_from_directory('frontend/build', path)
    else:
        return send_from_directory('frontend/build', 'index.html')


@app.route('/get-movies')
def get_movies():
    try:
        logging.info('Starting get-movies request...')
        movies_data = get_daily_movies()
        logging.info(f'Retrieved movies_data: {movies_data}')
        
        if not movies_data:
            logging.error('No movies data returned')
            return {"error": "Not enough movies to play the game!"}, 404
            
        return jsonify({'movies': movies_data})
    except Exception as e:
        logging.error(f"Error while fetching movies: {str(e)}")
        logging.error(f"Error type: {type(e)}")
        import traceback
        logging.error(f"Traceback: {traceback.format_exc()}")
        return {"error": f"Internal Server Error: {str(e)}"}, 500

@app.route('/game/setup/manual', methods=['POST'])
def manual_game_setup():
    get_daily_movies()
    return jsonify({"message": "Game setup completed!"})

@app.route('/initdb')
def initdb():
    """Create tables if they don't exist."""
    db.create_all()
    return 'Database tables created!', 200

@app.route('/.git/<path:dummy>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def block_git(dummy):
    return "Not accessible", 403

@app.route('/admin/reset-movies', methods=['POST'])
def reset_movies():
    try:
        # Reset all movies that were shown more than 24 hours ago
        yesterday = datetime.utcnow() - timedelta(days=1)
        movies_to_reset = Movie.query.filter(
            or_(Movie.last_shown < yesterday, Movie.is_active == True)
        ).all()
        
        for movie in movies_to_reset:
            movie.is_active = False
        
        db.session.commit()
        return jsonify({"message": f"Reset {len(movies_to_reset)} movies"}), 200
    except Exception as e:
        logging.error(f"Error resetting movies: {e}")
        return {"error": "Internal Server Error"}, 500

@app.route('/test-redis')
def test_redis():
    try:
        redis_conn.set('test', 'working')
        result = redis_conn.get('test')
        return jsonify({
            'status': 'success',
            'redis_test': result.decode('utf-8') if result else None
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True, threaded=True)
