const constituencyDatabase = {
    "Singur": [
        { name: "Debasish Chatterjee", party: "CMIP", symbolUrl: "cmip.png" },
        { name: "Becharam Manna", party: "AITC", symbolUrl: "aitc.png" },
        { name: "Dr. Arup Kumar Das", party: "BJP", symbolUrl: "bjp.png" },
        { name: "Barun Kumar Malik", party: "INC", symbolUrl: "inc.png" }
    ],
    "Gandhinagar": [
        { name: "Amit Shah", party: "BJP", symbolUrl: "symbols/lotus.png" },
        { name: "Sonal Patel", party: "INC", symbolUrl: "symbols/hand.png" }
    ],
    "Kolathur": [
        { name: "Muthuvel Karunanidhi Stalin", party: "DMK", symbolUrl: "dmk.webp" },
        { name: "Santhana Krishnan", party: "AIADMK", symbolUrl: "aiadmk.jpg" },
        { name: "Soundara Pandian Louther Seth", party: "NTK", symbolUrl: "ntk.webp" },
        { name: "V. S. Babu", party: "TVK", symbolUrl: "tvk.jpg" }
    ],
    "Chowrangee": [
        { name: "Nayna Bandopadhyay", party: "AITC", symbolUrl: "aitc.png" },
        { name: "Manash Sarkar", party: "INC", symbolUrl: "inc.png" },
        { name: "Santosh Pathak", party: "BJP", symbolUrl: "bjp.png" },
        { name: "Sanjoy Basu", party: "CMIP", symbolUrl: "cmip.png" }
    ],
    "New Delhi": [
        { name: "Parvesh Sahib Singh Verma", party: "BJP", symbolUrl: "bjp.png" },
        { name: "Arvind Kejriwal", party: "AAP", symbolUrl: "aap.jpg" },
        { name: "Sandeep Dikshit", party: "INC", symbolUrl: "inc.png" }
    ]
};

async function castVote(candidateName) {
    try {
        const response = await fetch('https://evoting2.onrender.com/api/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ candidate: candidateName })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert("Vote successfully recorded for " + candidateName);
        } else {
            alert("Failed to record vote. Please try again.");
        }
    } catch (error) {
        alert("Server error. Please ensure the backend is running.");
        console.error("Voting Error:", error);
    }
}
