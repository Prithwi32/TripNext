"use client";

import { EditBlogForm } from "../../components/EditBlogForm";

interface EditBlogPageProps {
  params: {
    id: string;
  };
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  return (
    <div className="container mx-auto max-w-5xl pb-20">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
      <EditBlogForm blogId={params.id} />
    </div>
  );
}
