import { useState, useMemo } from 'react';
import { useHardware } from '@/hooks/useHardware';
import { Header } from '@/components/dashboard/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { HardwareTable } from '@/components/dashboard/HardwareTable';
import { HardwareForm } from '@/components/dashboard/HardwareForm';
import { Hardware, HardwareFormData } from '@/types/hardware';
import { 
  HardDrive, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Wrench,
  Shield
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type StatusFilter = 'all' | 'healthy' | 'warning' | 'critical';

const Index = () => {
  const { hardware, isLoading, addHardware, updateHardware, deleteHardware, getStats } = useHardware();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Hardware | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const stats = getStats();

  const handleStatusFilter = (status: StatusFilter) => {
    setStatusFilter(prev => prev === status ? 'all' : status);
  };

  const filteredHardware = useMemo(() => {
    let filtered = hardware;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.vendor.toLowerCase().includes(query) ||
        item.model.toLowerCase().includes(query) ||
        item.serialNumber.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [hardware, searchQuery, statusFilter]);

  const handleAddNew = () => {
    setEditingItem(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (item: Hardware) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: HardwareFormData) => {
    if (editingItem) {
      updateHardware(editingItem.id, data);
    } else {
      addHardware(data);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteHardware(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <HardDrive className="h-12 w-12 mx-auto text-primary animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading hardware inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddNew={handleAddNew}
      />

      <main className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <StatCard
            title="Total Assets"
            value={stats.total}
            icon={HardDrive}
            description="Registered hardware"
            onClick={() => handleStatusFilter('all')}
            isActive={statusFilter === 'all'}
          />
          <StatCard
            title="Healthy"
            value={stats.healthy}
            icon={CheckCircle2}
            variant="success"
            description="All systems go"
            onClick={() => handleStatusFilter('healthy')}
            isActive={statusFilter === 'healthy'}
          />
          <StatCard
            title="Attention"
            value={stats.warning}
            icon={AlertTriangle}
            variant="warning"
            description="Needs review"
            onClick={() => handleStatusFilter('warning')}
            isActive={statusFilter === 'warning'}
          />
          <StatCard
            title="Critical"
            value={stats.critical}
            icon={XCircle}
            variant="destructive"
            description="Immediate action"
            onClick={() => handleStatusFilter('critical')}
            isActive={statusFilter === 'critical'}
          />
          <StatCard
            title="Maintenance"
            value={stats.withMaintenance}
            icon={Wrench}
            description="Active contracts"
          />
          <StatCard
            title="Pro Support"
            value={stats.withSupport}
            icon={Shield}
            description="With support plans"
          />
        </div>

        {/* Hardware Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Hardware Inventory</h2>
            <p className="text-sm text-muted-foreground">
              {filteredHardware.length} of {hardware.length} items
            </p>
          </div>
          <HardwareTable
            hardware={filteredHardware}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>

      {/* Add/Edit Form */}
      <HardwareForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(undefined);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hardware</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this hardware asset? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
