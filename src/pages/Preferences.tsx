
import React, { useState } from 'react';
import Header from '@/components/Header';
import UserPreferencesForm from '@/components/UserPreferencesForm';
import { UserPreference } from '@/types';
import { useToast } from '@/components/ui/use-toast';

// Default preferences - in a real app this would come from a database
const initialPreferences: UserPreference = {
  preferredWorkingHours: {
    start: '09:00',
    end: '17:00',
  },
  focusTime: {
    start: '10:00',
    end: '12:00',
  },
  breakPreferences: {
    frequency: 60,
    duration: 15,
  },
  activeTimeTracking: true,
  productiveTimeSlots: [],
  distractionFreeMode: false,
};

const Preferences = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreference>(initialPreferences);

  const handleSavePreferences = (updatedPreferences: UserPreference) => {
    setPreferences(updatedPreferences);
    
    // In a real app, this would save to a database
    localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
    
    toast({
      title: "Preferences Updated",
      description: "Your schedule preferences have been saved successfully.",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
      <Header />
      
      <div className="my-8">
        <h1 className="text-2xl font-bold mb-6">Preferences & Settings</h1>
        <p className="text-muted-foreground mb-8">
          Customize your schedule preferences to help the AI make better suggestions based on your work habits.
        </p>
        
        <UserPreferencesForm 
          initialPreferences={preferences} 
          onSave={handleSavePreferences} 
        />
      </div>
    </div>
  );
};

export default Preferences;
