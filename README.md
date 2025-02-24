# Cloudflare Tunnel Docker Setup

This guide helps you set up a Cloudflare Tunnel using Docker to securely expose your services to the internet.

## Prerequisites

- Cloudflare account
- Domain registered and active on Cloudflare
- Docker and Docker Compose installed on your system

## Setup Instructions

### 1. Create a Cloudflare Tunnel

1. Log into your [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/)
2. Navigate to Access > Tunnels
3. Click "Create a tunnel"
4. Name your tunnel
5. Select Docker as your environment
6. Copy the provided token

### 2. Configure Environment

1. Clone this repository
2. Create a `.env` file in the project root
3. Paste your Cloudflare tunnel token into the `.env` file:
   ```
   TUNNEL_TOKEN=your-token-here
   ```

### 3. Start the Services

1. Start the tunnel service:
   ```bash
   docker compose up -d
   ```

2. Start the example site:
   ```bash
   cd example-site
   docker compose up -d --build
   ```

### 4. Configure DNS and Routing

1. In your Cloudflare Zero Trust Dashboard, go to your tunnel's configuration
2. Add a new public hostname:
   - Select your domain
   - Enter your desired subdomain
   - Service type: HTTP
   - URL: `site1:3000` (or your service's internal URL)

### 5. Verify Setup

1. Wait a few minutes for DNS to propagate
2. Visit your configured subdomain to verify the service is accessible

## Troubleshooting

If you cannot access your site:
- Verify that all containers are running using `docker ps`
- Check container logs using `docker logs <container-name>`
- Ensure your Cloudflare DNS settings are correct
- Verify your tunnel is connected in the Cloudflare dashboard

## Security Note

This setup provides secure access to your services through Cloudflare's network. No ports need to be opened on your firewall as the connection is outbound only.