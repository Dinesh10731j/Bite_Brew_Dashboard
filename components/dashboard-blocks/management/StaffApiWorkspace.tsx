"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { BlockCard, GenericTable } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { Badge } from "@/components/shared/ui/Badge";
import { Button } from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input";
import { Select } from "@/components/shared/ui/Select";
import { toast } from "sonner";
import { dashboardApi } from "@/lib/api/dashboard";
import { extractList } from "@/services/api/http";

type StaffRole = "admin" | "manager" | "staff";

type StaffRow = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  photo: string;
  updatedAt: string;
};

function normalizeStaff(item: any): StaffRow {
  const roleRaw = String(item?.role ?? "staff").toLowerCase();
  const role: StaffRole =
    roleRaw === "admin" || roleRaw === "manager" || roleRaw === "staff" ? (roleRaw as StaffRole) : "staff";

  const updatedAt = item?.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-";

  return {
    id: item?.id ?? item?._id ?? "",
    name: item?.name ?? item?.fullName ?? "Staff",
    email: item?.email ?? "-",
    role,
    photo: item?.photo ?? item?.image ?? item?.avatar ?? "",
    updatedAt,
  };
}

export function StaffApiWorkspace() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const [create, setCreate] = useState({ name: "", email: "", role: "staff" as StaffRole });
  const [createPhotoFile, setCreatePhotoFile] = useState<File | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState({ name: "", email: "", role: "staff" as StaffRole });
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);

  const staffQuery = useQuery<StaffRow[], Error>({
    queryKey: ["staff", search],
    queryFn: async () => {
      const response = await dashboardApi.getStaff({ page: 1, limit: 100, search: search || undefined });
      return extractList<any>(response).map(normalizeStaff);
    },
    placeholderData: [],
  });


  const createMutation = useMutation({
    mutationFn: async () => {
      let photoUrl = "";
      if (createPhotoFile) {
        const upload: any = await dashboardApi.uploadImage(createPhotoFile, "staff");
        photoUrl = upload?.data?.url ?? upload?.url ?? upload?.data?.imageUrl ?? "";
      }

      await dashboardApi.createStaff({
        name: create.name,
        email: create.email,
        role: create.role,
        ...(photoUrl ? { photo: photoUrl } : {}),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      setCreate({ name: "", email: "", role: "staff" });
      setCreatePhotoFile(null);
      toast.success("Staff created successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create staff");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      let photoUrl: string | undefined;
      if (editPhotoFile) {
        const upload: any = await dashboardApi.uploadImage(editPhotoFile, "staff");
        photoUrl = upload?.data?.url ?? upload?.url ?? upload?.data?.imageUrl ?? "";
      }

      await dashboardApi.updateStaff(id, {
        name: edit.name,
        email: edit.email,
        role: edit.role,
        ...(photoUrl ? { photo: photoUrl } : {}),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      setEditingId(null);
      setEdit({ name: "", email: "", role: "staff" });
      setEditPhotoFile(null);
      toast.success("Staff updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update staff");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await dashboardApi.deleteStaff(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete staff");
    },
  });

  const rows = staffQuery.data ?? [];

  const tableRows = useMemo(
    () =>
      rows.map((staff) => [
        <div key={`${staff.id}-person`} className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-brand/15">
            <Image
              src={staff.photo || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"}
              alt={staff.name}
              fill
              sizes="40px"
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="leading-tight">
            <div className="font-medium text-slate-900 dark:text-white">{staff.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-300">{staff.email}</div>
          </div>
        </div>,
        <Badge key={`${staff.id}-role`} tone={staff.role === "admin" ? "brand" : staff.role === "manager" ? "warning" : "neutral"}>
          {staff.role}
        </Badge>,
        staff.updatedAt,
        <div key={`${staff.id}-actions`} className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="p-1 h-8 w-8"
            onClick={() => {
              setEditingId(staff.id);
              setEdit({ name: staff.name, email: staff.email, role: staff.role });
              setEditPhotoFile(null);
            }}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            className="p-1 h-8 w-8"
            onClick={() => {
      void deleteMutation.mutateAsync(staff.id);
            }}
            title="Delete"
          >

            <Trash2 className="h-4 w-4" />
          </Button>
        </div>,
      ]),
    [rows, deleteMutation]
  );

  return (
    <div className="space-y-6">
      <ResourceNote
        error={staffQuery.error instanceof Error ? staffQuery.error.message : ""}
        loading={staffQuery.isLoading}
        fallbackLabel="staff"
      />

      <BlockCard title="Staff Directory" description="Create, edit, delete staff members with photo uploads.">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          placeholder="Search by name or email"
        />
      </BlockCard>

      <BlockCard title="Create Staff" description="Add a staff member and optionally upload a profile photo.">
        <div className="grid gap-3 md:grid-cols-3">
          <Input value={create.name} onChange={(e) => setCreate((c) => ({ ...c, name: e.target.value }))} placeholder="Name" />
          <Input value={create.email} onChange={(e) => setCreate((c) => ({ ...c, email: e.target.value }))} placeholder="Email" />
          <Select value={create.role} onChange={(e) => setCreate((c) => ({ ...c, role: e.target.value as StaffRole }))}>
            <option value="admin">admin</option>
            <option value="manager">manager</option>
            <option value="staff">staff</option>
          </Select>
          <Input
            type="file"
            accept="image/*"
            onChange={(event) => setCreatePhotoFile(event.target.files?.[0] ?? null)}
            className="md:col-span-3"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => void createMutation.mutateAsync()}
            disabled={!create.name.trim() || !create.email.trim()}
          >
            Create Staff
          </Button>
        </div>
      </BlockCard>

      <BlockCard
        title={editingId ? "Edit Staff" : "Edit Staff"}
        description={editingId ? "Update the selected staff member." : "Select a staff row to edit."}
      >
        <div className="grid gap-3 md:grid-cols-3">
          <Input
            value={edit.name}
            onChange={(e) => setEdit((cur) => ({ ...cur, name: e.target.value }))}
            placeholder="Name"
            disabled={!editingId}
          />
          <Input
            value={edit.email}
            onChange={(e) => setEdit((cur) => ({ ...cur, email: e.target.value }))}
            placeholder="Email"
            disabled={!editingId}
          />
          <Select
            value={edit.role}
            onChange={(e) => setEdit((cur) => ({ ...cur, role: e.target.value as StaffRole }))}
            disabled={!editingId}
          >
            <option value="admin">admin</option>
            <option value="manager">manager</option>
            <option value="staff">staff</option>
          </Select>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setEditPhotoFile(e.target.files?.[0] ?? null)}
            disabled={!editingId}
            className="md:col-span-3"
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setEditingId(null);
              setEdit({ name: "", email: "", role: "staff" });
              setEditPhotoFile(null);
            }}
            disabled={!editingId}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!editingId) return;
              void updateMutation.mutateAsync({ id: editingId });
            }}
            disabled={!editingId || !edit.name.trim() || !edit.email.trim()}
          >
            Save Changes
          </Button>
        </div>
      </BlockCard>

      <GenericTable
        title="Staff"
        description="Staff members overview with edit and delete actions."
        headers={["Staff", "Role", "Updated", "Actions"]}
        rows={tableRows}
      />
    </div>
  );
}

