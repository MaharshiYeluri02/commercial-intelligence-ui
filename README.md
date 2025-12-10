# Commercial Platform

A modern React application showcasing a commercial platform with four main sections: Investment, Analytics, Security, and Integration.

## Features

- **Investment**: Budget optimization with portfolio analysis and risk assessment
- **Analytics**: Data insights with real-time dashboards and predictive analytics
- **Security**: Enterprise protection with multi-factor authentication and threat detection
- **Integration**: Seamless connectivity with API management and third-party integrations

## Tech Stack

- React 18
- Tailwind CSS
- Create React App

## Getting Started

### Option 1: Docker (Recommended)

#### Prerequisites
- Docker Desktop installed and running
- See [DOCKER_SETUP.md](../DOCKER_SETUP.md) for detailed instructions

#### Quick Start
```bash
# From the project root directory
cd /Users/maharshi/Documents/Rxalgos
docker compose up --build
```

Access the application at [http://localhost:3000](http://localhost:3000)

#### Development Mode with Hot Reload
```bash
docker compose -f docker-compose.dev.yml up --build
```

### Option 2: Local Development

#### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

#### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

To create a production build:

```bash
npm run build
```

This builds the app for production to the `build` folder.

## Project Structure

```
commercial_platform/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main application component
│   ├── index.js        # Application entry point
│   └── index.css       # Tailwind CSS imports
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)
- `npm run deploy` - Deploy to GitHub Pages

## Styling

This project uses Tailwind CSS for styling. The configuration is set up in `tailwind.config.js` and the CSS is imported in `src/index.css`.

## Deployment

### Prerequisites for Deployment

Before deploying, ensure you have:
- Docker installed and running (for Docker deployment)
- Git configured with GitHub access
- Node.js 18+ and npm installed

### Deployment Options

#### 1. GitHub Pages (Recommended for Static Hosting)

This project is configured to deploy to GitHub Pages automatically.

**Steps:**

1. Ensure your repository is set up on GitHub
2. Run the deployment command:
   ```bash
   npm run deploy
   ```
3. The app will be built and deployed to: `https://MaharshiYeluri02.github.io/commercial-intelligence-ui`

**Note:** The `gh-pages` package handles the deployment. It builds the app and pushes the build folder to the `gh-pages` branch.

#### 2. Docker Deployment (Recommended for Production)

**Development Environment:**

For development with hot-reload:
```bash
# Build and run development container
docker build -f Dockerfile.dev -t commercial-ui-dev .
docker run -p 3000:3000 -v $(pwd):/app commercial-ui-dev
```

**Production Environment:**

For production deployment with Nginx:
```bash
# Build production image
docker build -t commercial-ui:latest .

# Run production container
docker run -p 80:80 commercial-ui:latest
```

Access the application at `http://localhost`

**Production Features:**
- Multi-stage Docker build for optimized image size
- Nginx web server for efficient static file serving
- Custom Nginx configuration with gzip compression
- Health check endpoint at `/health`
- Automatic graceful shutdowns

**Docker Compose (Alternative):**

If you have a `docker-compose.yml` file in the parent directory:
```bash
# Production
docker-compose up -d

# Development
docker-compose -f docker-compose.dev.yml up -d
```

#### 3. Manual Production Build

For hosting on any web server:

```bash
# Create production build
npm run build

# The build folder can be deployed to any static hosting service:
# - AWS S3 + CloudFront
# - Netlify
# - Vercel
# - Azure Static Web Apps
# - Google Cloud Storage
```

The `build` folder contains optimized static files ready for deployment.

#### 4. Cloud Platform Deployment

**AWS (with Docker):**
```bash
# Build for AWS
docker build -t commercial-ui:latest .

# Tag for ECR
docker tag commercial-ui:latest <aws-account-id>.dkr.ecr.<region>.amazonaws.com/commercial-ui:latest

# Push to ECR
docker push <aws-account-id>.dkr.ecr.<region>.amazonaws.com/commercial-ui:latest

# Deploy using ECS, EKS, or App Runner
```

**Google Cloud Platform:**
```bash
# Build for GCP
docker build -t gcr.io/<project-id>/commercial-ui:latest .

# Push to Container Registry
docker push gcr.io/<project-id>/commercial-ui:latest

# Deploy to Cloud Run, GKE, or App Engine
```

**Azure:**
```bash
# Build for Azure
docker build -t commercial-ui:latest .

# Tag for ACR
docker tag commercial-ui:latest <registry-name>.azurecr.io/commercial-ui:latest

# Push to ACR
docker push <registry-name>.azurecr.io/commercial-ui:latest

# Deploy using Azure Container Instances or App Service
```

### Environment Variables

If you need environment variables for your deployment:

1. Create a `.env` file in the root directory
2. Add variables with `REACT_APP_` prefix:
   ```
   REACT_APP_API_URL=https://api.example.com
   REACT_APP_ENV=production
   ```
3. Access in code: `process.env.REACT_APP_API_URL`

### Post-Deployment Verification

After deployment, verify:
- [ ] Application loads successfully
- [ ] All pages render correctly
- [ ] Static assets (images, fonts) load properly
- [ ] No console errors
- [ ] Performance metrics are acceptable
- [ ] Health check endpoint works (Docker deployments)

### Troubleshooting

**Common Issues:**

1. **Docker build fails**: Ensure all dependencies are in `package.json` and `node_modules` is not in the image
2. **GitHub Pages 404**: Check that `homepage` in `package.json` matches your repository URL
3. **Build errors**: Clear cache with `npm ci` and rebuild
4. **Port conflicts**: Change port mapping in Docker run command

### Monitoring and Logs

**Docker Logs:**
```bash
# View logs
docker logs <container-id>

# Follow logs
docker logs -f <container-id>
```

**Health Check:**
```bash
# Check container health
docker ps

# Manual health check
curl http://localhost/health
```

---

## License

This project is private and confidential.
