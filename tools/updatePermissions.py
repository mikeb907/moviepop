import boto3

def update_permissions(bucket_name):
    """Update the permissions of all objects in a DigitalOcean Space to public-read."""
    session = boto3.session.Session()
    client = session.client('s3',
                            region_name='nyc3',  # Change this if your Space is in a different region
                            endpoint_url='https://nyc3.digitaloceanspaces.com',
                            aws_access_key_id='DO00TGXN4D3AUWXJXXBT',
                            aws_secret_access_key='87r5NoCZ+DevsayLchaTx6LUKw5tB5RCexDou84Ns7E')
    
    try:
        # List objects in the Space
        objects = client.list_objects_v2(Bucket=bucket_name)
        
        # Ensure objects were found
        if 'Contents' not in objects:
            print(f"No objects found in bucket {bucket_name}.")
            return
        
        # Update the permissions for each object
        for obj in objects['Contents']:
            client.put_object_acl(Bucket=bucket_name, Key=obj['Key'], ACL='public-read')
            print(f"Updated permissions for {obj['Key']} to public-read.")
    
    except Exception as e:
        print("An error occurred:", e)

if __name__ == "__main__":
    update_permissions('concessionstand')
