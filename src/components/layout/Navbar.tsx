
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

export const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      toast.success("Erfolgreich ausgeloggt");
      navigate("/login");
    } catch (error) {
      toast.error("Fehler beim Ausloggen");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="bg-card shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">FitTrack</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/workouts")}
              >
                Workouts
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                Ausloggen
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/login")}
              >
                Anmelden
              </Button>
              <Button 
                onClick={() => navigate("/signup")}
              >
                Registrieren
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
