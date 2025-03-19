
import React from 'react';
import { formatDate } from '@/utils/timeUtils';
import { Bell, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { toast } = useToast();
  const today = new Date();

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have no new notifications.",
      duration: 3000,
    });
  };

  return (
    <header className="w-full mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-semibold tracking-tight">TimeTune Genius</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            {formatDate(today)}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full h-10 w-10 p-0 border-none transition-all duration-300 hover:bg-accent"
            onClick={handleNotificationClick}
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Link to="/preferences">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full h-10 w-10 p-0 border-none transition-all duration-300 hover:bg-accent"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
