document.addEventListener('DOMContentLoaded', () => {

    const loggedInUser = sessionStorage.getItem('loggedInAdmin');
    if (!loggedInUser) {
        alert("Unauthorized Access. Please log in.");
        window.location.href = 'admin-login.html';
        return;
    }

    const constituencyDatabase = {
        "Singur": [
            { name: "Debasish Chatterjee", party: "CMIP" },
            { name: "Becharam Manna", party: "AITC" },
            { name: "Dr. Arup Kumar Das", party: "BJP" },
            { name: "Barun Kumar Malik", party: "INC" }
        ],
        "Gandhinagar": [
            { name: "Amit Shah", party: "BJP" },
            { name: "Sonal Patel", party: "INC" }
        ],
        "Kolathur": [
            { name: "Muthuvel Karunanidhi Stalin", party: "DMK" },
            { name: "Santhana Krishnan", party: "AIADMK" },
            { name: "Soundara Pandian Louther Seth", party: "NTK" },
            { name: "V. S. Babu", party: "TVK" }
        ],
        "Chowrangee": [
            { name: "Nayna Bandopadhyay", party: "AITC" },
            { name: "Manash Sarkar", party: "INC" },
            { name: "Santosh Pathak", party: "BJP" },
            { name: "Sanjoy Basu", party: "CMIP" }
        ],
        "New Delhi": [
            { name: "Parvesh Sahib Singh Verma", party: "BJP" },
            { name: "Arvind Kejriwal", party: "AAP" },
            { name: "Sandeep Dikshit", party: "INC" }
        ]
    };

    const stateMapping = {
        "Singur": "West Bengal",
        "Chowrangee": "West Bengal",
        "Gandhinagar": "Gujarat",
        "Kolathur": "Tamil Nadu",
        "New Delhi": "Delhi"
    };

    const masterCandidateList = [];
    for (const [constituency, candidates] of Object.entries(constituencyDatabase)) {
        candidates.forEach(c => {
            masterCandidateList.push({
                name: c.name,
                party: c.party,
                constituency: constituency,
                state: stateMapping[constituency]
            });
        });
    }

    const viewLiveDashboard = document.getElementById('view-live-dashboard');
    const viewStateTally = document.getElementById('view-state-tally');
    
    const navLive = document.getElementById('nav-live');
    const navTally = document.getElementById('nav-tally');
    const pageTitle = document.getElementById('page-title');

    const tableBody = document.getElementById('results-table-body');
    const tallyTableBody = document.getElementById('tally-table-body');
    const totalVotesElement = document.getElementById('total-votes-count');
    const leadingPartyBanner = document.getElementById('leading-party-banner');

    const stateFilter = document.getElementById('state-filter'); 
    const constituencyFilter = document.getElementById('constituency-filter');
    const tallyStateFilter = document.getElementById('tally-state-filter');

    navLive.addEventListener('click', (e) => {
        e.preventDefault();
        navTally.classList.remove('active');
        navLive.classList.add('active');
        viewStateTally.classList.add('hidden');
        viewLiveDashboard.classList.remove('hidden');
        pageTitle.textContent = "Election Overview";
    });

    navTally.addEventListener('click', (e) => {
        e.preventDefault();
        navLive.classList.remove('active');
        navTally.classList.add('active');
        viewLiveDashboard.classList.add('hidden');
        viewStateTally.classList.remove('hidden');
        pageTitle.textContent = "State-wise Tally & Percentages";
        loadStateTally(tallyStateFilter.value); 
    });

    function updateConstituencyDropdown(selectedState) {
        constituencyFilter.innerHTML = `<option value="All">🏙️ All Constituencies</option>`;
        let validConstituencies = selectedState === "All" ? Object.keys(stateMapping) : Object.keys(stateMapping).filter(c => stateMapping[c] === selectedState);
        validConstituencies.forEach(c => {
            const option = document.createElement('option');
            option.value = c; option.textContent = c;
            constituencyFilter.appendChild(option);
        });
    }

    async function loadVotingData(selectedState = "All", selectedConstituency = "All") {
        tableBody.innerHTML = "";
        
        let votesDB = {};
        try {
            const response = await fetch('https://evoting2.onrender.com/api/results');
            votesDB = await response.json();
        } catch (error) {
            console.error("Error fetching votes:", error);
        }
        
        let totalVotesOverall = 0;

        let candidatesArray = masterCandidateList.map(candidate => {
            const candidateVotes = votesDB[candidate.name] || 0;
            totalVotesOverall += candidateVotes;
            return { ...candidate, votes: candidateVotes };
        });

        if (selectedState !== "All") candidatesArray = candidatesArray.filter(c => c.state === selectedState);
        if (selectedConstituency !== "All") candidatesArray = candidatesArray.filter(c => c.constituency === selectedConstituency);

        const maxVotesPerConstituency = {};
        candidatesArray.forEach(c => {
            if (!maxVotesPerConstituency[c.constituency] || c.votes > maxVotesPerConstituency[c.constituency]) {
                maxVotesPerConstituency[c.constituency] = c.votes;
            }
        });

        candidatesArray.sort((a, b) => {
            if (a.state !== b.state) return a.state.localeCompare(b.state);
            if (a.constituency !== b.constituency) return a.constituency.localeCompare(b.constituency);
            return b.votes - a.votes; 
        });

        candidatesArray.forEach(c => {
            const tr = document.createElement('tr');
            const isLeading = c.votes === maxVotesPerConstituency[c.constituency] && c.votes > 0;
            if (isLeading) tr.classList.add('leader-row');

            let statusHtml = `<span style="color: #6c757d;">Pending</span>`;
            if (isLeading) statusHtml = `⭐ <span style="color: #28a745; font-weight: bold;">Leading in ${c.constituency}</span>`;

            tr.innerHTML = `
                <td style="font-weight: 500;">${c.name}</td>
                <td style="color: #6c757d;">${c.state}</td>
                <td style="color: #007bff; font-weight: bold;">${c.constituency}</td>
                <td style="font-size: 18px;">${c.votes}</td>
                <td>${statusHtml}</td>
            `;
            tableBody.appendChild(tr);
        });

        totalVotesElement.textContent = totalVotesOverall;
        if (candidatesArray.length === 0) tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px;">No data available.</td></tr>`;
    }

    async function loadStateTally(selectedState) {
        tallyTableBody.innerHTML = "";
        
        let votesDB = {};
        try {
            const response = await fetch('https://evoting2.onrender.com/api/results');
            votesDB = await response.json();
        } catch (error) {
            console.error("Error fetching votes:", error);
        }
