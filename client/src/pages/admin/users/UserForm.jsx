import { Button, ErrorMessage, Input, Select } from "../../../components/ui";
import { use, useActionState } from "react";
import apiFetch from "../../../utils/apiFetch";
import logger from "../../../utils/logger";
import PropTypes from "prop-types";
import SnackbarContext from "../../../contexts/snackbar";

export default function UserForm({ onSubmit, user }) {
  const { enqueueSnackbar } = use(SnackbarContext);

  const formState = async (prevState, formData) => {
    try {
      const data = {
        email: formData.get("email"),
        role: formData.get("role"),
      };

      if (!user) {
        data.password = formData.get("password");
        data.passwordConfirm = formData.get("passwordConfirm");
      }

      let response;

      if (user) {
        response = await apiFetch(`/api/admin/users/${user.id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
      } else {
        response = await apiFetch("/api/admin/users", {
          method: "POST",
          body: JSON.stringify(data),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        return result;
      }

      logger.info(`User ${user ? "updated" : "created"}:`, result);

      enqueueSnackbar(`User ${user ? "updated" : "created"} successfully.`);

      onSubmit?.();

      return null;
    } catch (error) {
      logger.error("Error creating user:", error);

      return { errorMessage: "An error occurred. Please try again." };
    }
  };

  const [errors, formAction, isPending] = useActionState(formState, null);

  return (
    <form action={formAction}>
      <ErrorMessage message={errors?.errorMessage} />

      <div className="stack">
        <Input
          autoComplete="email"
          defaultValue={user?.email}
          errors={errors}
          fullWidth
          label="Email"
          maxLength={255}
          name="email"
          required
          type="email"
        />

        <Select
          defaultValue={user?.role}
          errors={errors}
          fullWidth
          label="Role"
          name="role"
          options={[
            { label: "User", value: "USER" },
            { label: "Admin", value: "ADMIN" },
          ]}
          required
        />

        {user ? null : (
          <>
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
          </>
        )}
      </div>

      <Button
        className="w-full"
        loading={isPending}
        size="lg"
        style={{ marginTop: "1.5rem" }}
        type="submit"
      >
        {user ? "Update" : "Create"}
      </Button>
    </form>
  );
}

UserForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  user: PropTypes.object,
};
