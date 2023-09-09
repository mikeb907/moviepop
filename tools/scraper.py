import requests
from bs4 import BeautifulSoup
import boto3
import psycopg2
import os  # Required for file deletion

BASE_URL = "https://film-grab.com"
PAGE_URL_FORMAT = "https://film-grab.com/page/{page_num}"
TOTAL_PAGES = 20  # Number of pages to scrape
session = boto3.session.Session()
client = session.client('s3',
                        region_name='nyc3',
                        endpoint_url='https://concessionstand.nyc3.digitaloceanspaces.com',
                        aws_access_key_id='DO00TGXN4D3AUWXJXXBT',
                        aws_secret_access_key='87r5NoCZ+DevsayLchaTx6LUKw5tB5RCexDou84Ns7E')

# Database connection
conn = psycopg2.connect(
    dbname="postgres",
    user="postgres",
    password="Sfogliatelle1209!",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

def download_image(img_url, img_title):
    print(f"Downloading {img_url} titled {img_title}...")

    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        'Referer': BASE_URL
    }

    response = requests.get(img_url, headers=headers, stream=True)
    response.raise_for_status()

    local_filename = img_url.split('/')[-1]
    with open(local_filename, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192): 
            f.write(chunk)

    print(f"Image saved to local file: {local_filename}")
    return local_filename

def upload_to_DO_space(filename):
    with open(filename, 'rb') as f:
        client.put_object(Bucket="concessionstand", Key=filename, Body=f, ContentType='image/jpeg')
    
    # Delete the file locally after uploading
    os.remove(filename)
    return f"https://concessionstand.nyc3.digitaloceanspaces.com/{filename}"

for page_num in range(1, TOTAL_PAGES + 1):
    if page_num == 1:
        page_url = BASE_URL
    else:
        page_url = PAGE_URL_FORMAT.format(page_num=page_num)
    
    response = requests.get(page_url)
    soup = BeautifulSoup(response.content, 'html.parser')
    img_wrappers = soup.find_all('a', class_='popup-image')

    for wrapper in img_wrappers:
        img_tag = wrapper.find('img', class_='wp-post-image')
        img_url = img_tag['src']
        img_title = wrapper['data-title']
        filename = download_image(img_url, img_title)
        do_space_img_url = upload_to_DO_space(filename)

        print(f"Stored image URL: {do_space_img_url}")

        insert_query = "INSERT INTO movie (title, still_url) VALUES (%s, %s) ON CONFLICT (still_url) DO NOTHING;"
        cur.execute(insert_query, (img_title, do_space_img_url))
        conn.commit()

        print("-" * 50)

cur.close()
conn.close()
print("Script completed.")
