export const MOCK_USER = {
  name: "Kipchoge Keino",
  id: "JANI-KE-2025-8821",
  coop: "Muranga Tea Cooperative",
  location: "Muranga, Kenya",
  farmSize: "2.5 Ha",
  complianceScore: 94
};

export const MOCK_FIELDS = [
  { 
    id: 1, 
    name: "North Hill Coffee", 
    crop: "Coffee (Arabica)", 
    size: "1.2 Ha", 
    status: "Flowering", 
    compliance: "EUDR Compliant",
    lastActivity: "Fertilizer Application",
    image: "coffee"
  },
  { 
    id: 2, 
    name: "River Valley Tea", 
    crop: "Tea", 
    size: "0.8 Ha", 
    status: "Harvest Ready", 
    compliance: "Pending Review",
    lastActivity: "Weeding",
    image: "tea"
  },
  { 
    id: 3, 
    name: "Garden Plot", 
    crop: "Avocado", 
    size: "0.5 Ha", 
    status: "Vegetative", 
    compliance: "EUDR Compliant",
    lastActivity: "Pruning",
    image: "avocado"
  }
];

export const MOCK_TASKS = [
  { id: 1, title: "Apply Fertilizer to North Hill", due: "Today", urgent: true },
  { id: 2, title: "Scout for Coffee Berry Borer", due: "Tomorrow", urgent: false },
  { id: 3, title: "Sync Weekly Logs", due: "Fri, 24 Nov", urgent: false }
];

export const MOCK_WEATHER = {
  temp: 24,
  condition: "Cloudy",
  precip: "40%",
  advice: "Good day for pruning, risk of rain in PM."
};
