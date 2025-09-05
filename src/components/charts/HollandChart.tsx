import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface HollandChartProps {
  data: any; // Chart.js data object
  options: any; // Chart.js options object
}

const HollandChart: React.FC<HollandChartProps> = ({ data, options }) => {
    return <Radar data={data} options={options} />;
};

export default HollandChart;