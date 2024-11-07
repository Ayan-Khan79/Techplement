import express from 'express';
import cors from 'cors';
import path from 'path';
import fetch from 'node-fetch'; // Import node-fetch
import { fileURLToPath } from 'url'; // Import fileURLToPath
import https from 'https';



const app = express();
const PORT = 5000;

// Get the current directory name from the module URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Create __dirname

app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory 
app.use(express.static(path.join(__dirname, 'public')));


// Endpoint to get a random quote
app.get('/quote', async (req, res) => {
    try {
        const agent = new https.Agent({ rejectUnauthorized: false });
        const response = await fetch('https://api.quotable.io/random', { agent });
        const quoteData = await response.json();
        res.json({
            text: quoteData.content,
            author: quoteData.author
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quote', error });
    }
});


// Search endpoint for quotes by author
app.get('/search', async (req, res) => {
    const author = req.query.author;
    try {
        const response = await fetch(`https://api.quotable.io/search/quotes?query=${encodeURIComponent(author)}&fields=author`);
        const data = await response.json();

        // Check if there are results and return the first quote if available
        if (response.ok && data.results && data.results.length > 0) {
            const quotes = data.results.map(quote => ({ content: quote.content, author: quote.author }));
            res.json(quotes); // Return an array of quotes found
        } else {
            res.status(404).json({ message: 'No quotes found for this author.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error searching for quotes', error });
    }
});



// Serve index.html for the root route "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
