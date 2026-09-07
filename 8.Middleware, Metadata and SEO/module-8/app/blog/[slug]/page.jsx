import React from "react";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `Blog Post: ${slug}`,
    description: `This is the blog post about ${slug}.`,
    openGraph: {
      images: {
        url: `/blog/${slug}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `Open Graph image for ${slug}`,
      },
    },
  };
}

const SlugPage = async ({ params }) => {
  const { slug } = await params;
  return <div>SlugPage: {slug}</div>;
};

export default SlugPage;
