document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspirational" },
        { text: "The purpose of our lives is to be happy.", category: "Life" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "Get busy living or get busy dying.", category: "Motivational" }
    ];

    function displayRandomQuote() {
        const quoteDisplay = document.getElementById('quoteDisplay');
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteDisplay.textContent = `"${quotes[randomIndex].text}" - ${quotes[randomIndex].category}`;
    }

    function addQuote() {
        const newQuoteText = document.getElementById('newQuoteText').value;
        const newQuoteCategory = document.getElementById('newQuoteCategory').value;

        if (newQuoteText && newQuoteCategory) {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';
            alert('Quote added successfully!');
        } else {
            alert('Please enter both a quote and a category.');
        }
    }

    document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
    document.getElementById('addQuote').addEventListener('click', addQuote);
});
