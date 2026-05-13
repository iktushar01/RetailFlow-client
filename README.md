# 🏪 
RetailFlow POS Management System - Frontend

A modern, full-featured React application for comprehensive store management with procurement workflows, inventory tracking, and supplier management.

![React](https://img.shields.io/badge/React-19.1.1-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.14-38bdf8)
![Axios](https://img.shields.io/badge/Axios-1.12.2-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Complete Feature Set

### 🔐 Authentication & User Management
- **Secure Login System** - Username/password authentication with xenuser/xenuser123
- **User Profile Management** - View and edit personal information
- **Settings & Preferences** - Customize language, timezone, notifications, display, and security
- **Protected Routes** - All dashboard features require authentication
- **Session Persistence** - Stay logged in across browser sessions
- **Logout Functionality** - Secure logout with confirmation
- **Password Management** - Change password with validation

### 📦 Product Management
- **Add Products** - Comprehensive form with image upload and QR code generation
- **View Products** - Table and card view toggle for flexible visualization
- **Edit Products** - Full editing with image replacement and QR regeneration
- **Delete Products** - Safe deletion with confirmation dialogs
- **Advanced Filtering** - Search by name, brand, QR code; filter by category and supplier
- **Export to CSV** - Download filtered product data
- **Duplicate Prevention** - QR code validation
- **Category Management** - Add categories on-the-fly

### 👥 Supplier Management
- **Complete CRUD** - Add, view, edit, delete suppliers
- **Contact Tracking** - Phone, email, address management
- **Payment Terms** - Configurable payment options
- **Status Management** - Active/Inactive supplier tracking
- **Advanced Filtering** - Multi-criteria search and filtering
- **Export Data** - CSV export functionality

### 📋 Purchase Order (PO) System
- **Create POs** - Generate purchase orders with multiple items
- **Item Selection** - Add products with quantities and prices
- **Automatic Calculations** - Subtotal, tax, and total auto-calculated
- **PO Status Flow** - Pending → Sent → Partially Received → Fully Received
- **Send to Supplier** - Mark POs as sent (email integration ready)
- **Edit Draft POs** - Modify before sending
- **Delete Protection** - Prevent deletion of received POs
- **Advanced Filtering** - Search by PO number, supplier, status, date range
- **Newest First Sorting** - Multi-level fallback sorting
- **Pagination** - Navigate large datasets easily

### 📦 Goods Receive Notes (GRN)
- **Multi-Receipt Support** - Create multiple GRNs per PO
- **Partial Receipt** - Receive items in batches
- **Full Receipt** - Complete order fulfillment
- **Batch Tracking** - Record batch numbers for products
- **Expiry Tracking** - Track expiration dates for perishable items
- **Automatic Inventory Update** - Stock updated immediately on GRN creation
- **Cumulative Validation** - Prevent over-receiving
- **Remaining Quantity Display** - Show what's left to receive
- **Independent Approval** - Approve partial and full receipts separately
- **PO Status Auto-Update** - Automatically updates PO status based on receipts
- **Payment Record Creation** - Auto-creates payment records on approval
- **Edit Partial GRNs** - Modify partially received GRNs
- **Delete with Inventory Revert** - Safely delete GRNs and revert stock
- **Advanced Filtering** - Search by GRN/PO number, supplier, status, date

### 💰 Supplier Payments
- **Payment Tracking** - Complete payment management system
- **Auto Payment Creation** - Payment records created from approved GRNs
- **Payment Status** - Due / Partial / Paid tracking
- **Add Payments** - Record payments with multiple methods
- **Payment Methods** - Cash, Bank Transfer, Mobile Payment, Cheque, Credit Card
- **Payment History** - Full transaction history per GRN
- **Transaction References** - Track transaction/reference IDs
- **Due Date Management** - 30-day payment terms
- **Automatic Status Updates** - Status changes based on amounts paid
- **Supplier Overview** - View all payments by supplier
- **Advanced Filtering** - Search by GRN/PO, filter by status, supplier, date range
- **Payment Statistics** - Total amount, paid, due overview
- **Overdue Tracking** - Identify overdue payments

### 🏭 Warehouse Inventory (Inhouse Products)
- **Real-time Stock Levels** - View current inventory quantities
- **Product Details** - SKU, batch, expiry, location tracking
- **Stock Status Indicators** - In Stock / Low Stock / Out of Stock
- **Low Stock Alerts** - Configurable threshold warnings
- **Expiry Tracking** - Expired and expiring soon alerts (30-day warning)
- **Multi-location Support** - Track products across warehouses
- **Category Filtering** - Filter by product categories
- **Search Functionality** - Find products quickly
- **Last Updated Timestamps** - Track when stock was modified
- **Inventory Statistics** - Total products, stock levels, alerts
- **Color-Coded Badges** - Visual stock status indicators

### 📥 Stock In (from GRN)
- **GRN History** - View all stock receipt entries
- **Audit Trail** - Complete history of goods received
- **Batch & Expiry Info** - Track batch numbers and expiry dates
- **Receipt Details** - Ordered vs received quantities
- **Supplier Information** - Linked supplier data
- **PO Linkage** - Connect to original purchase orders
- **Automatic Stock Info** - Displays auto-update notifications
- **Status Tracking** - Monitor approval status
- **Historical Records** - All past stock receipts

### 🎨 User Interface
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Modern Gradient UI** - Professional color schemes
- **Smooth Animations** - Transitions and hover effects
- **Loading States** - Skeleton loaders and spinners
- **Empty States** - Helpful messages when no data
- **Modal Dialogs** - Beautiful SweetAlert2 modals
- **Status Badges** - Color-coded status indicators
- **Icon Library** - Lucide React icons throughout
- **Pagination Controls** - First/Previous/Next/Last buttons
- **Sortable Tables** - Click headers to sort
- **Filter Panels** - Collapsible filter sections
- **Statistics Cards** - Dashboard-style stat displays

### 🔧 Technical Features
- **SharedTable Component** - Reusable table with sorting, pagination, filtering
- **Newest-First Sorting** - Multi-level fallback (createdAt → _id → date field)
- **Pagination System** - 10 items per page (configurable)
- **Advanced Filtering** - Multiple filter criteria with reset
- **Form Validation** - Client-side validation with error messages
- **QR Code Generation** - Auto-generated unique product identifiers
- **Image Upload** - ImgBB integration for cloud storage
- **API Integration** - RESTful API with Axios
- **State Management** - React hooks (useState, useEffect, useMemo, useCallback)
- **Error Handling** - User-friendly error messages
- **Loading States** - Feedback during async operations
- **Reusable Components** - DRY principle throughout

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- ImgBB API key (for image uploads)

### Installation

1. **Clone and navigate**
   ```bash
   git clone <repository-url>
   cd pos-store-management-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Create `.env` file:
   ```env
   VITE_IMGBB_API_KEY=your_imgbb_api_key_here
   VITE_API_BASE_URL=https://pos-system-management-server-20.vercel.app
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
pos-store-management-client/
├── src/
│   ├── Components/
│   │   ├── Footer/
│   │   │   └── Footer.jsx
│   │   ├── Header/
│   │   │   └── Header.jsx
│   │   ├── Sidebar/
│   │   │   └── Sidebar.jsx              # Navigation menu
│   │   └── UI/
│   │       └── Button.jsx               # Reusable button component
│   │
│   ├── Pages/
│   │   ├── HomePage/
│   │   │   └── HomePage.jsx             # Dashboard home
│   │   │
│   │   ├── LoginPage/
│   │   │   └── LoginPage.jsx            # Authentication page
│   │   │
│   │   ├── ProfilePage/
│   │   │   └── ProfilePage.jsx          # User profile management
│   │   │
│   │   ├── SettingsPage/
│   │   │   └── SettingsPage.jsx         # Application settings
│   │   │
│   │   ├── ProductPages/
│   │   │   ├── ProductAdd.jsx           # Add new products
│   │   │   ├── ProductManage.jsx        # Manage all products
│   │   │   ├── AddCategoryModal.jsx     # Add categories
│   │   │   ├── ViewProductModal.jsx     # View details
│   │   │   └── EditProductModal.jsx     # Edit products
│   │   │
│   │   ├── SuppliersPages/
│   │   │   ├── SupplierPages.jsx        # Main supplier page
│   │   │   ├── SuppliersList.jsx        # Supplier table
│   │   │   ├── SuppliersFilter.jsx      # Filter component
│   │   │   ├── AddSuppliersModal.jsx    # Add modal
│   │   │   ├── AddSuppliersFrom.jsx     # Add form
│   │   │   ├── EditSuppliersModal.jsx   # Edit modal
│   │   │   └── EditSuppliersForm.jsx    # Edit form
│   │   │
│   │   ├── POPages/
│   │   │   ├── ManagePO.jsx             # Main PO page
│   │   │   ├── components/
│   │   │   │   ├── POList.jsx           # PO table
│   │   │   │   ├── POFilter.jsx         # Filter panel
│   │   │   │   ├── POForm.jsx           # Create/Edit form
│   │   │   │   ├── POItemsTable.jsx     # Items table
│   │   │   │   └── POSummary.jsx        # Summary display
│   │   │   ├── services/
│   │   │   │   └── poService.js         # API calls
│   │   │   └── utils/
│   │   │       └── poHelpers.js         # Helper functions
│   │   │
│   │   ├── GRNPages/
│   │   │   ├── GRNManage.jsx            # Main GRN page
│   │   │   ├── components/
│   │   │   │   ├── GRNList.jsx          # GRN table
│   │   │   │   ├── GRNFilter.jsx        # Filter panel
│   │   │   │   ├── GRNForm.jsx          # Create/Edit form
│   │   │   │   └── GRNItemsTable.jsx    # Items table
│   │   │   ├── services/
│   │   │   │   └── grnService.js        # API calls
│   │   │   └── utils/
│   │   │       └── grnHelpers.js        # Helper functions
│   │   │
│   │   ├── GENPaymentsPage/
│   │   │   ├── Payments.jsx             # Main payments page
│   │   │   ├── components/
│   │   │   │   ├── PaymentsList.jsx     # Payments table
│   │   │   │   ├── PaymentsFilter.jsx   # Filter panel
│   │   │   │   └── AddPaymentModal.jsx  # Payment form
│   │   │   ├── services/
│   │   │   │   └── paymentsService.js   # API calls
│   │   │   └── utils/
│   │   │       └── paymentsHelpers.js   # Helper functions
│   │   │
│   │   ├── InStockProductPages/
│   │   │   ├── InStockProductPages.jsx  # Main inventory page
│   │   │   ├── components/
│   │   │   │   ├── InventoryList.jsx    # Inventory table
│   │   │   │   └── InventoryFilter.jsx  # Filter panel
│   │   │   ├── services/
│   │   │   │   └── inventoryService.js  # API calls
│   │   │   └── utils/
│   │   │       └── inventoryHelpers.js  # Helper functions
│   │   │
│   │   └── StockInPages/
│   │       └── StockInPages.jsx         # Stock in history
│   │
│   ├── Shared/
│   │   ├── InputFrom/
│   │   │   └── InputFrom.jsx            # Form input component
│   │   ├── ReuseableFilter/
│   │   │   └── ReuseableFilter.jsx      # Filter component
│   │   ├── SharedModal/
│   │   │   └── SharedModal.jsx          # Modal wrapper
│   │   └── SharedTable/
│   │       └── SharedTable.jsx          # Table with sort/pagination
│   │
│   ├── Layouts/
│   │   └── DashboardLayout.jsx          # Main layout
│   │
│   ├── Routes/
│   │   ├── PublicRoute.jsx              # Route configuration
│   │   └── ProtectedRoute.jsx           # Authentication guard
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx              # Authentication state management
│   │
│   ├── constants/
│   │   └── zIndex.js                    # Z-index constants
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
├── .env
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## 🛠️ Tech Stack

### Core
- **React 19.1.1** - UI library with hooks
- **React Router DOM 7.9.3** - Client-side routing with protected routes
- **Tailwind CSS 4.1.14** - Utility-first CSS
- **Vite 7.1.7** - Build tool and dev server
- **Context API** - Authentication state management
- **LocalStorage** - Session persistence

### UI Libraries
- **TanStack React Table 8.21.3** - Powerful table component
- **Lucide React 0.544.0** - Icon library
- **SweetAlert2 11.23.0** - Beautiful alerts
- **React Modal 3.16.3** - Accessible modals
- **React Hook Form 7.63.0** - Form management

### HTTP & API
- **Axios 1.12.2** - HTTP client
- **Backend**: https://pos-system-management-server-20.vercel.app/

## 📡 API Integration

All pages communicate with the backend API:

- **Products**: `/products`
- **Suppliers**: `/suppliers`
- **Purchase Orders**: `/purchase-orders`
- **GRN**: `/grn`
- **Inventory**: `/inventory`
- **Payments**: `/payments`

## 🔐 Authentication System

### Login Credentials
- **Username**: `xenuser`
- **Password**: `xenuser123`

### Features
- **Protected Routes** - All dashboard features require authentication
- **Session Management** - Persistent login across browser sessions
- **User Profile** - View and edit personal information
- **Settings** - Customize application preferences
- **Logout** - Secure logout with confirmation

## 🎨 Component Library

### Button Component
Multiple variants and sizes:
- **Variants**: primary, secondary, outline, ghost, edit, delete, glass, neon
- **Sizes**: sm, md, lg
- **Features**: Loading state, disabled state, custom icons

```jsx
<Button variant="primary" size="md" loading={loading}>
  Submit
</Button>
```

### SharedTable Component
Advanced data table with:
- ✅ Sortable columns (click headers)
- ✅ Pagination (10 items per page)
- ✅ Custom row actions
- ✅ Loading and empty states
- ✅ Responsive design

### SharedModal Component
Flexible modal system:
- ✅ Multiple sizes
- ✅ Custom headers/footers
- ✅ Close on click outside
- ✅ ESC key support
- ✅ Smooth animations

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_IMGBB_API_KEY` | ImgBB API key for image uploads | Yes |
| `VITE_API_BASE_URL` | Backend API URL | No (defaults to production) |

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)

# Build
npm run build        # Build for production

# Preview
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Build Output
```bash
npm run build        # Creates dist/ folder
```

## 📊 Key Workflows

### Authentication Flow
1. Visit application → Redirected to login page
2. Enter credentials (xenuser/xenuser123)
3. Login successful → Redirected to dashboard
4. Access all protected features
5. Manage profile and settings
6. Logout when done

### Purchase to Receipt Flow
1. Create Supplier
2. Add Products to Catalog
3. Create Purchase Order
4. Send PO to Supplier
5. Create GRN (Receive Goods)
   - Inventory auto-updated ✅
   - Payment record created ✅
6. Approve GRN for audit trail
7. Record Payments
8. Track Payment Status

### Stock Management Flow
1. GRN Created → Stock Added to Inventory
2. View in Inhouse Products page
3. Monitor low stock alerts
4. Track expiry dates
5. Review in Stock In history

## 🎯 Performance Features

- ⚡ Code splitting with lazy loading
- ⚡ Memoized expensive calculations (useMemo)
- ⚡ Debounced search inputs
- ⚡ Pagination for large datasets
- ⚡ Optimized re-renders
- ⚡ Fast Vite build tool

## 📚 Documentation

Each module includes:
- Clear component structure
- Service layer for API calls
- Utility functions for helpers
- Consistent naming conventions
- Code comments where needed

## 🐛 Troubleshooting

### Images not uploading
- Check `VITE_IMGBB_API_KEY` in `.env`
- Verify file size (max 5MB)
- Check image format (PNG, JPG, WEBP)

### API connection errors
- Verify backend is running
- Check `VITE_API_BASE_URL`
- Confirm CORS configuration

### Build errors
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

## 📄 License

MIT License - see LICENSE file

## 👥 Authors

Store-Xen Development Team

## 🙏 Acknowledgments

- ImgBB for image hosting
- QR Server for QR codes
- Tailwind CSS community
- React ecosystem

---

**🌐 Backend API:** https://pos-system-management-server-20.vercel.app/  
**📦 Version:** 1.0.0  
**⚡ Build Tool:** Vite  
**🎨 Styling:** Tailwind CSS  

---

**Made with ❤️ by Store-Xen Team**
