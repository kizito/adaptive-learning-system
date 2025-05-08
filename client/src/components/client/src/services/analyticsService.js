/**
 * Analytics service for tracking user interactions
 */

// Track event to backend or analytics service
export const trackEvent = (eventName, eventData = {}) => {
  try {
    // Add timestamp if not provided
    if (!eventData.timestamp) {
      eventData.timestamp = new Date().toISOString();
    }
    
    // In a real implementation, this would send data to an analytics service
    // For prototype, we just log to console and localStorage
    console.log(`[Analytics] Event: ${eventName}`, eventData);
    
    // Store in localStorage for demo purposes
    const events = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
    events.push({ name: eventName, data: eventData });
    localStorage.setItem('analyticsEvents', JSON.stringify(events));
    
    // In a production app, we would send this to a backend
    // api.post('/api/analytics', { eventName, eventData });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Get stored analytics events (for demo purposes)
export const getStoredEvents = () => {
  return JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
};

// Clear stored events (for demo purposes)
export const clearStoredEvents = () => {
  localStorage.removeItem('analyticsEvents');
};
