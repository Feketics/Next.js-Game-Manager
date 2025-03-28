"use client";
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function RatingChart({ games }) {
  const ratingCounts = {};
  games.forEach(game => {
    const rating = game.rating;
    ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
  });
  const labels = Object.keys(ratingCounts).sort((a, b) => a - b);
  const dataValues = labels.map(rating => ratingCounts[rating]);

  const maxDataValue = Math.max(...dataValues);
  const yMax = Math.ceil(maxDataValue * 1.2);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Games Count by Rating',
        data: dataValues,
        backgroundColor: 'rgba(153,102,255,0.6)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: yMax,
      },
    },
  };

  return (
    <div style={{ margin: '2rem 0' }}>
      <h3>Games Count by Rating</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}
