export type HardwareCategory = 'server' | 'network' | 'storage' | 'workstation' | 'laptop' | 'peripheral' | 'other';

export const HARDWARE_CATEGORIES: { value: HardwareCategory; label: string }[] = [
  { value: 'server', label: 'Server' },
  { value: 'network', label: 'Network Equipment' },
  { value: 'storage', label: 'Storage' },
  { value: 'workstation', label: 'Workstation' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'peripheral', label: 'Peripheral' },
  { value: 'other', label: 'Other' },
];

export const HARDWARE_VENDORS = [
  'Dell Technologies',
  'Hewlett Packard Enterprise',
  'Cisco Systems',
  'Lenovo',
  'IBM',
  'Juniper Networks',
  'NetApp',
  'VMware',
  'Microsoft',
  'Other',
];

export interface Hardware {
  id: string;
  name: string;
  category: HardwareCategory;
  vendor: string;
  model: string;
  serialNumber: string;
  unitCost: number;
  purchaseDate: string;
  endOfLife: string;
  warrantyExpiry: string;
  maintenanceContract: {
    hasContract: boolean;
    expiryDate?: string;
    provider?: string;
  };
  professionalSupport: {
    hasSupport: boolean;
    provider?: string;
    contactInfo?: string;
  };
  documents: {
    warranty?: string;
    invoice?: string;
  };
  status: 'healthy' | 'warning' | 'critical';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type HardwareFormData = Omit<Hardware, 'id' | 'status' | 'createdAt' | 'updatedAt'>;
