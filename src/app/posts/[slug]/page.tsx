import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import { BLOG_NAME } from "@/lib/constants";
import markdownToHtml from "@/lib/markdownToHtml";
import Alert from "@/app/_components/alert";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <main>
      <Alert preview={post.preview} />
      <Container>
        <Header />
        <article className="mb-32">
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
          />
          <PostBody content={content} />
        </article>
      </Container>
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | ${BLOG_NAME}`;
  const url = `https://collincaram.com/posts/${post.slug}`;

  return {
    title,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    openGraph: {
      title,
      description: post.excerpt,
      type: 'article',
      url,
      images: [{
        url: post.ogImage.url,
        width: 1200,
        height: 630,
        alt: post.title,
      }],
      publishedTime: post.date,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: post.excerpt,
      images: [post.ogImage.url],
      creator: '@collincaram',
    },
    alternates: {
      canonical: url,
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
