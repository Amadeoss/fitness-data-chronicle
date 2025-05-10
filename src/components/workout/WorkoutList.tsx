
import { useState, useEffect } from "react";
import { getUserWorkouts, Workout } from "../../services/WorkoutService";
import { useAuth } from "../../contexts/AuthContext";
import { Card } from "../ui/card";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "../ui/button";

export const WorkoutList = () => {
  const { currentUser } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const data = await getUserWorkouts(currentUser.uid);
        setWorkouts(data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [currentUser]);

  const toggleExpand = (workoutId: string | undefined) => {
    if (!workoutId) return;
    if (expandedWorkout === workoutId) {
      setExpandedWorkout(null);
    } else {
      setExpandedWorkout(workoutId);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Workouts werden geladen...</div>;
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">Noch keine Workouts</h3>
        <p className="text-muted-foreground mt-2">
          Füge dein erstes Workout hinzu, um es hier zu sehen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Deine Workouts</h2>
      
      {workouts.map((workout) => (
        <Card key={workout.id} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">
                {format(workout.date, "EEEE, d. MMMM yyyy", { locale: de })}
              </h3>
              <span className="badge-muscle">{workout.muscleGroup}</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => toggleExpand(workout.id)}
            >
              {expandedWorkout === workout.id ? "Weniger anzeigen" : "Details anzeigen"}
            </Button>
          </div>
          
          {expandedWorkout === workout.id && (
            <div className="mt-4 space-y-4">
              <h4 className="font-medium">Übungen:</h4>
              <div className="space-y-2">
                {workout.exercises.map((exercise, index) => (
                  <div 
                    key={index} 
                    className="exercise-card"
                  >
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium">{exercise.name}</h5>
                      <span className="badge-weight">{exercise.weight} kg</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {exercise.sets} × {exercise.reps} Wiederholungen
                    </p>
                    {exercise.comments && (
                      <p className="text-sm mt-2 italic">
                        "{exercise.comments}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default WorkoutList;
