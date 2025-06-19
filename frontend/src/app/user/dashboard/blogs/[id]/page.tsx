"use client";

import { BlogDetail } from "../components/BlogDetail";

interface BlogDetailPageProps {
  params: {
    id: string;
  };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  return (
    <div className="container mx-auto max-w-5xl pb-20">
      <h1 className="text-3xl font-bold mb-6">Blog Details</h1>
      <BlogDetail blogId={params.id} />
    </div>
  );
}
