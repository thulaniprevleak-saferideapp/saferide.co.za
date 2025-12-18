# SafeRide Web Application - Configuration Guide

## Project Configuration Overview

This document outlines all configuration files and their purposes in the SafeRide web application.

## Configuration Files

### 1. Firebase Configuration

#### google-services.json
- **Location**: `/google-services.json`
- **Purpose**: Firebase configuration for Android mobile app
- **Contains**: Project ID, API keys, storage bucket information
- **Security**: Should not contain sensitive keys (client-side config)

#### js/config.js
- **Location**: `/js/config.js`
- **Purpose**: Firebase web SDK configuration
- **Contains**: Web app Firebase initialization settings
- **Usage**: Loaded before app.js to initialize Firebase services

### 2. Deployment Configuration

#### GitHub Actions Workflow
- **Location**: `/.github/workflows/static.yml`
- **Purpose**: Automated deployment to GitHub Pages
- **Trigger**: Push to `main` branch or manual dispatch
- **Target**: GitHub Pages hosting
- **Process**:
  1. Checkout repository
  2. Setup GitHub Pages
  3. Upload artifact (entire web app)
  4. Deploy to Pages

#### CNAME Files
- **Locations**: `/CNAME` and `/docs/CNAME`
- **Purpose**: Custom domain configuration
- **Domain**: www.saferides.co.za
- **Note**: Required for GitHub Pages custom domain

### 3. Project Configuration

#### package.json
- **Location**: `/package.json`
- **Purpose**: Project metadata and dependencies
- **Key Scripts**:
  - `start`: Run local development server
  - `deploy`: Deployment message (handled by GitHub Actions)
- **Dependencies**: Firebase SDK

#### .gitignore
- **Location**: `/.gitignore`
- **Purpose**: Specify files to exclude from version control
- **Excludes**: 
  - node_modules
  - environment files
  - editor configs
  - build outputs

## Environment Setup

### Local Development

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd saferide.co.za
   ```

2. **Start Local Server**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or Node.js
   npx http-server -p 8000
   ```

3. **Access Application**
   ```
   http://localhost:8000
   ```

### Production Deployment

#### Prerequisites
1. GitHub repository set up
2. GitHub Pages enabled in repository settings
3. Custom domain configured (optional)
4. Firebase project created and configured

#### Deployment Steps
1. **Commit Changes**
   ```bash
   git add .
   git commit -m "Your changes"
   ```

2. **Push to Main Branch**
   ```bash
   git push origin main
   ```

3. **Automatic Deployment**
   - GitHub Actions workflow triggers automatically
   - Site builds and deploys to GitHub Pages
   - Available at: https://www.saferides.co.za

## Firebase Setup

### Web App Configuration

1. **Firebase Console**
   - Navigate to: https://console.firebase.google.com/
   - Select project: saferide-peld8

2. **Add Web App**
   - Go to Project Settings > General
   - Under "Your apps", add Web app
   - Copy configuration to `js/config.js`

3. **Enable Authentication**
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Configure OAuth providers if needed

4. **Setup Firestore Database**
   - Go to Firestore Database
   - Create database (start in production mode)
   - Configure security rules

### Security Rules

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Contact messages
    match /contact-messages/{message} {
      allow create: if true;
      allow read: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // User profiles
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Driver applications
    match /driver-applications/{applicationId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null && 
                             (resource.data.userId == request.auth.uid || 
                              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

## Domain Configuration

### Custom Domain Setup

1. **DNS Configuration**
   - Add CNAME record pointing to: `yourusername.github.io`
   - Or A records pointing to GitHub Pages IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

2. **GitHub Repository Settings**
   - Go to Settings > Pages
   - Enter custom domain: www.saferides.co.za
   - Enable "Enforce HTTPS"

3. **CNAME File**
   - Ensure CNAME file exists in root with domain name
   - GitHub Actions preserves this file during deployment

## Monitoring and Analytics

### Recommended Integrations

1. **Google Analytics**
   - Add tracking code to index.html
   - Track page views, user interactions

2. **Firebase Analytics**
   - Already integrated via Firebase SDK
   - Track custom events in app.js

3. **Error Monitoring**
   - Consider: Sentry, LogRocket, or Firebase Crashlytics
   - Add error tracking to catch production issues

## Security Considerations

1. **API Keys**
   - Firebase client config is safe to expose
   - Never commit server-side API keys

2. **Authentication**
   - Email verification recommended for production
   - Implement password strength requirements
   - Add CAPTCHA for signup forms

3. **Database Security**
   - Use Firestore security rules (never allow open access)
   - Validate all user inputs
   - Implement rate limiting

4. **HTTPS**
   - Always enforce HTTPS in production
   - GitHub Pages provides automatic SSL

## Performance Optimization

### Recommended Improvements

1. **Image Optimization**
   - Compress all images
   - Use WebP format with fallbacks
   - Implement lazy loading

2. **CSS/JS Minification**
   - Minify CSS and JavaScript files
   - Combine files to reduce HTTP requests

3. **CDN Usage**
   - Firebase SDKs already on CDN
   - Consider CDN for assets

4. **Caching Strategy**
   - Configure cache headers
   - Use service workers for offline support

## Troubleshooting

### Common Issues

1. **GitHub Pages not updating**
   - Check Actions tab for workflow status
   - Verify CNAME file exists
   - Clear browser cache

2. **Firebase connection errors**
   - Verify config in js/config.js
   - Check Firebase project status
   - Review browser console for errors

3. **Custom domain not working**
   - Wait for DNS propagation (up to 48 hours)
   - Verify DNS records
   - Check GitHub Pages settings

## Support

For configuration assistance:
- Email: info@saferides.co.za
- Documentation: /docs/
- Security Issues: See SECURITY.md
