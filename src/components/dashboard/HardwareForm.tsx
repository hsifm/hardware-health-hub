import { useState } from 'react';
import { Hardware, HardwareFormData, HARDWARE_CATEGORIES, HARDWARE_VENDORS, HardwareCategory } from '@/types/hardware';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HardwareFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: HardwareFormData) => void;
  initialData?: Hardware;
}

const defaultFormData: HardwareFormData = {
  name: '',
  category: 'server',
  vendor: '',
  model: '',
  serialNumber: '',
  unitCost: 0,
  purchaseDate: '',
  endOfLife: '',
  warrantyExpiry: '',
  maintenanceContract: {
    hasContract: false,
    expiryDate: '',
    provider: ''
  },
  professionalSupport: {
    hasSupport: false,
    provider: '',
    contactInfo: ''
  },
  documents: {},
  notes: ''
};

// Category-specific placeholder examples
const categoryExamples: Record<HardwareCategory, {
  name: string;
  model: string;
  serialNumber: string;
  cost: string;
  vendor: string;
}> = {
  server: {
    name: 'Dell PowerEdge R750',
    model: 'PowerEdge R750',
    serialNumber: 'SRV-2024-001',
    cost: '45000',
    vendor: 'Dell Technologies'
  },
  network: {
    name: 'Cisco Catalyst 9300',
    model: 'Catalyst 9300-48P',
    serialNumber: 'NET-2024-001',
    cost: '12500',
    vendor: 'Cisco Systems'
  },
  storage: {
    name: 'NetApp FAS2700',
    model: 'FAS2700 AFF',
    serialNumber: 'STR-2024-001',
    cost: '85000',
    vendor: 'NetApp'
  },
  ntp: {
    name: 'Meinberg LANTIME M300',
    model: 'LANTIME M300/GPS',
    serialNumber: 'NTP-2024-001',
    cost: '15000',
    vendor: 'Meinberg'
  },
  other: {
    name: 'Hardware Asset Name',
    model: 'Model Number',
    serialNumber: 'ASSET-2024-001',
    cost: '10000',
    vendor: 'Vendor Name'
  }
};

export function HardwareForm({ open, onClose, onSubmit, initialData }: HardwareFormProps) {
  const [formData, setFormData] = useState<HardwareFormData>(
    initialData ? {
      name: initialData.name,
      category: initialData.category,
      vendor: initialData.vendor,
      model: initialData.model,
      serialNumber: initialData.serialNumber,
      unitCost: initialData.unitCost,
      purchaseDate: initialData.purchaseDate,
      endOfLife: initialData.endOfLife,
      warrantyExpiry: initialData.warrantyExpiry,
      maintenanceContract: initialData.maintenanceContract,
      professionalSupport: initialData.professionalSupport,
      documents: initialData.documents,
      notes: initialData.notes
    } : defaultFormData
  );

  const [customVendor, setCustomVendor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(defaultFormData);
    setCustomVendor('');
    onClose();
  };

  const updateField = <K extends keyof HardwareFormData>(
    field: K,
    value: HardwareFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVendorChange = (value: string) => {
    if (value === 'Other') {
      setCustomVendor('');
      updateField('vendor', '');
    } else {
      setCustomVendor('');
      updateField('vendor', value);
    }
  };

  const examples = categoryExamples[formData.category];

  const isOtherVendor = !HARDWARE_VENDORS.slice(0, -1).includes(formData.vendor) && formData.vendor !== '';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {initialData ? 'Edit Hardware' : 'Add New Hardware'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Asset Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder={`e.g., ${examples.name}`}
                  required
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: HardwareCategory) => updateField('category', value)}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {HARDWARE_CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor *</Label>
                <Select
                  value={isOtherVendor ? 'Other' : formData.vendor}
                  onValueChange={handleVendorChange}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {HARDWARE_VENDORS.map(vendor => (
                      <SelectItem key={vendor} value={vendor}>
                        {vendor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {(formData.vendor === '' && customVendor === '') || isOtherVendor ? (
                <div className="space-y-2">
                  <Label htmlFor="customVendor">Custom Vendor *</Label>
                  <Input
                    id="customVendor"
                    value={isOtherVendor ? formData.vendor : customVendor}
                    onChange={e => updateField('vendor', e.target.value)}
                    placeholder="Enter vendor name"
                    required={formData.vendor === ''}
                    className="bg-background border-border"
                  />
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={e => updateField('model', e.target.value)}
                  placeholder={`e.g., ${examples.model}`}
                  required
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number *</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={e => updateField('serialNumber', e.target.value)}
                  placeholder={`e.g., ${examples.serialNumber}`}
                  required
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="unitCost">Unit Cost (AED) *</Label>
                <Input
                  id="unitCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.unitCost || ''}
                  onChange={e => updateField('unitCost', parseFloat(e.target.value) || 0)}
                  placeholder={`e.g., ${examples.cost}`}
                  required
                  className="bg-background border-border"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Important Dates
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date *</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={e => updateField('purchaseDate', e.target.value)}
                  required
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warrantyExpiry">Warranty Expiry *</Label>
                <Input
                  id="warrantyExpiry"
                  type="date"
                  value={formData.warrantyExpiry}
                  onChange={e => updateField('warrantyExpiry', e.target.value)}
                  required
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endOfLife">End of Life *</Label>
                <Input
                  id="endOfLife"
                  type="date"
                  value={formData.endOfLife}
                  onChange={e => updateField('endOfLife', e.target.value)}
                  required
                  className="bg-background border-border"
                />
              </div>
            </div>
          </div>

          {/* Maintenance Contract */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Maintenance Contract
              </h3>
              <Switch
                checked={formData.maintenanceContract.hasContract}
                onCheckedChange={checked => 
                  updateField('maintenanceContract', {
                    ...formData.maintenanceContract,
                    hasContract: checked
                  })
                }
              />
            </div>
            {formData.maintenanceContract.hasContract && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maintenanceProvider">Provider</Label>
                  <Input
                    id="maintenanceProvider"
                    value={formData.maintenanceContract.provider || ''}
                    onChange={e => 
                      updateField('maintenanceContract', {
                        ...formData.maintenanceContract,
                        provider: e.target.value
                      })
                    }
                    placeholder="e.g., Dell ProSupport"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenanceExpiry">Expiry Date</Label>
                  <Input
                    id="maintenanceExpiry"
                    type="date"
                    value={formData.maintenanceContract.expiryDate || ''}
                    onChange={e => 
                      updateField('maintenanceContract', {
                        ...formData.maintenanceContract,
                        expiryDate: e.target.value
                      })
                    }
                    className="bg-background border-border"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Professional Support */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Professional Support
              </h3>
              <Switch
                checked={formData.professionalSupport.hasSupport}
                onCheckedChange={checked => 
                  updateField('professionalSupport', {
                    ...formData.professionalSupport,
                    hasSupport: checked
                  })
                }
              />
            </div>
            {formData.professionalSupport.hasSupport && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supportProvider">Provider</Label>
                  <Input
                    id="supportProvider"
                    value={formData.professionalSupport.provider || ''}
                    onChange={e => 
                      updateField('professionalSupport', {
                        ...formData.professionalSupport,
                        provider: e.target.value
                      })
                    }
                    placeholder="e.g., Dell Technologies"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportContact">Contact Info</Label>
                  <Input
                    id="supportContact"
                    value={formData.professionalSupport.contactInfo || ''}
                    onChange={e => 
                      updateField('professionalSupport', {
                        ...formData.professionalSupport,
                        contactInfo: e.target.value
                      })
                    }
                    placeholder="e.g., support@vendor.com"
                    className="bg-background border-border"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={e => updateField('notes', e.target.value)}
              placeholder="Additional notes about this hardware..."
              rows={3}
              className="bg-background border-border"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              {initialData ? 'Update Hardware' : 'Add Hardware'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}