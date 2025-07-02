function fetchDataForKeyword(userid, containerpoap){
    const options = { method: 'GET', headers: { accept: 'application/json' } };
    const apiUrl = `https://testnet.rss3.io/data/accounts/${userid}/activities?limit=100&action_limit=10&platform=POAP`;

    fetch(apiUrl, options)
        .then(response => response.json())
        .then(response => {
            displayData(response, containerpoap);
            updateContainerHeight(containerpoap); // Update height after rendering data
        })
        .catch(err => console.error(err));
}

// Function to display data
function displayData(data, containerpoap) {
    // const container = document.getElementById('data-container'); // Ensure this is the correct ID
    containerpoap.innerHTML = ''; // Clear previous content

    if (!data.data || data.data.length === 0) {
        containerpoap.innerHTML = '<p>no POAPs to show.</p>'; // Display message
        return;
    } 

    data.data.forEach(item => {
        if (item.actions && item.actions.length > 0) {
            const action = item.actions[0];
            if (action.metadata) {
                const imageUrl = action.metadata.image_url;
                const id = action.metadata.id;
                const link = `https://collectors.poap.xyz/token/${id}`;
                const imageElement = document.createElement('img');
                imageElement.src = imageUrl;
                imageElement.style.cursor = 'pointer';
                imageElement.className = 'image-style';
                imageElement.onclick = () => window.open(link, '_blank');

                containerpoap.appendChild(imageElement);
            }
        }
    });
}

// Function to update container height based on its expanded/collapsed state
function updateContainerHeight(containerpoap) {
    // var container = document.querySelector('.container');
    if (containerpoap.classList.contains('expanded')) {
        var fullHeight = containerpoap.scrollHeight + 'px';
        containerpoap.style.height = fullHeight;
    } else {
        containerpoap.style.height = '150px';
    }
}

// Toggle button event listener
document.querySelectorAll('.poaps').forEach(poapSection => {
    const userid = poapSection.dataset.userid;
    const containerpoap = poapSection.querySelector('.containerpoap');
    
    // Fetch data for this section
    fetchDataForKeyword(userid, containerpoap);

    // Add toggle button event listener
    poapSection.querySelector('#toggleButtonpoap').addEventListener('click', function() {
        containerpoap.classList.toggle('expanded');
        updateContainerHeight(containerpoap);
    });

// Example usage
});