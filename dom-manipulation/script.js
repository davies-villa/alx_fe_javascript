// Array to store quotes
let quotes = [];

// Function to display a random quote
function showRandomQuote() {
    if (quotes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerText = quotes[randomIndex].text;
}

// Function to create and display the form for adding a new quote
function createAddQuoteForm() {
    const form = document.createElement('div');
    form.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
    `;
    document.body.appendChild(form);
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotes(); // Save the updated quotes to local storage
        showRandomQuote(); // Optionally, show the newly added quote
    } else {
        alert('Please enter both quote text and category.');
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

// Function to fetch quotes from a simulated server
function fetchQuotesFromServer() {
    const serverQuotes = [
        { text: "Server Quote 1", category: "Inspiration" },
        { text: "Server Quote 2", category: "Motivation" }
    ];

    // Merge server quotes with existing quotes
    quotes.push(...serverQuotes);

    // Save the merged quotes to local storage
    saveQuotes();

    // Update the display
    showRandomQuote();
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    const quoteDisplay = document.getElementById('quoteDisplay');

    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        quoteDisplay.innerText = filteredQuotes[randomIndex].text;
    } else {
        quoteDisplay.innerText = 'No quotes available for this category.';
    }
}

// Function to populate the category filter dynamically
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = Array.from(new Set(quotes.map(quote => quote.category)));

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    createAddQuoteForm();
    showRandomQuote();
    populateCategoryFilter();
});
