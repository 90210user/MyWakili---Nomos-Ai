/**
 * cPanel Specific Configuration
 * 
 * This file contains helper functions for running the application on cPanel
 */

import path from 'path';
import fs from 'fs';

// Used to determine if we're running in a cPanel environment
export function isCPanel(): boolean {
  // Common cPanel paths and environment variables
  return process.env.CPANEL !== undefined || 
    fs.existsSync('/usr/local/cpanel') || 
    process.env.DOCUMENT_ROOT?.includes('/home') || 
    false;
}

// Get the correct port for cPanel Node.js applications
export function getCPanelPort(): number {
  // Try to get port from environment variables
  if (process.env.PORT) {
    return Number(process.env.PORT);
  }

  // Default port for cPanel Node.js applications is often assigned
  // by the system, but we'll use 5000 as a fallback
  return 5000;
}

// Get the correct public directory for static files
export function getPublicDir(): string {
  if (isCPanel()) {
    // In cPanel, typically the Node.js app runs in a subdirectory
    // and static files would be in the public_html directory
    const defaultPath = '../public_html';
    
    if (fs.existsSync(path.resolve(process.cwd(), defaultPath))) {
      return defaultPath;
    }
    
    // If we can't find the public_html directory, fall back to the client build
    return path.resolve(process.cwd(), 'client');
  }
  
  // For non-cPanel environments, use the client build directory
  return path.resolve(process.cwd(), 'client');
}

// Helper for logging cPanel-specific information
export function logCPanelInfo(): void {
  if (isCPanel()) {
    console.log('Running in cPanel environment');
    console.log(`Using port: ${getCPanelPort()}`);
    console.log(`Public directory: ${getPublicDir()}`);
    console.log(`Current directory: ${process.cwd()}`);
    
    // Log environment variables that might be useful for debugging
    console.log('Environment variables:');
    console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`- PORT: ${process.env.PORT}`);
    console.log(`- DOCUMENT_ROOT: ${process.env.DOCUMENT_ROOT}`);
    console.log(`- HOME: ${process.env.HOME}`);
  }
}