const dummyVoters = [
    {
        voterId: "V101",
        password: "pass123",
        name: "Rahul Sharma",
        fatherName: "Ajay Sharma",
        address: "Singur Market, Hooghly, West Bengal",
        contact: "9876543210",
        state: "West Bengal",
        constituencyName: "Singur",
        constituencyNumber: "188"
    },
    {
        voterId: "V102",
        password: "pass123",
        name: "Priya Patel",
        fatherName: "Ramesh Patel",
        address: "45, SG Highway, Ahmedabad, Gujarat",
        contact: "8765432109",
        state: "Gujarat",
        constituencyName: "Gandhinagar",
        constituencyNumber: "06"
    },
    {
        voterId: "V103",
        password: "pass123",
        name: "Amit Singh",
        fatherName: "Vikram Singh",
        address: "78, Civil Lines, Kolathur, Tamil Nadu",
        state: "Tamil Nadu",
        contact: "7654321098",
        constituencyName: "Kolathur",
        constituencyNumber: "07"
    },
    {
        voterId: "V104",
        password: "pass123",
        name: "Chandrajit Banerjee",
        fatherName: "Avijit Banerjee",
        address: "90, Esplanade, Kolkata, West Bengal",
        contact: "6543210987",
        state: "West Bengal",
        constituencyName: "Chowrangee",
        constituencyNumber: "18"
    },
    {
        voterId: "V106",
        password: "pass123",
        name: "Rahul Santra",
        fatherName: "Ajay Santra",
        address: "Singur Market, Hooghly, West Bengal",
        contact: "9876583210",
        state: "West Bengal",
        constituencyName: "Singur",
        constituencyNumber: "188"
    },
    {
        voterId: "V105",
        password: "pass123",
        name: "Karan Gupta",
        fatherName: "Sanjay Gupta",
        address: "22, Connaught Place, New Delhi",
        contact: "9988776655",
        state: "Delhi",
        constituencyName: "New Delhi",
        constituencyNumber: "04"
    }
];
// PUT THIS IN YOUR VOTER JAVASCRIPT FILE!
// const constituencyDatabase = {
//     "Singur": [
//         { name: "Debasish Chatterjee", symbolUrl: "cmip.png" },
//         { name: "Becharam Manna", symbolUrl: "aitc.png" },
//         { name: "Dr. Arup Kumar Das", symbolUrl: "bjp.png" },
//         { name: "Barun Kumar Malik", symbolUrl: "inc.png" }
//     ],
//     "Gandhinagar": [
//         { name: "Amit Shah", symbolUrl: "bjp.png" },
//         { name: "Sonal Patel", symbolUrl: "inc.png" }
//     ],
//     "Kolathur": [
//         { name: "Muthuvel Karunanidhi Stalin", symbolUrl: "dmk.webp" },
//         { name: "Santhana Krishnan", symbolUrl: "aiadmk.jpg" },
//         { name: "Soundara Pandian Louther Seth", symbolUrl: "ntk.webp" },
//         { name: "V. S. Babu", symbolUrl: "tvk.jpg" }
//     ],
//     "Chowrangee": [
//         { name: "Nayna Bandopadhyay", symbolUrl: "aitc.png" },
//         { name: "Manash Sarkar", symbolUrl: "inc.png" },
//         { name: "Santosh Pathak", symbolUrl: "bjp.png" },
//         { name: "Sanjoy Basu", symbolUrl: "cmip.png" }
//     ],
//     "New Delhi": [
//         { name: "Parvesh Sahib Singh Verma", symbolUrl: "bjp.png" },
//         { name: "Arvind Kejriwal", symbolUrl: "aap.jpg" },
//         { name: "Sandeep Dikshit", symbolUrl: "inc.png" }
//     ]
// };

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const enteredId = document.getElementById('voter-id').value;
    const enteredPass = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-message');

    const user = dummyVoters.find(v => v.voterId === enteredId && v.password === enteredPass);

    if (user) {
        sessionStorage.setItem('loggedInVoter', JSON.stringify(user));
        window.location.href = 'voter.html';
    } else {
        errorMsg.textContent = "Invalid Voter ID or Password.";
    }
});