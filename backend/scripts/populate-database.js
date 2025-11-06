import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/user.js';
import Farmer from '../models/Farmer.js';
import Buyer from '../models/Buyer.js';
import WasteListing from '../models/WasteListing.js';
import Purchase from '../models/Purchase.js';

const fixAndPopulateDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Step 1: Fix listings without farmerId
    console.log('\n🔧 Fixing listings without farmerId...');
    const listingsWithoutFarmer = await WasteListing.find({ farmerId: { $exists: false } });
    console.log(`Found ${listingsWithoutFarmer.length} listings without farmerId`);

    const farmers = await Farmer.find().populate('userId');
    if (farmers.length === 0) {
      console.log('❌ No farmers found!');
      process.exit(1);
    }

    // Assign random farmers to listings without farmerId
    for (const listing of listingsWithoutFarmer) {
      const randomFarmer = farmers[Math.floor(Math.random() * farmers.length)];
      const farmerUser = await User.findById(randomFarmer.userId);
      if (farmerUser) {
        listing.farmerId = randomFarmer.userId;
        listing.farmerName = farmerUser.name;
        await listing.save();
        console.log(`✅ Fixed listing ${listing._id} - assigned to ${farmerUser.name}`);
      }
    }

    // Step 2: Get active listings with proper farmerId
    const activeListings = await WasteListing.find({ 
      status: 'Active',
      farmerId: { $exists: true, $ne: null }
    }).limit(10);
    console.log(`\n✅ Found ${activeListings.length} active listings with farmerId`);

    // Step 3: Create sample listings if needed
    if (activeListings.length < 5) {
      console.log('\n📝 Creating additional sample listings...');
      const sampleFarmers = await Farmer.find().populate('userId').limit(3);
      
      for (const farmer of sampleFarmers) {
        const user = await User.findById(farmer.userId);
        if (!user) continue;

        const sampleListings = [
          {
            farmerId: farmer.userId,
            farmerName: user.name,
            location: 'Punjab, India',
            wasteType: 'Rice Straw',
            quantity: '50 tons',
            price: '₹8,500/ton',
            carbonSaving: '145 kg CO₂',
            image: '🌾',
            status: 'Active',
            inquiries: Math.floor(Math.random() * 10),
            description: 'High-quality rice straw, perfect for composting and biofuel production.',
            category: 'Crop Residue',
            expectedProcess: 'Composting',
            co2Footprint: '145 kg CO₂',
            tags: ['organic', 'fresh', 'bulk']
          },
          {
            farmerId: farmer.userId,
            farmerName: user.name,
            location: 'Haryana, India',
            wasteType: 'Wheat Straw',
            quantity: '30 tons',
            price: '₹7,200/ton',
            carbonSaving: '120 kg CO₂',
            image: '🌾',
            status: 'Active',
            inquiries: Math.floor(Math.random() * 8),
            description: 'Premium wheat straw available for immediate pickup.',
            category: 'Crop Residue',
            expectedProcess: 'Animal Feed',
            co2Footprint: '120 kg CO₂',
            tags: ['premium', 'organic']
          }
        ];

        for (const listingData of sampleListings) {
          const existing = await WasteListing.findOne({
            farmerId: listingData.farmerId,
            wasteType: listingData.wasteType,
            status: 'Active'
          });
          if (!existing) {
            await WasteListing.create(listingData);
            console.log(`✅ Created listing: ${listingData.wasteType} for ${user.name}`);
          }
        }
      }
    }

    // Step 4: Create purchases for buyers
    console.log('\n🛒 Creating purchases for buyers...');
    const buyers = await Buyer.find().populate('userId');
    const updatedListings = await WasteListing.find({ 
      status: 'Active',
      farmerId: { $exists: true, $ne: null }
    }).limit(10);

    let purchaseCount = 0;
    for (const buyer of buyers) {
      const buyerId = buyer.userId._id || buyer.userId;
      const buyerName = buyer.userId.name || 'Unknown Buyer';
      
      // Get 2-3 listings per buyer
      const listingsToPurchase = updatedListings.slice(purchaseCount, purchaseCount + 3);
      
      if (listingsToPurchase.length === 0) break;

      for (const listing of listingsToPurchase) {
        // Check if purchase already exists
        const existingPurchase = await Purchase.findOne({
          buyerId: buyerId,
          listingId: listing._id
        });

        if (existingPurchase) {
          continue;
        }

        // Ensure farmerId exists
        const farmerId = listing.farmerId?._id || listing.farmerId;
        if (!farmerId) {
          console.log(`⚠️  Skipping listing ${listing._id} - no farmerId`);
          continue;
        }

        // Calculate total amount
        const priceMatch = listing.price.match(/₹([\d,]+)/);
        const quantityMatch = listing.quantity.match(/([\d.]+)/);
        let totalAmount = 0;

        if (priceMatch && quantityMatch) {
          const pricePerUnit = parseFloat(priceMatch[1].replace(/,/g, ''));
          const quantity = parseFloat(quantityMatch[1]);
          totalAmount = pricePerUnit * quantity;
        }

        // Create purchase with different statuses
        const statuses = ['Pending', 'Confirmed', 'Completed'];
        const status = statuses[purchaseCount % 3];

        await Purchase.create({
          buyerId: buyerId,
          listingId: listing._id,
          farmerId: farmerId,
          wasteType: listing.wasteType,
          quantity: listing.quantity,
          price: listing.price,
          totalAmount: totalAmount,
          carbonSaving: listing.carbonSaving || listing.co2Footprint,
          status: status
        });

        // Mark listing as Sold
        listing.status = 'Sold';
        await listing.save();

        purchaseCount++;
        console.log(`✅ Created purchase for ${buyerName}: ${listing.wasteType} (${status})`);
      }
    }

    // Final Summary
    const finalStats = {
      users: await User.countDocuments(),
      farmers: await Farmer.countDocuments(),
      buyers: await Buyer.countDocuments(),
      listings: await WasteListing.countDocuments(),
      activeListings: await WasteListing.countDocuments({ status: 'Active' }),
      soldListings: await WasteListing.countDocuments({ status: 'Sold' }),
      purchases: await Purchase.countDocuments(),
      pendingPurchases: await Purchase.countDocuments({ status: 'Pending' }),
      confirmedPurchases: await Purchase.countDocuments({ status: 'Confirmed' }),
      completedPurchases: await Purchase.countDocuments({ status: 'Completed' })
    };

    console.log('\n=== DATABASE SUMMARY ===');
    console.log(`Users: ${finalStats.users}`);
    console.log(`Farmers: ${finalStats.farmers}`);
    console.log(`Buyers: ${finalStats.buyers}`);
    console.log(`Total Listings: ${finalStats.listings}`);
    console.log(`  - Active: ${finalStats.activeListings}`);
    console.log(`  - Sold: ${finalStats.soldListings}`);
    console.log(`Total Purchases: ${finalStats.purchases}`);
    console.log(`  - Pending: ${finalStats.pendingPurchases}`);
    console.log(`  - Confirmed: ${finalStats.confirmedPurchases}`);
    console.log(`  - Completed: ${finalStats.completedPurchases}`);
    console.log('\n✅ Database populated successfully!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixAndPopulateDatabase();
