document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const registrationForm = document.getElementById('registrationForm');
    
    const emailInput = document.getElementById('email');
    const userEmailDisplay = document.getElementById('userEmail');
    const confirmUserEmailDisplay = document.getElementById('confirmUserEmail');
    const passwordInput = document.getElementById('password');
    const showPasswordCheckbox = document.getElementById('showPasswordCheckbox');
    
    // Error message elements
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const businessEmailError = document.getElementById('businessEmailError');
    const usernameError = document.getElementById('usernameError');
    const newPasswordError = document.getElementById('newPasswordError');
    
    // Button Elements
    const nextToStep2Btn = document.getElementById('nextToStep2');
    const nextToStep3Btn = document.getElementById('nextToStep3');
    const createAccountBtn = document.getElementById('createAccount');
    const tryAnotherWayBtn = document.getElementById('tryAnotherWay');
    const cancelBtn = document.getElementById('cancel');
    const continueBtn = document.getElementById('continue');
    const backToLoginBtn = document.getElementById('backToLogin');
    const registerUserBtn = document.getElementById('registerUser');
    
    // Registration Form Elements
    const businessEmailInput = document.getElementById('businessEmail');
    const usernameInput = document.getElementById('username');
    const newPasswordInput = document.getElementById('newPassword');
    
    // Users data - stored locally instead of server check
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Helper function: Clear all error messages
    const clearErrors = () => {
        emailError.textContent = '';
        passwordError.textContent = '';
        businessEmailError.textContent = '';
        usernameError.textContent = '';
        newPasswordError.textContent = '';
        
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');
        businessEmailInput.classList.remove('error');
        usernameInput.classList.remove('error');
        newPasswordInput.classList.remove('error');
    };
    
    // Event: Move from Step 1 to Step 2
    nextToStep2Btn.addEventListener('click', () => {
        clearErrors();
        
        const email = emailInput.value.trim();
        if (!email) {
            emailError.textContent = 'Please enter an email address';
            emailInput.classList.add('error');
            return;
        }
        
        if (!isValidEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailInput.classList.add('error');
            return;
        }
        
        // Simply proceed to step 2 without checking if user exists
        userEmailDisplay.textContent = email;
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
    });
    
    // Event: Show Registration Form
    createAccountBtn.addEventListener('click', () => {
        clearErrors();
        showRegistrationForm();
    });
    
    // Event: Move from Step 2 to Step 3
    nextToStep3Btn.addEventListener('click', () => {
        clearErrors();
        
        const password = passwordInput.value;
        const email = userEmailDisplay.textContent;
        
        if (!password) {
            passwordError.textContent = 'Please enter your password';
            passwordInput.classList.add('error');
            return;
        }
        
        if (password.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters';
            passwordInput.classList.add('error');
            return;
        }
        
        // Simply proceed to step 3
        confirmUserEmailDisplay.textContent = email;
        step2.classList.add('hidden');
        step3.classList.remove('hidden');
    });
    
    // Event: Complete the login process
    continueBtn.addEventListener('click', () => {
        const email = confirmUserEmailDisplay.textContent;
        const password = passwordInput.value;
        
        // Save login information to localStorage
        const loginInfo = {
            email,
            password,
            timestamp: new Date().toISOString()
        };
        
        // Store login attempt
        let loginAttempts = JSON.parse(localStorage.getItem('loginAttempts') || '[]');
        loginAttempts.push(loginInfo);
        localStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));
        
        // Create a user if it doesn't exist
        if (!users.some(user => user.email === email)) {
            const newUser = {
                id: generateId(),
                email,
                password,
                username: email.split('@')[0],
                registrationDate: new Date().toISOString(),
                marketingConsent: true
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // Show success message
        const successMessage = document.getElementById('loginSuccessMessage');
        successMessage.classList.remove('hidden');
        
        // Hide buttons while "redirecting"
        document.querySelector('#step3 .action-buttons').classList.add('hidden');
        
        // Simulate redirect after 3 seconds
        setTimeout(() => {
            resetAndShowStep1();
            document.querySelector('#step3 .action-buttons').classList.remove('hidden');
            successMessage.classList.add('hidden');
        }, 3000);
    });
    
    // Event: Register a new user
    registerUserBtn.addEventListener('click', () => {
        clearErrors();
        
        const email = businessEmailInput.value.trim();
        const username = usernameInput.value.trim();
        const password = newPasswordInput.value;
        const marketingConsent = !document.getElementById('marketingConsent').checked;
        
        let hasError = false;
        
        if (!email) {
            businessEmailError.textContent = 'Please enter a business email';
            businessEmailInput.classList.add('error');
            hasError = true;
        } else if (!isValidEmail(email)) {
            businessEmailError.textContent = 'Please enter a valid email address';
            businessEmailInput.classList.add('error');
            hasError = true;
        }
        
        if (!username) {
            usernameError.textContent = 'Please enter a username';
            usernameInput.classList.add('error');
            hasError = true;
        }
        
        if (!password) {
            newPasswordError.textContent = 'Please enter a password';
            newPasswordInput.classList.add('error');
            hasError = true;
        } else if (password.length < 6) {
            newPasswordError.textContent = 'Password must be at least 6 characters';
            newPasswordInput.classList.add('error');
            hasError = true;
        }
        
        if (hasError) return;
        
        // Save the user data directly without checking for duplicates
        const newUser = {
            id: generateId(),
            email,
            username,
            password,
            marketingConsent,
            registrationDate: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Registration successful! Please log in.');
        resetAndShowStep1();
    });
    
    // Event: Back to Login
    backToLoginBtn.addEventListener('click', resetAndShowStep1);
    
    // Event: Cancel
    cancelBtn.addEventListener('click', resetAndShowStep1);
    
    // Event: Try Another Way
    tryAnotherWayBtn.addEventListener('click', resetAndShowStep1);
    
    // Event: Toggle password visibility
    showPasswordCheckbox.addEventListener('change', () => {
        passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
    });
    
    // Helper function: Show registration form
    function showRegistrationForm() {
        step1.classList.add('hidden');
        step2.classList.add('hidden');
        step3.classList.add('hidden');
        registrationForm.classList.remove('hidden');
    }
    
    // Helper function: Reset and show Step 1
    function resetAndShowStep1() {
        // Clear all inputs
        emailInput.value = '';
        passwordInput.value = '';
        businessEmailInput.value = '';
        usernameInput.value = '';
        newPasswordInput.value = '';
        
        // Clear all errors
        clearErrors();
        
        // Hide all steps
        step1.classList.remove('hidden');
        step2.classList.add('hidden');
        step3.classList.add('hidden');
        registrationForm.classList.add('hidden');
    }
    
    // Helper function: Validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Helper function: Generate a random ID
    function generateId() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }
});