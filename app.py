from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random

app = Flask(__name__, static_folder="frontend/build/static", template_folder="frontend/build")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///movies.db'

# Initialize CORS with the app
CORS(app)

db = SQLAlchemy(app)

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    still_url = db.Column(db.String(500), nullable=False)

@app.route('/')
def index():
    return send_from_directory('frontend/build', 'index.html')

@app.route('/get-movies')
def get_movies():
    movies = Movie.query.all()
    if not movies:
        return {"error": "No movies found in the database!"}, 404
    
    movies_data = [{"title": movie.title, "still_url": movie.still_url} for movie in movies]
    return {"movies": random.sample(movies_data, 3)}  # Randomly selecting 3 movies

# Move database initialization outside the block below
with app.app_context():
    db.create_all()  # Creates the movies table if it doesn't exist yet

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True, threaded=True)
