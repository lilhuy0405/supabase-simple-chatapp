import { useEffect, useState } from "react";
import ChatRoom from "./components/ChatRoom";
import SignIn from "./components/SignIn";
import "./index.css";
import { supabase } from "./supbase";
function App() {
  const [user, setUser] = useState<any>(null);
  const fetchUser = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      if (user) {
        setUser(user);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      setUser(null);
      if (error) throw error;
    } catch (err) {
      console.log(err);
    }
  };
  console.log(user);

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬 SUPABASE</h1>
        {user && (
          <button className="sign-out" onClick={handleSignOut}>
            Sign Out
          </button>
        )}
      </header>

      <section>
        {user ? <ChatRoom user={user} /> : <SignIn onSuccess={fetchUser} />}
      </section>
    </div>
  );
}

export default App;
