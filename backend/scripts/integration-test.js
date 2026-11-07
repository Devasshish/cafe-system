import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000/api';
let adminToken = '';
let createdItemId = '';
let testOrderId = '';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${testName} - ${details}`);
    failedTests++;
  }
}

async function runTestSuite() {
  console.log('=====================================================');
  console.log('   CAFE ORDERING SYSTEM - FULL INTEGRATION TEST SUITE');
  console.log('=====================================================\n');

  try {
    // -----------------------------------------------------------------
    // 1. HEALTH CHECK & SYSTEM INTEGRITY
    // -----------------------------------------------------------------
    console.log('>>> [1/4] SYSTEM HEALTH & MONGO CONNECTIVITY');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'GET /api/health returns HTTP 200');
    assert(healthData.status === 'OK', 'Health status is OK');
    assert(healthData.database.ready === true, 'MongoDB Atlas connection ready: true');
    console.log();

    // -----------------------------------------------------------------
    // 2. CUSTOMER JOURNEY
    // -----------------------------------------------------------------
    console.log('>>> [2/4] CUSTOMER USER JOURNEY');

    // 2.1 Fetch entire menu
    const menuRes = await fetch(`${BASE_URL}/menu?limit=50`);
    const menuData = await menuRes.json();
    assert(menuRes.status === 200, 'Customer opens menu (GET /api/menu)');
    assert(menuData.data.length > 0, `Menu contains ${menuData.data.length} active items`);

    const availableItems = menuData.data.filter((item) => item.isAvailable);
    const unavailableItems = menuData.data.filter((item) => !item.isAvailable);
    assert(availableItems.length > 0, 'Menu contains available items for ordering');
    assert(unavailableItems.length > 0, 'Menu contains at least one unavailable item for testing out-of-stock guard');

    const testItem1 = availableItems[0];
    const testItem2 = availableItems[1] || availableItems[0];
    const outOfStockItem = unavailableItems[0];

    // 2.2 Search item by name
    const searchRes = await fetch(`${BASE_URL}/menu?search=${encodeURIComponent(testItem1.name.slice(0, 5))}`);
    const searchData = await searchRes.json();
    assert(searchRes.status === 200, 'Search menu by keyword');
    assert(searchData.data.some((i) => i._id === testItem1._id), 'Search results include matching item');

    // 2.3 Filter by category
    const categoryRes = await fetch(`${BASE_URL}/menu?category=${encodeURIComponent(testItem1.category)}`);
    const categoryData = await categoryRes.json();
    assert(categoryRes.status === 200, 'Filter menu by category');
    assert(categoryData.data.every((i) => i.category.toLowerCase() === testItem1.category.toLowerCase()), 'All returned items match category');

    // 2.4 Sort by price
    const sortRes = await fetch(`${BASE_URL}/menu?sort=price_asc`);
    const sortData = await sortRes.json();
    assert(sortRes.status === 200, 'Sort menu by price ascending');
    let isSorted = true;
    for (let i = 0; i < sortData.data.length - 1; i++) {
      if (sortData.data[i].price > sortData.data[i + 1].price) {
        isSorted = false;
        break;
      }
    }
    assert(isSorted, 'Menu items are strictly ordered by ascending price');

    // 2.5 Security: Attempt to order unavailable product
    const outOfStockOrderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Test Customer',
        phoneNumber: '+1-555-123-4567',
        tableNumber: 'T01',
        items: [{ menuItem: outOfStockItem._id, quantity: 1 }],
      }),
    });
    const outOfStockOrderData = await outOfStockOrderRes.json();
    assert(outOfStockOrderRes.status === 400, 'Server blocks ordering unavailable products');
    assert(outOfStockOrderData.success === false, 'Server returns error response for out-of-stock item');

    // 2.6 Security: Attempt price tampering (send $0.01 price from client)
    const expectedSubtotal = Math.round((testItem1.price * 2 + testItem2.price * 1) * 100) / 100;
    const orderPlacementRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Alice Customer',
        phoneNumber: '+1-555-987-6543',
        tableNumber: 'T05',
        spoofedClientPrice: 0.01,
        totalAmount: 0.01,
        items: [
          { menuItem: testItem1._id, quantity: 2, price: 0.01 },
          { menuItem: testItem2._id, quantity: 1, price: 0.01 },
        ],
      }),
    });
    const orderPlacementData = await orderPlacementRes.json();
    assert(orderPlacementRes.status === 201, 'Customer successfully places valid order (POST /api/orders)');
    assert(orderPlacementData.data.orderNumber.startsWith('ORD-'), 'Unique orderNumber format generated (ORD-YYMMDD-XXXX)');
    assert(orderPlacementData.data.totalAmount === expectedSubtotal, `Server ignored client price tampering (Expected: $${expectedSubtotal}, Calculated: $${orderPlacementData.data.totalAmount})`);
    assert(orderPlacementData.data.items[0].name === testItem1.name, 'Order preserves item name snapshot');
    assert(orderPlacementData.data.items[0].price === testItem1.price, 'Order preserves item price snapshot');

    testOrderId = orderPlacementData.data._id;

    // 2.7 Fetch placed order details
    const getOrderRes = await fetch(`${BASE_URL}/orders/${testOrderId}`);
    const getOrderData = await getOrderRes.json();
    assert(getOrderRes.status === 200, 'Retrieve individual order details (GET /api/orders/:id)');
    assert(getOrderData.data.customerName === 'Alice Customer', 'Order customer details match');
    assert(getOrderData.data.tableNumber === 'T05', 'Order table number matches');
    console.log();

    // -----------------------------------------------------------------
    // 3. ADMIN USER JOURNEY & AUTHENTICATION
    // -----------------------------------------------------------------
    console.log('>>> [3/4] ADMIN AUTHENTICATION & OPERATIONS');

    // 3.1 Security: Attempt protected operation without token
    const unauthMenuRes = await fetch(`${BASE_URL}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Hacker Drink', price: 9.99, category: 'hot coffee' }),
    });
    assert(unauthMenuRes.status === 401, 'Blocked unauthorized menu creation without Bearer token (HTTP 401)');

    // 3.2 Admin Login with invalid credentials
    const badLoginRes = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'incorrect-password' }),
    });
    assert(badLoginRes.status === 401, 'Rejects invalid admin login attempt');

    // 3.3 Admin Login with valid credentials
    const loginRes = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, 'Admin logs in successfully (POST /api/admin/login)');
    assert(Boolean(loginData.token), 'Admin receives signed JWT token');
    adminToken = loginData.token;

    // 3.4 Admin Dashboard Stats
    const statsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const statsData = await statsRes.json();
    assert(statsRes.status === 200, 'Fetch dashboard statistics (GET /api/admin/stats)');
    assert(statsData.data.totalOrders >= 1, 'Total orders metric is accurate');
    assert(statsData.data.totalSales > 0, `Total revenue metric is aggregated ($${statsData.data.totalSales})`);

    // 3.5 Admin: Create a new menu item
    const testItemName = `Seasonal Spiced Cider ${Date.now()}`;
    const createItemRes = await fetch(`${BASE_URL}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: testItemName,
        price: 5.75,
        category: 'beverages',
        description: 'Warm spiced apple cider with cinnamon bark',
        isAvailable: true,
        preparationTime: 4,
      }),
    });
    const createItemData = await createItemRes.json();
    assert(createItemRes.status === 201, 'Admin creates new menu item (POST /api/menu)');
    createdItemId = createItemData.data._id;

    // 3.6 Admin: Edit the created menu item
    const updateItemRes = await fetch(`${BASE_URL}/menu/${createdItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        price: 6.25,
        description: 'Updated artisan cider recipe with organic honey',
      }),
    });
    const updateItemData = await updateItemRes.json();
    assert(updateItemRes.status === 200, 'Admin edits menu item (PUT /api/menu/:id)');
    assert(updateItemData.data.price === 6.25, 'Updated price persisted in MongoDB Atlas');

    // 3.7 Admin: Toggle item availability
    const toggleRes = await fetch(`${BASE_URL}/menu/${createdItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ isAvailable: false }),
    });
    const toggleData = await toggleRes.json();
    assert(toggleRes.status === 200, 'Admin toggles availability status to false');
    assert(toggleData.data.isAvailable === false, 'Availability toggle persisted');

    // 3.8 Admin: Change customer order status
    const updateStatusRes = await fetch(`${BASE_URL}/orders/${testOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ orderStatus: 'Preparing' }),
    });
    const updateStatusData = await updateStatusRes.json();
    assert(updateStatusRes.status === 200, 'Admin updates order status to Preparing (PATCH /api/orders/:id/status)');
    assert(updateStatusData.data.orderStatus === 'Preparing', 'Order status transition persisted');

    // 3.9 Admin: Delete the created test menu item
    const deleteRes = await fetch(`${BASE_URL}/menu/${createdItemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(deleteRes.status === 200, 'Admin deletes test menu item (DELETE /api/menu/:id)');

    const recheckDeletedRes = await fetch(`${BASE_URL}/menu/${createdItemId}`);
    assert(recheckDeletedRes.status === 404, 'Verified deleted item is no longer accessible (HTTP 404)');
    console.log();

    // -----------------------------------------------------------------
    // 4. BACKEND INTEGRITY & BOUNDARY CHECKS
    // -----------------------------------------------------------------
    console.log('>>> [4/4] BOUNDARY & VALIDATION INTEGRITY CHECKS');

    // 4.1 Invalid MongoDB ObjectId
    const invalidIdRes = await fetch(`${BASE_URL}/menu/not-an-objectid`);
    assert(invalidIdRes.status === 400, 'Rejects invalid MongoDB ObjectId format (HTTP 400)');

    // 4.2 Non-existent MongoDB ObjectId
    const nonExistentRes = await fetch(`${BASE_URL}/menu/507f1f77bcf86cd799439011`);
    assert(nonExistentRes.status === 404, 'Handles non-existent item ID gracefully (HTTP 404)');

    // 4.3 Validation error on negative price
    const negPriceRes = await fetch(`${BASE_URL}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ name: 'Free Coffee', price: -5, category: 'hot coffee' }),
    });
    assert(negPriceRes.status === 400, 'Rejects negative price with express-validator (HTTP 400)');

    // 4.4 Swagger Documentation availability
    const swaggerDocsRes = await fetch(`http://localhost:5000/api/docs/`);
    assert(swaggerDocsRes.status === 200, 'Swagger UI documentation loads at /api/docs (HTTP 200)');

    const swaggerJsonRes = await fetch(`http://localhost:5000/api/docs.json`);
    const swaggerJsonData = await swaggerJsonRes.json();
    assert(swaggerJsonRes.status === 200, 'Swagger OpenAPI spec accessible at /api/docs.json');
    assert(Object.keys(swaggerJsonData.paths).length >= 8, `OpenAPI documents all ${Object.keys(swaggerJsonData.paths).length} API routes`);

    console.log('\n=====================================================');
    console.log(`   TEST RESULTS: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
    console.log('=====================================================');

    if (failedTests > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal Test Execution Error:', error);
    process.exit(1);
  }
}

runTestSuite();

