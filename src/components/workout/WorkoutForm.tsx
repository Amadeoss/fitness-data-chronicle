
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { addWorkout } from "../../services/WorkoutService";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

const muscleGroups = [
  "Brust",
  "Rücken",
  "Schultern",
  "Beine",
  "Arme",
  "Bauch",
  "Vollkörper",
];

interface ExerciseInput {
  name: string;
  weight: number;
  reps: number;
  sets: number;
  comments: string;
}

interface WorkoutFormProps {
  onWorkoutAdded?: () => void;
}

export const WorkoutForm = ({ onWorkoutAdded }: WorkoutFormProps) => {
  const { currentUser } = useAuth();
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [muscleGroup, setMuscleGroup] = useState<string>("Brust");
  const [exercises, setExercises] = useState<ExerciseInput[]>([
    { name: "", weight: 0, reps: 0, sets: 0, comments: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addExercise = () => {
    setExercises([...exercises, { name: "", weight: 0, reps: 0, sets: 0, comments: "" }]);
  };

  const removeExercise = (index: number) => {
    const updatedExercises = [...exercises];
    updatedExercises.splice(index, 1);
    setExercises(updatedExercises);
  };

  const updateExercise = (index: number, field: keyof ExerciseInput, value: string | number) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error("Du musst eingeloggt sein, um Workouts zu speichern");
      return;
    }

    // Validierung
    if (!date || !muscleGroup) {
      toast.error("Datum und Muskelgruppe sind erforderlich");
      return;
    }

    // Übungsdaten validieren
    const validExercises = exercises.filter(exercise => 
      exercise.name.trim() !== "" && exercise.sets > 0 && exercise.reps > 0
    );

    if (validExercises.length === 0) {
      toast.error("Füge mindestens eine gültige Übung hinzu");
      return;
    }

    try {
      setIsSubmitting(true);
      
      await addWorkout({
        userId: currentUser.uid,
        date: new Date(date),
        muscleGroup,
        exercises: validExercises,
      });

      toast.success("Workout erfolgreich gespeichert!");
      
      // Formular zurücksetzen
      setDate(new Date().toISOString().split("T")[0]);
      setMuscleGroup("Brust");
      setExercises([{ name: "", weight: 0, reps: 0, sets: 0, comments: "" }]);
      
      // Callback aufrufen, wenn vorhanden
      if (onWorkoutAdded) {
        onWorkoutAdded();
      }
    } catch (error) {
      toast.error("Fehler beim Speichern des Workouts");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="text-xl font-bold mb-4">Neues Workout erfassen</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label htmlFor="date" className="block text-sm font-medium">
            Datum
          </label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="muscleGroup" className="block text-sm font-medium">
            Muskelgruppe
          </label>
          <select
            id="muscleGroup"
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            required
          >
            {muscleGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Übungen</h3>
      
      {exercises.map((exercise, index) => (
        <div key={index} className="border rounded-md p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Übung {index + 1}</h4>
            {exercises.length > 1 && (
              <Button 
                type="button" 
                variant="destructive" 
                size="sm"
                onClick={() => removeExercise(index)}
              >
                Entfernen
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="space-y-2">
              <label htmlFor={`name-${index}`} className="block text-sm font-medium">
                Name der Übung
              </label>
              <Input
                id={`name-${index}`}
                value={exercise.name}
                onChange={(e) => updateExercise(index, "name", e.target.value)}
                required
                placeholder="z.B. Bankdrücken, Kniebeugen, ..."
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label htmlFor={`weight-${index}`} className="block text-sm font-medium">
                Gewicht (kg)
              </label>
              <Input
                id={`weight-${index}`}
                type="number"
                min="0"
                value={exercise.weight}
                onChange={(e) => updateExercise(index, "weight", Number(e.target.value))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor={`reps-${index}`} className="block text-sm font-medium">
                Wiederholungen
              </label>
              <Input
                id={`reps-${index}`}
                type="number"
                min="1"
                value={exercise.reps}
                onChange={(e) => updateExercise(index, "reps", Number(e.target.value))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor={`sets-${index}`} className="block text-sm font-medium">
                Sätze
              </label>
              <Input
                id={`sets-${index}`}
                type="number"
                min="1"
                value={exercise.sets}
                onChange={(e) => updateExercise(index, "sets", Number(e.target.value))}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor={`comments-${index}`} className="block text-sm font-medium">
              Kommentare (optional)
            </label>
            <Textarea
              id={`comments-${index}`}
              value={exercise.comments}
              onChange={(e) => updateExercise(index, "comments", e.target.value)}
              placeholder="Anmerkungen zur Übung, Technik, etc."
              className="resize-none"
              rows={2}
            />
          </div>
        </div>
      ))}
      
      <div className="flex justify-between my-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={addExercise}
        >
          + Weitere Übung hinzufügen
        </Button>
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Wird gespeichert..." : "Workout speichern"}
        </Button>
      </div>
    </form>
  );
};

export default WorkoutForm;
