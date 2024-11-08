import express from 'express';
import cors from 'cors';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import https from 'https';

const app = express();
const PORT = 5000;
const API_KEY = process.env.FAVQS_API_KEY; // Replace with your FavQs API key

// Get the current directory name from the module URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get a random quote
app.get('/quote', async (req, res) => {
    try {
        const agent = new https.Agent({ rejectUnauthorized: false });
        const response = await fetch('https://favqs.com/api/qotd', { agent });
        const quoteData = await response.json();
        
        res.json({
            text: quoteData.quote.body,
            author: quoteData.quote.author
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quote', error });
    }
});

// Search endpoint for quotes by author
app.get('/search', async (req, res) => {
    const author = req.query.author;
    const formattedAuthor = author.name?.split(' ').map(word => word.replace(/\.$/, '')).join('-').toLowerCase();
    try {
        const response = await fetch(`https://favqs.com/api/quotes/?filter=${encodeURIComponent(formattedAuthor)}&type=author`, {
            headers: {
                'Authorization': `Token token="${API_KEY}"`
            }
        });
        
        if (!response.ok) {
            // Handle non-200 responses from the API
            return res.status(response.status).json({ message: 'Error fetching quotes from FavQs API' });
        }
        
        const data = await response.json();

        // Check if there are results and return quotes if available
        if (data.quotes && data.quotes.length > 0) {
            // Destructure quote and extract content and author
            const quotes = data.quotes.map(({ body, author }) => ({ content: body, author }));
            res.json(quotes); // Return the filtered quotes
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
