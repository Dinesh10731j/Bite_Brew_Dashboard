import { BlockCard } from "@/components/dashboard-blocks/common";
import { FileUpload } from "@/components/shared/forms/FileUpload";

export function GalleryUpload() {
  return (
    <BlockCard title="Upload Media">
      <FileUpload />
    </BlockCard>
  );
}
