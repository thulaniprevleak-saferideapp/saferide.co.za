# SafeRide Web Application Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ACCESS                              │
│                                                                   │
│  Desktop Browser ◄──────────►  Mobile Browser ◄──────────► Tablet│
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE / DNS                              │
│              www.saferides.co.za (Custom Domain)                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GITHUB PAGES                                │
│                   (Static Web Hosting)                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Static Assets                                        │       │
│  │  • index.html                                         │       │
│  │  • css/style.css                                      │       │
│  │  • js/app.js                                          │       │
│  │  • js/config.js                                       │       │
│  │  • assets/*                                           │       │
│  └──────────────────────────────────────────────────────┘       │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ API Calls
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FIREBASE BACKEND                              │
│                  (saferide-peld8)                                │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐│
│  │   Firebase Auth  │  │    Firestore     │  │  Cloud Storage ││
│  │                  │  │                  │  │                ││
│  │  • Email/Pass    │  │  • Users         │  │  • Profile Pics││
│  │  • OAuth         │  │  • Drivers       │  │  • Documents   ││
│  │  • Sessions      │  │  • Rides         │  │  • Receipts    ││
│  │                  │  │  • Messages      │  │                ││
│  └──────────────────┘  └──────────────────┘  └────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Layer

```
┌─────────────────────────────────────────┐
│         index.html (Entry Point)         │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Navigation Bar                    │ │
│  │  • Logo                            │ │
│  │  • Menu Items                      │ │
│  │  • Auth Buttons                    │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Hero Section                      │ │
│  │  • Value Proposition               │ │
│  │  • CTA Buttons                     │ │
│  │  • Key Stats                       │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Driver Benefits                   │ │
│  │  • Feature Cards                   │ │
│  │  • Comparison Table                │ │
│  │  • Application CTA                 │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Rider Information                 │ │
│  │  • App Features                    │ │
│  │  • Download Links                  │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Contact Form                      │ │
│  │  • Message Submission              │ │
│  │  • Firebase Integration            │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Footer                            │ │
│  │  • Links                           │ │
│  │  • Social Media                    │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### JavaScript Module Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    js/config.js                          │
│  • Firebase Initialization                               │
│  • Service Configuration (Auth, Firestore)               │
│  • Environment Variables                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    js/app.js                             │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │  DOM Management                                  │    │
│  │  • Event Listeners                               │    │
│  │  • Smooth Scrolling                              │    │
│  │  • Mobile Menu Toggle                            │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Modal System                                    │    │
│  │  • Login Modal                                   │    │
│  │  • Signup Modal (Driver/Rider)                   │    │
│  │  • Password Reset Modal                          │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Firebase Authentication                         │    │
│  │  • User Login                                    │    │
│  │  • User Registration                             │    │
│  │  • Password Reset                                │    │
│  │  • Auth State Management                         │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Firestore Operations                            │    │
│  │  • Save Contact Messages                         │    │
│  │  • Save User Profiles                            │    │
│  │  • Driver Applications                           │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │  UI Animations                                   │    │
│  │  • Intersection Observer                         │    │
│  │  • Scroll Animations                             │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

### User Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌───────────┐     ┌──────────┐
│  User    │────►│ Login/   │────►│ Firebase  │────►│ Success  │
│  Action  │     │ Signup   │     │   Auth    │     │ Redirect │
└──────────┘     │  Form    │     └───────────┘     └──────────┘
                 └──────────┘            │
                                         │ On Success
                                         ▼
                                  ┌──────────────┐
                                  │  Create/Get  │
                                  │  User Doc in │
                                  │  Firestore   │
                                  └──────────────┘
                                         │
                                         ▼
                                  ┌──────────────┐
                                  │  Update UI   │
                                  │  Show User   │
                                  │  Dashboard   │
                                  └──────────────┘
```

### Contact Form Submission Flow

```
┌──────────┐     ┌──────────┐     ┌───────────┐     ┌──────────┐
│  User    │────►│ Contact  │────►│ Firestore │────►│ Success  │
│  Submits │     │  Form    │     │Collection │     │ Message  │
│  Form    │     │Validation│     │   Save    │     │          │
└──────────┘     └──────────┘     └───────────┘     └──────────┘
                                         │
                                         │ Trigger (Future)
                                         ▼
                                  ┌──────────────┐
                                  │  Cloud       │
                                  │  Function    │
                                  │  Send Email  │
                                  └──────────────┘
```

## Deployment Architecture

### CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────┐
│                   Developer                              │
│                                                           │
│  ┌──────────────┐                                        │
│  │  Local Dev   │                                        │
│  │  Make Changes│                                        │
│  └──────┬───────┘                                        │
│         │                                                 │
│         │ git commit & push                              │
│         ▼                                                 │
│  ┌──────────────┐                                        │
│  │  Git Push to │                                        │
│  │  Main Branch │                                        │
│  └──────┬───────┘                                        │
└─────────┼─────────────────────────────────────────────────┘
          │
          │ Webhook Trigger
          ▼
┌─────────────────────────────────────────────────────────┐
│              GitHub Actions Workflow                     │
│          (.github/workflows/static.yml)                  │
│                                                           │
│  ┌──────────────────────────────────────────┐           │
│  │  Step 1: Checkout Repository             │           │
│  │  • actions/checkout@v4                   │           │
│  └────────────┬─────────────────────────────┘           │
│               │                                           │
│               ▼                                           │
│  ┌──────────────────────────────────────────┐           │
│  │  Step 2: Setup GitHub Pages              │           │
│  │  • actions/configure-pages@v5            │           │
│  └────────────┬─────────────────────────────┘           │
│               │                                           │
│               ▼                                           │
│  ┌──────────────────────────────────────────┐           │
│  │  Step 3: Upload Artifact                 │           │
│  │  • actions/upload-pages-artifact@v3      │           │
│  │  • Path: '.' (entire repository)         │           │
│  └────────────┬─────────────────────────────┘           │
│               │                                           │
│               ▼                                           │
│  ┌──────────────────────────────────────────┐           │
│  │  Step 4: Deploy to Pages                 │           │
│  │  • actions/deploy-pages@v4               │           │
│  └────────────┬─────────────────────────────┘           │
└───────────────┼─────────────────────────────────────────┘
                │
                │ Deploy
                ▼
┌─────────────────────────────────────────────────────────┐
│              GitHub Pages Server                         │
│                                                           │
│  • Serves static files                                   │
│  • HTTPS enabled                                         │
│  • Custom domain: www.saferides.co.za                    │
│  • CDN caching                                           │
└─────────────────────────────────────────────────────────┘
```

## Database Schema

### Firestore Collections

```
saferide-peld8 (Firebase Project)
│
├── users/
│   └── {userId}
│       ├── name: string
│       ├── email: string
│       ├── phone: string
│       ├── userType: "driver" | "rider"
│       ├── createdAt: timestamp
│       ├── status: "active" | "pending" | "suspended"
│       └── (driver-specific fields)
│           ├── licenseNumber: string
│           ├── vehicleRegistration: string
│           └── rating: number
│
├── contact-messages/
│   └── {messageId}
│       ├── name: string
│       ├── email: string
│       ├── subject: string
│       ├── message: string
│       └── timestamp: timestamp
│
├── driver-applications/ (future)
│   └── {applicationId}
│       ├── userId: string
│       ├── status: "pending" | "approved" | "rejected"
│       ├── documents: array
│       └── submittedAt: timestamp
│
└── rides/ (future)
    └── {rideId}
        ├── driverId: string
        ├── riderId: string
        ├── status: string
        ├── pickup: geopoint
        ├── destination: geopoint
        └── timestamp: timestamp
```

## Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                  Client-Side Security                    │
│                                                           │
│  • Input Validation                                      │
│  • XSS Prevention                                        │
│  • CSRF Protection                                       │
│  • HTTPS Only                                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Firebase Security Rules                     │
│                                                           │
│  • Authentication Required                               │
│  • Role-Based Access Control                             │
│  • Data Validation Rules                                 │
│  • Rate Limiting                                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                Backend Validation                        │
│                                                           │
│  • Firebase Admin SDK Verification                       │
│  • Server-Side Validation                                │
│  • Audit Logging                                         │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Responsive design, Flexbox, Grid
- **JavaScript ES6+**: Modern syntax, async/await
- **Firebase SDK**: Authentication and Database

### Backend
- **Firebase Authentication**: User management
- **Cloud Firestore**: NoSQL database
- **Cloud Storage**: File storage (future)
- **Cloud Functions**: Serverless compute (future)

### DevOps
- **GitHub**: Version control
- **GitHub Actions**: CI/CD pipeline
- **GitHub Pages**: Static hosting

### Domain & DNS
- **Custom Domain**: www.saferides.co.za
- **HTTPS**: Automatic SSL via GitHub Pages

## Scalability Considerations

### Current Architecture (MVP)
- Supports: 1,000 - 10,000 users
- Database: Firestore (automatic scaling)
- Hosting: GitHub Pages (CDN-backed)

### Future Scaling Path
1. **Phase 1**: Add Cloud Functions for backend logic
2. **Phase 2**: Implement Cloud Run for API services
3. **Phase 3**: Add Load Balancer for high traffic
4. **Phase 4**: Multi-region deployment

## Monitoring & Analytics

```
┌─────────────────────────────────────────┐
│          User Interactions              │
└─────────────┬───────────────────────────┘
              │
              ├──────► Google Analytics
              │        • Page views
              │        • User behavior
              │
              ├──────► Firebase Analytics
              │        • Custom events
              │        • User properties
              │
              └──────► Firebase Performance
                       • Load times
                       • Network requests
```

## Backup & Recovery

### Automated Backups
- **Firestore**: Daily automatic backups
- **Authentication**: Firebase manages
- **Code**: Git version control
- **Static Assets**: GitHub repository

### Disaster Recovery
- **RTO**: < 1 hour (Recovery Time Objective)
- **RPO**: < 1 day (Recovery Point Objective)
- **Strategy**: Restore from Firestore backup + redeploy from Git

---

## Architecture Decision Records (ADRs)

### ADR-001: Use GitHub Pages for Hosting
- **Decision**: Host on GitHub Pages instead of traditional web server
- **Rationale**: Free, reliable, automatic HTTPS, integrated with Git workflow
- **Consequences**: Limited to static content, but sufficient for MVP

### ADR-002: Firebase as Backend
- **Decision**: Use Firebase instead of custom backend
- **Rationale**: Faster development, automatic scaling, built-in security
- **Consequences**: Vendor lock-in, but benefits outweigh concerns

### ADR-003: Vanilla JavaScript
- **Decision**: Use vanilla JS instead of React/Vue/Angular
- **Rationale**: Simpler setup, faster load times, no build process needed
- **Consequences**: May refactor to framework if complexity increases

---

**Architecture Version**: 1.0  
**Last Updated**: December 2025  
**Status**: Production Ready
