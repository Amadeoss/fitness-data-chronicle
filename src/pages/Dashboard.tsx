
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { getUserWorkouts } from "@/services/WorkoutService";
import { useAuth } from "@/contexts/AuthContext";
import StatsSummary from "@/components/dashboard/StatsSummary";
import ExerciseProgress from "@/components/dashboard/ExerciseProgress";
import { Select } from "@/components/ui/select";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [exercises, setExercises] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>("");

  useEffect(() => {
    const fetchExercises = async () => {
      if (!currentUser) return;
      
      try {
        const workouts = await getUserWorkouts(currentUser.uid);
        
        // Alle eindeutigen Übungsnamen extrahieren
        const uniqueExercises = new Set<string>();
        
        workouts.forEach(workout => {
          workout.exercises.forEach(exercise => {
            uniqueExercises.add(exercise.name);
          });
        });
        
        const exercisesList = Array.from(uniqueExercises);
        setExercises(exercisesList);
        
        // Wähle die erste Übung als Standard aus, wenn vorhanden
        if (exercisesList.length > 0 && !selectedExercise) {
          setSelectedExercise(exercisesList[0]);
        }
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchExercises();
  }, [currentUser]);

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dein Dashboard</h1>
        
        <StatsSummary />
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Fortschritt</h2>
            
            {exercises.length > 0 && (
              <div className="w-64">
                <select
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  {exercises.map((exercise) => (
                    <option key={exercise} value={exercise}>
                      {exercise}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {selectedExercise ? (
            <ExerciseProgress exerciseName={selectedExercise} />
          ) : (
            <div className="text-center py-8 bg-card rounded-lg">
              <h3 className="text-lg font-medium">Keine Übungen gefunden</h3>
              <p className="text-muted-foreground mt-2">
                Füge ein Workout hinzu, um deinen Fortschritt zu sehen.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
