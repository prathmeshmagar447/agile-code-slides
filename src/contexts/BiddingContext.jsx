
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'react-hot-toast';

const BiddingContext = createContext();

export function useBidding() {
  return useContext(BiddingContext);
}

export function BiddingProvider({ children }) {
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rfqs, setRfqs] = useState([]);
  const [bids, setBids] = useState([]);

  // Load data from Supabase on mount
  useEffect(() => {
    if (currentUser) {
      loadRfqsFromSupabase();
      loadBidsFromSupabase();
    }
  }, [currentUser]);

  // Load RFQs from Supabase
  const loadRfqsFromSupabase = async () => {
    setLoading(true);
    try {
      let query = supabase.from('bids').select('*');
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        setRfqs(data);
      }
    } catch (err) {
      console.error('Error loading RFQs:', err);
      setError('Failed to load RFQs');
    } finally {
      setLoading(false);
    }
  };

  // Load bids from Supabase
  const loadBidsFromSupabase = async () => {
    setLoading(true);
    try {
      let query = supabase.from('bid_responses').select('*');
      
      if (userRole === 'supplier') {
        query = query.eq('supplier_id', currentUser.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        setBids(data);
      }
    } catch (err) {
      console.error('Error loading bids:', err);
      setError('Failed to load bids');
    } finally {
      setLoading(false);
    }
  };

  // Create a new RFQ (company function)
  const createRfq = async (rfqData) => {
    setLoading(true);
    setError('');
    
    try {
      const newRfq = {
        created_by: currentUser.id,
        material: rfqData.itemName,
        quantity: rfqData.quantity,
        unit: rfqData.unit || 'units',
        deadline: rfqData.bidDeadline,
        description: rfqData.description,
        delivery_location: rfqData.deliveryLocation,
        expected_price: rfqData.expectedPrice,
        delivery_timeline: rfqData.deliveryTimeline,
        status: 'Posted'
      };
      
      const { data, error } = await supabase
        .from('bids')
        .insert(newRfq)
        .select();
        
      if (error) throw error;
      
      // Add the new RFQ to the local state
      if (data && data.length > 0) {
        setRfqs(prevRfqs => [...prevRfqs, data[0]]);
        toast.success('RFQ created successfully');
        return data[0];
      }
    } catch (err) {
      console.error('Failed to create RFQ:', err);
      setError('Failed to create RFQ');
      toast.error('Failed to create RFQ');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Submit a bid for an RFQ (supplier function)
  const submitBid = async (rfqId, bidData) => {
    setLoading(true);
    setError('');
    
    try {
      const newBid = {
        bid_id: rfqId,
        supplier_id: currentUser.id,
        price: bidData.price,
        quantity_offered: bidData.quantityOffered || null,
        delivery_time: bidData.deliveryDate,
        notes: bidData.terms,
        documents: bidData.documents || [],
        status: 'Submitted'
      };
      
      const { data, error } = await supabase
        .from('bid_responses')
        .insert(newBid)
        .select();
        
      if (error) throw error;
      
      // Add the new bid to the local state
      if (data && data.length > 0) {
        setBids(prevBids => [...prevBids, data[0]]);
        toast.success('Bid submitted successfully');
        return data[0];
      }
    } catch (err) {
      console.error('Failed to submit bid:', err);
      setError('Failed to submit bid');
      toast.error('Failed to submit bid');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update bid status (company function)
  const updateBidStatus = async (bidId, status) => {
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('bid_responses')
        .update({ status })
        .eq('id', bidId)
        .select();
        
      if (error) throw error;
      
      // Update the bid in local state
      if (data && data.length > 0) {
        setBids(prevBids => 
          prevBids.map(bid => 
            bid.id === bidId ? { ...bid, status } : bid
          )
        );
        
        // If a bid is accepted, update the RFQ status to Awarded
        if (status === 'Accepted') {
          const bid = bids.find(b => b.id === bidId);
          if (bid) {
            await updateRfqStatus(bid.bid_id, 'Awarded');
            
            // Reject all other bids for this RFQ
            const otherBids = bids.filter(b => b.bid_id === bid.bid_id && b.id !== bidId);
            for (const otherBid of otherBids) {
              await updateBidStatus(otherBid.id, 'Rejected');
            }
          }
        }
        
        toast.success(`Bid ${status.toLowerCase()} successfully`);
        return data[0];
      }
    } catch (err) {
      console.error('Failed to update bid status:', err);
      setError('Failed to update bid status');
      toast.error('Failed to update bid status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update RFQ status (company function)
  const updateRfqStatus = async (rfqId, status) => {
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('bids')
        .update({ status })
        .eq('id', rfqId)
        .select();
        
      if (error) throw error;
      
      // Update the RFQ in local state
      if (data && data.length > 0) {
        setRfqs(prevRfqs => 
          prevRfqs.map(rfq => 
            rfq.id === rfqId ? { ...rfq, status } : rfq
          )
        );
        
        // If an RFQ is closed, reject all pending bids
        if (status === 'Closed') {
          const pendingBids = bids.filter(bid => 
            bid.bid_id === rfqId && bid.status === 'Submitted'
          );
          
          for (const pendingBid of pendingBids) {
            await updateBidStatus(pendingBid.id, 'Rejected');
          }
        }
        
        toast.success(`RFQ ${status.toLowerCase()} successfully`);
        return data[0];
      }
    } catch (err) {
      console.error('Failed to update RFQ status:', err);
      setError('Failed to update RFQ status');
      toast.error('Failed to update RFQ status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get RFQs based on user role
  const getRfqs = () => {
    if (userRole === 'company') {
      // Companies see their own RFQs
      return rfqs.filter(rfq => rfq.created_by === currentUser.id);
    } else if (userRole === 'supplier') {
      // Suppliers see all available RFQs
      return rfqs.filter(rfq => rfq.status === 'Posted' || rfq.status === 'Bidding');
    }
    return [];
  };

  // Get bids based on user role
  const getBids = (rfqId = null) => {
    if (userRole === 'company') {
      // Companies see bids for their RFQs
      const companyRfqIds = rfqs
        .filter(rfq => rfq.created_by === currentUser.id)
        .map(rfq => rfq.id);
      
      return rfqId 
        ? bids.filter(bid => bid.bid_id === rfqId)
        : bids.filter(bid => companyRfqIds.includes(bid.bid_id));
    } else if (userRole === 'supplier') {
      // Suppliers see their own bids
      return rfqId 
        ? bids.filter(bid => bid.bid_id === rfqId && bid.supplier_id === currentUser.id)
        : bids.filter(bid => bid.supplier_id === currentUser.id);
    }
    return [];
  };

  // Get a specific RFQ by ID
  const getRfqById = (rfqId) => {
    return rfqs.find(rfq => rfq.id === rfqId) || null;
  };

  // Get a specific bid by ID
  const getBidById = (bidId) => {
    return bids.find(bid => bid.id === bidId) || null;
  };

  // Create notifications for suppliers when a new bid is posted
  const createNotification = async (type, message, relatedBid, recipientId) => {
    try {
      await supabase.from('notifications').insert({
        user_id: recipientId,
        type,
        message,
        related_bid: relatedBid,
        seen: false
      });
    } catch (err) {
      console.error('Failed to create notification:', err);
    }
  };

  // Get notifications for the current user
  const getNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error('Failed to get notifications:', err);
      return [];
    }
  };

  // Mark a notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      await supabase
        .from('notifications')
        .update({ seen: true })
        .eq('id', notificationId);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      await supabase
        .from('notifications')
        .update({ seen: true })
        .eq('user_id', currentUser.id);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const value = {
    loading,
    error,
    createRfq,
    submitBid,
    updateBidStatus,
    updateRfqStatus,
    getRfqs,
    getBids,
    getRfqById,
    getBidById,
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    refreshData: async () => {
      await loadRfqsFromSupabase();
      await loadBidsFromSupabase();
    }
  };

  return (
    <BiddingContext.Provider value={value}>
      {children}
    </BiddingContext.Provider>
  );
}
