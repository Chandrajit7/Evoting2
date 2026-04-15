document.addEventListener('DOMContentLoaded', () => {
    const userData = sessionStorage.getItem('loggedInVoter');
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }

    const currentUser = JSON.parse(userData);
    const dashboardContainer = document.getElementById('dashboard-container');
    const profileContainer = document.getElementById('profile-container');
    const editProfileContainer = document.getElementById('edit-profile-container');
    const editProfileForm = document.getElementById('edit-profile-form');

    function updateUI() {
        document.getElementById('welcome-name').textContent = currentUser.name;
        document.getElementById('p-name').textContent = currentUser.name;
        document.getElementById('p-father').textContent = currentUser.fatherName;
        document.getElementById('p-address').textContent = currentUser.address;
        document.getElementById('p-contact').textContent = currentUser.contact;
        document.getElementById('p-const-name').textContent = currentUser.constituencyName;
        document.getElementById('p-const-no').textContent = currentUser.constituencyNumber;
    }

    updateUI();

    document.getElementById('btn-profile').addEventListener('click', function() {
        dashboardContainer.classList.add('hidden');
        profileContainer.classList.remove('hidden');
    });

    document.getElementById('btn-back-dashboard').addEventListener('click', function() {
        profileContainer.classList.add('hidden');
        dashboardContainer.classList.remove('hidden');
    });

    document.getElementById('btn-cast-vote').addEventListener('click', function() {
        if (currentUser.hasVoted) {
            alert("You have already cast your vote! Multiple votes are not allowed.");
        } else {
            window.location.href = 'castvote.html';
        }
    });

    document.getElementById('btn-edit-profile').addEventListener('click', function() {
        profileContainer.classList.add('hidden');
        editProfileContainer.classList.remove('hidden');
        document.getElementById('edit-name').value = currentUser.name;
        document.getElementById('edit-father').value = currentUser.fatherName;
        document.getElementById('edit-address').value = currentUser.address;
        document.getElementById('edit-contact').value = currentUser.contact;
    });

    document.getElementById('btn-cancel-edit').addEventListener('click', function() {
        editProfileContainer.classList.add('hidden');
        profileContainer.classList.remove('hidden');
    });

    editProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        currentUser.name = document.getElementById('edit-name').value;
        currentUser.fatherName = document.getElementById('edit-father').value;
        currentUser.address = document.getElementById('edit-address').value;
        currentUser.contact = document.getElementById('edit-contact').value;
        sessionStorage.setItem('loggedInVoter', JSON.stringify(currentUser));
        updateUI();
        editProfileContainer.classList.add('hidden');
        profileContainer.classList.remove('hidden');
        alert("Profile updated successfully!");
    });

    document.getElementById('btn-logout').addEventListener('click', function() {
        sessionStorage.removeItem('loggedInVoter');
        window.location.href = 'login.html';
    });
});