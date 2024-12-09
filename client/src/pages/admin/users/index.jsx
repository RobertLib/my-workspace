import {
  Breadcrumbs,
  Button,
  DataTable,
  Dialog,
  Switch,
} from "../../../components/ui";
import { Link, useSearchParams } from "react-router";
import { use, useMemo } from "react";
import apiFetch from "../../../utils/apiFetch";
import logger from "../../../utils/logger";
import SnackbarContext from "../../../contexts/snackbar";
import useDataTable from "../../../hooks/useDataTable";
import useQuery from "../../../hooks/useQuery";
import UserForm from "./UserForm";

export default function Users() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { enqueueSnackbar } = use(SnackbarContext);

  const dataTableParams = useDataTable();

  const deleted = searchParams.get("deleted") ?? "false";
  const dialog = searchParams.get("dialog") ?? "";
  const userId = parseInt(searchParams.get("userId") ?? "", 10);

  const {
    data: users,
    isLoading,
    refetch,
    total,
  } = useQuery(
    `/api/admin/users?${new URLSearchParams({
      ...dataTableParams,
      deleted,
    }).toString()}`
  );

  const columns = useMemo(
    () => [
      {
        filter: "input",
        key: "email",
        label: "Email",
        sortable: true,
      },
      {
        filter: "select",
        filterSelectOptions: [
          { label: "", value: "" },
          { label: "Admin", value: "ADMIN" },
          { label: "User", value: "USER" },
        ],
        key: "role",
        label: "Role",
        render: (row) => <div className="chip">{row.role}</div>,
        sortable: true,
      },
    ],
    []
  );

  const openUserForm = (id) => {
    searchParams.set("dialog", "userForm");
    searchParams.set("userId", id ? id.toString() : "");
    setSearchParams(searchParams);
  };

  const closeUserForm = () => {
    searchParams.delete("dialog");
    searchParams.delete("userId");
    setSearchParams(searchParams);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await apiFetch(`/api/admin/users/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message);
        }

        enqueueSnackbar("User deleted successfully.");

        refetch();
      } catch (error) {
        logger.error(error);

        enqueueSnackbar("An error occurred while deleting the user.", "danger");
      }
    }
  };

  const user = users?.find(({ id }) => id === userId);

  return (
    <div className="container container-fluid">
      <Breadcrumbs
        items={[
          { label: "Home", link: "/" },
          { label: "Admin", link: "/admin" },
          { label: "Users" },
        ]}
      />

      <div className="header">
        <h1>Users</h1>

        <Button onClick={() => openUserForm()} size="sm">
          + New User
        </Button>
      </div>

      <DataTable
        actions={(row) => (
          <div className="btn-group">
            <Link
              className="btn btn-primary btn-sm"
              to={`/admin/users/${row.id}`}
            >
              Detail
            </Link>
            <Button
              onClick={() => openUserForm(row.id)}
              size="sm"
              variant="warning"
            >
              Edit
            </Button>
            {deleted !== "true" && (
              <Button
                onClick={() => handleDelete(row.id)}
                size="sm"
                variant="danger"
              >
                Delete
              </Button>
            )}
          </div>
        )}
        columns={columns}
        data={users}
        loading={isLoading}
        toolbar={
          <Switch
            defaultChecked={deleted === "true"}
            label="Deleted"
            onChange={() => {
              const newDeletedValue = deleted === "true" ? "false" : "true";
              searchParams.set("deleted", newDeletedValue);
              searchParams.set("page", "1");
              setSearchParams(searchParams);
            }}
          />
        }
        total={total}
      />

      {dialog === "userForm" && (
        <Dialog
          onClose={() => closeUserForm()}
          title={`${user ? "Edit" : "New"} User`}
        >
          <UserForm
            onSubmit={() => {
              closeUserForm();
              refetch();
            }}
            user={user}
          />
        </Dialog>
      )}
    </div>
  );
}
