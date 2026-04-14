import AuthForm from "../components/AuthForm";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const { isLoading, register } = useAuth();

  const fields = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "John Doe",
      autoComplete: "name",
    },
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
      placeholder: "Min. 6 characters",
      autoComplete: "new-password",
    },
  ];

  return (
    <AuthForm
      title="Create Account"
      subtitle="Join the AI Battle Arena and start competing"
      fields={fields}
      submitLabel="Create Account"
      isLoading={isLoading}
      onSubmit={(data) =>
        register({ name: data.name, email: data.email, password: data.password })
      }
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    />
  );
}
