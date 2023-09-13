from sqlalchemy import create_engine, text
import os
import random
import logging

# Configure logging
logging.basicConfig(filename='daily_reset.log', level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(message)s')

# PostgreSQL connection configuration
DATABASE_URL = os.environ.get('DATABASE_URL', 'postgresql://postgres:Sfogliatelle1209!@localhost/postgres')

# Ensure the correct URL format
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)

def daily_reset():

    # Set all movies to inactive
    with engine.connect() as conn:
        conn.execute(text("UPDATE movie SET is_active = FALSE"))

    # Fetch movies not shown in the last two weeks
    query = text("""
        SELECT id, title 
        FROM movie 
        WHERE id NOT IN (SELECT movie_id FROM game_history WHERE date_shown > NOW() - INTERVAL '2 weeks') 
        ORDER BY RANDOM() LIMIT 3
    """)

    movies = []
    with engine.connect() as conn:
        result = conn.execute(query)
        for row in result:
            movies.append(row)

    # Set the fetched movies to active
    movie_ids = [movie[0] for movie in movies]
    with engine.connect() as conn:
        conn.execute(text(f"UPDATE movie SET is_active = TRUE WHERE id IN ({','.join(map(str, movie_ids))})"))

    # Insert these movies into the game_history table
    for movie_id in movie_ids:
        with engine.connect() as conn:
            conn.execute(text("INSERT INTO game_history (movie_id, date_shown) VALUES (:movie_id, NOW())"), {"movie_id": movie_id})

    # Populate the movie_options table (for simplicity, we'll add the correct title and two random ones as options)
    for movie in movies:
        # Fetch two random movie titles other than the current movie
        query = text("""
            SELECT title 
            FROM movie 
            WHERE id != :movie_id 
            ORDER BY RANDOM() LIMIT 2
        """)

        options = [movie[1]]  # Add the correct title
        with engine.connect() as conn:
            result = conn.execute(query, {"movie_id": movie[0]})
            for row in result:
                options.append(row[0])

        random.shuffle(options)  # Shuffle the options

        for option in options:
            with engine.connect() as conn:
                conn.execute(text("INSERT INTO movie_options (movie_id, option_title) VALUES (:movie_id, :option_title)"), {"movie_id": movie[0], "option_title": option})

if __name__ == "__main__":
    daily_reset()


if __name__ == "__main__":
    try:
        logging.info('Starting daily reset...')
        daily_reset()
        logging.info('Daily reset completed successfully!')
    except Exception as e:
        logging.error(f"An error occurred: {e}")