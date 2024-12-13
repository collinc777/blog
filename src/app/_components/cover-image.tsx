import cn from "classnames";
import Link from "next/link";
import Image from "next/image";

type Props = {
  title: string;
  src: string;
  slug?: string;
};

const CoverImage = ({ title, src, slug }: Props) => {
  const image = (
    <Image
      src={src}
      alt={`Cover Image for ${title}`}
      className={cn("shadow-sm rounded-lg object-cover", {
        "hover:shadow-lg transition-shadow duration-200": slug,
      })}
      width={2000}
      height={1000}
      priority
      style={{
        width: '100%',
        height: 'auto',
        maxHeight: '500px', // Limit maximum height
        objectFit: 'cover',
      }}
    />
  );
  return (
    <div className="mx-auto max-w-4xl">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
};

export default CoverImage;
