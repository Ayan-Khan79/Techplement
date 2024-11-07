// API URLs
const baseUrl = 'http://localhost:5000';


async function fetchRandomQuote() {
    try {
        const response = await fetch(`${baseUrl}/quote`);
        console.log(response);
        
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
        
        // Log the response for debugging
        console.log(`Fetching quotes from: ${baseUrl}/search?author=${encodeURIComponent(author)}`);

        const data = await response.json();
        
        if (response.ok && data.results && data.results.length > 0) {
            // Extract quotes content from the results
            const quotes = data.results.map(quote => quote.content);
            // Display the first quote in the list
            displayQuote({ text: quotes[0], author: author });
        } else {
            // Provide feedback about the results
            console.warn('No quotes found for the author:', author);
            alert('No quotes found for this author.');
        }
    } catch (error) {
        console.error('Error searching by author:', error);
        alert(error.message); // Display the error message to the user
    }
}



function displayQuote(quote) {
    const quoteTextElement = document.getElementById('quote-text');
    const quoteAuthorElement = document.getElementById('quote-author');

    quoteTextElement.textContent = quote.text || 'No quote found';
    quoteAuthorElement.textContent = quote.author || 'Unknown';
}

// Initial load
fetchRandomQuote();
