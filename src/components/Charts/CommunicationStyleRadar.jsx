import React from 'react';
import { Radar } from 'react-chartjs-2';
import './chartRegister';
import { communicationRadarMock } from '../../data/growthDashboardMock';

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 12,
        padding: 16,
        font: { size: 12 }
      }
    }
  },
  scales: {
    r: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 20,
        backdropColor: 'transparent'
      },
      grid: {
        color: 'rgba(148, 163, 184, 0.35)'
      },
      pointLabels: {
        font: { size: 11 }
      }
    }
  }
};

function CommunicationStyleRadar() {
  const data = {
    labels: communicationRadarMock.labels,
    datasets: [
      {
        label: '上月',
        data: communicationRadarMock.previousMonth,
        borderColor: 'rgb(148, 163, 184)',
        backgroundColor: 'rgba(148, 163, 184, 0.15)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(148, 163, 184)'
      },
      {
        label: '本月',
        data: communicationRadarMock.currentMonth,
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(37, 99, 235)'
      }
    ]
  };

  return (
    <div className="chart-container h-64 w-full max-w-none">
      <Radar data={data} options={options} />
    </div>
  );
}

export default CommunicationStyleRadar;
