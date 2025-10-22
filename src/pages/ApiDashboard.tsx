import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiKeyManager } from "@/components/api/ApiKeyManager";
import { ApiDocumentation } from "@/components/api/ApiDocumentation";
import { Key, Globe, Code, Zap, Shield } from "lucide-react";

export default function ApiDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Key className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">API Access</h1>
          <p className="text-muted-foreground">
            Integrate LegalDeep AI into your applications with reliable paid plans and enterprise support.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Pay Per Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24</div>
            <p className="text-xs text-muted-foreground">per contract analysis</p>
            <Badge variant="secondary" className="mt-2">No long-term commitment</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Enterprise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Unlimited</div>
            <p className="text-xs text-muted-foreground">starting at $299/month</p>
            <Badge className="mt-2">Includes dedicated support</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Rate Limits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">60/min</div>
            <p className="text-xs text-muted-foreground">requests per minute baseline</p>
            <Badge variant="outline" className="mt-2">Higher limits available</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="keys">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="keys">
          <ApiKeyManager />
        </TabsContent>

        <TabsContent value="docs">
          <ApiDocumentation />
        </TabsContent>
      </Tabs>
    </div>
  );
}