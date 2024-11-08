import express from 'express';
import cors from 'cors';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = 5000;
const API_KEY = process.env.FAVQS_API_KEY; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: '*' }));
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get a random quote
app.get('/quote', async (req, res) => {
    try {
        const response = await fetch('https://favqs.com/api/qotd');
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

    if (!author) return res.status(400).json({ message: 'Author is required' });

    const formattedAuthor = author.split(' ').map(word => word.replace(/\.$/, '')).join('-').toLowerCase();

    try {
        const response = await fetch(`https://favqs.com/api/quotes/?filter=${encodeURIComponent(formattedAuthor)}&type=author`, {
            headers: {
                'Authorization': `Token token="${API_KEY}"`
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ message: 'Error fetching quotes from FavQs API' });
        }

        const data = await response.json();

        if (data.quotes && data.quotes.length > 0) {
            const firstQuote = data.quotes[0];
            res.json({
                text: firstQuote.body,
                author: firstQuote.author
            });
        } else {
            res.status(404).json({ message: 'No quotes found for this author.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error searching for quotes', error });
    }
});



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
