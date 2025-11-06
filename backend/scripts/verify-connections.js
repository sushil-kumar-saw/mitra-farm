import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/user.js';
import Farmer from '../models/Farmer.js';
import Buyer from '../models/Buyer.js';
import WasteListing from '../models/WasteListing.js';
import Purchase from '../models/Purchase.js';
import CommunityPost from '../models/CommunityPost.js';

const verifyConnections = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('=== DATABASE STRUCTURE VERIFICATION ===\n');

    // 1. Check Users
    const userCount = await User.countDocuments();
    console.log(`1. Users: ${userCount}`);
    if (userCount === 0) {
      console.log('   ⚠️  No users found in database');
    }

    // 2. Check Farmers
    const farmerCount = await Farmer.countDocuments();
    console.log(`2. Farmers: ${farmerCount}`);
    const farmers = await Farmer.find().limit(3).populate('userId', 'name email');
    if (farmers.length > 0) {
      console.log(`   Sample: ${farmers.map(f => f.userId?.name || 'Unknown').join(', ')}`);
    }

    // 3. Check Buyers
    const buyerCount = await Buyer.countDocuments();
    console.log(`3. Buyers: ${buyerCount}`);
    const buyers = await Buyer.find().limit(3).populate('userId', 'name email');
    if (buyers.length > 0) {
      console.log(`   Sample: ${buyers.map(b => b.userId?.name || 'Unknown').join(', ')}`);
    }

    // 4. Check Listings
    const listingCount = await WasteListing.countDocuments();
    console.log(`\n4. Waste Listings: ${listingCount}`);
    const activeListings = await WasteListing.countDocuments({ status: 'Active' });
    const soldListings = await WasteListing.countDocuments({ status: 'Sold' });
    console.log(`   Active: ${activeListings}, Sold: ${soldListings}`);
    
    // Check for listings without farmerId
    const listingsWithoutFarmer = await WasteListing.countDocuments({ 
      $or: [
        { farmerId: { $exists: false } },
        { farmerId: null }
      ]
    });
    if (listingsWithoutFarmer > 0) {
      console.log(`   ⚠️  ${listingsWithoutFarmer} listings missing farmerId`);
    }

    // Check listings with farmerId
    const listingsWithFarmer = await WasteListing.find({ 
      farmerId: { $exists: true, $ne: null } 
    }).limit(3);
    if (listingsWithFarmer.length > 0) {
      console.log(`   Sample listings with farmerId:`);
      for (const listing of listingsWithFarmer) {
        const farmer = await User.findById(listing.farmerId);
        console.log(`     - ${listing.wasteType} by ${farmer?.name || 'Unknown'} (${listing.status})`);
      }
    }

    // 5. Check Purchases
    const purchaseCount = await Purchase.countDocuments();
    console.log(`\n5. Purchases: ${purchaseCount}`);
    const purchases = await Purchase.find().limit(3).populate('buyerId', 'name').populate('farmerId', 'name');
    if (purchases.length > 0) {
      console.log(`   Sample purchases:`);
      purchases.forEach(p => {
        console.log(`     - ${p.wasteType} (${p.quantity}) - Buyer: ${p.buyerId?.name || 'Unknown'}, Farmer: ${p.farmerId?.name || 'Unknown'}, Status: ${p.status}`);
      });
    }

    // 6. Check Community Posts
    const postCount = await CommunityPost.countDocuments();
    console.log(`\n6. Community Posts: ${postCount}`);

    // 7. Verify Relationships
    console.log('\n=== RELATIONSHIP VERIFICATION ===\n');

    // Check farmer-listings relationship
    const testFarmer = await Farmer.findOne().populate('userId');
    if (testFarmer) {
      const farmerListings = await WasteListing.countDocuments({ farmerId: testFarmer.userId._id });
      console.log(`Farmer "${testFarmer.userId?.name}" has ${farmerListings} listings`);
    }

    // Check buyer-purchases relationship
    const testBuyer = await Buyer.findOne().populate('userId');
    if (testBuyer) {
      const buyerPurchases = await Purchase.countDocuments({ buyerId: testBuyer.userId._id });
      console.log(`Buyer "${testBuyer.userId?.name}" has ${buyerPurchases} purchases`);
    }

    // 8. Check Data Consistency
    console.log('\n=== DATA CONSISTENCY CHECK ===\n');

    // Check if all purchases have valid listings
    const purchasesWithInvalidListing = await Purchase.find().then(purchases => {
      return Promise.all(purchases.map(async (p) => {
        const listing = await WasteListing.findById(p.listingId);
        return !listing ? p._id : null;
      }));
    }).then(results => results.filter(r => r !== null));

    if (purchasesWithInvalidListing.length > 0) {
      console.log(`⚠️  ${purchasesWithInvalidListing.length} purchases reference invalid listings`);
    } else {
      console.log('✅ All purchases have valid listing references');
    }

    // Check if all purchases have valid buyers
    const purchasesWithInvalidBuyer = await Purchase.find().then(purchases => {
      return Promise.all(purchases.map(async (p) => {
        const buyer = await User.findById(p.buyerId);
        return !buyer ? p._id : null;
      }));
    }).then(results => results.filter(r => r !== null));

    if (purchasesWithInvalidBuyer.length > 0) {
      console.log(`⚠️  ${purchasesWithInvalidBuyer.length} purchases reference invalid buyers`);
    } else {
      console.log('✅ All purchases have valid buyer references');
    }

    // Check if all purchases have valid farmers
    const purchasesWithInvalidFarmer = await Purchase.find().then(purchases => {
      return Promise.all(purchases.map(async (p) => {
        const farmer = await User.findById(p.farmerId);
        return !farmer ? p._id : null;
      }));
    }).then(results => results.filter(r => r !== null));

    if (purchasesWithInvalidFarmer.length > 0) {
      console.log(`⚠️  ${purchasesWithInvalidFarmer.length} purchases reference invalid farmers`);
    } else {
      console.log('✅ All purchases have valid farmer references');
    }

    console.log('\n=== SUMMARY ===');
    console.log(`✅ Database structure verified`);
    console.log(`   - ${userCount} users`);
    console.log(`   - ${farmerCount} farmers`);
    console.log(`   - ${buyerCount} buyers`);
    console.log(`   - ${listingCount} listings (${activeListings} active, ${soldListings} sold)`);
    console.log(`   - ${purchaseCount} purchases`);
    console.log(`   - ${postCount} community posts`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

verifyConnections();

