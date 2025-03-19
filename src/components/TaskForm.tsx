
import React, { useState } from 'react';
import { PlusCircle, Calendar, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { mockCategories } from '@/utils/mockData';
import { formatDate } from '@/utils/timeUtils';
import { Task } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState(mockCategories[0].id);
  const [duration, setDuration] = useState(60);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      priority,
      category,
      duration,
      completed: false,
      progress: 0,
      createdAt: new Date(),
      dueDate,
    };

    onAddTask(newTask);
    toast({
      title: "Success",
      description: "Task added successfully",
      duration: 3000,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory(mockCategories[0].id);
    setDuration(60);
    setDueDate(undefined);
    setIsOpen(false);
  };

  return (
    <div className="mb-6 animate-fade-in">
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)} 
          className="group w-full py-6 flex items-center justify-center gap-2 transition-all duration-300 hover:bg-primary/90"
        >
          <PlusCircle className="mr-1 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          <span>Add New Task</span>
        </Button>
      ) : (
        <div className="w-full bg-card shadow-lg rounded-lg p-4 animate-scale-in">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Input 
                  type="text" 
                  placeholder="Task title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium focus-visible:ring-1"
                />
              </div>
              
              <div>
                <Textarea 
                  placeholder="Description (optional)" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none focus-visible:ring-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div className="flex items-center">
                            <div 
                              className="h-3 w-3 rounded-full mr-2" 
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Priority</label>
                  <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  Duration: {duration} minutes
                </label>
                <Slider 
                  value={[duration]} 
                  min={15} 
                  max={180} 
                  step={15} 
                  onValueChange={(value) => setDuration(value[0])}
                  className="py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">Due Date (Optional)</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      {dueDate ? formatDate(dueDate) : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <CalendarComponent
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Task</Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskForm;
