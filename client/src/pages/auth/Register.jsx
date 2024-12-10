import { Button, ErrorMessage, Input } from "../../components/ui";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router";
import { use, useActionState } from "react";
import apiFetch from "../../utils/apiFetch";
import logger from "../../utils/logger";
import SessionContext from "../../contexts/session";

export default function Register() {
  const { setCurrentUser } = use(SessionContext);

  const navigate = useNavigate();

  const formState = async (prevState, formData) => {
    try {
      const data = {
        email: formData.get("email"),
        password: formData.get("password"),
        passwordConfirm: formData.get("passwordConfirm"),
      };

      const response = await apiFetch("/api/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return result;
      }

      logger.info("User created:", result);

      localStorage.setItem("token", result.token);

      setCurrentUser(jwtDecode(result.token));

      navigate("/");

      return null;
    } catch (error) {
      logger.error("Error creating user:", error);

      return { errorMessage: "An error occurred. Please try again." };
    }
  };

  const [errors, formAction, isPending] = useActionState(formState, null);

  return (
    <div className="container container-sm">
      <h1>Register</h1>

      <form action={formAction} className="panel" style={{ padding: "2rem" }}>
        <ErrorMessage message={errors?.errorMessage} />

        <div className="stack">
          <Input
            autoComplete="email"
            errors={errors}
            fullWidth
            label="Email"
            maxLength={255}
            name="email"
            required
            type="email"
          />

          <Input
            autoComplete="new-password"
            errors={errors}
            fullWidth
            label="Password"
            maxLength={255}
            name="password"
            required
            type="password"
          />

          <Input
            autoComplete="new-password"
            errors={errors}
            fullWidth
            label="Confirm Password"
            maxLength={255}
            name="passwordConfirm"
            required
            type="password"
          />
        </div>

        <Button
          className="w-full"
          loading={isPending}
          size="lg"
          style={{ marginTop: "1.5rem" }}
          type="submit"
        >
          Register
        </Button>

        <p className="text-center" style={{ marginBottom: 0 }}>
          or,{" "}
          <Link className="link" to="/auth/login">
            login
          </Link>
        </p>
      </form>
    </div>
  );
}
