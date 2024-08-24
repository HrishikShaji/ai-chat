import dynamic from "next/dynamic";
import ReactMarkdown, { ExtraProps } from "react-markdown"
import { TableWrapper } from "./TableWrapper";
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"
import { memo } from "react";

const ClientSideChartRender = dynamic(
  () => import('./ChatChartRender'),
  { ssr: false }
);
export const RenderMarkdown = memo(({ content }: { content: string }) => {
  let tableIndex = 0;

  return (
    <ReactMarkdown
      components={{
        "status": ({ node, ...props }: ExtraProps) => {
          return null;
        },
        "json": ({ node, ...props }: ExtraProps) => {
          return null;
        },
        "report-metadata": ({ node, ...props }: ExtraProps) => {
          return null;
        },
        "report": ({ node, ...props }: ExtraProps) => {
          return <div className="bg-yellow-500" {...props} />;
        },
        "report-chart": ({ node, ...props }: ExtraProps) => {
          return <div className="bg-green-500" {...props} />;
        },
        table: ({ node, ...props }) => {
          return (
            <TableWrapper currentIndex={tableIndex++}>
              <table {...props} />
            </TableWrapper>
          );
        },
        script: ({ node, src, children }) => {
          if (src === "https://cdn.plot.ly/plotly-latest.min.js") {
            return null;
          }
          return (
            <div className="flex flex-col gap-2">
              <button
                className="bg-black text-white px-2 py-1 rounded-md"
                onClick={() => console.log(node?.children)}
              >
                Show Chart
              </button>
              <ClientSideChartRender scriptContent={children as string} />
            </div>
          );
        },
        div: ({ node, ...props }) => {
          return null;
        },
      }}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
    >
      {content}
    </ReactMarkdown>
  );
});

