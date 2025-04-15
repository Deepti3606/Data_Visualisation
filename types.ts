export interface DataPoint {
  [key: string]: string | number;
}

export interface ChartConfig {
  type: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
  xAxis: string;
  yAxis: string;
}

export interface FileData {
  headers: string[];
  data: DataPoint[];
}