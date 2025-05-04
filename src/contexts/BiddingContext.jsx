
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase, createNotification } from '../integrations/supabase/client';
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
  const [notifications, setNotifications] = useState([]);

  // Load data from Supabase on mount
  useEffect(() => {
    if (currentUser) {
      loadRfqsFromSupabase();
      loadBidsFromSupabase();
      loadNotifications();
    }
  }, [currentUser]);

  // Load RFQs from Supabase
  const loadRfqsFromSupabase = async () => {
    setLoading(true);
    try {
      let query = supabase.from('bids').select('*');
      
      if (userRole === 'company') {
        query = query.eq('created_by', currentUser.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        // Enhance RFQs with company information
        const enhancedRfqs = await Promise.all(data.map(async (rfq) => {
          // Get company details for each RFQ
          if (rfq.created_by) {
            const { data: companyData } = await supabase
              .from('users')
              .select('name')
              .eq('id', rfq.created_by)
              .single();
            
            return {
              ...rfq,
              companyName: companyData?.name || 'Unknown Company',
              // Map database fields to UI naming convention
              itemName: rfq.material,
              bidDeadline: rfq.deadline,
              deliveryLocation: rfq.description?.split('\n')?.[0] || 'Not specified',
              status: rfq.status || 'Posted',
            };
          }
          return rfq;
        }));
        
        setRfqs(enhancedRfqs);
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
        // Enhance bids with supplier information
        const enhancedBids = await Promise.all(data.map(async (bid) => {
          // Get supplier details for each bid
          if (bid.supplier_id) {
            const { data: supplierData } = await supabase
              .from('users')
              .select('name')
              .eq('id', bid.supplier_id)
              .single();
            
            return {
              ...bid,
              supplierName: supplierData?.name || 'Unknown Supplier',
              rfqId: bid.bid_id,
              status: bid.status || 'Submitted',
              deliveryDate: new Date(new Date().getTime() + (bid.delivery_time || 7 * 24 * 60 * 60 * 1000)),
              terms: bid.notes,
              createdAt: bid.created_at,
              selected: false,
            };
          }
          return bid;
        }));
        
        setBids(enhancedBids);
      }
    } catch (err) {
      console.error('Error loading bids:', err);
      setError('Failed to load bids');
    } finally {
      setLoading(false);
    }
  };
  
  // Load notifications from Supabase
  const loadNotifications = async () => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setNotifications(data);
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  };

  // Create a new RFQ (company function)
  const createRfq = async (rfqData) => {
    setLoading(true);
    setError('');
    
    try {
      // Format description to include delivery location
      const description = rfqData.deliveryLocation + 
        (rfqData.description ? `\n${rfqData.description}` : '');
      
      const newRfq = {
        created_by: currentUser.id,
        material: rfqData.itemName,
        quantity: rfqData.quantity,
        unit: rfqData.unit || 'units',
        deadline: rfqData.bidDeadline,
        description: description,
        status: 'Posted'
      };
      
      const { data, error } = await supabase
        .from('bids')
        .insert(newRfq)
        .select();
        
      if (error) throw error;
      
      // Add the new RFQ to the local state
      if (data && data.length > 0) {
        const enhancedRfq = {
          ...data[0],
          companyName: currentUser.name || 'Unknown Company',
          itemName: data[0].material,
          bidDeadline: data[0].deadline,
          deliveryLocation: rfqData.deliveryLocation,
          status: 'Posted',
        };
        
        setRfqs(prevRfqs => [...prevRfqs, enhancedRfq]);
        
        // Notify all suppliers of new RFQ
        const { data: suppliersData } = await supabase
          .from('users')
          .select('id')
          .eq('role', 'supplier');
          
        if (suppliersData) {
          for (const supplier of suppliersData) {
            await createNotification(
              supplier.id,
              'new_bid', 
              `New RFQ: ${rfqData.itemName}`, 
              data[0].id
            );
          }
        }
        
        toast.success('RFQ created successfully');
        return enhancedRfq;
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
      // Convert delivery date to interval (days from now)
      const deliveryDate = new Date(bidData.deliveryDate);
      const nowDate = new Date();
      const deliveryInterval = Math.ceil((deliveryDate - nowDate) / (1000 * 60 * 60 * 24));
      
      const newBid = {
        bid_id: rfqId,
        supplier_id: currentUser.id,
        price: bidData.price,
        quantity_offered: bidData.quantityOffered || null,
        delivery_time: `${deliveryInterval} days`,
        notes: bidData.terms,
        status: 'Submitted'
      };
      
      // Check if this is an update to an existing bid
      const existingBid = bids.find(b => b.supplier_id === currentUser.id && b.bid_id === rfqId);
      
      let data, error;
      
      if (existingBid) {
        // Update existing bid
        const { data: updatedData, error: updateError } = await supabase
          .from('bid_responses')
          .update(newBid)
          .eq('id', existingBid.id)
          .select();
          
        data = updatedData;
        error = updateError;
      } else {
        // Create new bid
        const { data: insertedData, error: insertError } = await supabase
          .from('bid_responses')
          .insert(newBid)
          .select();
          
        data = insertedData;
        error = insertError;
      }
        
      if (error) throw error;
      
      // Update local state
      if (data && data.length > 0) {
        const enhancedBid = {
          ...data[0],
          supplierName: currentUser.name || 'Unknown Supplier',
          rfqId: data[0].bid_id,
          status: 'Submitted',
          deliveryDate: deliveryDate,
          terms: bidData.terms,
          createdAt: data[0].created_at,
          selected: false,
        };
        
        if (existingBid) {
          setBids(prevBids => prevBids.map(b => 
            b.id === enhancedBid.id ? enhancedBid : b
          ));
          toast.success('Bid updated successfully');
        } else {
          setBids(prevBids => [...prevBids, enhancedBid]);
          toast.success('Bid submitted successfully');
          
          // Notify the company about the new bid
          const rfq = rfqs.find(r => r.id === rfqId);
          if (rfq && rfq.created_by) {
            await createNotification(
              rfq.created_by,
              'new_bid_response', 
              `New bid received for: ${rfq.material}`, 
              rfqId
            );
          }
          
          // Notify other suppliers about bid activity
          const { data: suppliersData } = await supabase
            .from('users')
            .select('id')
            .eq('role', 'supplier')
            .neq('id', currentUser.id);
            
          if (suppliersData) {
            const rfq = rfqs.find(r => r.id === rfqId);
            for (const supplier of suppliersData) {
              await createNotification(
                supplier.id,
                'bid_activity', 
                `New competitive bid on: ${rfq?.material || 'RFQ'}`, 
                rfqId
              );
            }
          }
        }
        
        return enhancedBid;
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
        
        // Notify the supplier about their bid status
        const bid = bids.find(b => b.id === bidId);
        if (bid && bid.supplier_id) {
          const statusMessage = status === 'Accepted' ? 
            'Congratulations! Your bid has been accepted' : 
            'Your bid has been rejected';
            
          await createNotification(
            bid.supplier_id,
            'bid_status_update', 
            statusMessage, 
            bid.bid_id
          );
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
        
        // Notify all suppliers who bid on this RFQ
        const rfqBids = bids.filter(bid => bid.bid_id === rfqId);
        for (const bid of rfqBids) {
          if (bid.supplier_id) {
            await createNotification(
              bid.supplier_id,
              'rfq_status_update', 
              `An RFQ you bid on has been ${status.toLowerCase()}`, 
              rfqId
            );
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
    return rfqs;
  };

  // Get bids based on user role and optional RFQ ID
  const getBids = (rfqId = null) => {
    if (rfqId) {
      return bids.filter(bid => bid.bid_id === rfqId);
    }
    return bids;
  };

  // Get a specific RFQ by ID
  const getRfqById = (rfqId) => {
    return rfqs.find(rfq => rfq.id === rfqId) || null;
  };

  // Get notifications for the current user
  const getNotifications = () => {
    return notifications;
  };

  // Mark a notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      await supabase
        .from('notifications')
        .update({ seen: true })
        .eq('id', notificationId);
        
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId ? { ...notification, seen: true } : notification
        )
      );
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
        
      setNotifications(prev => prev.map(notification => ({ ...notification, seen: true })));
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
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    refreshData: async () => {
      await loadRfqsFromSupabase();
      await loadBidsFromSupabase();
      await loadNotifications();
    }
  };

  return (
    <BiddingContext.Provider value={value}>
      {children}
    </BiddingContext.Provider>
  );
}
