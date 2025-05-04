
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBidding } from '../../contexts/BiddingContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Visibility as ViewIcon,
  CheckCircle as AcceptIcon,
  Cancel as RejectIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const ViewResponses = () => {
  const { id: rfqId } = useParams();
  const navigate = useNavigate();
  const { fetchRfqById, fetchBidsForRfq, updateBidStatus, updateRfqStatus } = useBidding();
  const { currentUser, userRole } = useAuth();
  
  const [rfq, setRfq] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBid, setSelectedBid] = useState(null);
  const [bidDetailsOpen, setBidDetailsOpen] = useState(false);
  
  useEffect(() => {
    loadData();
  }, [rfqId]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const rfqData = await fetchRfqById(rfqId);
      if (!rfqData) {
        setError('RFQ not found');
        setLoading(false);
        return;
      }
      
      setRfq(rfqData);
      const bidsData = await fetchBidsForRfq(rfqId);
      setBids(bidsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewBid = (bid) => {
    setSelectedBid(bid);
    setBidDetailsOpen(true);
  };
  
  const handleAcceptBid = async (bid) => {
    try {
      // Accept this bid
      await updateBidStatus(bid.id, 'Accepted');
      
      // Reject all other bids
      const otherBids = bids.filter(b => b.id !== bid.id);
      for (const otherBid of otherBids) {
        await updateBidStatus(otherBid.id, 'Rejected');
      }
      
      // Mark RFQ as Awarded
      await updateRfqStatus(rfqId, 'Awarded');
      
      // Refresh data
      loadData();
    } catch (err) {
      console.error('Error accepting bid:', err);
      setError('Failed to accept bid');
    }
  };
  
  const handleRejectBid = async (bid) => {
    try {
      await updateBidStatus(bid.id, 'Rejected');
      loadData();
    } catch (err) {
      console.error('Error rejecting bid:', err);
      setError('Failed to reject bid');
    }
  };
  
  const handleCloseRfq = async () => {
    try {
      await updateRfqStatus(rfqId, 'Closed');
      loadData();
    } catch (err) {
      console.error('Error closing RFQ:', err);
      setError('Failed to close RFQ');
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/bids')}
          sx={{ mb: 2 }}
        >
          Back to Bids
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  if (!rfq) {
    return (
      <Box>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/bids')}
          sx={{ mb: 2 }}
        >
          Back to Bids
        </Button>
        <Alert severity="info">RFQ not found</Alert>
      </Box>
    );
  }

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
        <Typography variant="h5">Bid Responses</Typography>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6">{rfq.material}</Typography>
            <Chip
              label={rfq.status}
              color={
                rfq.status === 'Posted' ? 'primary' :
                rfq.status === 'Bidding' ? 'info' :
                rfq.status === 'Awarded' ? 'success' :
                'default'
              }
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
          {userRole === 'company' && rfq.created_by === currentUser?.id && rfq.status !== 'Closed' && rfq.status !== 'Awarded' && (
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={handleCloseRfq}
            >
              Close RFQ
            </Button>
          )}
        </Box>
        
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="textSecondary">
              <strong>Company:</strong> {rfq.companyName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="textSecondary">
              <strong>Quantity:</strong> {rfq.quantity} {rfq.unit}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="textSecondary">
              <strong>Deadline:</strong> {rfq.deadline ? format(new Date(rfq.deadline), 'MMM dd, yyyy') : 'Not specified'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="textSecondary">
              <strong>Location:</strong> {rfq.deliveryLocation}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="body2" color="textSecondary">
              <strong>Description:</strong> {rfq.description || 'No description provided'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h6" sx={{ mb: 2 }}>Responses ({bids.length})</Typography>
      
      {bids.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            No responses have been submitted for this RFQ yet.
          </Typography>
          {userRole === 'supplier' && rfq.status !== 'Closed' && rfq.status !== 'Awarded' && (
            <Button 
              variant="contained" 
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => navigate('/bids')}
            >
              Place Bid
            </Button>
          )}
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Supplier</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Delivery</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bids.map((bid) => (
                <TableRow key={bid.id}>
                  <TableCell>{bid.supplierName}</TableCell>
                  <TableCell>${bid.price}</TableCell>
                  <TableCell>{bid.quantity_offered || rfq.quantity} {rfq.unit}</TableCell>
                  <TableCell>{format(new Date(bid.deliveryDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Chip
                      label={bid.status}
                      color={
                        bid.status === 'Accepted' ? 'success' :
                        bid.status === 'Rejected' ? 'error' :
                        'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{format(new Date(bid.createdAt), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleViewBid(bid)}
                    >
                      <ViewIcon />
                    </IconButton>
                    
                    {userRole === 'company' && 
                     rfq.created_by === currentUser?.id && 
                     bid.status === 'Submitted' && 
                     rfq.status !== 'Closed' && 
                     rfq.status !== 'Awarded' && (
                      <>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleAcceptBid(bid)}
                        >
                          <AcceptIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRejectBid(bid)}
                        >
                          <RejectIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Bid Details Dialog */}
      <Dialog open={bidDetailsOpen} onClose={() => setBidDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Bid Details</DialogTitle>
        <DialogContent>
          {selectedBid && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Supplier</Typography>
                <Typography variant="body1">{selectedBid.supplierName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Status</Typography>
                <Chip 
                  label={selectedBid.status} 
                  color={
                    selectedBid.status === 'Accepted' ? 'success' :
                    selectedBid.status === 'Rejected' ? 'error' :
                    'default'
                  }
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Price</Typography>
                <Typography variant="body1">${selectedBid.price}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Quantity Offered</Typography>
                <Typography variant="body1">{selectedBid.quantity_offered || rfq.quantity} {rfq.unit}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Delivery Date</Typography>
                <Typography variant="body1">{format(new Date(selectedBid.deliveryDate), 'MMM dd, yyyy')}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2">Terms & Notes</Typography>
                <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                  <Typography variant="body2">{selectedBid.terms || 'No terms specified'}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Submitted</Typography>
                <Typography variant="body2">
                  {format(new Date(selectedBid.createdAt), 'MMM dd, yyyy h:mm a')}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBidDetailsOpen(false)}>Close</Button>
          {selectedBid && 
           userRole === 'company' && 
           rfq.created_by === currentUser?.id && 
           selectedBid.status === 'Submitted' && 
           rfq.status !== 'Closed' && 
           rfq.status !== 'Awarded' && (
            <>
              <Button 
                variant="contained" 
                color="success"
                onClick={() => {
                  handleAcceptBid(selectedBid);
                  setBidDetailsOpen(false);
                }}
              >
                Accept Bid
              </Button>
              <Button 
                variant="contained" 
                color="error"
                onClick={() => {
                  handleRejectBid(selectedBid);
                  setBidDetailsOpen(false);
                }}
              >
                Reject Bid
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewResponses;
