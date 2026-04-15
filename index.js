document.addEventListener('DOMContentLoaded', () => {
    
    const voterBtn = document.getElementById('voterBtn');
    const adminBtn = document.getElementById('adminBtn');

    voterBtn.addEventListener('click', () => {
        alert('Voter clicked');
        // Add navigation logic here, e.g., window.location.href = 'voter.html';
    });

    adminBtn.addEventListener('click', () => {
        alert('Admin clicked');
        // Add navigation logic here, e.g., window.location.href = 'admin.html';
    });
    
});