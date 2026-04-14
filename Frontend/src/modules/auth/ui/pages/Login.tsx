import AuthForm from "../components/AuthForm";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const { isLoading, login } = useAuth();

  const fields = [
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "you@example.com",
      autoComplete: "email",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "••••••••",
      autoComplete: "current-password",
    },
  ];

  return (
    <AuthForm
      title="Welcome Back"
      subtitle="Sign in to your AI Battle Arena account"
      fields={fields}
      submitLabel="Sign In"
      isLoading={isLoading}
      onSubmit={(data) => login({ email: data.email, password: data.password })}
      footerText="Don't have an account?"
      footerLinkText="Create one"
      footerLinkTo="/register"
    />
  );
}
