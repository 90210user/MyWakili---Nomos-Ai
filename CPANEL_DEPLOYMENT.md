# MyWakili AI Layer - cPanel Deployment Guide

This guide provides detailed instructions for deploying the MyWakili AI Layer application to a cPanel hosting environment.

## Prerequisites

1. A cPanel hosting account with Node.js support
2. Access to the cPanel dashboard
3. Ability to create and manage Node.js applications in cPanel
4. FTP client or File Manager access to upload files

## Preparation

Before deploying, make sure you have the following:

1. OpenAI API key (for AI functionality)
2. Firebase project setup (for authentication)
3. Proper environment variables ready

## Deployment Steps

### 1. Build the Application

Run the deployment preparation script:

```bash
# Make the script executable (if needed)
chmod +x deploy-cpanel.sh

# Run the script
./deploy-cpanel.sh
```

This will create a `cpanel-deploy` directory with all the files needed for deployment, and also a ZIP archive of the same files.

### 2. Upload Static Files

1. Log in to your cPanel account
2. Navigate to the File Manager
3. Go to the `public_html` directory
4. Upload all files from the `cpanel-deploy/public_html` directory to your cPanel `public_html` directory
   - You can use the File Manager's Upload feature or an FTP client

### 3. Set Up Node.js Application

1. In cPanel, locate the "Setup Node.js App" section
2. Click "Create Application"
3. Configure the application:
   - **Node.js version**: Choose version 18.x or higher
   - **Application mode**: Production
   - **Application root**: Choose a directory for your Node.js app (e.g., `node_app`)
   - **Application URL**: Your domain name (this should be handled automatically)
   - **Application startup file**: `index.js`

4. Click "Create" to set up the Node.js environment

### 4. Upload Server Files

1. Navigate to the Node.js application directory you just created
2. Upload all files from the `cpanel-deploy/node_app` directory to this directory
   - You can use the File Manager's Upload feature or an FTP client

### 5. Install Dependencies

1. In cPanel, go back to the "Setup Node.js App" section
2. Find your application in the list and click "Run NPM Install"
3. Wait for the installation to complete

### 6. Configure Environment Variables

1. In the Node.js app section of cPanel, find your application
2. Click on "Environment Variables" or similar
3. Add the following variables:
   - `NODE_ENV`: `production`
   - `PORT`: (typically set automatically by cPanel)
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `VITE_FIREBASE_API_KEY`: Your Firebase API key
   - `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `VITE_FIREBASE_APP_ID`: Your Firebase app ID

### 7. Start the Application

1. In the Node.js app section, find your application
2. Click "Start Application" or similar
3. Wait for the application to start

### 8. Configure .htaccess (if needed)

Check if the included `.htaccess` file in your `public_html` directory is working correctly. It should proxy API requests to your Node.js application.

If you need to modify it, the important part is:

```apache
# Proxy API requests to the Node.js application
RewriteRule ^api/(.*) http://localhost:PORT/$1 [P,L]
```

Replace `PORT` with the actual port of your Node.js application in cPanel.

## Troubleshooting

### Application Not Starting

1. Check the Node.js application logs in cPanel
2. Ensure all dependencies are installed
3. Verify environment variables are set correctly

### API Requests Not Working

1. Check that your Node.js application is running
2. Verify that the .htaccess file is properly configured
3. Check the port number in the .htaccess file matches your Node.js application port

### Static Files Not Loading

1. Ensure all files are correctly uploaded to the `public_html` directory
2. Check file permissions (should be 644 for files, 755 for directories)

### Authentication Issues

1. Verify Firebase configuration in environment variables
2. Ensure your domain is authorized in Firebase project settings

## Maintenance

### Updating the Application

To update your application:

1. Make changes to your code locally
2. Run the deployment preparation script again
3. Upload the new files to cPanel
4. Restart your Node.js application

### Monitoring

1. Check your Node.js application logs regularly
2. Monitor CPU and memory usage in cPanel

## Additional Resources

- [cPanel Documentation](https://docs.cpanel.net/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs/)