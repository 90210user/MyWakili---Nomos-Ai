// deploy-cpanel.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Starting cPanel deployment preparation...');

// Step 1: Create production build
console.log('\n🔨 Building production assets...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

// Step 2: Create deployment directory
const deployDir = path.join(process.cwd(), 'cpanel-deploy');
console.log(`\n📁 Creating deployment directory at ${deployDir}`);

if (fs.existsSync(deployDir)) {
  console.log('Cleaning existing deployment directory');
  fs.rmSync(deployDir, { recursive: true, force: true });
}

fs.mkdirSync(deployDir);
fs.mkdirSync(path.join(deployDir, 'public_html'), { recursive: true });
fs.mkdirSync(path.join(deployDir, 'node_app'), { recursive: true });

// Step 3: Copy necessary files
console.log('\n📋 Copying files for deployment...');

// Copy static files to public_html
fs.cpSync(path.join(process.cwd(), 'dist/client'), path.join(deployDir, 'public_html'), { recursive: true });

// Copy server files
fs.cpSync(path.join(process.cwd(), 'dist'), path.join(deployDir, 'node_app'), { recursive: true });

// Create production package.json for the server
const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
const prodPackageJson = {
  name: packageJson.name,
  version: packageJson.version,
  type: 'module',
  scripts: {
    start: 'NODE_ENV=production node index.js'
  },
  dependencies: {
    express: packageJson.dependencies.express,
    'express-session': packageJson.dependencies['express-session'],
    'drizzle-orm': packageJson.dependencies['drizzle-orm'],
    'openai': packageJson.dependencies.openai,
    'firebase': packageJson.dependencies.firebase,
    'zod': packageJson.dependencies.zod,
    'ws': packageJson.dependencies.ws,
    'axios': packageJson.dependencies.axios,
    'memorystore': packageJson.dependencies.memorystore,
  }
};

fs.writeFileSync(
  path.join(deployDir, 'node_app', 'package.json'), 
  JSON.stringify(prodPackageJson, null, 2)
);

// Create .htaccess to proxy requests to Node.js app
const htaccessContent = `
# Enable rewrite engine
RewriteEngine On

# Proxy API requests to the Node.js application
RewriteRule ^api/(.*) http://localhost:PORT/$1 [P,L]

# Serve static files directly
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Serve index.html for all other routes (SPA routing)
RewriteRule ^ index.html [L]
`;

fs.writeFileSync(
  path.join(deployDir, 'public_html', '.htaccess'), 
  htaccessContent.replace('PORT', '5000')
);

// Create .env file for server configuration
const envContent = `
NODE_ENV=production
PORT=5000
`;

fs.writeFileSync(path.join(deployDir, 'node_app', '.env'), envContent);

// Create README with deployment instructions
const readmeContent = `# cPanel Deployment Instructions

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
6. Update the port in the .htaccess file to match your Node.js application port
7. (Optional) Set up environment variables in cPanel for:
   - OPENAI_API_KEY
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_APP_ID

## Troubleshooting

- If you encounter issues with API requests, check that the Node.js application is running
- Ensure the .htaccess file is correctly pointing to your Node.js application port
- Check cPanel error logs for any Node.js application errors
`;

fs.writeFileSync(path.join(deployDir, 'README.md'), readmeContent);

// Create a simple bash script to manage the Node.js app
const startupScriptContent = `#!/bin/bash
# MyWakili AI Layer App management script

case "$1" in
  start)
    echo "Starting MyWakili AI Layer application..."
    cd $(dirname "$0")/node_app
    npm start
    ;;
  stop)
    echo "Stopping MyWakili AI Layer application..."
    pkill -f "node index.js"
    ;;
  restart)
    echo "Restarting MyWakili AI Layer application..."
    pkill -f "node index.js"
    cd $(dirname "$0")/node_app
    npm start
    ;;
  *)
    echo "Usage: $0 {start|stop|restart}"
    exit 1
    ;;
esac
`;

fs.writeFileSync(path.join(deployDir, 'manage.sh'), startupScriptContent);
fs.chmodSync(path.join(deployDir, 'manage.sh'), '755');

// Step 4: Create ZIP archive for easy download
console.log('\n📦 Creating ZIP archive of deployment files...');
try {
  execSync(`cd ${deployDir} && zip -r ../cpanel-deploy.zip .`, { stdio: 'inherit' });
  console.log('✅ ZIP archive created successfully: cpanel-deploy.zip');
} catch (error) {
  console.error('⚠️ Could not create ZIP archive. Please zip the cpanel-deploy directory manually.');
}

console.log('\n✅ Deployment preparation complete!');
console.log('The files for cPanel deployment are in the cpanel-deploy directory');
console.log('A ZIP archive is also available at cpanel-deploy.zip');
console.log('See the README.md file in the cpanel-deploy directory for deployment instructions');