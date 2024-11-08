// API URLs
const baseUrl = 'http://localhost:5000';


async function fetchRandomQuote() {
    try {
        const response = await fetch(`${baseUrl}/quote`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch a quote');
        }
        const data = await response.json();
        displayQuote(data);
    } catch (error) {
        console.error('Error fetching quote:', error);
        alert('Failed to fetch a quote');
    }
}


async function searchByAuthor() {
    const author = document.getElementById('author-search').value.trim();
    try {
        const response = await fetch(`${baseUrl}/search?author=${encodeURIComponent(author)}`);

        console.log(`Fetching quotes from: ${baseUrl}/search?author=${encodeURIComponent(author)}`);
        
        const data = await response.json();

        if (response.ok && data.text) {
            // Display the first quote from the data
            displayQuote({ text: data.text, author: data.author });
        } else {
            console.warn('No quotes found for the author:', author);
            alert('No quotes found for this author.');
        }
    } catch (error) {
        console.error('Error searching by author:', error);
        alert(error.message);
    }
}





function displayQuote(quote) {
    const quoteTextElement = document.getElementById('quote-text');
    const quoteAuthorElement = document.getElementById('quote-author');

    quoteTextElement.textContent = quote.text || 'No quote found';
    quoteAuthorElement.textContent = `- ${quote.author}` || 'Unknown';
}

// Initial load
fetchRandomQuote();
