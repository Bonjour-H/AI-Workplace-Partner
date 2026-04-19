import React from 'react';
import { Line } from 'react-chartjs-2';
import './chartRegister';
import { mindsetTrendMock } from '../../data/growthDashboardMock';

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    y: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 20
      },
      grid: {
        color: 'rgba(148, 163, 184, 0.35)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
};

function MindsetTrendChart() {
  const data = {
    labels: mindsetTrendMock.labels,
    datasets: [
      {
        label: '心态稳定指数',
        data: mindsetTrendMock.values,
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(37, 99, 235)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  return (
    <div className="chart-container h-64 w-full max-w-none">
      <Line data={data} options={options} />
    </div>
  );
}

export default MindsetTrendChart;
