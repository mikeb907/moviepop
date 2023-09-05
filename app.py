from flask import Flask, render_template
import random
import requests

app = Flask(__name__, static_folder='.', static_url_path='')

@app.route('/')
def index():
    return render_template("index.html")

API_KEY = "36dd9f6061948278f3b8d34a8cf6566d"  # Your TMDb API key
TMDB_BASE_URL = "https://api.themoviedb.org/3"
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

@app.route('/get-movies')
def get_movies():
    movies_with_stills = []  # Initialize the list at the start

    try:
        # Get movies from a range of years
        years = list(range(1965, 2024))
        random_years = random.sample(years, 5)  # Randomly select 5 years to fetch movies from
        
        movies_list = []
        for year in random_years:
            while len(movies_list) < 3:  # Ensure we have at least 3 movies with stills before breaking
                response = requests.get(f"{TMDB_BASE_URL}/discover/movie?api_key={API_KEY}&language=en-US&primary_release_year={year}&page={random.randint(1, 10)}")
                data = response.json()
                if data.get('results'):
                    for movie in data.get('results'):
                        images_response = requests.get(f"{TMDB_BASE_URL}/movie/{movie['id']}/images?api_key={API_KEY}")
                        images_data = images_response.json()
                        if images_data.get('stills'):
                            random_still = random.choice(images_data['stills'])
                            movies_with_stills.append({
                                "title": movie["title"],
                                "still_url": IMAGE_BASE_URL + random_still["file_path"]
                            })
                            if len(movies_with_stills) == 3:
                                break

        # Before returning, print the movies_with_stills:
        print("Sending movies data:", movies_with_stills)
        return {"movies": movies_with_stills}

    except requests.RequestException as e:
        print("API request error:", str(e))
        return {"error": f"API request error: {str(e)}"}, 500
    except Exception as e:
        print("Unexpected error:", str(e))
        return {"error": str(e)}, 500




if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True, threaded=True)
