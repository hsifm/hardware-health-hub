import { useState, useMemo } from 'react';
import { useHardware } from '@/hooks/useHardware';
import { Header } from '@/components/dashboard/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { HardwareTable } from '@/components/dashboard/HardwareTable';
import { HardwareForm } from '@/components/dashboard/HardwareForm';
import { Hardware, HardwareFormData, HARDWARE_CATEGORIES, HardwareCategory } from '@/types/hardware';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  HardDrive, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  X
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
type CategoryFilter = 'all' | HardwareCategory;

const Index = () => {
  const { hardware, isLoading, addHardware, updateHardware, deleteHardware, getStats } = useHardware();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
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
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
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
  }, [hardware, searchQuery, statusFilter, categoryFilter]);

  const clearAllFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  const hasActiveFilters = statusFilter !== 'all' || categoryFilter !== 'all';

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
        </div>

        {/* Hardware Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Hardware Inventory</h2>
              
              {/* Category Filter Dropdown */}
              <Select
                value={categoryFilter}
                onValueChange={(value: CategoryFilter) => setCategoryFilter(value)}
              >
                <SelectTrigger className="w-[180px] h-8 text-sm bg-background border-border">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {HARDWARE_CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Active Filter Badges */}
              {statusFilter !== 'all' && (
                <Badge 
                  variant="outline" 
                  className={
                    statusFilter === 'healthy' 
                      ? 'bg-success/10 text-success border-success/30' 
                      : statusFilter === 'warning'
                      ? 'bg-warning/10 text-warning border-warning/30'
                      : 'bg-destructive/10 text-destructive border-destructive/30'
                  }
                >
                  {statusFilter === 'healthy' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                  {statusFilter === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {statusFilter === 'critical' && <XCircle className="h-3 w-3 mr-1" />}
                  {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} only
                </Badge>
              )}

              {/* Clear All Filters */}
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllFilters}
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear filters
                </Button>
              )}
            </div>
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
