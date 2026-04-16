"use client";

import Image from "next/image";
import { GripVertical } from "lucide-react";
import { BlockCard } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { Badge } from "@/components/shared/ui/Badge";
import { Button } from "@/components/shared/ui/Button";
import { useBackendResource } from "@/hooks/useBackendResource";
import { dashboardApi } from "@/lib/api/dashboard";
import { galleryItems as fallbackItems } from "@/lib/mock-data";
import { GalleryUpload } from "./GalleryUpload";

type GalleryCard = {
  id: string;
  title: string;
  image: string;
  category: string;
  uploadDate: string;
  tags: string[];
  featured: boolean;
};

function normalizeGallery(item: any): GalleryCard {
  return {
    id: item?.id ?? item?._id ?? "gallery-1",
    title: item?.title ?? item?.caption ?? `Gallery ${item?.id ?? "item"}`,
    image: item?.url ?? item?.image ?? fallbackItems[0]?.image ?? "",
    category: item?.category ?? "FOOD",
    uploadDate: item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-",
    tags: Array.isArray(item?.tags) ? item.tags : [],
    featured: Boolean(item?.featured)
  };
}

export function GalleryApiWorkspace() {
  const resource = useBackendResource<GalleryCard[]>({
    fallback: fallbackItems as unknown as GalleryCard[],
    loader: async () => {
      const response: any = await dashboardApi.getGallery({ page: 1, limit: 24 });
      const items = response?.data ?? [];
      return Array.isArray(items) ? items.map(normalizeGallery) : (fallbackItems as unknown as GalleryCard[]);
    },
    resetOnError: false,
  });

  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <ResourceNote error={resource.error} loading={resource.loading} fallbackLabel="gallery" />
      <GalleryUpload />
      <BlockCard title="Gallery Manager" description="Featured media, tags, and reorder controls.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resource.data.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-3xl border border-brand/10 dark:border-white/10">
              <div className="relative h-52">
                <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <Badge tone="brand">{item.category}</Badge>
                  <GripVertical className="h-4 w-4 text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-brand-ink dark:text-white">{item.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Uploaded {item.uploadDate}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.featured ? <Badge tone="warning">Featured</Badge> : null}
                  {item.tags.map((tag) => (
                    <Badge key={`${item.id}-${tag}`} tone="neutral">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="danger" className="flex-1">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </BlockCard>
    </div>
  );
}
