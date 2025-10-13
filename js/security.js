// Website Security Enhancements
class WebsiteSecurity {
    constructor() {
        this.csrfToken = this.generateCSRFToken();
        this.init();
    }

    init() {
        this.enhanceFormSecurity();
        this.setupFileUploadValidation();
        this.addSecurityIndicators();
        this.setupPasswordVisibilityToggle();
    }

    // Form Security
    enhanceFormSecurity() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Add CSRF protection
            if (!form.querySelector('[name="csrf_token"]')) {
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = 'csrf_token';
                csrfInput.value = this.csrfToken;
                form.appendChild(csrfInput);
            }

            // Add form submission protection
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    this.showSecurityMessage('Please fix form errors before submitting.', 'error');
                }
            });

            // Real-time input validation
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    // File Upload Security
    setupFileUploadValidation() {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.validateFileUpload(e.target);
            });

            // Add file type restrictions
            if (!input.accept) {
                input.accept = '.jpg,.jpeg,.png,.pdf,.doc,.docx';
            }
        });
    }

    validateFileUpload(input) {
        const file = input.files[0];
        if (!file) return true;

        const allowedTypes = [
            'image/jpeg', 
            'image/png', 
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        const maxSize = 5 * 1024 * 1024; // 5MB
        const maxSizeReadable = '5MB';

        // File type validation
        if (!allowedTypes.includes(file.type)) {
            this.showFieldError(input, `Invalid file type. Allowed: JPG, PNG, PDF, DOC (max ${maxSizeReadable})`);
            input.value = '';
            return false;
        }

        // File size validation
        if (file.size > maxSize) {
            this.showFieldError(input, `File too large. Maximum size is ${maxSizeReadable}`);
            input.value = '';
            return false;
        }

        this.clearFieldError(input);
        this.showSecurityMessage('File looks good!', 'success');
        return true;
    }

    // Field Validation
    validateField(field) {
        const value = field.value.trim();
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }

        // Required field validation
        if (field.required && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }

        this.clearFieldError(field);
        return true;
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Security UI Helpers
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error security-warning';
        errorDiv.textContent = message;
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.style.padding = '5px 10px';
        
        field.parentNode.appendChild(errorDiv);
        field.classList.add('error');
    }

    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.classList.remove('error');
    }

    showSecurityMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.security-message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `security-message security-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '20px';
        messageDiv.style.right = '20px';
        messageDiv.style.zIndex = '10000';
        messageDiv.style.maxWidth = '300px';
        messageDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';

        document.body.appendChild(messageDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Security Indicators
    addSecurityIndicators() {
        // Add HTTPS indicators to secure links
        const secureLinks = document.querySelectorAll('a[href^="https://"]');
        secureLinks.forEach(link => {
            if (!link.querySelector('.secure-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'secure-indicator';
                indicator.textContent = ' 🔒';
                indicator.title = 'Secure connection';
                link.appendChild(indicator);
            }
        });
    }

    // Password Visibility Toggle
    setupPasswordVisibilityToggle() {
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        
        passwordInputs.forEach(input => {
            const toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = 'password-toggle';
            toggle.textContent = '👁️';
            toggle.style.background = 'none';
            toggle.style.border = 'none';
            toggle.style.cursor = 'pointer';
            toggle.style.position = 'absolute';
            toggle.style.right = '10px';
            toggle.style.top = '50%';
            toggle.style.transform = 'translateY(-50%)';
            
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';
            wrapper.style.width = '100%';
            
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
            wrapper.appendChild(toggle);

            toggle.addEventListener('click', () => {
                if (input.type === 'password') {
                    input.type = 'text';
                    toggle.textContent = '🔒';
                } else {
                    input.type = 'password';
                    toggle.textContent = '👁️';
                }
            });
        });
    }

    // Utility Functions
    generateCSRFToken() {
        return 'csrf_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    }

    sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// Initialize security when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.websiteSecurity = new WebsiteSecurity();
    console.log('🔒 Security features loaded successfully!');
});
