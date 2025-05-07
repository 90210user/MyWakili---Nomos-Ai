#!/bin/bash

# cPanel Deployment Script for MyWakili AI Layer
echo "Starting cPanel deployment preparation..."

# Step 1: Create production build
echo -e "\n🔨 Building production assets..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi
echo "✅ Build completed successfully"

# Step 2: Create deployment directory
DEPLOY_DIR="cpanel-deploy"
echo -e "\n📁 Creating deployment directory at $DEPLOY_DIR"

if [ -d "$DEPLOY_DIR" ]; then
  echo "Cleaning existing deployment directory"
  rm -rf "$DEPLOY_DIR"
fi

mkdir -p "$DEPLOY_DIR/public_html"
mkdir -p "$DEPLOY_DIR/node_app"

# Step 3: Copy necessary files
echo -e "\n📋 Copying files for deployment..."

# Copy static files to public_html
cp -r dist/client/* "$DEPLOY_DIR/public_html/"

# Copy server files
cp -r dist/* "$DEPLOY_DIR/node_app/"

# Create .htaccess to proxy requests to Node.js app
cat > "$DEPLOY_DIR/public_html/.htaccess" << EOF
# Enable rewrite engine
RewriteEngine On

# Proxy API requests to the Node.js application
RewriteRule ^api/(.*) http://localhost:5000/\$1 [P,L]

# Serve static files directly
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Serve index.html for all other routes (SPA routing)
RewriteRule ^ index.html [L]
EOF

# Create production package.json for the server
cat > "$DEPLOY_DIR/node_app/package.json" << EOF
{
  "name": "mywakili-ai-layer",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "NODE_ENV=production node index.js"
  },
  "dependencies": {
    "express": "^4.21.2",
    "express-session": "^1.18.1",
    "drizzle-orm": "^0.39.1",
    "openai": "^4.97.0",
    "firebase": "^11.6.1",
    "zod": "^3.24.2",
    "ws": "^8.18.0",
    "axios": "^1.9.0",
    "memorystore": "^1.6.7"
  }
}
EOF

# Create .env file for server configuration
cat > "$DEPLOY_DIR/node_app/.env" << EOF
NODE_ENV=production
PORT=5000
EOF

# Create README with deployment instructions
cat > "$DEPLOY_DIR/README.md" << EOF
# cPanel Deployment Instructions

This directory contains files ready for cPanel deployment.

## Setup Instructions

1. Upload the contents of \`public_html\` directory to your cPanel public_html folder
2. Create a Node.js application in cPanel:
   - Go to "Setup Node.js App" in cPanel
   - Create a new application
   - Choose a Node.js version 18 or higher
   - Set the application path to a directory of your choice (e.g., node_app)
   - Set the Application URL to your domain
   - Set Application startup file to index.js
   - Set Application mode to Production

3. Upload the contents of \`node_app\` directory to your Node.js application directory
4. In your Node.js application directory, run:
   \`\`\`
   npm install
   \`\`\`

5. Start the Node.js application in cPanel
6. Update the port in the .htaccess file to match your Node.js application port if needed
7. Set up environment variables in cPanel for:
   - OPENAI_API_KEY
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_APP_ID

## Troubleshooting

- If you encounter issues with API requests, check that the Node.js application is running
- Ensure the .htaccess file is correctly pointing to your Node.js application port
- Check cPanel error logs for any Node.js application errors
EOF

# Create a simple bash script to manage the Node.js app
cat > "$DEPLOY_DIR/manage.sh" << EOF
#!/bin/bash
# MyWakili AI Layer App management script

case "\$1" in
  start)
    echo "Starting MyWakili AI Layer application..."
    cd \$(dirname "\$0")/node_app
    npm start
    ;;
  stop)
    echo "Stopping MyWakili AI Layer application..."
    pkill -f "node index.js"
    ;;
  restart)
    echo "Restarting MyWakili AI Layer application..."
    pkill -f "node index.js"
    cd \$(dirname "\$0")/node_app
    npm start
    ;;
  *)
    echo "Usage: \$0 {start|stop|restart}"
    exit 1
    ;;
esac
EOF

chmod +x "$DEPLOY_DIR/manage.sh"

# Step 4: Create ZIP archive for easy download
echo -e "\n📦 Creating ZIP archive of deployment files..."
cd "$DEPLOY_DIR" && zip -r "../cpanel-deploy.zip" . && cd ..
if [ $? -ne 0 ]; then
  echo "⚠️ Could not create ZIP archive. Please zip the cpanel-deploy directory manually."
else
  echo "✅ ZIP archive created successfully: cpanel-deploy.zip"
fi

echo -e "\n✅ Deployment preparation complete!"
echo "The files for cPanel deployment are in the $DEPLOY_DIR directory"
echo "A ZIP archive is also available at cpanel-deploy.zip"
echo "See the README.md file in the $DEPLOY_DIR directory for deployment instructions"