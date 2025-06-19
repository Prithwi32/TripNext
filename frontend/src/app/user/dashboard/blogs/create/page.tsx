"use client";

import { CreateBlogForm } from "../components/CreateBlogForm";

export default function CreateBlogPage() {
  return (
    <div className="container mx-auto max-w-5xl pb-20">
      <h1 className="text-3xl font-bold mb-6">Create New Blog</h1>
      <CreateBlogForm />
    </div>
  );
}
