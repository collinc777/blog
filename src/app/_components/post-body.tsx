import markdownStyles from "./markdown-styles.module.css";
import { SuspendedBuildVsBuyDocGenerator } from "./build-vs-buy-doc-generator";

type Props = {
  content: string;
  features?: string[];
};

export function PostBody({ content, features }: Props) {
  return (
    <div className="max-w-3xl mx-auto">
      <div
        className={markdownStyles["markdown"]}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {features?.includes('build-vs-buy-doc-generator') && (
        <SuspendedBuildVsBuyDocGenerator />
      )}
    </div>
  );
}
