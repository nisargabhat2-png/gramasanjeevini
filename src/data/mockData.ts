export interface Medicine {
  id: string;
  name: string;
  description: string;
  isLifeSaving: boolean;
  category: string;
}

export interface InventoryItem {
  id: string;
  medicineId: string;
  shopId: string;
  stock: number;
  expiryDate: string; // ISO string
  price: number;
  discount?: number; // percentage discount for near-expiry
}

export interface Shop {
  id: string;
  name: string;
  village: string;
  distanceKm: number;
  contact: string;
  address: string;
}

export const MEDICINES: Medicine[] = [
  { id: 'm1', name: 'Insulin (Human)', description: 'Rapid-acting insulin for acute blood sugar management.', isLifeSaving: true, category: 'Diabetes' },
  { id: 'm2', name: 'Polyvalent Antivenom', description: 'Lyophilized antivenom for Cobra and Viper bites.', isLifeSaving: true, category: 'Emergency' },
  { id: 'm3', name: 'Dolo 650mg', description: 'Antipyretic and analgesic for fever management.', isLifeSaving: false, category: 'General' },
  { id: 'm4', name: 'Azithromycin 500mg', description: 'Broad-spectrum antibiotic for respiratory infections.', isLifeSaving: false, category: 'Antibiotics' },
  { id: 'm5', name: 'Salbutamol Inhaler', description: 'Emergency bronchodilator for acute asthma relief.', isLifeSaving: true, category: 'Respiratory' },
  { id: 'm6', name: 'Atropine Injection', description: 'Essential for organophosphate poisoning treatments.', isLifeSaving: true, category: 'Emergency' },
  { id: 'm7', name: 'Metformin 500mg', description: 'First-line medication for type 2 diabetes.', isLifeSaving: false, category: 'Diabetes' },
  { id: 'm8', name: 'ORS (Electrolyte)', description: 'Rehydration salts for acute diarrhea management.', isLifeSaving: false, category: 'Gastro' },
];

export const SHOPS: Shop[] = [
  { id: 's1', name: 'Kushal Medical Centre', village: 'Hoskote', distanceKm: 1.2, contact: '9845012345', address: 'Old Post Office Road, Hoskote' },
  { id: 's2', name: 'Sri Rama Drug Store', village: 'Malur', distanceKm: 4.8, contact: '9845054321', address: 'Market junction, Malur' },
  { id: 's3', name: 'Namma Clinics & Pharma', village: 'Devanhalli', distanceKm: 12.5, contact: '9900112233', address: 'NH 44, Near Airport Crossing' },
  { id: 's4', name: 'Pavitra Pharma Hub', village: 'Budigere', distanceKm: 6.2, contact: '9988776655', address: 'Village Square, Budigere' },
  { id: 's5', name: 'Jeevan Rakshak Pharmacy', village: 'Kadugodi', distanceKm: 15.0, contact: '9812345678', address: 'Whitefield Main Road, Kadugodi' },
  { id: 's6', name: 'Halli Health Point', village: 'Siddapura', distanceKm: 8.4, contact: '9822334455', address: 'Main Temple St, Siddapura' },
  { id: 's7', name: 'Gramin Medical Store', village: 'Neraluru', distanceKm: 3.1, contact: '9611223344', address: 'Panchayat Bhavan Road, Neraluru' },
  { id: 's8', name: 'Arogya Kendra', village: 'Gunjur', distanceKm: 7.5, contact: '9744556677', address: 'Station Road, Gunjur' },
  { id: 's9', name: 'Seva Pharmacy', village: 'Attibele', distanceKm: 18.2, contact: '9533445566', address: 'Industrial Area, Attibele' },
  { id: 's10', name: 'Vishwa Medicals', village: 'Varathur', distanceKm: 11.0, contact: '9422334455', address: 'Lake View St, Varathur' },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'i1', medicineId: 'm1', shopId: 's1', stock: 12, expiryDate: '2026-08-15', price: 420 },
  { id: 'i2', medicineId: 'm1', shopId: 's4', stock: 0, expiryDate: '2026-05-15', price: 460 },
  { id: 'i3', medicineId: 'm2', shopId: 's2', stock: 4, expiryDate: '2026-11-20', price: 1150 },
  { id: 'i4', medicineId: 'm2', shopId: 's3', stock: 10, expiryDate: '2027-01-10', price: 1250 },
  { id: 'i5', medicineId: 'm3', shopId: 's1', stock: 120, expiryDate: '2027-03-01', price: 22 },
  { id: 'i11', medicineId: 'm3', shopId: 's2', stock: 45, expiryDate: '2026-10-15', price: 25 },
  { id: 'i12', medicineId: 'm3', shopId: 's3', stock: 80, expiryDate: '2027-01-20', price: 24 },
  { id: 'i13', medicineId: 'm1', shopId: 's2', stock: 5, expiryDate: '2026-09-10', price: 440 },
  { id: 'i14', medicineId: 'm1', shopId: 's3', stock: 8, expiryDate: '2026-11-05', price: 435 },
  { id: 'i6', medicineId: 'm4', shopId: 's2', stock: 45, expiryDate: '2026-12-01', price: 85 },
  { id: 'i7', medicineId: 'm5', shopId: 's1', stock: 8, expiryDate: '2026-07-20', price: 280, discount: 15 },
  { id: 'i8', medicineId: 'm5', shopId: 's5', stock: 25, expiryDate: '2027-04-15', price: 310 },
  { id: 'i9', medicineId: 'm6', shopId: 's3', stock: 6, expiryDate: '2026-10-10', price: 550 },
  { id: 'i10', medicineId: 'm8', shopId: 's4', stock: 200, expiryDate: '2027-06-30', price: 15, discount: 10 },
];
