// SafeRide Web App JavaScript

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const driverSignupBtn = document.getElementById('driverSignupBtn');
const riderSignupBtn = document.getElementById('riderSignupBtn');
const contactForm = document.getElementById('contactForm');

// Mobile Menu Toggle
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    });
});

// Login Handler
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        showLoginModal();
    });
}

// Signup Handlers
if (signupBtn) {
    signupBtn.addEventListener('click', () => {
        showSignupModal('rider');
    });
}

if (driverSignupBtn) {
    driverSignupBtn.addEventListener('click', () => {
        showSignupModal('driver');
    });
}

if (riderSignupBtn) {
    riderSignupBtn.addEventListener('click', () => {
        // For now, scroll to app download section
        // In production, this would open app store or show download modal
        alert('Mobile app coming soon! Download from Google Play Store or Apple App Store.');
    });
}

// Contact Form Handler
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: e.target[0].value,
            email: e.target[1].value,
            subject: e.target[2].value,
            message: e.target[3].value,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            // Save to Firestore
            await db.collection('contact-messages').add(formData);
            
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error sending your message. Please try again or email us directly at info@saferides.co.za');
        }
    });
}

// Modal Functions
function showLoginModal() {
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="loginModal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal('loginModal')">&times;</button>
                <h2>Login to SafeRide</h2>
                <form id="loginForm">
                    <input type="email" placeholder="Email" required>
                    <input type="password" placeholder="Password" required>
                    <div class="form-options">
                        <label>
                            <input type="checkbox"> Remember me
                        </label>
                        <a href="#" onclick="showPasswordResetModal()">Forgot password?</a>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">Login</button>
                </form>
                <p class="modal-footer">
                    Don't have an account? <a href="#" onclick="closeModal('loginModal'); showSignupModal('rider')">Sign up</a>
                </p>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listener to the form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

function showSignupModal(userType = 'rider') {
    const modalHTML = `
        <div class="modal-overlay" id="signupModal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal('signupModal')">&times;</button>
                <h2>Sign Up as ${userType === 'driver' ? 'Driver' : 'Rider'}</h2>
                <form id="signupForm">
                    <input type="text" placeholder="Full Name" required>
                    <input type="email" placeholder="Email" required>
                    <input type="tel" placeholder="Phone Number" required>
                    <input type="password" placeholder="Password" required>
                    <input type="password" placeholder="Confirm Password" required>
                    ${userType === 'driver' ? `
                        <input type="text" placeholder="Driver's License Number" required>
                        <input type="text" placeholder="Vehicle Registration" required>
                    ` : ''}
                    <label class="checkbox-label">
                        <input type="checkbox" required>
                        I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
                    </label>
                    <button type="submit" class="btn btn-primary btn-full">Sign Up</button>
                </form>
                <p class="modal-footer">
                    Already have an account? <a href="#" onclick="closeModal('signupModal'); showLoginModal()">Login</a>
                </p>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listener
    document.getElementById('signupForm').addEventListener('submit', (e) => handleSignup(e, userType));
}

function showPasswordResetModal() {
    const modalHTML = `
        <div class="modal-overlay" id="resetModal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal('resetModal')">&times;</button>
                <h2>Reset Password</h2>
                <p>Enter your email address and we'll send you a link to reset your password.</p>
                <form id="resetForm">
                    <input type="email" placeholder="Email" required>
                    <button type="submit" class="btn btn-primary btn-full">Send Reset Link</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('resetForm').addEventListener('submit', handlePasswordReset);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// Firebase Authentication Handlers
async function handleLogin(e) {
    e.preventDefault();
    
    const email = e.target[0].value;
    const password = e.target[1].value;
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('User logged in:', userCredential.user);
        alert('Login successful!');
        closeModal('loginModal');
        // Redirect to dashboard or update UI
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
}

async function handleSignup(e, userType) {
    e.preventDefault();
    
    const name = e.target[0].value;
    const email = e.target[1].value;
    const phone = e.target[2].value;
    const password = e.target[3].value;
    const confirmPassword = e.target[4].value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    try {
        // Create user account
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Update profile
        await userCredential.user.updateProfile({
            displayName: name
        });
        
        // Save additional user data to Firestore
        const userData = {
            name: name,
            email: email,
            phone: phone,
            userType: userType,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: userType === 'driver' ? 'pending' : 'active'
        };
        
        if (userType === 'driver') {
            userData.licenseNumber = e.target[5].value;
            userData.vehicleRegistration = e.target[6].value;
        }
        
        await db.collection('users').doc(userCredential.user.uid).set(userData);
        
        console.log('User created:', userCredential.user);
        alert(`${userType === 'driver' ? 'Driver' : 'Rider'} account created successfully!${userType === 'driver' ? ' Your application is pending review.' : ''}`);
        closeModal('signupModal');
        
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed: ' + error.message);
    }
}

async function handlePasswordReset(e) {
    e.preventDefault();
    
    const email = e.target[0].value;
    
    try {
        await auth.sendPasswordResetEmail(email);
        alert('Password reset email sent! Check your inbox.');
        closeModal('resetModal');
    } catch (error) {
        console.error('Password reset error:', error);
        alert('Error sending reset email: ' + error.message);
    }
}

// Auth State Observer
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User is signed in:', user.email);
        // Update UI for logged-in user
        updateUIForLoggedInUser(user);
    } else {
        console.log('No user signed in');
        // Update UI for logged-out user
        updateUIForLoggedOutUser();
    }
});

function updateUIForLoggedInUser(user) {
    // Update navigation buttons
    if (loginBtn) loginBtn.textContent = 'Dashboard';
    if (signupBtn) signupBtn.textContent = 'Logout';
    
    // Add logout functionality
    if (signupBtn) {
        signupBtn.onclick = async () => {
            try {
                await auth.signOut();
                alert('Logged out successfully');
            } catch (error) {
                console.error('Logout error:', error);
            }
        };
    }
}

function updateUIForLoggedOutUser() {
    // Reset navigation buttons
    if (loginBtn) loginBtn.textContent = 'Login';
    if (signupBtn) signupBtn.textContent = 'Sign Up';
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.benefit-card, .feature, .stat').forEach(el => {
    observer.observe(el);
});

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    .benefit-card,
    .feature,
    .stat {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        animation: slideUp 0.3s ease;
    }
    
    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #64748b;
        line-height: 1;
    }
    
    .modal-content h2 {
        margin-bottom: 1.5rem;
        color: var(--primary-color);
    }
    
    .modal-content form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .modal-content input {
        padding: 0.75rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 1rem;
    }
    
    .modal-content input:focus {
        outline: none;
        border-color: var(--primary-color);
    }
    
    .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.875rem;
    }
    
    .checkbox-label {
        font-size: 0.875rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .btn-full {
        width: 100%;
    }
    
    .modal-footer {
        margin-top: 1rem;
        text-align: center;
        font-size: 0.875rem;
        color: #64748b;
    }
    
    .modal-footer a {
        color: var(--primary-color);
        text-decoration: none;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Console welcome message
console.log('%cWelcome to SafeRide!', 'color: #1e40af; font-size: 24px; font-weight: bold;');
console.log('%cDriver-first rideshare platform', 'color: #10b981; font-size: 14px;');
