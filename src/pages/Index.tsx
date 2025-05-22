
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login page
    navigate('/login');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-black">
      <div className="text-center animate-pulse">
        <h1 className="text-3xl font-display text-luxury-gold">Loading...</h1>
      </div>
    </div>
  );
};

export default Index;
