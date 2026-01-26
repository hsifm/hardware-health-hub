import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, HardDrive } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddNew: () => void;
}

export function Header({ searchQuery, onSearchChange, onAddNew }: HeaderProps) {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <HardDrive className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Hardware Manager</h1>
              <p className="text-sm text-muted-foreground">Track and manage your hardware assets</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hardware..."
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                className="pl-9 w-64 bg-background border-border"
              />
            </div>
            <Button onClick={onAddNew} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Hardware
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
