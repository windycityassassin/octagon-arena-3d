import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AD_SPACES } from './data';
import { AdSpace } from './types';
import { 
  Square, 
  Fence, 
  Cylinder, 
  Monitor, 
  X,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AdSpacePanelProps {
  selectedAdSpace: string | null;
  hoveredAdSpace: string | null;
  onAdSpaceSelect: (id: string | null) => void;
  onAdSpaceHover: (id: string | null) => void;
}

const getIcon = (type: AdSpace['type']) => {
  switch (type) {
    case 'mat': return <Square className="h-4 w-4" />;
    case 'fence': return <Fence className="h-4 w-4" />;
    case 'post': return <Cylinder className="h-4 w-4" />;
    case 'banner': return <Monitor className="h-4 w-4" />;
  }
};

const getTypeLabel = (type: AdSpace['type']) => {
  switch (type) {
    case 'mat': return 'Mat';
    case 'fence': return 'Fence';
    case 'post': return 'Post';
    case 'banner': return 'Banner';
  }
};

const getTierInfo = (type: AdSpace['type'], name: string) => {
  if (name.includes('Center')) return { label: 'Premium', class: 'badge-premium' };
  if (type === 'banner') return { label: 'Featured', class: 'bg-accent/15 text-accent border border-accent/25' };
  return { label: 'Standard', class: 'bg-secondary/80 text-secondary-foreground border border-border/50' };
};

const groupedSpaces = {
  mat: AD_SPACES.filter((s) => s.type === 'mat'),
  fence: AD_SPACES.filter((s) => s.type === 'fence'),
  post: AD_SPACES.filter((s) => s.type === 'post'),
  banner: AD_SPACES.filter((s) => s.type === 'banner'),
};

export const AdSpacePanel = ({
  selectedAdSpace,
  hoveredAdSpace,
  onAdSpaceSelect,
  onAdSpaceHover,
}: AdSpacePanelProps) => {
  const selectedSpace = AD_SPACES.find((s) => s.id === selectedAdSpace);

  return (
    <div className="absolute top-6 right-6 z-10 w-[320px]">
      <div className="glass-panel rounded-2xl max-h-[calc(100vh-6rem)] flex flex-col overflow-hidden hover-lift">
        {/* Header */}
        <div className="p-5 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/15 arena-glow-subtle">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-wider uppercase text-foreground">
                  Ad Spaces
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select to view details
                </p>
              </div>
            </div>
            <div className="badge-available flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {AD_SPACES.length} Live
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {selectedSpace ? (
            <div className="p-5">
              {/* Selected Space Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-foreground tracking-wide leading-tight">
                    {selectedSpace.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-secondary/80 text-secondary-foreground border border-border/50">
                      {getTypeLabel(selectedSpace.type)}
                    </span>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${getTierInfo(selectedSpace.type, selectedSpace.name).class}`}>
                      {getTierInfo(selectedSpace.type, selectedSpace.name).label}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
                  onClick={() => onAdSpaceSelect(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <Separator className="my-4 bg-border/30" />

              {/* Details */}
              <div className="space-y-5 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                    Description
                  </span>
                  <p className="text-foreground mt-2 leading-relaxed">
                    {selectedSpace.description}
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                      Dimensions
                    </span>
                    <p className="text-foreground mt-2 font-mono text-lg font-bold">
                      {selectedSpace.dimensions}
                    </p>
                  </div>
                  <div className="flex-1">
                    <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                      Status
                    </span>
                    <div className="mt-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-semibold ${
                        selectedSpace.available 
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' 
                          : 'bg-destructive/15 text-destructive border border-destructive/25'
                      }`}>
                        <span className={`h-2 w-2 rounded-full ${selectedSpace.available ? 'bg-emerald-500' : 'bg-destructive'}`} />
                        {selectedSpace.available ? 'Available' : 'Reserved'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-5 bg-border/30" />

              {/* CTA */}
              <Button 
                className="w-full h-12 font-bold tracking-wider uppercase gap-2 btn-premium text-primary-foreground rounded-xl"
                size="lg"
              >
                Express Interest
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[480px] custom-scrollbar">
              <div className="p-4 space-y-5">
                {(Object.entries(groupedSpaces) as [AdSpace['type'], AdSpace[]][]).map(
                  ([type, spaces]) => (
                    <div key={type}>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-2.5 px-1">
                        <span className="p-1.5 rounded-lg bg-muted/50">
                          {getIcon(type)}
                        </span>
                        {getTypeLabel(type)} Spaces 
                        <span className="text-primary font-bold">({spaces.length})</span>
                      </h4>
                      <div className="space-y-1">
                        {spaces.map((space) => {
                          const isActive = hoveredAdSpace === space.id;
                          return (
                            <button
                              key={space.id}
                              className={`w-full text-left px-3.5 py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-between group ${
                                isActive
                                  ? 'bg-primary/15 text-primary ring-1 ring-primary/40'
                                  : 'hover:bg-muted/60'
                              }`}
                              onClick={() => onAdSpaceSelect(space.id)}
                              onMouseEnter={() => onAdSpaceHover(space.id)}
                              onMouseLeave={() => onAdSpaceHover(null)}
                            >
                              <span className="truncate font-medium">{space.name}</span>
                              <ChevronRight className={`h-4 w-4 flex-shrink-0 transition-all duration-200 ${
                                isActive 
                                  ? 'opacity-100 translate-x-0 text-primary' 
                                  : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'
                              }`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
};