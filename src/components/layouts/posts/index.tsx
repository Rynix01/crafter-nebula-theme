import PostCard from "@/components/ui/post-card";
import { PostsResponse } from "@/lib/types/posts";

export default function Posts({ posts }: { posts: PostsResponse }) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold">Son Gönderiler</h1>
      <p className="text-xs sm:text-sm text-muted-foreground mb-6">
        Sunucumuzdan en güncel haberler ve duyurular
      </p>
      
      {/* Post Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.data.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}