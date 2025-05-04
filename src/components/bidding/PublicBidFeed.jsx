
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBidding } from '../../contexts/BiddingContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { format, isAfter } from 'date-fns';

const PublicBidFeed = () => {
  const navigate = useNavigate();
  const { getAllRfqs, submitBid } = useBidding();
  const { currentUser, userRole } = useAuth();
  
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    material: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [bidFormOpen, setBidFormOpen] = useState(false);
  const [bidData, setBidData] = useState({
    price: '',
    quantityOffered: '',
    deliveryDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    terms: ''
  });
  
  // Load RFQs on component mount
  useEffect(() => {
    loadRfqs();
  }, []);
  
  const loadRfqs = async () => {
    setLoading(true);
    const fetchedRfqs = await getAllRfqs();
    setRfqs(fetchedRfqs);
    setLoading(false);
  };
  
  // Filter RFQs based on search term and filters
  const filteredRfqs = rfqs.filter(rfq => {
    // Search term filter
    const searchMatch = 
      rfq.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rfq.description && rfq.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Material filter
    const materialMatch = 
      !filters.material || rfq.material.toLowerCase().includes(filters.material.toLowerCase());
    
    // Status filter
    const statusMatch = !filters.status || rfq.status === filters.status;
    
    return searchMatch && materialMatch && statusMatch;
  });
  
  const handleViewResponses = (rfq) => {
    navigate(`/bids/${rfq.id}/responses`);
  };
  
  const handleBidNow = (rfq) => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/bids' } });
      return;
    }
    
    setSelectedRfq(rfq);
    setBidData({
      price: '',
      quantityOffered: rfq.quantity || '',
      deliveryDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      terms: ''
    });
    setBidFormOpen(true);
  };
  
  const handleSubmitBid = async () => {
    try {
      await submitBid(selectedRfq.id, bidData);
      setBidFormOpen(false);
      loadRfqs(); // Refresh the list
    } catch (error) {
      console.error('Error submitting bid:', error);
    }
  };
  
  const isDeadlinePassed = (deadline) => {
    return !isAfter(new Date(deadline), new Date());
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Request for Quotations (RFQs)</Typography>
        <Box>
          {userRole === 'company' && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/bids/create')}
              sx={{ mr: 1 }}
            >
              Create New RFQ
            </Button>
          )}
          <Button 
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadRfqs}
          >
            Refresh
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search RFQs..."
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
        </Box>
        
        {showFilters && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Material Type</InputLabel>
              <Select
                value={filters.material}
                label="Material Type"
                onChange={(e) => setFilters({ ...filters, material: e.target.value })}
              >
                <MenuItem value="">All Materials</MenuItem>
                {/* Get unique materials */}
                {[...new Set(rfqs.map(rfq => rfq.material))].map(material => (
                  <MenuItem key={material} value={material}>{material}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="Posted">Posted</MenuItem>
                <MenuItem value="Bidding">Bidding</MenuItem>
                <MenuItem value="Awarded">Awarded</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>
            </FormControl>
            <Button 
              variant="text" 
              onClick={() => setFilters({ material: '', status: '' })}
            >
              Clear Filters
            </Button>
          </Box>
        )}
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredRfqs.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            No RFQs found. {userRole === 'company' ? 'Create your first RFQ to get started.' : 'Check back later for new opportunities.'}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredRfqs.map(rfq => (
            <Grid item xs={12} sm={6} md={4} key={rfq.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" gutterBottom noWrap sx={{ maxWidth: '70%' }}>
                      {rfq.itemName}
                    </Typography>
                    <Chip 
                      label={rfq.status} 
                      color={
                        rfq.status === 'Posted' ? 'primary' :
                        rfq.status === 'Bidding' ? 'info' :
                        rfq.status === 'Awarded' ? 'success' :
                        'default'
                      }
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>Company:</strong> {rfq.companyName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>Quantity:</strong> {rfq.quantity} {rfq.unit}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>Deadline:</strong> {rfq.deadline ? format(new Date(rfq.deadline), 'MMM dd, yyyy') : 'Not specified'}
                    {isDeadlinePassed(rfq.deadline) && (
                      <Chip label="Expired" color="error" size="small" sx={{ ml: 1 }} />
                    )}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>Location:</strong> {rfq.deliveryLocation}
                  </Typography>
                  {rfq.description && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      <strong>Description:</strong><br />
                      {rfq.description.length > 100 
                        ? `${rfq.description.substring(0, 100)}...` 
                        : rfq.description}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => handleViewResponses(rfq)}
                  >
                    View Responses
                  </Button>
                  {userRole === 'supplier' && !isDeadlinePassed(rfq.deadline) && rfq.status !== 'Closed' && rfq.status !== 'Awarded' && (
                    <Button 
                      size="small" 
                      color="secondary"
                      onClick={() => handleBidNow(rfq)}
                    >
                      Bid Now
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Bid Form Dialog */}
      <Dialog open={bidFormOpen} onClose={() => setBidFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Bid</DialogTitle>
        <DialogContent>
          {selectedRfq && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                RFQ: {selectedRfq.itemName} ({selectedRfq.quantity} {selectedRfq.unit})
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price"
                    fullWidth
                    required
                    type="number"
                    value={bidData.price}
                    onChange={(e) => setBidData({...bidData, price: e.target.value})}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Quantity Offered"
                    fullWidth
                    type="number"
                    value={bidData.quantityOffered}
                    onChange={(e) => setBidData({...bidData, quantityOffered: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Delivery Date"
                    fullWidth
                    required
                    type="date"
                    value={bidData.deliveryDate ? format(new Date(bidData.deliveryDate), 'yyyy-MM-dd') : ''}
                    onChange={(e) => setBidData({...bidData, deliveryDate: new Date(e.target.value)})}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Terms & Notes"
                    fullWidth
                    multiline
                    rows={4}
                    value={bidData.terms}
                    onChange={(e) => setBidData({...bidData, terms: e.target.value})}
                    placeholder="Enter any special terms, conditions or notes"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBidFormOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmitBid} 
            variant="contained" 
            color="primary"
            disabled={!bidData.price || !bidData.deliveryDate}
          >
            Submit Bid
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PublicBidFeed;
