import { useState } from 'react';
import { ChartConfig, FileData } from '../types';

interface ChartCustomizerProps {
  config: ChartConfig;
  fileData: FileData;
  onConfigChange: (config: ChartConfig) => void;
}

export default function ChartCustomizer({ config, fileData, onConfigChange }: ChartCustomizerProps) {
  const [chartType, setChartType] = useState(config.type);
  const [colors, setColors] = useState(config.datasets[0].backgroundColor);
  const [xAxis, setXAxis] = useState(config.xAxis);
  const [yAxis, setYAxis] = useState(config.yAxis);

  const handleChartTypeChange = (type: string) => {
    setChartType(type);
    onConfigChange({
      ...config,
      type
    });
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
    
    onConfigChange({
      ...config,
      datasets: config.datasets.map(dataset => ({
        ...dataset,
        backgroundColor: newColors,
        borderColor: newColors
      }))
    });
  };

  const handleAxisChange = (axis: 'x' | 'y', value: string) => {
    const newConfig = { ...config };
    
    if (axis === 'x') {
      setXAxis(value);
      newConfig.xAxis = value;
      newConfig.labels = fileData.data.map(row => String(row[value]));
    } else {
      setYAxis(value);
      newConfig.yAxis = value;
      newConfig.datasets[0].label = value;
      newConfig.datasets[0].data = fileData.data.map(row => Number(row[value]));
    }

    onConfigChange(newConfig);
  };

  const getNumericColumns = () => {
    return fileData.headers.filter(header =>
      fileData.data.every(row => !isNaN(Number(row[header])))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Chart Type</label>
        <select
          value={chartType}
          onChange={(e) => handleChartTypeChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="doughnut">Doughnut Chart</option>
          <option value="radar">Radar Chart</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">X-Axis Data</label>
        <select
          value={xAxis}
          onChange={(e) => handleAxisChange('x', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {fileData.headers.map(header => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Y-Axis Data</label>
        <select
          value={yAxis}
          onChange={(e) => handleAxisChange('y', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {getNumericColumns().map(header => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Colors</label>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {colors.map((color, index) => (
            <input
              key={index}
              type="color"
              value={color}
              onChange={(e) => handleColorChange(index, e.target.value)}
              className="w-full h-8 cursor-pointer"
            />
          ))}
        </div>
      </div>
    </div>
  );
}