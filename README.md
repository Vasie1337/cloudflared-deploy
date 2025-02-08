# Traefik Reverse Proxy with Node.js Example

A production-ready setup for hosting multiple web applications using Traefik as a reverse proxy with automatic SSL certificate management.

## Quick Start

1. **Clone and Setup**
```bash
# Clone repository
git clone <repository-url>
cd traefik-deploy

# Create network
docker network create proxy

# Configure domains
# Replace these in docker-compose.yml files:
# - panel.domain.com (Traefik dashboard)
# - site.domain (example site)

# Start Traefik
docker-compose up -d

# Start example site
cd example-site
cp .env.example .env
docker-compose up -d
```

2. **Verify Setup**
- Traefik Dashboard: https://panel.domain.com
- Example Site: https://site.domain

## Development Setup

```bash
# Create development override
cat > docker-compose.override.yml << EOL
services:
  traefik:
    command:
      - "--api.insecure=true"
    ports:
      - "8080:8080"
EOL

# Start services in dev mode
docker-compose up -d
cd example-site
npm install
npm run dev
```

Development URLs:
- Traefik Dashboard: http://localhost:8080
- Example Site: http://localhost:3000

## Project Structure
```
├── docker-compose.yml         # Traefik configuration
└── example-site/
    ├── docker-compose.yml     # Site configuration
    ├── server.js             # Node.js application
    ├── .env                  # Environment variables
    └── Dockerfile           # Container setup
```

## Adding a New Site

1. **Create Site Directory**
```bash
mkdir my-site && cd my-site
```

2. **Create Docker Compose**
```yaml
services:
  mysite:
    build: .
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

3. **Deploy**
```bash
docker-compose up -d
```

## Troubleshooting

Common issues and solutions:

1. **SSL Certificates**
   - Ensure DNS is configured
   - Check Traefik logs: `docker-compose logs traefik`

2. **Network Issues**
   - Verify proxy network: `docker network ls`
   - Check container logs: `docker-compose logs`

3. **Service Discovery**
   - Confirm labels in docker-compose.yml
   - Check Traefik dashboard

## Maintenance

```bash
# View logs
docker-compose logs -f traefik
docker-compose -f example-site/docker-compose.yml logs

# Update services
docker-compose pull
docker-compose up -d

# Backup certificates
docker cp $(docker ps -q -f name=traefik):/letsencrypt ./backup/
```

## Security Notes

- Change default dashboard domain
- Enable authentication for Traefik dashboard
- Keep Docker and Traefik updated
- Use specific versions in Docker images
- Regular security audits

## Environment Variables

```env
# Traefik Dashboard
DASHBOARD_DOMAIN=panel.domain.com

# Example Site
SITE_NAME=example-site
NODE_ENV=production
PORT=3000
```

For more details, check [Traefik documentation](https://doc.traefik.io/traefik/). 