const axios = require('axios');
const cheerio = require('cheerio');

// Object to store names and their occurrences
const memberMap = {};

/*
async function scrapeURL(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        let programCommitteeFound = false;

        $('h3, .views-field-field-speakers-institution').each(function () {
            const text = $(this).text().trim();

            if (text === 'Program Committee' || text === 'Technical Program Committee') {
                programCommitteeFound = true;
            }

            if (programCommitteeFound && $(this).hasClass('views-field-field-speakers-institution')) {
                const name = extractName(text);
                if (name) {
                    memberMap[name] = (memberMap[name] || 0) + 1;
                }
            }
        });
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
    }
}
*/

async function scrapeURL(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        let programCommitteeFound = false;

        // Check for different types of HTML structures
        $('h3, .views-field-field-speakers-institution, .tpct td').each(function () {
            const text = $(this).text().trim();

            // Check for 'Program Committee' in the text for the first type of structure
            if (text === 'Program Committee' || text.includes('Technical Program Committee')) {
                programCommitteeFound = true;
            }

            // Extract names for the first type of structure
            if (programCommitteeFound && $(this).hasClass('views-field-field-speakers-institution')) {
                const name = extractName(text);
                if (name) {
                    memberMap[name] = (memberMap[name] || 0) + 1;
                }
            }

            // Extract names for the second type of structure (new HTML structure)
            if ($(this).is('.tpct td') && !$(this).hasClass('zm-grey') && !$(this).hasClass('zm-lightgrey')) {
                const name = extractNameFromNewStructure(text);
                if (name) {
                    memberMap[name] = (memberMap[name] || 0) + 1;
                }
            }
        });
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
    }
}

function extractNameFromNewStructure(text) {
    const parts = text.split(',');
    if (parts.length > 1) {
        return parts[0].trim(); // Assuming the name is before the comma
    }
    return null;
}



function extractName(text) {
    const parts = text.split(',');
    if (parts.length > 0) {
        return parts[0].trim();
    }
    return null;
}

function printOverlappingMembers() {
    console.log("Overlapping Program Committee Members:\n");
    for (const [name, count] of Object.entries(memberMap)) {
        if (count > 1) {
            console.log(`${name} (Count: ${count})`);
        }
    }
}

// URLs array
const urls = [
    'https://www.usenix.org/conference/atc24/call-for-papers',
    //'https://www.usenix.org/conference/nsdi24/call-for-papers',
    'https://www.sigmobile.org/mobicom/2024/committee.html',
    'https://www.sigmobile.org/mobicom/2024/committee.html',
    // Add more URLs as needed
];

// Scrape each URL and then print overlapping members
Promise.all(urls.map(url => scrapeURL(url))).then(() => {
    printOverlappingMembers();
});

