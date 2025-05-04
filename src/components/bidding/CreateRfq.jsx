
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBidding } from '../../contexts/BiddingContext';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { format } from 'date-fns';

const CreateRfq = () => {
  const navigate = useNavigate();
  const { createRfq, loading, error } = useBidding();
  
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    unit: 'units',
    bidDeadline: format(new Date(new Date().setDate(new Date().getDate() + 7)), 'yyyy-MM-dd'),
    deliveryLocation: '',
    description: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.itemName.trim()) errors.itemName = 'Material name is required';
    if (!formData.quantity || formData.quantity <= 0) errors.quantity = 'Valid quantity is required';
    if (!formData.unit) errors.unit = 'Unit is required';
    if (!formData.bidDeadline) errors.bidDeadline = 'Deadline is required';
    if (!formData.deliveryLocation.trim()) errors.deliveryLocation = 'Delivery location is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const rfq = await createRfq(formData);
      navigate('/bids');
    } catch (err) {
      console.error('Error creating RFQ:', err);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          color="primary" 
          sx={{ mr: 2 }}
          onClick={() => navigate('/bids')}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">Create New RFQ</Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Material Name"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!formErrors.itemName}
                helperText={formErrors.itemName}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!formErrors.quantity}
                helperText={formErrors.quantity}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth required error={!!formErrors.unit}>
                <InputLabel>Unit</InputLabel>
                <Select
                  name="unit"
                  value={formData.unit}
                  label="Unit"
                  onChange={handleInputChange}
                >
                  <MenuItem value="units">Units</MenuItem>
                  <MenuItem value="kg">Kilograms (kg)</MenuItem>
                  <MenuItem value="tons">Tons</MenuItem>
                  <MenuItem value="liters">Liters</MenuItem>
                  <MenuItem value="boxes">Boxes</MenuItem>
                  <MenuItem value="pallets">Pallets</MenuItem>
                  <MenuItem value="pieces">Pieces</MenuItem>
                  <MenuItem value="meters">Meters</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Delivery Location"
                name="deliveryLocation"
                value={formData.deliveryLocation}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!formErrors.deliveryLocation}
                helperText={formErrors.deliveryLocation}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Bid Deadline"
                name="bidDeadline"
                type="date"
                value={formData.bidDeadline}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                error={!!formErrors.bidDeadline}
                helperText={formErrors.bidDeadline}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description/Specifications"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                placeholder="Provide detailed specifications, quality requirements, and any other information suppliers should know"
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                variant="outlined" 
                sx={{ mr: 2 }}
                onClick={() => navigate('/bids')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Create RFQ'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateRfq;
