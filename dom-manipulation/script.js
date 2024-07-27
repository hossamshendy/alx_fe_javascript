document.addEventListener('DOMContentLoaded', () => {
  let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "The best way to predict the future is to invent it.", category: "Motivation" }
  ];

  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');
  const categoryFilter = document.getElementById('categoryFilter');

  // Server URL for fetching and posting quotes
  const serverUrl = 'https://jsonplaceholder.typicode.com/posts';

  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  function showRandomQuote() {
    const filteredQuotes = getFilteredQuotes();
    if (filteredQuotes.length === 0) {
      quoteDisplay.textContent = "No quotes available for the selected category.";
      return;
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`;
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
  }

  function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }

  function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem('selectedCategory', selectedCategory);
    showRandomQuote();
  }

  function getFilteredQuotes() {
    const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
    if (selectedCategory === 'all') {
      return quotes;
    }
    return quotes.filter(quote => quote.category === selectedCategory);
  }

  window.addQuote = function() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes();
      populateCategories();
      syncWithServer();
      alert('New quote added successfully!');
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
    } else {
      alert('Please enter both a quote and a category.');
    }
  };

  window.exportToJsonFile = function() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = 'quotes.json';
    downloadAnchor.click();
    URL.revokeObjectURL(url);
  };

  window.importFromJsonFile = function(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      syncWithServer();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  };

  // Simulate fetching quotes from server
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch(serverUrl);
      const serverQuotes = await response.json();
      if (Array.isArray(serverQuotes) && serverQuotes.length > 0) {
        quotes = serverQuotes.map(quote => ({
          text: quote.title,
          category: quote.body.split(' ')[0]  // Example category extraction
        }));
        saveQuotes();
        populateCategories();
      }
    } catch (error) {
      console.error('Error fetching quotes from server:', error);
    }
  }

  // Simulate syncing local quotes with server
  async function syncWithServer() {
    try {
      await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quotes)
      });
    } catch (error) {
      console.error('Error syncing with server:', error);
    }
  }

  // Initialize
  const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
  const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
  categoryFilter.value = selectedCategory;

  populateCategories();

  if (lastQuote) {
    quoteDisplay.textContent = `"${lastQuote.text}" - ${lastQuote.category}`;
  } else {
    showRandomQuote();
  }

  fetchQuotesFromServer();
  setInterval(fetchQuotesFromServer, 30000); // Periodically fetch quotes from server every 30 seconds
});


Export Quotes
application/json
Blob
innerHTML
createAddQuoteForm
createElement
appendChild
FileReader
onload
readAsText

