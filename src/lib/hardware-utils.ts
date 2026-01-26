import { Hardware } from '@/types/hardware';
import { differenceInDays, parseISO, isAfter } from 'date-fns';

export function calculateStatus(hardware: Omit<Hardware, 'status'>): 'healthy' | 'warning' | 'critical' {
  const today = new Date();
  const warrantyExpiry = parseISO(hardware.warrantyExpiry);
  const endOfLife = parseISO(hardware.endOfLife);
  const maintenanceExpiry = hardware.maintenanceContract.expiryDate 
    ? parseISO(hardware.maintenanceContract.expiryDate) 
    : null;

  // Check if end of life has passed
  if (isAfter(today, endOfLife)) {
    return 'critical';
  }

  // Check if warranty has expired
  if (isAfter(today, warrantyExpiry)) {
    return 'critical';
  }

  // Check if maintenance contract has expired (if exists)
  if (maintenanceExpiry && isAfter(today, maintenanceExpiry)) {
    return 'warning';
  }

  // Check if warranty is within 60 days
  const daysToWarrantyExpiry = differenceInDays(warrantyExpiry, today);
  if (daysToWarrantyExpiry <= 60) {
    return 'warning';
  }

  // Check if EOL is within 120 days
  const daysToEndOfLife = differenceInDays(endOfLife, today);
  if (daysToEndOfLife <= 120) {
    return 'warning';
  }

  // Check maintenance within 60 days
  if (maintenanceExpiry) {
    const daysToMaintenanceExpiry = differenceInDays(maintenanceExpiry, today);
    if (daysToMaintenanceExpiry <= 60) {
      return 'warning';
    }
  }

  return 'healthy';
}

export function getDaysUntil(dateString: string): number {
  return differenceInDays(parseISO(dateString), new Date());
}

export function getStatusLabel(status: Hardware['status']): string {
  switch (status) {
    case 'healthy':
      return 'Healthy';
    case 'warning':
      return 'Attention Needed';
    case 'critical':
      return 'Critical';
  }
}
