'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';
import { Translatable } from '../translatable';
import { Alert, AlertDescription } from '../ui/alert';

const visitorData = [
  { date: '2026-02-15', visitors: 150 },
  { date: '2026-02-16', visitors: 200 },
  { date: '2026-02-17', visitors: 180 },
  { date: '2026-02-18', visitors: 220 },
  { date: '2026-02-19', visitors: 250 },
  { date: '2026-02-20', visitors: 230 },
  { date: '2026-02-21', visitors: 280 },
  { date: '2026-02-22', visitors: 300 },
  { date: '2026-02-23', visitors: 290 },
  { date: '2026-02-24', visitors: 320 },
  { date: '2026-02-25', visitors: 350 },
  { date: '2026-02-26', visitors: 330 },
  { date: '2026-02-27', visitors: 310 },
  { date: '2026-02-28', visitors: 340 },
  { date: '2026-03-01', visitors: 400 },
  { date: '2026-03-02', visitors: 380 },
  { date: '2026-03-03', visitors: 410 },
  { date: '2026-03-04', visitors: 430 },
  { date: '2026-03-05', visitors: 450 },
  { date: '2026-03-06', visitors: 440 },
  { date: '2026-03-07', visitors: 460 },
  { date: '2026-03-08', visitors: 480 },
  { date: '2026-03-09', visitors: 470 },
  { date: '2026-03-10', visitors: 500 },
  { date: '2026-03-11', visitors: 520 },
  { date: '2026-03-12', visitors: 510 },
  { date: '2026-03-13', visitors: 530 },
  { date: '2026-03-14', visitors: 550 },
  { date: '2026-03-15', visitors: 540 },
  { date: '2026-03-16', visitors: 560 },
];

const topPagesData = [
    { page: '/', views: 12500 },
    { page: '/provinces/western-cape', views: 8900 },
    { page: '/towns/cape-town', views: 7600 },
    { page: '/routes/garden-route', views: 6500 },
    { page: '/plan-your-trip', views: 5200 },
];


export function SiteTrafficPanel() {
  return (
    <div className="space-y-8 mt-4">
        <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
            <AlertDescription>
                <Translatable text="This is a preview of the Site Traffic dashboard. The data shown here is for demonstration purposes only. To see live analytics, you will need to connect this to your Google Analytics account." />
            </AlertDescription>
        </Alert>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader>
                    <CardTitle><Translatable text="Total Visitors" /></CardTitle>
                    <CardDescription><Translatable text="Last 30 days" /></CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold text-primary">10,482</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle><Translatable text="Total Page Views" /></CardTitle>
                    <CardDescription><Translatable text="Last 30 days" /></CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold text-primary">42,931</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle><Translatable text="Sessions" /></CardTitle>
                    <CardDescription><Translatable text="Last 30 days" /></CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold text-primary">12,104</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle><Translatable text="Bounce Rate" /></CardTitle>
                    <CardDescription><Translatable text="Last 30 days" /></CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold text-primary">34.2%</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle><Translatable text="Daily Visitors (Last 30 Days)" /></CardTitle>
                </CardHeader>
                <CardContent className="h-[350px] w-full">
                    <ResponsiveContainer>
                        <LineChart data={visitorData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle><Translatable text="Top 5 Most Visited Pages" /></CardTitle>
                    <CardDescription><Translatable text="Last 30 days" /></CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {topPagesData.map((item) => (
                            <li key={item.page} className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground truncate">{item.page}</span>
                                <span className="font-bold">{item.views.toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>

         <div className="text-center">
            <Button asChild>
                <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    <Translatable text="View Full Analytics in Google Analytics" />
                </a>
            </Button>
        </div>
    </div>
  );
}
