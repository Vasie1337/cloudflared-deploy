# Traefik Reverse Proxy with Node.js Example

This project demonstrates a setup using Traefik as a reverse proxy with automatic SSL certificate management, alongside a sample Node.js application.

## Project Structure

```
.
├── docker-compose.yml          # Main Traefik configuration
├── example-site/
    ├── docker-compose.yml      # Example site configuration
    ├── server.js              # Node.js application
    ├── package.json           # Node.js dependencies
    ├── Dockerfile            # Container configuration for the app
    └── .env                  # Environment variables
```

## Features

- Traefik v2.10 reverse proxy
- Automatic SSL certificate generation using Let's Encrypt
- HTTP to HTTPS redirection
- Docker network isolation
- Traefik dashboard
- Sample Node.js application

## Prerequisites

- Docker and Docker Compose
- Domain name with DNS configured
- Port 80 and 443 available on your host

## Setup Instructions

1. Clone this repository
2. Update domain names in both `docker-compose.yml` files:
   - Update `panel.domain.com` in the root `docker-compose.yml` for the Traefik dashboard
   - Update `site.domain` in `example-site/docker-compose.yml` for the example site

3. Start Traefik:
```bash
docker-compose up -d
```

4. Start the example site:
```bash
cd example-site
docker-compose up -d
```

## Configuration

### Traefik Configuration
- Dashboard available at: https://panel.domain.com
- Automatic SSL certificate generation using Let's Encrypt
- All HTTP traffic redirected to HTTPS
- Docker socket mounted for automatic service discovery

### Example Site Configuration
- Simple Node.js Express application
- Environment variables configurable via `.env` file
- Exposed on port 3000 internally
- Accessible through Traefik using the configured domain

## Networks

The project uses a Docker network named `proxy` for communication between Traefik and the services. This network is created automatically when starting the containers.

## SSL Certificates

SSL certificates are automatically managed by Traefik using Let's Encrypt. Certificates are stored in a Docker volume named `letsencrypt` for persistence.

## Security Notes

- The Traefik dashboard should be properly secured in production
- Consider adding authentication to the dashboard
- The Docker socket is mounted read-only for security

## Adding a New Site

To add a new site to the Traefik setup:

1. Create a new directory for your site:
```bash
mkdir my-new-site
cd my-new-site
```

2. Create a `docker-compose.yml` file with the following structure:
```yaml
services:
  mysite:
    build: .  # Or use your specific image
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.mysite.rule=Host(`your-domain.com`)"
      - "traefik.http.routers.mysite.entrypoints=websecure"
      - "traefik.http.routers.mysite.tls.certresolver=letsencrypt"
      - "traefik.http.services.mysite.loadbalancer.server.port=YOUR_PORT"
    networks:
      - proxy

networks:
  proxy:
    external: true
```

Key points when adding a new site:
- Replace `mysite` with a unique name for your service
- Update `your-domain.com` with your actual domain
- Set `YOUR_PORT` to the port your application listens on
- Ensure your service is connected to the `proxy` network
- Make sure the service names in the Traefik labels are unique across all sites

3. Add your application files and Dockerfile

4. Start your new site:
```bash
docker-compose up -d
```

The new site will be automatically detected by Traefik, and SSL certificates will be generated automatically. 