import { GenericTable } from "@/components/dashboard-blocks/common";

const fallbackRows = [
  ["Aarav Admin", "admin", "Full access", "Today 09:10"],
  ["Mina Staff", "staff", "Orders, messages", "Today 08:22"],
  ["Rajan Ops", "manager", "Operations, reports", "Yesterday 18:45"]
];

export function UsersList({ rows = fallbackRows }: { rows?: string[][] }) {
  return (
    <GenericTable
      title="Admin Users"
      description="Admin and staff access management."
      headers={["Name", "Role", "Permissions", "Last Login"]}
      rows={rows}
    />
  );
}
