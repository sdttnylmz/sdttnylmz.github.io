function processMarkdown(markdown) {
    const converter = new showdown.Converter();

let html = converter.makeHtml(markdown);

// Create a virtual DOM to manipulate
const parser = new DOMParser();
const doc = parser.parseFromString(html, 'text/html');

// Process images to ensure they are displayed correctly
doc.querySelectorAll('img').forEach(img => {
img.outerHTML = `<img src="${img.src}" alt="${img.alt.replace(/"/g, '&quot;')}"  class="image"/>`;
});

// Regular expression to match standalone URLs (not part of Markdown links or images)
const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

// Find all text nodes and process standalone URLs to embeds
const walk = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null, false);
let node;
const nodesToRemove = [];
while (node = walk.nextNode()) {
let text = node.nodeValue;
let replacedText = text.replace(urlRegex, (url) => {
    // Skip URLs that are part of Markdown links or images
    if (text.includes(`](${url})`) || text.includes(`![](${url})`)) {
        return url;
    } else {
        // Convert standalone URLs to embed format
        return `<blockquote class="embedly-card" data-card-controls="0" data-card-key="1d5c48f7edc34c54bdae4c37b681ea2b"><h4><a href="${url}"></a></h4></blockquote>`;
    }
});

// If changes were made, replace the current text node with the new HTML
if (replacedText !== text) {
    let div = document.createElement('div');
    div.innerHTML = replacedText;
    while (div.firstChild) {
        node.parentNode.insertBefore(div.firstChild, node);
    }
    // node.parentNode.removeChild(node);
    nodesToRemove.push(node);
}
}
nodesToRemove.forEach(node=> node.parentNode.removeChild(node));
// Return the processed HTML
return doc.body.innerHTML;
} 

function convertIpfsUrlToHttp(url) {
if (url.startsWith('ipfs://')) {
    return `https://1w3.spheron.link/ipfs/${url.slice(7)}`;
}
return url; // return the original URL if it's not an IPFS URL
}


document.addEventListener('DOMContentLoaded', function() {
    // Get the element and the account ID
    var myElement = document.getElementById("myElement");
    var accountID = myElement.getAttribute("data-accountID");


const options = { method: 'GET', headers: { accept: 'application/json' } };

fetch(`https://testnet.rss3.io/data/accounts/${encodeURIComponent(accountID)}/activities?limit=100&action_limit=10&platform=Mirror`, options)
    .then(response => response.json())
    .then(data => {
        const activities = data.data;
        const uniquePublications = new Set();
        const cardContainer = document.getElementById('cardContainer');

        activities.forEach(activity => {
            const publicationId = activity.actions[0].metadata.publication_id;
            if (!uniquePublications.has(publicationId)) {
                uniquePublications.add(publicationId);

                let fullBodyContent = processMarkdown(activity.actions[0].metadata.body);

                const truncatedBodyContent = fullBodyContent.slice(0, 200) + '...';

                let mediaContent = '';

if (activity.actions[0].metadata.media) {
mediaContent = activity.actions[0].metadata.media.map(media => {
const httpUrl = convertIpfsUrlToHttp(media.address);
return `<img src="${httpUrl}" alt="Media Content" class="photo" />`;
}).join('');
}


                const card = document.createElement('div');
                card.className = 'card-mirror';
                card.innerHTML = `
                    <h3>${activity.actions[0].metadata.title}</h3>
                    <div>${truncatedBodyContent}</div>
                    <small>${new Date(activity.timestamp * 1000).toLocaleString()}</small>
                `;
                card.addEventListener('click', () => {
                    // document.getElementById('popupTitle').textContent = activity.actions[0].metadata.title;
                    // document.getElementById('popupTimestamp').textContent = new Date(activity.timestamp * 1000).toLocaleString();
                    // document.getElementById('popupBody').innerHTML = mediaContent + fullBodyContent;
                    // document.getElementById('popup').style.display = 'block';
                    if (mediaContent) {
                    // If there is media content, display only the media
                    document.getElementById('popupBody').innerHTML = mediaContent + fullBodyContent;
                    //document.getElementById('popupTimestamp').textContent = new Date(activity.timestamp * 1000).toLocaleString();
                    
                } else {
                    // If there is no media content, display the title and body
                    document.getElementById('popupTitle').textContent = activity.actions[0].metadata.title;
                    // document.getElementById('popupTimestamp').textContent = new Date(activity.timestamp * 1000).toLocaleString();
                    document.getElementById('popupBody').innerHTML = fullBodyContent;
                }
                document.getElementById('popup').style.display = 'block';
                });
                cardContainer.appendChild(card);
            }
        });
    })
    .catch(err => console.error(err));

document.getElementById('closePopup').addEventListener('click', () => {
    document.getElementById('popup').style.display = 'none';
});
});