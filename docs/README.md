# SafeRide Web Application

## Overview
SafeRide is a driver-centric e-hailing platform that provides a transparent and fair alternative to traditional rideshare services. This repository contains the web application for SafeRide.

## Project Structure
```
saferide.co.za/
├── index.html              # Main landing page
├── css/
│   └── style.css          # Styling and responsive design
├── js/
│   ├── config.js          # Firebase configuration
│   └── app.js             # Main application logic
├── assets/                # Images, logos, and media files
├── docs/                  # Documentation and GitHub Pages
├── .github/
│   └── workflows/         # CI/CD automation
├── google-services.json   # Firebase Android config
├── package.json           # Project dependencies
└── README.md             # This file
```

## Configuration Files

### Firebase Configuration
- **google-services.json**: Firebase configuration for Android app
- **js/config.js**: Firebase web SDK configuration

### Deployment Configuration
- **.github/workflows/static.yml**: GitHub Actions workflow for automatic deployment to GitHub Pages
- **CNAME**: Custom domain configuration for www.saferides.co.za

## Features

### For Drivers
- Low 5-10% service fee (vs 15-25% competitors)
- 100% of surge pricing goes to drivers
- Performance-based bonuses and loyalty programs
- 24/7 dedicated driver support
- Comprehensive insurance coverage

### For Riders
- Transparent pricing with no hidden fees
- Professional, well-compensated drivers
- Real-time ride tracking
- Multiple payment options
- Safety features including emergency button

## Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Firestore Database)
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions
- **Domain**: www.saferides.co.za

## Local Development

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local server) or any static file server
- Git

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/saferide.co.za.git
cd saferide.co.za
```

2. Start a local server:
```bash
# Using Python 3
python -m http.server 8000

# Or using Python 2
python -m SimpleHTTPServer 8000

# Or using Node.js (if you have it)
npx http-server -p 8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

## Deployment

### Automatic Deployment
The site automatically deploys to GitHub Pages when you push to the `main` branch. The deployment workflow is configured in `.github/workflows/static.yml`.

### Manual Deployment
1. Commit your changes:
```bash
git add .
git commit -m "Your commit message"
```

2. Push to GitHub:
```bash
git push origin main
```

3. GitHub Actions will automatically build and deploy the site

### Custom Domain Setup
The site is configured to use the custom domain `www.saferides.co.za`. The CNAME file in the root directory contains this configuration.

## Firebase Setup

### Web App Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (saferide-peld8)
3. Navigate to Project Settings > General
4. Under "Your apps", add a Web app if not already created
5. Copy the configuration and update `js/config.js` if needed

### Security Rules
Configure Firestore security rules in the Firebase Console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Contact messages - anyone can write, admins can read
    match /contact-messages/{message} {
      allow create: if true;
      allow read: if request.auth != null && request.auth.token.admin == true;
    }
    
    // User data - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## Features Roadmap

### Phase 1 (Current)
- ✅ Responsive landing page
- ✅ Driver and rider information sections
- ✅ Contact form with Firebase integration
- ✅ User authentication (login/signup)
- ✅ Firebase integration

### Phase 2 (Planned)
- [ ] Driver application portal
- [ ] Real-time ride tracking map
- [ ] Payment gateway integration
- [ ] Driver dashboard
- [ ] Rider booking interface
- [ ] Admin panel

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Integration with navigation APIs
- [ ] In-app messaging

## Contributing
Please read SECURITY.md for security policies and procedures.

## License
See the LICENSE file for details.

## Support
- **Email**: info@saferides.co.za
- **Website**: https://www.saferides.co.za
- **Documentation**: See the `docs/` folder

## Team
SafeRide is proudly South African, built by a team dedicated to improving the lives of rideshare drivers.

---

**Note**: This is a production web application. For development purposes, always use a separate Firebase project and configuration.
