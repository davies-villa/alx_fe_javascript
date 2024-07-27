document.addEventListener('DOMContentLoaded', () => {

let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Your time is limited, don't waste it living someone else's life.", category: "Motivation" }
  ];
  
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  function showRandomQuote() {
    const filteredQuotes = getFilteredQuotes();
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerText = `${filteredQuotes[randomIndex].text} - ${filteredQuotes[randomIndex].category}`;
    sessionStorage.setItem('lastQuote', JSON.stringify(filteredQuotes[randomIndex]));
  }
  
  function getFilteredQuotes() {
    const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
    if (selectedCategory === 'all') {
      return quotes;
    } else {
      return quotes.filter(quote => quote.category === selectedCategory);
    }
  }
  
  function populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.innerText = category;
      categoryFilter.appendChild(option);
    });
  
    const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
    categoryFilter.value = selectedCategory;
  }
  
  function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;
    localStorage.setItem('selectedCategory', selectedCategory);
    showRandomQuote();
  }
  
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes();
      populateCategoryFilter();
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      alert('Quote added successfully!');
    } else {
      alert('Please fill in both fields.');
    }
  }
  
  function exportToJsonFile() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategoryFilter();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  window.onload = function() {
    populateCategoryFilter();
    showRandomQuote();
  
    const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
    if (lastQuote) {
      document.getElementById('quoteDisplay').innerText = `${lastQuote.text} - ${lastQuote.category}`;
    }
  };
  

});
