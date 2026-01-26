import { useState } from 'react';
import { Hardware, HardwareFormData } from '@/types/hardware';
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
import { X } from 'lucide-react';

interface HardwareFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: HardwareFormData) => void;
  initialData?: Hardware;
}

const defaultFormData: HardwareFormData = {
  name: '',
  vendor: '',
  model: '',
  serialNumber: '',
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

export function HardwareForm({ open, onClose, onSubmit, initialData }: HardwareFormProps) {
  const [formData, setFormData] = useState<HardwareFormData>(
    initialData ? {
      name: initialData.name,
      vendor: initialData.vendor,
      model: initialData.model,
      serialNumber: initialData.serialNumber,
      purchaseDate: initialData.purchaseDate,
      endOfLife: initialData.endOfLife,
      warrantyExpiry: initialData.warrantyExpiry,
      maintenanceContract: initialData.maintenanceContract,
      professionalSupport: initialData.professionalSupport,
      documents: initialData.documents,
      notes: initialData.notes
    } : defaultFormData
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(defaultFormData);
    onClose();
  };

  const updateField = <K extends keyof HardwareFormData>(
    field: K,
    value: HardwareFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
                  placeholder="e.g., Dell PowerEdge R750"
                  required
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor *</Label>
                <Input
                  id="vendor"
                  value={formData.vendor}
                  onChange={e => updateField('vendor', e.target.value)}
                  placeholder="e.g., Dell Technologies"
                  required
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={e => updateField('model', e.target.value)}
                  placeholder="e.g., PowerEdge R750"
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
                  placeholder="e.g., SRV-2024-001"
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
