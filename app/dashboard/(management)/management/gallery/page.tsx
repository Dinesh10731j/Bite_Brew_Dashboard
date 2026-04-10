import { GalleryGrid } from "@/components/dashboard-blocks/management/GalleryGrid";
import { GalleryUpload } from "@/components/dashboard-blocks/management/GalleryUpload";

export default function ManagementGalleryPage() {
  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <GalleryUpload />
      <GalleryGrid />
    </div>
  );
}
