// Array to hold the quotes
let quotes = [];

// Function to show a random quote from the array
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerText = quotes[randomIndex] ? quotes[randomIndex].text : 'No quotes available';
}

// Function to create and display the form for adding a new quote
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
    `;
    document.body.appendChild(formContainer);
}

// Function to add a new quote to the array and update local storage
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
        populateCategoryFilter();
        showRandomQuote();
        postQuoteToServer(newQuote); // Post new quote to server
    } else {
        alert('Please fill in both fields.');
    }
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to populate the category filter dropdown
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

// Function to filter quotes based on the selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerText = filteredQuotes.length ? filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].text : 'No quotes available for this category';
}

// Function to fetch quotes from a simulated server using JSONPlaceholder
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const serverQuotes = await response.json();

        // Assume each post from JSONPlaceholder has a title as the quote and "Server Data" as a category
        serverQuotes.forEach(post => {
            const quote = {
                text: post.title,
                category: "Server Data"
            };
            quotes.push(quote);
        });

        // Save the updated quotes array to local storage
        saveQuotes();

        // Display the first quote fetched from the server
        showRandomQuote();

        console.log('Quotes fetched and updated successfully from server!');
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
    }
}

// Function to post a new quote to a simulated server
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

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    createAddQuoteForm();
    showRandomQuote();
    populateCategoryFilter();

    // Fetch quotes from the server when the page loads
    fetchQuotesFromServer();
});
