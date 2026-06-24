'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink, BarChart2, Users, Eye, TrendingUp } from 'lucide-react';
import { Translatable } from '../translatable';

export function SiteTrafficPanel() {
  return (
    <div className="space-y-8 mt-4">

      {/* Quick Stats Links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <Translatable text="Active Users" />
            </CardTitle>
            <CardDescription><Translatable text="Real-time" /></CardDescription>
          </CardHeader>
          <CardContent>
            <a href="https://analytics.google.com/analytics/web/#/p542119803/realtime/overview" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
              <Translatable text="View in Google Analytics" />
              <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <Translatable text="Page Views" />
            </CardTitle>
            <CardDescription><Translatable text="Last 30 days" /></CardDescription>
          </CardHeader>
          <CardContent>
            <a href="https://analytics.google.com/analytics/web/#/p542119803/reports/reportinghub" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
              <Translatable text="View in Google Analytics" />
              <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-primary" />
              <Translatable text="Traffic Sources" />
            </CardTitle>
            <CardDescription><Translatable text="Last 30 days" /></CardDescription>
          </CardHeader>
          <CardContent>
            <a href="https://analytics.google.com/analytics/web/#/p542119803/reports/acquisition-overview" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
              <Translatable text="View in Google Analytics" />
              <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <Translatable text="Top Pages" />
            </CardTitle>
            <CardDescription><Translatable text="Last 30 days" /></CardDescription>
          </CardHeader>
          <CardContent>
            <a href="https://analytics.google.com/analytics/web/#/p542119803/reports/engagement-pages-and-screens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
              <Translatable text="View in Google Analytics" />
              <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Live Looker Studio Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            <Translatable text="Live Analytics Dashboard" />
          </CardTitle>
          <CardDescription>
            <Translatable text="Real-time data from Google Analytics — use the date range filter to adjust the period." />
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden rounded-b-lg">
          <iframe
            width="100%"
            height="600"
            src="https://datastudio.google.com/embed/reporting/2f16c839-82ce-4118-9c17-147a53d56f86/page/ePY1F" 
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle><Translatable text="Quick Analytics Links" /></CardTitle>
          <CardDescription><Translatable text="Direct links to your Google Analytics reports" /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <a href="https://analytics.google.com/analytics/web/#/p542119803/realtime/overview" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors text-sm">
              <Users className="h-4 w-4 text-primary shrink-0" />
              <span>Realtime Overview</span>
              <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
            </a>
            <a href="https://analytics.google.com/analytics/web/#/p542119803/reports/reportinghub" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors text-sm">
              <BarChart2 className="h-4 w-4 text-primary shrink-0" />
              <span>Reports Overview</span>
              <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
            </a>
            <a href="https://analytics.google.com/analytics/web/#/p542119803/reports/acquisition-overview" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors text-sm">
              <TrendingUp className="h-4 w-4 text-primary shrink-0" />
              <span>Acquisition Overview</span>
              <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
            </a>
            <a href="https://analytics.google.com/analytics/web/#/p542119803/reports/engagement-pages-and-screens" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors text-sm">
              <Eye className="h-4 w-4 text-primary shrink-0" />
              <span>Pages and Screens</span>
              <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
            </a>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button asChild size="lg">
          <a href="https://analytics.google.com/analytics/web/#/p542119803" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            <Translatable text="Open Full Google Analytics Dashboard" />
          </a>
        </Button>
      </div>

    </div>
  );
}
