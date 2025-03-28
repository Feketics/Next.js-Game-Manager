"use client";
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function YearChart({ games }) 
{
  const yearCounts = {};
  games.forEach(game => 
  {
    if (game.datePublished) 
    {
      const year = new Date(game.datePublished).getFullYear();
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    }
  });

  const labels = Object.keys(yearCounts).sort();
  const dataValues = labels.map(year => yearCounts[year]);

  const maxDataValue = Math.max(...dataValues);
  const yMax = Math.ceil(maxDataValue * 1.2);

  const chartData = 
  {
    labels,
    datasets: [
      {
        label: 'Games Released per Year',
        data: dataValues,
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

  const options = 
  {
    scales: 
    {
      y: 
      {
        beginAtZero: true,
        max: yMax,
      },
    },
  };

  return (
    <div style={{ margin: '2rem 0' }}>
      <h3>Games Released per Year</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}
