import  { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut, Radar } from 'react-chartjs-2';
import { FileData, ChartConfig } from './types';
import FileUpload from './components/FileUpload';
import ChartCustomizer from './components/ChartCustomizer';
import { LineChart, BarChart } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const defaultColors = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#FF6384',
  '#36A2EB',
];

function App() {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null);

  const handleDataParsed = (data: FileData) => {
    setFileData(data);
    
    // Create initial chart configuration
    const numericColumn = data.headers.find(header => 
      data.data.every(row => !isNaN(Number(row[header])))
    );

    if (numericColumn) {
      const defaultXAxis = data.headers[0];
      const defaultYAxis = numericColumn;

      setChartConfig({
        type: 'bar',
        xAxis: defaultXAxis,
        yAxis: defaultYAxis,
        labels: data.data.map(row => String(row[defaultXAxis])),
        datasets: [{
          label: defaultYAxis,
          data: data.data.map(row => Number(row[defaultYAxis])),
          backgroundColor: defaultColors.slice(0, data.data.length),
          borderColor: defaultColors.slice(0, data.data.length),
          borderWidth: 1
        }]
      });
    }
  };

  const renderChart = () => {
    if (!chartConfig) return null;

    const chartProps = {
      data: {
        labels: chartConfig.labels,
        datasets: chartConfig.datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: `${chartConfig.yAxis} vs ${chartConfig.xAxis}`
          }
        }
      }
    };

    switch (chartConfig.type) {
      case 'bar':
        return <Bar {...chartProps} />;
      case 'line':
        return <Line {...chartProps} />;
      case 'pie':
        return <Pie {...chartProps} />;
      case 'doughnut':
        return <Doughnut {...chartProps} />;
      case 'radar':
        return <Radar {...chartProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-4">
            <LineChart className="h-10 w-10 text-blue-500" />
            Data Visualizer
            <BarChart className="h-10 w-10 text-blue-500" />
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Upload your data file and create beautiful visualizations
          </p>
        </div>

        {!fileData ? (
          <div className="max-w-xl mx-auto">
            <FileUpload onDataParsed={handleDataParsed} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
              {renderChart()}
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Customize Chart</h2>
              {chartConfig && fileData && (
                <ChartCustomizer
                  config={chartConfig}
                  fileData={fileData}
                  onConfigChange={setChartConfig}
                />
              )}
              <button
                onClick={() => {
                  setFileData(null);
                  setChartConfig(null);
                }}
                className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
              >
                Upload New File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;