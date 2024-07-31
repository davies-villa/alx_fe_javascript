// Load quotes from local storage or use the default array
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" }
];

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById('quoteDisplay').innerText = `"${quote.text}" - ${quote.category}`;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    localStorage.setItem('quotes', JSON.stringify(quotes)); // Save to local storage

    // Update dropdown if it's a new category
    if (!document.querySelector(`option[value="${newQuoteCategory}"]`)) {
      const option = document.createElement('option');
      option.value = newQuoteCategory;
      option.textContent = newQuoteCategory;
      document.getElementById('categoryFilter').appendChild(option);
    }

    alert('Quote added successfully!');
  } else {
    alert('Please enter both quote text and category.');
  }
}

// Function to export quotes as a JSON file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();

  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    localStorage.setItem('quotes', JSON.stringify(quotes)); // Update local storage
    alert('Quotes imported successfully!');
    populateCategories(); // Re-populate categories after importing
  };
  fileReader.readAsText(event.target.files[0]);
}

// Populate categories dynamically in the dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset categories

  const categories = [...new Set(quotes.map(quote => quote.category))];

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  let filteredQuotes = quotes;

  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }

  // Display the first quote from the filtered list
  if (filteredQuotes.length > 0) {
    document.getElementById('quoteDisplay').innerText = `"${filteredQuotes[0].text}" - ${filteredQuotes[0].category}`;
  } else {
    document.getElementById('quoteDisplay').innerText = 'No quotes available for this category.';
  }
}

// Apply the last selected filter and apply it on page load
function applyLastSelectedFilter() {
  const lastSelectedCategory = localStorage.getItem('selectedCategory') || 'all';
  document.getElementById('categoryFilter').value = lastSelectedCategory;
  filterQuotes();
}

document.getElementById('categoryFilter').addEventListener('change', function() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);
});

// Call these functions on page load
populateCategories();
applyLastSelectedFilter();

// Event listener to show a new quote when the button is clicked
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
