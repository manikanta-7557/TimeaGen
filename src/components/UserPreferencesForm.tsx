
import React, { useState } from 'react';
import { UserPreference } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, BarChart2, Focus, Bell } from 'lucide-react';

interface UserPreferencesFormProps {
  initialPreferences?: UserPreference;
  onSave: (preferences: UserPreference) => void;
}

const defaultPreferences: UserPreference = {
  preferredWorkingHours: {
    start: '09:00',
    end: '17:00',
  },
  focusTime: {
    start: '10:00',
    end: '12:00',
  },
  breakPreferences: {
    frequency: 60, // 60 minutes
    duration: 15, // 15 minutes
  },
  activeTimeTracking: true,
  productiveTimeSlots: [],
  distractionFreeMode: false,
};

const UserPreferencesForm: React.FC<UserPreferencesFormProps> = ({ 
  initialPreferences = defaultPreferences,
  onSave
}) => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreference>(initialPreferences);

  const handleInputChange = (
    section: keyof UserPreference, 
    field: string, 
    value: string | number | boolean
  ) => {
    if (section === 'preferredWorkingHours' || section === 'focusTime') {
      setPreferences(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else if (section === 'breakPreferences') {
      setPreferences(prev => ({
        ...prev,
        breakPreferences: {
          ...prev.breakPreferences,
          [field]: Number(value)
        }
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(preferences);
    toast({
      title: "Preferences Saved",
      description: "Your schedule preferences have been updated",
      duration: 3000,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Working Hours
            </CardTitle>
            <CardDescription>Set your preferred working hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workStart">Start Time</Label>
                <Input
                  id="workStart"
                  type="time"
                  value={preferences.preferredWorkingHours.start}
                  onChange={(e) => handleInputChange('preferredWorkingHours', 'start', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workEnd">End Time</Label>
                <Input
                  id="workEnd"
                  type="time"
                  value={preferences.preferredWorkingHours.end}
                  onChange={(e) => handleInputChange('preferredWorkingHours', 'end', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Focus className="mr-2 h-5 w-5 text-primary" />
              Focus Time
            </CardTitle>
            <CardDescription>Set your most productive hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="focusStart">Start Time</Label>
                <Input
                  id="focusStart"
                  type="time"
                  value={preferences.focusTime.start}
                  onChange={(e) => handleInputChange('focusTime', 'start', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="focusEnd">End Time</Label>
                <Input
                  id="focusEnd"
                  type="time"
                  value={preferences.focusTime.end}
                  onChange={(e) => handleInputChange('focusTime', 'end', e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-4">
              <Switch
                checked={preferences.distractionFreeMode}
                onCheckedChange={(checked) => handleInputChange('distractionFreeMode', 'distractionFreeMode', checked)}
                id="distraction-free"
              />
              <Label htmlFor="distraction-free" className="cursor-pointer">
                Enable Distraction-Free Mode during focus time
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-primary" />
              Break Preferences
            </CardTitle>
            <CardDescription>Customize your break schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Break Frequency: {preferences.breakPreferences.frequency} minutes</Label>
              </div>
              <Slider
                value={[preferences.breakPreferences.frequency]}
                min={30}
                max={120}
                step={15}
                onValueChange={(value) => handleInputChange('breakPreferences', 'frequency', value[0])}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Break Duration: {preferences.breakPreferences.duration} minutes</Label>
              </div>
              <Slider
                value={[preferences.breakPreferences.duration]}
                min={5}
                max={30}
                step={5}
                onValueChange={(value) => handleInputChange('breakPreferences', 'duration', value[0])}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-primary" />
              Activity Tracking
            </CardTitle>
            <CardDescription>Configure activity monitoring for better suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                checked={preferences.activeTimeTracking}
                onCheckedChange={(checked) => handleInputChange('activeTimeTracking', 'activeTimeTracking', checked)}
                id="activity-tracking"
              />
              <Label htmlFor="activity-tracking" className="cursor-pointer">
                Enable Active Time Tracking
              </Label>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This helps the AI understand your work patterns and make better time suggestions
            </p>
          </CardContent>
        </Card>

        <CardFooter className="flex justify-end">
          <Button type="submit">Save Preferences</Button>
        </CardFooter>
      </div>
    </form>
  );
};

export default UserPreferencesForm;
