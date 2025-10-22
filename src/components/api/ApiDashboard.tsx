import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, Key, TrendingUp, Globe, type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { ApiKeyManager } from './ApiKeyManager';
import { ApiDocumentation } from './ApiDocumentation';

interface UsageStats {
  total_requests: number;
  requests_today: number;
  requests_this_month: number;
  success_rate: number;
  avg_response_time: number;
}

export const ApiDashboard = () => {
  const [stats, setStats] = useState<UsageStats>({
    total_requests: 0,
    requests_today: 0,
    requests_this_month: 0,
    success_rate: 0,
    avg_response_time: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageStats();
  }, []);

  const fetchUsageStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Mock stats for now until types are updated
      // TODO: Implement real API usage tracking after types update
      const mockData = [];

      // Calculate stats from usage data
      const totalRequests = mockData.length || 0;
      const requestsToday = 0;
      const requestsThisMonth = 0;
      const successfulRequests = 0;
      const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100;
      
      setStats({
        total_requests: totalRequests,
        requests_today: requestsToday,
        requests_this_month: requestsThisMonth,
        success_rate: successRate,
        avg_response_time: 1200 // Mock average response time in ms
      });
    } catch (error) {
      console.error('Error fetching usage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, description, badge }: {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description: string;
    badge?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
        {badge && (
          <Badge variant="secondary" className="mt-2">
            {badge}
          </Badge>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">API Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your API usage and manage your integration with LegalDeep AI
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-8 bg-muted rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Requests"
                value={stats.total_requests.toLocaleString()}
                icon={BarChart3}
                description="All-time API calls"
                badge="Lifetime"
              />
              <StatCard
                title="Today's Usage"
                value={stats.requests_today.toLocaleString()}
                icon={TrendingUp}
                description="API calls today"
              />
              <StatCard
                title="Success Rate"
                value={`${stats.success_rate.toFixed(1)}%`}
                icon={Globe}
                description="Successful API responses"
                badge={stats.success_rate >= 95 ? "Excellent" : "Good"}
              />
              <StatCard
                title="Avg Response Time"
                value={`${stats.avg_response_time}ms`}
                icon={Clock}
                description="Average processing time"
                badge="Fast"
              />
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Start</CardTitle>
                <CardDescription>
                  Get started with the LegalDeep AI API in minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">1. Create an API Key</h4>
                  <p className="text-sm text-muted-foreground">
                    Generate a secure API key to authenticate your requests
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">2. Make Your First Request</h4>
                  <p className="text-sm text-muted-foreground">
                    Use our REST API to analyze legal documents programmatically
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">3. Integrate & Scale</h4>
                  <p className="text-sm text-muted-foreground">
                    Build powerful legal tech solutions with our AI capabilities
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>
                  Available endpoints in the LegalDeep AI API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <code className="text-sm">POST /api/analyze</code>
                    <p className="text-xs text-muted-foreground">Analyze legal documents</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <code className="text-sm">GET /api/status</code>
                    <p className="text-xs text-muted-foreground">Check analysis status</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <code className="text-sm">POST /api/scan</code>
                    <p className="text-xs text-muted-foreground">Process scanned documents</p>
                  </div>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="keys">
          <ApiKeyManager />
        </TabsContent>

        <TabsContent value="docs">
          <ApiDocumentation />
        </TabsContent>
      </Tabs>
    </div>
  );
};