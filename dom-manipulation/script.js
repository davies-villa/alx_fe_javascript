let quotes = [];

// Load quotes from local storage when the page is loaded
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerText = quotes[randomIndex] ? quotes[randomIndex].text : 'No quotes available';
}

// Create and append the form to add a new quote
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
    `;
    document.body.appendChild(formContainer);
}

// Add a new quote to the array and save it
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        const newQuote = {
            text: newQuoteText,
            category: newQuoteCategory
        };
        quotes.push(newQuote);
        saveQuotes();
        populateCategoryFilter(); // Correct function name
        showRandomQuote();
        postQuoteToServer(newQuote);
        notifyUser('Quote added and posted to server.');
    } else {
        alert('Please fill in both fields.');
    }
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategoryFilter(); // Correct function name
        notifyUser('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Populate the category filter dropdown
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Filter quotes based on the selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerText = filteredQuotes.length ? filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].text : 'No quotes available for this category';
}

// Fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const serverQuotes = await response.json();

        const formattedQuotes = serverQuotes.map(post => ({
            text: post.title,
            category: "Server Data"
        }));

        quotes.push(...formattedQuotes);
        saveQuotes();
        populateCategoryFilter(); // Correct function name
        showRandomQuote();
        notifyUser('Quotes fetched and updated successfully from server!');
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        notifyUser('Error fetching quotes from server.');
    }
}

// Post a new quote to the server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quote)
        });

        if (!response.ok) {
            throw new Error('Failed to post quote');
        }

        const result = await response.json();
        console.log('Quote posted successfully:', result);
    } catch (error) {
        console.error('Error posting quote to server:', error);
    }
}

// Sync local quotes with the server
async function syncQuotes() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const serverQuotes = await response.json();

        const formattedServerQuotes = serverQuotes.map(post => ({
            text: post.title,
            category: "Server Data"
        }));

        const localQuoteTexts = quotes.map(quote => quote.text);
        const newQuotes = formattedServerQuotes.filter(serverQuote => !localQuoteTexts.includes(serverQuote.text));

        if (newQuotes.length > 0) {
            quotes.push(...newQuotes);
            saveQuotes();
            notifyUser('Quotes synced with server!');
        } else {
            notifyUser('No new quotes to sync.');
        }
    } catch (error) {
        console.error('Error syncing quotes with server:', error);
        notifyUser('Error syncing quotes with server.');
    }
}

// Notify the user with a message
function notifyUser(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Export quotes to a JSON file
function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    createAddQuoteForm();
    showRandomQuote();
    populateCategoryFilter(); // Correct function name

    fetchQuotesFromServer();
    setInterval(syncQuotes, 600000); // Sync every 10 minutes
});
