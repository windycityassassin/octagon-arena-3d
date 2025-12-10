import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  DollarSign
} from 'lucide-react';

interface AdSpacePanelProps {
  selectedAdSpace: string | null;
  hoveredAdSpace: string | null;
  onAdSpaceSelect: (id: string | null) => void;
  onAdSpaceHover: (id: string | null) => void;
}

const getIcon = (type: AdSpace['type']) => {
  switch (type) {
    case 'mat':
      return <Square className="h-4 w-4" />;
    case 'fence':
      return <Fence className="h-4 w-4" />;
    case 'post':
      return <Cylinder className="h-4 w-4" />;
    case 'banner':
      return <Monitor className="h-4 w-4" />;
  }
};

const getTypeLabel = (type: AdSpace['type']) => {
  switch (type) {
    case 'mat':
      return 'Mat';
    case 'fence':
      return 'Fence';
    case 'post':
      return 'Post';
    case 'banner':
      return 'Banner';
  }
};

const getPremiumLevel = (type: AdSpace['type'], name: string) => {
  if (name.includes('Center')) return 'Premium';
  if (type === 'banner') return 'Featured';
  if (type === 'post') return 'Standard';
  return 'Standard';
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
    <div className="absolute top-4 right-4 z-10 w-80">
      <div className="glass-panel rounded-2xl max-h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-lg font-bold tracking-wider uppercase">Ad Spaces</h3>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20 font-bold">
              {AD_SPACES.length} Available
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {selectedSpace ? (
            <div className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground tracking-wide">{selectedSpace.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {getTypeLabel(selectedSpace.type)}
                    </Badge>
                    <Badge 
                      className={`text-xs ${
                        getPremiumLevel(selectedSpace.type, selectedSpace.name) === 'Premium' 
                          ? 'bg-primary/20 text-primary border-primary/30'
                          : getPremiumLevel(selectedSpace.type, selectedSpace.name) === 'Featured'
                          ? 'bg-accent/20 text-accent border-accent/30'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {getPremiumLevel(selectedSpace.type, selectedSpace.name)}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onAdSpaceSelect(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Separator className="my-4 bg-border/50" />

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Description</span>
                  <p className="text-foreground mt-1 leading-relaxed">{selectedSpace.description}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Dimensions</span>
                  <p className="text-foreground mt-1 font-mono text-lg font-bold">{selectedSpace.dimensions}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Status</span>
                  <div className="mt-1">
                    <Badge 
                      className={`${
                        selectedSpace.available 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                          : 'bg-destructive/20 text-destructive border-destructive/30'
                      }`}
                    >
                      {selectedSpace.available ? '● Available' : '● Reserved'}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator className="my-4 bg-border/50" />

              <Button className="w-full h-11 font-bold tracking-wider uppercase gap-2 arena-glow" size="lg">
                <DollarSign className="h-4 w-4" />
                Express Interest
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[450px]">
              <div className="p-4 space-y-5">
                {(Object.entries(groupedSpaces) as [AdSpace['type'], AdSpace[]][]).map(
                  ([type, spaces]) => (
                    <div key={type}>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span className="p-1 rounded bg-muted">
                          {getIcon(type)}
                        </span>
                        {getTypeLabel(type)} Spaces 
                        <span className="text-primary">({spaces.length})</span>
                      </h4>
                      <div className="space-y-1">
                        {spaces.map((space) => (
                          <button
                            key={space.id}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between group ${
                              hoveredAdSpace === space.id
                                ? 'bg-primary/15 text-primary ring-1 ring-primary/30'
                                : 'hover:bg-muted/80'
                            }`}
                            onClick={() => onAdSpaceSelect(space.id)}
                            onMouseEnter={() => onAdSpaceHover(space.id)}
                            onMouseLeave={() => onAdSpaceHover(null)}
                          >
                            <span className="truncate font-medium">{space.name}</span>
                            <ChevronRight className={`h-4 w-4 transition-all ${
                              hoveredAdSpace === space.id 
                                ? 'opacity-100 translate-x-0' 
                                : 'opacity-0 -translate-x-2'
                            }`} />
                          </button>
                        ))}
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
