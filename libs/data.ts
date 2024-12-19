export type PrivacyItem = {
  id: string;
  title: string;
  description: string;
  status: 'positive' | 'warning' | 'negative';
  icon: 'check' | 'alert-triangle' | 'x';
};

export type App = {
  id: string;
  name: string;
  category: string;
  icon: string;
  banner: string;
  rating?: number;
  notes?: number;
  guides?: number;
  tC?: string[]; // Array of privacy item IDs
};

// Add Guide type
export type Guide = {
  id: string;
  title: string;
  time: string;
  app_name: string;
}; 