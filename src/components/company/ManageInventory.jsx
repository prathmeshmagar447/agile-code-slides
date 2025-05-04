import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const ManageInventory = ({ dashboardData, setDashboardData, setCompanyView }) => {
  const { currentUser } = useAuth();
  
  // Load inventory data from localStorage or use mock data
  const [inventory, setInventory] = useState(() => {
    const savedInventory = localStorage.getItem('inventory');
    return savedInventory ? JSON.parse(savedInventory) : [
      {
        id: 1,
        itemName: 'Apple Pulp',
        category: 'Fruit Pulp',
        quantity: 450,
        unitPrice: 5,
        totalValue: 2250,
        location: 'Warehouse A',
        lastUpdated: '2023-07-20',
        status: 'In Stock',
        supplierId: 1,
        supplierName: 'Supplier A',
        companyId: currentUser?.id || 'company-123'
      },
      {
        id: 2,
        itemName: 'Mango Extract',
        category: 'Fruit Extract',
        quantity: 280,
        unitPrice: 6,
        totalValue: 1680,
        location: 'Warehouse B',
        lastUpdated: '2023-07-18',
        status: 'In Stock',
        supplierId: 2,
        supplierName: 'Supplier B',
        companyId: currentUser?.id || 'company-123'
      },
      {
        id: 3,
        itemName: 'Strawberry Concentrate',
        category: 'Fruit Concentrate',
        quantity: 350,
        unitPrice: 8,
        totalValue: 2800,
        location: 'Warehouse A',
        lastUpdated: '2023-07-15',
        status: 'In Stock',
        supplierId: 3,
        supplierName: 'Supplier C',
        companyId: currentUser?.id || 'company-123'
      },
      {
        id: 4,
        itemName: 'Citrus Peel',
        category: 'Fruit Peel',
        quantity: 180,
        unitPrice: 6,
        totalValue: 1080,
        location: 'Warehouse C',
        lastUpdated: '2023-07-10',
        status: 'Low Stock',
        supplierId: 4,
        supplierName: 'Supplier D',
        companyId: currentUser?.id || 'company-123'
      }
    ];
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    quantity: 0,
    unitPrice: 0,
    totalValue: 0,
    location: '',
    lastUpdated: '',
    status: 'In Stock',
    supplierId: '',
    supplierName: '',
    companyId: currentUser?.id || 'company-123'
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Load suppliers data from localStorage
  const [suppliers, setSuppliers] = useState(() => {
    const savedSuppliers = localStorage.getItem('suppliers');
    return savedSuppliers ? JSON.parse(savedSuppliers) : [];
  });

  // Categories for inventory items
  const categories = [
    'Fruit Pulp',
    'Fruit Extract',
    'Fruit Concentrate',
    'Fruit Peel',
    'Fruit Juice',
    'Fruit Puree',
    'Fruit Powder',
    'Fruit Preservative'
  ];

  // Inventory statuses
  const statuses = ['In Stock', 'Low Stock', 'Out of Stock', 'Reserved'];

  // Warehouse locations
  const locations = ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Warehouse D'];

  // Save inventory to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
    
    // Update dashboard data
    if (dashboardData && setDashboardData) {
      const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
      
      setDashboardData(prev => ({
        ...prev,
        inventoryValue: totalValue
      }));
      
      // Update inventory data for charts
      updateInventoryChartData();
    }
  }, [inventory, dashboardData, setDashboardData]);

  // Function to update inventory chart data
  const updateInventoryChartData = () => {
    // Group inventory by category for chart data
    const categoryGroups = {};
    inventory.forEach(item => {
      if (!categoryGroups[item.category]) {
        categoryGroups[item.category] = 0;
      }
      categoryGroups[item.category] += item.totalValue;
    });

    const labels = Object.keys(categoryGroups);
    const data = Object.values(categoryGroups);

    // Create chart data for InventoryLevels component
    const inventoryChartData = {
      labels: labels,
      datasets: [{
        label: 'Inventory Value',
        data: data,
        backgroundColor: ['#1976D2', '#FF9800', '#4CAF50', '#9C27B0', '#F44336', '#FFEB3B', '#03A9F4', '#E91E63'],
        barThickness: 40,
      }]
    };

    // Save chart data to localStorage for InventoryLevels component to use
    localStorage.setItem('inventoryChartData', JSON.stringify(inventoryChartData));
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setSelectedItem(item);
      setFormData({ ...item });
    } else {
      setSelectedItem(null);
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        itemName: '',
        category: '',
        quantity: 0,
        unitPrice: 0,
        totalValue: 0,
        location: '',
        lastUpdated: today,
        status: 'In Stock',
        supplierId: '',
        supplierName: '',
        companyId: currentUser?.id || 'company-123'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for supplier selection
    if (name === 'supplierId') {
      const supplierId = value === '' ? '' : value;
      const selectedSupplier = suppliers.find(s => s.id == supplierId);
      
      setFormData(prev => ({
        ...prev,
        supplierId: supplierId,
        supplierName: selectedSupplier ? selectedSupplier.name : ''
      }));
    } 
    // Special handling for quantity and unit price to calculate total value
    else if (name === 'quantity' || name === 'unitPrice') {
      const quantity = name === 'quantity' ? Number(value) : formData.quantity;
      const unitPrice = name === 'unitPrice' ? Number(value) : formData.unitPrice;
      const totalValue = quantity * unitPrice;
      
      setFormData(prev => ({
        ...prev,
        [name]: Number(value),
        totalValue: totalValue
      }));
    } 
    else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'totalValue' ? Number(value) : value
      }));
    }
  };

  const handleSaveItem = () => {
    // Validate form data
    if (!formData.itemName || !formData.category || formData.quantity < 0 || formData.unitPrice <= 0 || !formData.location) {
      setSnackbarMessage('Please fill all required fields with valid values');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    if (selectedItem) {
      // Update existing item
      setInventory(prev => prev.map(item => 
        item.id === selectedItem.id ? { ...formData, id: selectedItem.id } : item
      ));
      setSnackbarMessage('Inventory item updated successfully');
    } else {
      // Add new item
      const newItem = {
        ...formData,
        id: Date.now() // Simple way to generate unique ID
      };
      setInventory(prev => [...prev, newItem]);
      setSnackbarMessage('New inventory item added successfully');
    }

    setSnackbarSeverity('success');
    setOpenSnackbar(true);
    handleCloseDialog();
  };

  const handleDeleteItem = (id) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    setSnackbarMessage('Inventory item deleted successfully');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Out of Stock':
        return 'error';
      case 'Reserved':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          color="primary" 
          sx={{ mr: 2 }}
          onClick={() => setCompanyView('dashboard')}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          Manage Inventory
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Inventory Items</Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Item
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Total Value</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.unitPrice.toLocaleString()}</TableCell>
                  <TableCell>${item.totalValue.toLocaleString()}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.lastUpdated}</TableCell>
                  <TableCell>
                    <Chip 
                      label={item.status} 
                      color={getStatusColor(item.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{item.supplierName}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleOpenDialog(item)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Item Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Item Name"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Supplier</InputLabel>
                <Select
                  name="supplierId"
                  value={formData.supplierId}
                  onChange={handleInputChange}
                  label="Supplier"
                  displayEmpty
                >
                  <MenuItem value="" disabled>Select a supplier</MenuItem>
                  {suppliers.length > 0 ? (
                    suppliers
                      .map((supplier) => (
                        <MenuItem key={supplier.id} value={supplier.id}>
                          {supplier.name} - {supplier.category}
                        </MenuItem>
                      ))
                  ) : (
                    <MenuItem disabled>No suppliers available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Location</InputLabel>
                <Select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  label="Location"
                >
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>{location}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Unit Price ($)"
                name="unitPrice"
                type="number"
                value={formData.unitPrice}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Total Value ($)"
                name="totalValue"
                type="number"
                value={formData.totalValue}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  label="Status"
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Updated"
                name="lastUpdated"
                type="date"
                value={formData.lastUpdated}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveItem} variant="contained" color="primary">
            {selectedItem ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageInventory;