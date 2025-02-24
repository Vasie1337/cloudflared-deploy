prequesites:
cloudflare acc
domain on cloudflare
docker installed

1
create a tunnel on cloudflare
name your tunnel
select docker and copy the token

2
create a .env file in the project root and paste the token

3
docker compose up -d in the project root
cd example-site
docker compose up -d --build

4
go to your domain and test the site