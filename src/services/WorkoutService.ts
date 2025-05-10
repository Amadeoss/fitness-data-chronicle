
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Exercise {
  name: string;
  weight: number;
  reps: number;
  sets: number;
  comments?: string;
}

export interface Workout {
  id?: string;
  userId: string;
  date: Date;
  muscleGroup: string;
  exercises: Exercise[];
}

export const addWorkout = async (workout: Workout): Promise<string> => {
  const docRef = await addDoc(collection(db, "workouts"), {
    ...workout,
    date: workout.date.toISOString()
  });
  return docRef.id;
};

export const getUserWorkouts = async (userId: string): Promise<Workout[]> => {
  const q = query(
    collection(db, "workouts"),
    where("userId", "==", userId),
    orderBy("date", "desc")
  );

  const querySnapshot = await getDocs(q);
  const workouts: Workout[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    workouts.push({
      id: doc.id,
      userId: data.userId,
      date: new Date(data.date),
      muscleGroup: data.muscleGroup,
      exercises: data.exercises
    });
  });

  return workouts;
};

export const updateWorkout = async (id: string, workout: Partial<Workout>): Promise<void> => {
  const workoutRef = doc(db, "workouts", id);
  
  // Wenn ein Datum vorhanden ist, muss es in einen String umgewandelt werden
  const updateData = { ...workout };
  if (updateData.date) {
    updateData.date = updateData.date.toISOString();
  }
  
  await updateDoc(workoutRef, updateData);
};

export const deleteWorkout = async (id: string): Promise<void> => {
  const workoutRef = doc(db, "workouts", id);
  await deleteDoc(workoutRef);
};

export const getExerciseHistory = async (userId: string, exerciseName: string): Promise<{date: Date, weight: number, reps: number, sets: number}[]> => {
  const workouts = await getUserWorkouts(userId);
  
  const history: {date: Date, weight: number, reps: number, sets: number}[] = [];
  
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      if (exercise.name.toLowerCase() === exerciseName.toLowerCase()) {
        history.push({
          date: workout.date,
          weight: exercise.weight,
          reps: exercise.reps,
          sets: exercise.sets
        });
      }
    });
  });
  
  // Nach Datum sortieren (ältestes zuerst)
  return history.sort((a, b) => a.date.getTime() - b.date.getTime());
};
