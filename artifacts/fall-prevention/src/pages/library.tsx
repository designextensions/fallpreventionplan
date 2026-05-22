import { useListLibraryItems, getListLibraryItemsQueryKey, useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, FileText, Mic, PlayCircle, Lock } from "lucide-react";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import type { LibraryItemKind } from "@workspace/api-client-react/src/generated/api.schemas";

export function Library() {
  return (
    <ProtectedRoute>
      <LibraryContent />
    </ProtectedRoute>
  );
}

function LibraryContent() {
  const [filter, setFilter] = useState<string>("all");
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { data: items, isLoading } = useListLibraryItems({ query: { queryKey: getListLibraryItemsQueryKey() } });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/30">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  const hasAccess = me?.tier === 'subscription' || me?.tier === 'concierge' || me?.tier === 'admin';

  if (!hasAccess) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/30">
        <Card className="max-w-lg w-full border-border shadow-xl">
          <CardContent className="pt-10 pb-8 px-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-serif text-2xl font-bold mb-3">Library Locked</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Access the full archive of past classes, expert interviews, and articles by upgrading to Community Plus.
            </p>
            <Button className="w-full min-h-[56px] text-lg rounded-full font-bold">Upgrade Plan</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredItems = items?.filter(item => filter === "all" || item.kind === filter) || [];

  const getIcon = (kind: LibraryItemKind) => {
    switch(kind) {
      case "recording": return <Video className="w-5 h-5" />;
      case "article": return <FileText className="w-5 h-5" />;
      case "interview": return <Mic className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex-1 bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-12">
          <h1 className="font-serif text-4xl font-bold text-primary mb-2">Resource Library</h1>
          <p className="text-xl text-muted-foreground">Past sessions, clinical articles, and interviews.</p>
        </div>

        <Tabs defaultValue="all" onValueChange={setFilter} className="mb-8">
          <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
            <TabsTrigger value="all" className="min-h-[44px] text-base px-6">All Resources</TabsTrigger>
            <TabsTrigger value="recording" className="min-h-[44px] text-base px-6">Recordings</TabsTrigger>
            <TabsTrigger value="article" className="min-h-[44px] text-base px-6">Articles</TabsTrigger>
            <TabsTrigger value="interview" className="min-h-[44px] text-base px-6">Interviews</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <Card key={item.id} className="flex flex-col h-full hover:shadow-md transition-shadow border-border">
              {item.kind === 'recording' && (
                <div className="bg-black aspect-video relative flex items-center justify-center rounded-t-xl overflow-hidden border-b border-border">
                  <PlayCircle className="w-12 h-12 text-white/80" />
                </div>
              )}
              <CardHeader className="flex-1">
                <div className="flex items-center gap-2 text-sm text-primary font-bold uppercase tracking-wider mb-2">
                  {getIcon(item.kind)} {item.kind}
                </div>
                <CardTitle className="font-serif text-xl leading-tight mb-2">{item.title}</CardTitle>
                {item.summary && (
                  <p className="text-muted-foreground text-base line-clamp-3">{item.summary}</p>
                )}
              </CardHeader>
              <CardFooter className="pt-0 flex items-center justify-between text-sm text-muted-foreground border-t border-border mt-auto p-6 bg-muted/10">
                <span>{format(new Date(item.publishedAt), "MMM d, yyyy")}</span>
                {item.durationMin && <span>{item.durationMin} min</span>}
              </CardFooter>
            </Card>
          ))}
          
          {filteredItems.length === 0 && (
            <div className="col-span-full py-16 text-center text-muted-foreground text-lg">
              No items found for this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
