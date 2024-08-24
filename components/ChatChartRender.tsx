

//@ts-ignore
import Plot from "react-plotly.js";
import React, { memo, useEffect, useState, useCallback } from 'react';

interface ChatChartRenderProps {
  scriptContent: string;
}

const ChatChartRender = memo(({ scriptContent }: ChatChartRenderProps) => {
  const [chartData, setChartData] = useState<any>(null);
  const [chartLayout, setChartLayout] = useState<any>(null);
  const [isComplete, setIsComplete] = useState(false);

  const extractObject = useCallback((variableName: string, str: string) => {
    const regex = new RegExp(`var ${variableName} = (.*?);`, 's');
    const match = regex.exec(str);
    if (match && match[1]) {
      const jsonString = match[1]
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":')
        .replace(/'/g, '"')
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']');
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        console.error(`Error parsing JSON for ${variableName}:`, error, jsonString);
        return null;
      }
    }
    return null;
  }, []);

  useEffect(() => {

    const regex = /Plotly\.newPlot\('.*', data, layout\);/;
    if (regex.test(scriptContent)) {
      const completeScript = scriptContent.replace(/Plotly\.newPlot\(.*\);/, '');
      const parsedData = extractObject('data', completeScript);
      const parsedLayout = extractObject('layout', completeScript);

      if (
        JSON.stringify(parsedData) !== JSON.stringify(chartData) ||
        JSON.stringify(parsedLayout) !== JSON.stringify(chartLayout)
      ) {
        setChartData(parsedData);
        setChartLayout(parsedLayout);
        setIsComplete(true);
      }
    }
  }, [scriptContent, extractObject, chartData, chartLayout]);

  if (!isComplete) return null;
  return <div className="mt-5 rounded-3xl w-full overflow-hidden bg-white p-5">
    <Plot style={{ width: "100%", height: "100%" }} data={chartData} layout={{
      title: chartLayout?.title ? chartLayout.title : "chart", autoSize: true, modebar: { orientation: "v" },
      showlegend: true,
      legend: {
        x: .45,
        orientation: "h",
        traceorder: 'normal',
        font: {
          family: 'sans-serif',
          size: 12,
          color: '#000'
        },
        bgcolor: '#E2E2E2',
        bordercolor: '#FFFFFF',
        borderwidth: 2
      }
    }} useResizeHandler={true} />  </div>;
});

export default ChatChartRender;
