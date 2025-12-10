import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Maximize2
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
      <Card className="bg-background/90 backdrop-blur-sm border-border/50 max-h-[calc(100vh-8rem)] flex flex-col">
        <CardHeader className="py-3 px-4 flex-shrink-0">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Maximize2 className="h-4 w-4" />
              Ad Spaces
            </span>
            <Badge variant="secondary" className="text-xs">
              {AD_SPACES.length} Available
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 flex-1 overflow-hidden">
          {selectedSpace ? (
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{selectedSpace.name}</h3>
                  <Badge variant="outline" className="mt-1">
                    {getTypeLabel(selectedSpace.type)}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onAdSpaceSelect(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Separator className="my-3" />

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Description</span>
                  <p className="text-foreground mt-1">{selectedSpace.description}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Dimensions</span>
                  <p className="text-foreground mt-1 font-mono">{selectedSpace.dimensions}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <p className="mt-1">
                    <Badge variant={selectedSpace.available ? 'default' : 'secondary'}>
                      {selectedSpace.available ? 'Available' : 'Reserved'}
                    </Badge>
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <Button className="w-full" size="sm">
                Express Interest
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="p-4 space-y-4">
                {(Object.entries(groupedSpaces) as [AdSpace['type'], AdSpace[]][]).map(
                  ([type, spaces]) => (
                    <div key={type}>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                        {getIcon(type)}
                        {getTypeLabel(type)} Spaces ({spaces.length})
                      </h4>
                      <div className="space-y-1">
                        {spaces.map((space) => (
                          <button
                            key={space.id}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group ${
                              hoveredAdSpace === space.id
                                ? 'bg-primary/20 text-primary'
                                : 'hover:bg-muted'
                            }`}
                            onClick={() => onAdSpaceSelect(space.id)}
                            onMouseEnter={() => onAdSpaceHover(space.id)}
                            onMouseLeave={() => onAdSpaceHover(null)}
                          >
                            <span className="truncate">{space.name}</span>
                            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
