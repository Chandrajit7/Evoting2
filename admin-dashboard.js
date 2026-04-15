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
            const response = await fetch('http://127.0.0.1:5000/api/results');
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
            const response = await fetch('http://127.0.0.1:5000/api/results');
            votesDB = await response.json();
        } catch (error) {
            console.error("Error fetching votes:", error);
        }
        
        let partyVotes = {};
        let totalStateVotes = 0;

        masterCandidateList.forEach(candidate => {
            if (selectedState === "All" || candidate.state === selectedState) {
                const votes = votesDB[candidate.name] || 0;
                totalStateVotes += votes;
                
                if (!partyVotes[candidate.party]) {
                    partyVotes[candidate.party] = 0;
                }
                partyVotes[candidate.party] += votes;
            }
        });

        let partyArray = Object.keys(partyVotes).map(party => {
            return { party: party, votes: partyVotes[party] };
        });

        partyArray.sort((a, b) => b.votes - a.votes);

        const maxVotes = partyArray.length > 0 ? partyArray[0].votes : 0;

        if (totalStateVotes === 0) {
            leadingPartyBanner.innerHTML = `Waiting for votes to be cast in <b>${selectedState}</b>.`;
            leadingPartyBanner.style.borderLeftColor = "#6c757d";
        } else {
            const leadingParty = partyArray[0].party;
            leadingPartyBanner.innerHTML = `⭐ The <b>${leadingParty}</b> is currently leading the overall tally in <b>${selectedState}</b>!`;
            leadingPartyBanner.style.borderLeftColor = "#28a745";
        }

        partyArray.forEach(p => {
            const tr = document.createElement('tr');
            
            let percentage = 0;
            if (totalStateVotes > 0) {
                percentage = ((p.votes / totalStateVotes) * 100).toFixed(1);
            }

            let statusHtml = `<span style="color: #6c757d;">-</span>`;
            if (p.votes === maxVotes && p.votes > 0) {
                tr.classList.add('leader-row'); 
                statusHtml = `⭐ <span style="color: #28a745; font-weight: bold;">Leading</span>`;
            }

            tr.innerHTML = `
                <td style="font-weight: bold; font-size: 16px;">${p.party}</td>
                <td style="font-size: 18px;">${p.votes}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 45px; font-weight: bold;">${percentage}%</span>
                        <div style="background: #e9ecef; width: 100%; height: 10px; border-radius: 5px; overflow: hidden;">
                            <div style="background: #007bff; width: ${percentage}%; height: 100%;"></div>
                        </div>
                    </div>
                </td>
                <td>${statusHtml}</td>
            `;
            tallyTableBody.appendChild(tr);
        });
    }

    stateFilter.addEventListener('change', (e) => {
        updateConstituencyDropdown(e.target.value);
        loadVotingData(e.target.value, "All"); 
    });
    
    constituencyFilter.addEventListener('change', () => {
        loadVotingData(stateFilter.value, constituencyFilter.value);
    });
    
    tallyStateFilter.addEventListener('change', (e) => {
        loadStateTally(e.target.value);
    });

    document.getElementById('btn-refresh').addEventListener('click', () => {
        loadVotingData(stateFilter.value, constituencyFilter.value);
    });

    document.getElementById('btn-admin-logout').addEventListener('click', () => {
        sessionStorage.removeItem('loggedInAdmin');
        window.location.href = 'index.html';
    });

    const eciResetBtn = document.getElementById('btn-eci-reset');
    
    if (loggedInUser === 'eci') {
        eciResetBtn.classList.remove('hidden');
    }

    eciResetBtn.addEventListener('click', async () => {
        const confirmFirst = confirm("🚨 WARNING: You are about to wipe ALL election data. This cannot be undone. Proceed?");
        
        if (confirmFirst) {
            const confirmSecond = confirm("FINAL WARNING: Are you absolutely sure? Type OK to delete all votes.");
            if (confirmSecond) {
                await fetch('http://127.0.0.1:5000/api/reset', { method: 'POST' });
                loadVotingData(stateFilter.value, constituencyFilter.value);
                loadStateTally(tallyStateFilter.value);
                alert("Election Data has been completely reset by ECI Command.");
            }
        }
    });

    updateConstituencyDropdown("All"); 
    loadVotingData("All", "All"); 
});