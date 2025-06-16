
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Redirect based on authentication status
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center animate-pulse">
        <h1 className="text-3xl font-sans text-primary">Loading...</h1>
      </div>
    </div>
  );
};

export default Index;
