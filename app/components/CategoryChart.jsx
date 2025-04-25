"use client";
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart({ games }) 
{
  const categoryCounts = {};
  games.forEach(game => 
  {
    const category = game.category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const labels = Object.keys(categoryCounts);
  const data = labels.map(category => categoryCounts[category]);

  const chartData = 
  {
    labels,
    datasets: [
      {
        label: 'Games per Category',
        data,
        backgroundColor: [
            "rgb(255, 87, 51, 0.6)",   
            "rgb(51, 255, 87, 0.6)",   
            "rgb(51, 87, 255, 0.6)",   
            "rgb(255, 51, 161, 0.6)",  
            "rgb(255, 215, 0, 0.6)",   
            "rgb(255, 140, 0, 0.6)",   
            "rgb(138, 43, 226, 0.6)",  
            "rgb(0, 206, 209, 0.6)",   
            "rgb(255, 20, 147, 0.6)",  
            "rgb(50, 205, 50, 0.6)",   
            "rgb(220, 20, 60, 0.6)",   
            "rgb(32, 178, 170, 0.6)",  
            "rgb(153, 50, 204, 0.6)",  
            "rgb(255, 69, 0, 0.6)",    
            "rgb(106, 90, 205, 0.6)",  
            "rgb(64, 224, 208, 0.6)",  
            "rgb(178, 34, 34, 0.6)",   
            "rgb(154, 205, 50, 0.6)",  
            "rgb(186, 85, 211, 0.6)",  
            "rgb(255, 99, 71, 0.6)",   
          ],
      },
    ],
  };

  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => 
  {
    setHasMounted(true);
  }, []);

  // Before mounting, render null so SSR and client outputs match.
  if (!hasMounted) 
  {
    return null;
  }

  return (
    <div style={{ margin: '2rem 0' }}>
      <h3>Games per Category</h3>
      <Pie data={chartData} />
    </div>
  );
}
