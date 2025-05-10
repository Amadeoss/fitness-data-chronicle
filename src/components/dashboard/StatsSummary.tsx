
import { useState, useEffect } from "react";
import { getUserWorkouts } from "../../services/WorkoutService";
import { useAuth } from "../../contexts/AuthContext";
import { Card } from "../ui/card";

export const StatsSummary = () => {
  const { currentUser } = useAuth();
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [lastWorkout, setLastWorkout] = useState<Date | null>(null);
  const [mostTrainedMuscle, setMostTrainedMuscle] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const workouts = await getUserWorkouts(currentUser.uid);
        
        // Total Workouts
        setTotalWorkouts(workouts.length);
        
        // Last Workout
        if (workouts.length > 0) {
          setLastWorkout(new Date(Math.max(...workouts.map(w => w.date.getTime()))));
        }
        
        // Most Trained Muscle Group
        const muscleGroups: {[key: string]: number} = {};
        workouts.forEach(workout => {
          muscleGroups[workout.muscleGroup] = (muscleGroups[workout.muscleGroup] || 0) + 1;
        });
        
        let maxCount = 0;
        let mostTrained = "";
        
        Object.entries(muscleGroups).forEach(([muscle, count]) => {
          if (count > maxCount) {
            maxCount = count;
            mostTrained = muscle;
          }
        });
        
        setMostTrainedMuscle(mostTrained);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser]);

  if (loading) {
    return <div className="text-center py-4">Statistiken werden geladen...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="stat-card">
        <h3 className="text-muted-foreground mb-2">Workouts insgesamt</h3>
        <div className="stat-value">{totalWorkouts}</div>
      </Card>
      
      <Card className="stat-card">
        <h3 className="text-muted-foreground mb-2">Letztes Training</h3>
        <div className="stat-value">
          {lastWorkout ? new Date(lastWorkout).toLocaleDateString('de-DE') : "-"}
        </div>
      </Card>
      
      <Card className="stat-card">
        <h3 className="text-muted-foreground mb-2">Top Muskelgruppe</h3>
        <div className="stat-value">{mostTrainedMuscle || "-"}</div>
      </Card>
    </div>
  );
};

export default StatsSummary;
