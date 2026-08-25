import SignIn from "./SignIn";

// Same surface, different entry point — /signup just opens it in create-account mode.
// Keeping one component means the two modes can never drift apart visually.
export default function SignUp() {
  return <SignIn initialMode="signup" />;
}
