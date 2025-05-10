
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import WorkoutForm from "@/components/workout/WorkoutForm";
import WorkoutList from "@/components/workout/WorkoutList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Workouts = () => {
  const [activeTab, setActiveTab] = useState<string>("history");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleWorkoutAdded = () => {
    setActiveTab("history");
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Workouts</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="history">Workout-Historie</TabsTrigger>
            <TabsTrigger value="add">Neues Workout</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history" className="mt-4">
            <WorkoutList key={refreshTrigger} />
          </TabsContent>
          
          <TabsContent value="add">
            <WorkoutForm onWorkoutAdded={handleWorkoutAdded} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Workouts;
