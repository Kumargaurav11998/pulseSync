import ApiService from '../api/ApiService';
import SQLiteService from '../database/SQLiteService';

const API_KEY = '6Pa0qh7nEh4O4VoxaAH7o7QFVeNkQgtgr4ojz30N';
const QUOTE_LIMIT = 1000;
const CATEGORIES = [
  'wisdom', 'philosophy', 'life', 'truth', 'inspirational', 
  'relationships', 'love', 'faith', 'humor', 'success', 
  'courage', 'happiness', 'art', 'writing', 'fear', 
  'nature', 'time', 'freedom', 'death', 'leadership'
];

class QuoteService {
  async fetchAndStoreQuotes() {
    try {
      // Check if we already have enough quotes
      const currentCount = await SQLiteService.getQuoteCount();
      if (currentCount >= QUOTE_LIMIT) {
        console.log(`Quote cache full (${currentCount}). Skipping API call.`);
        return;
      }

      console.log(`Current quote count: ${currentCount}. Fetching new quotes...`);

      // Pick a random category
      const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      
      const response = await ApiService.get('https://api.api-ninjas.com/v2/quotes', {
        params: { categories: randomCategory },
        headers: { 'X-Api-Key': API_KEY }
      });

      if (response.data && Array.isArray(response.data)) {
        for (const item of response.data) {
          await SQLiteService.saveQuote(item.quote, item.author, randomCategory);
        }
        console.log(`Successfully stored ${response.data.length} new quotes from category: ${randomCategory}`);
      }
    } catch (error: any) {
      console.error('Error fetching quotes from API-Ninjas:', error?.message || error);
    }
  }

  async getDisplayQuotes() {
    // Try to get 5 random quotes from DB
    let quotes = await SQLiteService.getQuotes(5);
    
    // If DB is empty, return a fallback quote
    if (quotes.length === 0) {
      return [{
        quote: "The road to success begins with knowing what you need to know and why.",
        author: "Savania China",
        category: "success"
      }];
    }
    
    return quotes;
  }
}

export default new QuoteService();
