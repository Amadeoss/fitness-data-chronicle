
import { useState, useEffect } from "react";
import { getExerciseHistory } from "../../services/WorkoutService";
import { useAuth } from "../../contexts/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Card } from "../ui/card";

interface ExerciseProgressProps {
  exerciseName: string;
}

export const ExerciseProgress = ({ exerciseName }: ExerciseProgressProps) => {
  const { currentUser } = useAuth();
  const [progressData, setProgressData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser || !exerciseName) return;

      try {
        setLoading(true);
        const history = await getExerciseHistory(currentUser.uid, exerciseName);
        
        const formattedData = history.map((item) => ({
          date: format(item.date, "dd.MM.yy", { locale: de }),
          weight: item.weight,
          reps: item.reps,
          sets: item.sets,
          volume: item.weight * item.reps * item.sets,
        }));

        setProgressData(formattedData);
      } catch (error) {
        console.error("Error fetching exercise history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [currentUser, exerciseName]);

  if (loading) {
    return <div className="text-center py-4">Daten werden geladen...</div>;
  }

  if (progressData.length < 2) {
    return (
      <Card className="p-4">
        <h3 className="font-semibold mb-4">{exerciseName} Fortschritt</h3>
        <p className="text-muted-foreground">
          Nicht genügend Daten für {exerciseName}. Füge mehr Workouts hinzu, um deinen Fortschritt zu sehen.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">{exerciseName} Fortschritt</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="weight"
              stroke="#EA384C"
              name="Gewicht (kg)"
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="volume"
              stroke="#33C3F0"
              name="Volumen (kg)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ExerciseProgress;
