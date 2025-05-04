import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement);

const InventoryLevels = () => {
  // State for inventory chart data
  const [inventoryChartData, setInventoryChartData] = useState(null);
  
  // Load inventory chart data from localStorage
  useEffect(() => {
    const savedChartData = localStorage.getItem('inventoryChartData');
    if (savedChartData) {
      setInventoryChartData(JSON.parse(savedChartData));
    }
  }, []);
  
  // Default chart data if no data is available in localStorage
  const defaultInventoryData = {
    labels: ['Fruit Pulp', 'Fruit Extract', 'Fruit Concentrate', 'Fruit Peel'],
    datasets: [{
      label: 'Inventory Value',
      data: [2250, 1680, 2800, 1080],
      backgroundColor: ['#1976D2', '#FF9800', '#4CAF50', '#9C27B0'],
      barThickness: 40,
    }]
  };

  // Use inventory chart data from localStorage or default data
  const inventoryByCategoryData = inventoryChartData || defaultInventoryData;

  // Generate subcategory data based on category data
  const inventoryBySubcategoryData = {
    labels: inventoryByCategoryData.labels.flatMap(label => [
      `${label} - Premium`, 
      `${label} - Standard`
    ]),
    datasets: [{
      label: 'Inventory Value',
      data: inventoryByCategoryData.datasets[0].data.flatMap(value => [
        value * 0.6, // Premium version (60% of category value)
        value * 0.4  // Standard version (40% of category value)
      ]),
      backgroundColor: '#2196F3',
      barThickness: 20,
    }]
  };

  // Generate product data based on subcategory data
  const inventoryByProductData = {
    labels: inventoryBySubcategoryData.labels.flatMap(label => [
      `${label} - Batch A`,
      `${label} - Batch B`
    ]),
    datasets: [{
      label: 'Inventory Value',
      data: inventoryBySubcategoryData.datasets[0].data.flatMap(value => [
        value * 0.55, // Batch A (55% of subcategory value)
        value * 0.45  // Batch B (45% of subcategory value)
      ]),
      backgroundColor: '#9C27B0',
      barThickness: 15,
    }]
  };

  // Chart options
  const horizontalBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const verticalBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom align="center">
        Inventory Levels
      </Typography>

      {/* Inventory by Category */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom align="center">
          Inventory by Category
        </Typography>
        <Box sx={{ height: 300 }}>
          <Bar data={inventoryByCategoryData} options={verticalBarChartOptions} />
        </Box>
      </Paper>

      {/* Inventory by Subcategory */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom align="center">
          Inventory by Subcategory
        </Typography>
        <Box sx={{ height: 300 }}>
          <Bar data={inventoryBySubcategoryData} options={horizontalBarChartOptions} />
        </Box>
      </Paper>

      {/* Inventory by Product */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom align="center">
          Inventory by Product
        </Typography>
        <Box sx={{ height: 300 }}>
          <Bar data={inventoryByProductData} options={horizontalBarChartOptions} />
        </Box>
      </Paper>

      {/* Map visualization placeholder */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom align="center">
          Inventory by Location
        </Typography>
        <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Map visualization requires additional libraries
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default InventoryLevels;