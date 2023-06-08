import { useState } from "react";
import { supabase } from "../supbase";

const SignIn = ({ onSuccess }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const handleSignIn = async () => {
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginError?.message == "Email not confirmed") {
        alert("Please confirm your email first");
        return;
      }
      if (loginError) throw loginError;
      await onSuccess();
    } catch (err) {
      console.log(err);
    }
  };
  const handleSignUp = async () => {
    try {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });
      console.log(signUpData, signUpError);
      if (signUpError) throw signUpError;
      alert("Check your email for confirmation");
      setIsSignUp(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div style={{ width: "90%", margin: "0 auto" }}>
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="password"
        type="password"
        style={{ margin: "20px 0" }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="sign-in"
        onClick={isSignUp ? handleSignUp : handleSignIn}
      >
        {isSignUp ? "Sign up" : "Sign in"}
      </button>{" "}
      <br />
      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp
          ? "Already have an account? Sign in"
          : "Don't have an account? Sign up"}
      </button>
    </div>
  );
};

export default SignIn;
