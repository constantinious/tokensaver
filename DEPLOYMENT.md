# Deployment Guide

## Option 1: Render.com (Recommended - Free Tier)

1. **Sign up at [render.com](https://render.com)**

2. **Connect your GitHub repository**
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select `constantinious/tokensaver` repository

3. **Deploy**
   - Render will automatically detect `render.yaml`
   - Click "Apply"
   - Your app will be live at: `https://tokensaver.onrender.com`

**Note:** Free tier spins down after 15 minutes of inactivity. First request after spin-down takes ~30 seconds.

## Option 2: Railway.app

1. **Sign up at [railway.app](https://railway.app)**

2. **Deploy from GitHub**
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Login
   railway login
   
   # Deploy
   railway up
   ```

3. **Set environment variables** (optional):
   - `PORT=3000`
   - `NODE_ENV=production`

## Option 3: Fly.io

1. **Install Fly CLI**
   ```bash
   # macOS
   brew install flyctl
   
   # Or use install script
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login and deploy**
   ```bash
   fly auth login
   fly launch
   # Follow prompts, it will detect Dockerfile
   fly deploy
   ```

3. **Your app will be at**: `https://tokensaver.fly.dev`

## Option 4: Docker Hub + Self-Hosted

1. **Build and push to Docker Hub**
   ```bash
   docker build -t yourusername/tokensaver:latest .
   docker push yourusername/tokensaver:latest
   ```

2. **Deploy on any server**
   ```bash
   docker pull yourusername/tokensaver:latest
   docker run -d -p 80:3000 --name tokensaver yourusername/tokensaver:latest
   ```

## Testing Locally First

```bash
# Build Docker image
docker build -t tokensaver:latest .

# Run locally
docker run -p 3000:3000 tokensaver:latest

# Visit http://localhost:3000
```

## Post-Deployment

1. **Test the UI**: Visit your deployment URL
2. **Test the API**: 
   ```bash
   curl "https://your-app.com/parse?url=https://www.bbc.com/news"
   ```

3. **Monitor**: Check logs for errors
   - Render: Dashboard → Logs
   - Railway: `railway logs`
   - Fly.io: `fly logs`

## Rate Limiting (Recommended)

Consider adding rate limiting to prevent abuse:

```bash
npm install express-rate-limit
```

Add to `src/index.js`:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/parse', limiter);
```

## Custom Domain

Most platforms support custom domains:
- **Render**: Settings → Custom Domain
- **Railway**: Settings → Domains
- **Fly.io**: `fly certs add yourdomain.com`

## Environment Variables

Set these in your hosting platform:
- `PORT` - Automatically set by most platforms
- `NODE_ENV=production` - For production optimizations
