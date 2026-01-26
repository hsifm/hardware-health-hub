import { Hardware } from '@/types/hardware';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { getDaysUntil } from '@/lib/hardware-utils';
import { Edit, Trash2, FileText, Shield, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HardwareTableProps {
  hardware: Hardware[];
  onEdit: (item: Hardware) => void;
  onDelete: (id: string) => void;
}

export function HardwareTable({ hardware, onEdit, onDelete }: HardwareTableProps) {
  const getStatusBadge = (status: Hardware['status']) => {
    const variants = {
      healthy: 'bg-success/10 text-success border-success/30 hover:bg-success/20',
      warning: 'bg-warning/10 text-warning border-warning/30 hover:bg-warning/20',
      critical: 'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20'
    };
    
    const labels = {
      healthy: 'Healthy',
      warning: 'Attention',
      critical: 'Critical'
    };

    return (
      <Badge variant="outline" className={cn("font-medium", variants[status])}>
        {labels[status]}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  };

  const getDaysLabel = (dateString: string) => {
    const days = getDaysUntil(dateString);
    if (days < 0) return <span className="text-destructive">Expired</span>;
    if (days <= 30) return <span className="text-warning">{days}d left</span>;
    return <span className="text-muted-foreground">{days}d</span>;
  };

  if (hardware.length === 0) {
    return (
      <div className="glass-card rounded-xl p-12 text-center">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No hardware registered</h3>
        <p className="text-muted-foreground">Add your first hardware asset to get started.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            <TableHead className="text-muted-foreground font-semibold">Asset</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Vendor</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Warranty</TableHead>
            <TableHead className="text-muted-foreground font-semibold">End of Life</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Support</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hardware.map((item) => (
            <TableRow key={item.id} className="border-border/50 hover:bg-accent/50">
              <TableCell>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.serialNumber}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{item.vendor}</p>
                  <p className="text-sm text-muted-foreground">{item.model}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{formatDate(item.warrantyExpiry)}</p>
                  <p className="text-sm">{getDaysLabel(item.warrantyExpiry)}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{formatDate(item.endOfLife)}</p>
                  <p className="text-sm">{getDaysLabel(item.endOfLife)}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {item.maintenanceContract.hasContract && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      <Wrench className="h-3 w-3 mr-1" />
                      Maint
                    </Badge>
                  )}
                  {item.professionalSupport.hasSupport && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      <Shield className="h-3 w-3 mr-1" />
                      Pro
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                    className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
