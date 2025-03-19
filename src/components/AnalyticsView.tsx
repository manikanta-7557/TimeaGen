
import React from 'react';
import { ProductivityData } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface AnalyticsViewProps {
  productivityData: ProductivityData[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ productivityData }) => {
  // Calculate averages
  const calculateAverages = () => {
    const totalEfficiency = productivityData.reduce((sum, day) => sum + day.efficiencyScore, 0);
    const totalTasksCompleted = productivityData.reduce((sum, day) => sum + day.tasksCompleted, 0);
    const totalTasksPlanned = productivityData.reduce((sum, day) => sum + day.tasksPlanned, 0);
    
    const avgEfficiency = totalEfficiency / productivityData.length;
    const avgTasksCompleted = totalTasksCompleted / productivityData.length;
    const avgTasksPlanned = totalTasksPlanned / productivityData.length;
    const completionRate = (totalTasksCompleted / totalTasksPlanned) * 100;
    
    return {
      avgEfficiency: avgEfficiency.toFixed(1),
      avgTasksCompleted: avgTasksCompleted.toFixed(1),
      avgTasksPlanned: avgTasksPlanned.toFixed(1),
      completionRate: completionRate.toFixed(1)
    };
  };
  
  const averages = calculateAverages();
  
  // Format data for charts
  const formattedData = productivityData.map(day => ({
    name: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    efficiency: day.efficiencyScore,
    completed: day.tasksCompleted,
    planned: day.tasksPlanned
  }));

  return (
    <div className="glass-card rounded-lg p-4 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Productivity Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averages.avgEfficiency}%</div>
            <p className="text-xs text-muted-foreground mt-1">Average efficiency score</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averages.completionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Tasks completed vs planned</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averages.avgTasksPlanned}</div>
            <p className="text-xs text-muted-foreground mt-1">Average tasks planned per day</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averages.avgTasksCompleted}</div>
            <p className="text-xs text-muted-foreground mt-1">Average tasks completed per day</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="efficiency" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="efficiency" className="pt-2">
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 12 }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 12 }} 
                  domain={[0, 100]} 
                  unit="%" 
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Date
                              </span>
                              <span className="font-bold text-sm">
                                {payload[0].payload.name}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Efficiency
                              </span>
                              <span className="font-bold text-sm">
                                {payload[0].value}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="pt-2">
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Date
                              </span>
                              <span className="font-bold text-sm">
                                {payload[0].payload.name}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Planned
                              </span>
                              <span className="font-bold text-sm">
                                {payload[0].value}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Completed
                              </span>
                              <span className="font-bold text-sm">
                                {payload[1].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="planned" fill="#6b7280" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsView;
