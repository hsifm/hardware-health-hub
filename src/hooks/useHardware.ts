import { useState, useEffect, useCallback } from 'react';
import { Hardware, HardwareFormData } from '@/types/hardware';
import { calculateStatus } from '@/lib/hardware-utils';

const STORAGE_KEY = 'hardware-inventory';

// Sample data for demo
const sampleData: Hardware[] = [
  {
    id: '1',
    name: 'Dell PowerEdge R750',
    vendor: 'Dell Technologies',
    model: 'PowerEdge R750',
    serialNumber: 'SRV-2024-001',
    purchaseDate: '2023-06-15',
    endOfLife: '2028-06-15',
    warrantyExpiry: '2026-06-15',
    maintenanceContract: {
      hasContract: true,
      expiryDate: '2025-06-15',
      provider: 'Dell ProSupport'
    },
    professionalSupport: {
      hasSupport: true,
      provider: 'Dell Technologies',
      contactInfo: 'support@dell.com'
    },
    documents: {},
    status: 'healthy',
    notes: 'Primary production server',
    createdAt: '2023-06-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'HP ProLiant DL380',
    vendor: 'Hewlett Packard Enterprise',
    model: 'ProLiant DL380 Gen10',
    serialNumber: 'SRV-2022-045',
    purchaseDate: '2022-03-10',
    endOfLife: '2027-03-10',
    warrantyExpiry: '2025-03-10',
    maintenanceContract: {
      hasContract: true,
      expiryDate: '2025-02-01',
      provider: 'HPE Care Pack'
    },
    professionalSupport: {
      hasSupport: true,
      provider: 'HPE',
      contactInfo: 'hpe-support@hpe.com'
    },
    documents: {},
    status: 'warning',
    notes: 'Database server - maintenance expiring soon',
    createdAt: '2022-03-10',
    updatedAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Cisco Catalyst 9300',
    vendor: 'Cisco Systems',
    model: 'Catalyst 9300-48P',
    serialNumber: 'NET-2021-012',
    purchaseDate: '2021-01-20',
    endOfLife: '2026-01-20',
    warrantyExpiry: '2024-01-20',
    maintenanceContract: {
      hasContract: false
    },
    professionalSupport: {
      hasSupport: false
    },
    documents: {},
    status: 'critical',
    notes: 'Core network switch - warranty expired!',
    createdAt: '2021-01-20',
    updatedAt: '2024-01-01'
  }
];

export function useHardware() {
  const [hardware, setHardware] = useState<Hardware[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Hardware[];
      // Recalculate status on load
      const updated = parsed.map(h => ({
        ...h,
        status: calculateStatus(h)
      }));
      setHardware(updated);
    } else {
      // Initialize with sample data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
      setHardware(sampleData);
    }
    setIsLoading(false);
  }, []);

  const saveHardware = useCallback((items: Hardware[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    setHardware(items);
  }, []);

  const addHardware = useCallback((data: HardwareFormData) => {
    const newItem: Hardware = {
      ...data,
      id: crypto.randomUUID(),
      status: calculateStatus(data as Omit<Hardware, 'status'>),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    saveHardware([...hardware, newItem]);
    return newItem;
  }, [hardware, saveHardware]);

  const updateHardware = useCallback((id: string, data: Partial<HardwareFormData>) => {
    const updated = hardware.map(item => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          ...data,
          updatedAt: new Date().toISOString().split('T')[0]
        };
        return {
          ...updatedItem,
          status: calculateStatus(updatedItem)
        };
      }
      return item;
    });
    saveHardware(updated);
  }, [hardware, saveHardware]);

  const deleteHardware = useCallback((id: string) => {
    saveHardware(hardware.filter(item => item.id !== id));
  }, [hardware, saveHardware]);

  const getStats = useCallback(() => {
    const total = hardware.length;
    const healthy = hardware.filter(h => h.status === 'healthy').length;
    const warning = hardware.filter(h => h.status === 'warning').length;
    const critical = hardware.filter(h => h.status === 'critical').length;
    const withMaintenance = hardware.filter(h => h.maintenanceContract.hasContract).length;
    const withSupport = hardware.filter(h => h.professionalSupport.hasSupport).length;

    return { total, healthy, warning, critical, withMaintenance, withSupport };
  }, [hardware]);

  return {
    hardware,
    isLoading,
    addHardware,
    updateHardware,
    deleteHardware,
    getStats
  };
}
