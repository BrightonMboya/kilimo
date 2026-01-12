export const MOCK_USER = {
  name: "Kipchoge Keino",
  id: "JANI-KE-2025-8821",
  coop: "Muranga Tea Cooperative",
  location: "Muranga, Kenya",
  farmSize: "2.5 Ha",
  complianceScore: 94
};



export const MOCK_TASKS = [
  { id: 1, title: "Apply Fertilizer to North Hill", due: "Today", urgent: true },
  { id: 2, title: "Scout for Coffee Berry Borer", due: "Tomorrow", urgent: false },
  { id: 3, title: "Sync Weekly Logs", due: "Fri, 24 Nov", urgent: false }
];

export const MOCK_WEATHER = {
  temp: 24,
  precip: "40%",
  advice: "Good day for planting",
};

export const MOCK_FIELDS = [
  {
    id: "1",
    name: "North Field",
    crop: "Coffee (SL-28)",
    size: "2.5 Ha",
    compliance: "EUDR Compliant",
    lastActivity: "2 days ago",
  },
  {
    id: "2",
    name: "South Field",
    crop: "Maize",
    size: "1.8 Ha",
    compliance: "EUDR Compliant",
    lastActivity: "1 week ago",
  },
  {
    id: "3",
    name: "East Field",
    crop: "Beans",
    size: "1.2 Ha",
    compliance: "Pending Review",
    lastActivity: "3 days ago",
  },
];
