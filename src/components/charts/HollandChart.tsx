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

const HollandChart = () => {
    const data = {
        labels: ['Nghệ thuật (A)', 'Nghiên cứu (I)', 'Xã hội (S)', 'Quản lý (E)', 'Nghiệp vụ (C)', 'Kỹ thuật (R)'],
        datasets: [{
            label: 'Mức độ phù hợp',
            data: [90, 85, 80, 45, 30, 40],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2
        }]
    };
    const options = { responsive: true, maintainAspectRatio: false, scales: { r: { beginAtZero: true, max: 100 } }, plugins: { legend: { position: 'top' as const } } };
    return <Radar data={data} options={options} />;
};

export default HollandChart;