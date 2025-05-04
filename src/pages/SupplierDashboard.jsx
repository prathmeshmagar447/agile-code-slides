import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import {
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  LocalShipping as ShippingIcon,
  BarChart as AnalyticsIcon
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js'
import { Pie, Line } from 'react-chartjs-2'
import InventoryManagement from '../components/supplier/InventoryManagement'
import OrderView from '../components/supplier/OrderView'
import SupplierBiddingSystem from '../components/supplier/BiddingSystem'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title)

function SupplierDashboard() {
  // Function to categorize inventory items from ManageInventory data
  const categorizeInventory = (inventory) => {
    const result = {
      rawMaterials: [],
      workInProgress: [],
      finishedGoods: []
    }
    
    inventory.forEach(item => {
      // Categorize based on item category
      if (['Fruit Pulp', 'Fruit Extract', 'Fruit Peel', 'Raw Material', 'Ingredient'].includes(item.category)) {
        result.rawMaterials.push(item)
      } else if (['Fruit Concentrate', 'Fruit Puree', 'Work In Progress', 'Semi-Finished', 'Processing'].includes(item.category)) {
        result.workInProgress.push(item)
      } else {
        // Default to finished goods for other categories
        result.finishedGoods.push(item)
      }
    })
    
    return result
  }
  
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  
  // Redirect to login if no user is found
  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
    }
  }, [currentUser, navigate])
  
  // Dashboard data with initial empty values
  const [dashboardData, setDashboardData] = useState({
    inventoryCount: 0,
    pendingOrders: 15,
    shippedOrders: 8,
    totalRevenue: 45000,
    inventoryDistribution: {
      labels: ['Raw Materials', 'Work in Progress', 'Finished Goods'],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }]
    },
    monthlyRevenue: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Revenue',
        data: [5000, 7500, 8000, 9500, 7000, 8000],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4
      }]
    }
  })

  // Fetch and process inventory data for dashboard
  useEffect(() => {
    // Get supplier's inventory data from localStorage
    // This data is saved by the InventoryManagement component
    const savedInventory = localStorage.getItem('inventory')
    if (savedInventory) {
      const inventoryData = JSON.parse(savedInventory)
      
      // Filter inventory to only include items from the current supplier
      const supplierInventory = inventoryData.filter(item => {
        // Check if the item has supplier properties that match current user
        return item.supplierId === currentUser?.id || 
               (item.supplier_id && item.supplier_id === currentUser?.id)
      })
      
      // Count total inventory items
      const inventoryCount = supplierInventory.length
      
      // Create inventory distribution by item name and quantity
      const itemNames = []
      const itemQuantities = []
      const backgroundColors = []
      
      // Generate random colors for each item
      const getRandomColor = () => {
        const letters = '0123456789ABCDEF'
        let color = '#'
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)]
        }
        return color
      }
      
      // Extract item names and quantities
      supplierInventory.forEach(item => {
        // Support both naming conventions (from InventoryManagement and ManageInventory)
        const itemName = item.itemName || item.item_name
        const itemQuantity = parseInt(item.quantity) || parseInt(item.item_quantity) || 0
        
        // Only add items with valid names and quantities
        if (itemName && itemQuantity > 0) {
          itemNames.push(itemName)
          itemQuantities.push(itemQuantity)
          backgroundColors.push(getRandomColor())
        }
      })
      
      // Categorize inventory by type
      const categorizedInventory = categorizeInventory(supplierInventory)
      const categoryData = {
        labels: ['Raw Materials', 'Work in Progress', 'Finished Goods'],
        datasets: [{
          data: [
            categorizedInventory.rawMaterials.length,
            categorizedInventory.workInProgress.length,
            categorizedInventory.finishedGoods.length
          ],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      }
      
      // Update dashboard data
      setDashboardData(prev => ({
        ...prev,
        inventoryCount,
        inventoryDistribution: {
          labels: itemNames,
          datasets: [{
            data: itemQuantities,
            backgroundColor: backgroundColors,
            hoverBackgroundColor: backgroundColors
          }]
        },
        inventoryByCategory: categoryData
      }))
    }
  }, [currentUser])

  // Supplier Dashboard
  const [selectedView, setSelectedView] = useState('dashboard')

  if (selectedView === 'inventory') {
    return <InventoryManagement setSelectedView={setSelectedView} />
  }
  
  if (selectedView === 'orders') {
    return <OrderView setSelectedView={setSelectedView} />
  }
  
  if (selectedView === 'bidding') {
    return <SupplierBiddingSystem setSelectedView={setSelectedView} />
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Supplier Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <List>
              <ListItem button onClick={() => setSelectedView('inventory')}>
                <ListItemIcon>
                  <InventoryIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Manage Inventory" />
              </ListItem>
              <ListItem button onClick={() => setSelectedView('orders')}>
                <ListItemIcon>
                  <OrdersIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary="View Orders" />
              </ListItem>
              <ListItem button onClick={() => setSelectedView('bidding')}>
                <ListItemIcon>
                  <AnalyticsIcon color="info" />
                </ListItemIcon>
                <ListItemText primary="Bidding System" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={9}>
          {/* Summary Cards */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <InventoryIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h5" component="div">
                    {dashboardData.inventoryCount}
                  </Typography>
                  <Typography color="text.secondary">
                    Inventory Items
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <OrdersIcon color="secondary" sx={{ fontSize: 40 }} />
                  <Typography variant="h5" component="div">
                    {dashboardData.pendingOrders}
                  </Typography>
                  <Typography color="text.secondary">
                    Pending Orders
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <ShippingIcon color="success" sx={{ fontSize: 40 }} />
                  <Typography variant="h5" component="div">
                    {dashboardData.shippedOrders}
                  </Typography>
                  <Typography color="text.secondary">
                    Shipped Orders
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <AnalyticsIcon color="info" sx={{ fontSize: 40 }} />
                  <Typography variant="h5" component="div">
                    ${dashboardData.totalRevenue.toLocaleString()}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Revenue
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      {/* Charts section */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Inventory by Item Name and Quantity" />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Pie data={dashboardData.inventoryDistribution} options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'right'
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.label}: ${context.raw} units`;
                        }
                      }
                    }
                  }
                }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Monthly Revenue" />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Line data={dashboardData.monthlyRevenue} options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `$${value}`
                      }
                    }
                  }
                }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button variant="contained" startIcon={<InventoryIcon />} onClick={() => setSelectedView('inventory')}>
          Manage Inventory
        </Button>
        <Button variant="contained" color="secondary" startIcon={<OrdersIcon />} onClick={() => setSelectedView('orders')}>
          View Orders
        </Button>
      </Box>
    </Container>
  )
}

export default SupplierDashboard