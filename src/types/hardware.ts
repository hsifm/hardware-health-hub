export interface Hardware {
  id: string;
  name: string;
  vendor: string;
  model: string;
  serialNumber: string;
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
