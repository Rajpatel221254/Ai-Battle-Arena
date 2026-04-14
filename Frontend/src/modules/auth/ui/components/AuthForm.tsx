import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Loader from "../../../../shared/components/Loader.js";

interface AuthField {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
}

interface AuthFormProps {
  title: string;
  subtitle: string;
  fields: AuthField[];
  submitLabel: string;
  isLoading: boolean;
  onSubmit: (data: Record<string, string>) => void;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

export default function AuthForm({
  title,
  subtitle,
  fields,
  submitLabel,
  isLoading,
  onSubmit,
  footerText,
  footerLinkText,
  footerLinkTo,
}: AuthFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      const value = formData[field.name]?.trim();
      if (!value) {
        newErrors[field.name] = `${field.label} is required`;
      } else if (field.type === "email" && !/\S+@\S+\.\S+/.test(value)) {
        newErrors[field.name] = "Please enter a valid email";
      } else if (field.type === "password" && value.length < 6) {
        newErrors[field.name] = "Password must be at least 6 characters";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-neon-purple/20 rounded-full animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-neon-cyan/15 rounded-full animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="w-full max-w-md relative animate-fade-in-up">
        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl shadow-black/30">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple mb-4 shadow-lg shadow-neon-cyan/20">
              <span className="text-arena-900 font-extrabold text-lg">AI</span>
            </div>
            <h1 className="text-2xl font-bold text-arena-50">{title}</h1>
            <p className="text-arena-400 mt-1 text-sm">{subtitle}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-arena-300 mb-1.5"
                >
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: e.target.value,
                    }));
                    if (errors[field.name]) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next[field.name];
                        return next;
                      });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-arena-800/80 border text-arena-100 placeholder:text-arena-500 
                    focus:outline-none focus:ring-2 focus:ring-neon-cyan/40 focus:border-neon-cyan/50
                    transition-all duration-200 text-sm
                    ${errors[field.name] ? "border-red-500/60" : "border-arena-600/50"}`}
                />
                {errors[field.name] && (
                  <p className="mt-1 text-xs text-red-400">{errors[field.name]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-arena-900 
                font-semibold text-sm hover:opacity-90 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg shadow-neon-cyan/20 hover:shadow-neon-cyan/30
                flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader size="button" />
                  <span>Please wait…</span>
                </>
              ) : (
                submitLabel
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-arena-400">
            {footerText}{" "}
            <Link
              to={footerLinkTo}
              className="text-neon-cyan hover:text-neon-cyan/80 font-medium transition-colors"
            >
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
