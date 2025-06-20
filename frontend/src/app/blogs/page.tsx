import AllBlogsList from "./components/AllBlogsList";

export default function BlogsPage() {
  return (
    <div className="container mx-auto max-w-7xl pt-8 pb-20 px-3 xs:px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl xs:text-3xl font-bold">Travel Blogs</h1>
          <p className="text-muted-foreground mt-1">
            View and share your travel experiences and stories!
          </p>
        </div>
      </div>
      <AllBlogsList />
    </div>
  );
}
