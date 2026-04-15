document.addEventListener('DOMContentLoaded', () => {

    const step1Container = document.getElementById('admin-step-1');
    const step2Container = document.getElementById('admin-step-2');
    const loginForm = document.getElementById('admin-login-form');
    const otpForm = document.getElementById('otp-form');
    const step1Error = document.getElementById('step-1-error');
    const step2Error = document.getElementById('step-2-error');
    const otpSentMsg = document.getElementById('otp-sent-msg');
    
    const otpInputs = document.querySelectorAll('.otp-digit');
    let currentAdminId = null; 

    // --- 6-BOX OTP LOGIC ---
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
            pastedData.forEach((char, i) => {
                if (otpInputs[i] && /[0-9]/.test(char)) {
                    otpInputs[i].value = char;
                    if (i < otpInputs.length - 1) otpInputs[i + 1].focus();
                }
            });
        });
    });

    // --- STEP 1: Verify Credentials ---
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const enteredId = document.getElementById('admin-id').value;
        const enteredPass = document.getElementById('admin-password').value;

        try {
            const response = await fetch('http://127.0.0.1:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin_id: enteredId, password: enteredPass })
            });
            const result = await response.json();

            if (result.success) {
                step1Error.textContent = "";
                currentAdminId = enteredId; 
                step1Container.classList.add('hidden');
                step2Container.classList.remove('hidden');
                otpSentMsg.textContent = result.message;
                otpInputs[0].focus(); 
            } else {
                step1Error.textContent = result.message; 
            }
        } catch (error) {
            step1Error.textContent = "Cannot connect to the server. Is app.py running?";
        }
    });

    // --- STEP 2: Verify OTP ---
    otpForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const enteredOTP = Array.from(otpInputs).map(input => input.value).join('');

        if (enteredOTP.length !== 6) {
            step2Error.textContent = "Please enter all 6 digits.";
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin_id: currentAdminId, otp: enteredOTP })
            });
            const result = await response.json();

            if (result.success) {
                // THE FIX IS RIGHT HERE! It already says currentAdminId
                sessionStorage.setItem('loggedInAdmin', currentAdminId); 
                
                alert(result.message + " Redirecting to Dashboard.");
                window.location.href = 'admin-dashboard.html'; 
            } else {
                step2Error.textContent = result.message; 
                otpInputs.forEach(input => input.value = "");
                otpInputs[0].focus();
            }
        } catch (error) {
            step2Error.textContent = "Cannot connect to the server.";
        }
    });

    // --- Cancel / Back Button ---
    document.getElementById('btn-back-login').addEventListener('click', function() {
        step2Container.classList.add('hidden');
        step1Container.classList.remove('hidden');
        otpInputs.forEach(input => input.value = "");
        step2Error.textContent = "";
        currentAdminId = null;
    });
});