// Static data for the owner dashboard
export const ownerData = {
  id: 1,
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "+1 234 567 8900",
  joinDate: "2023-01-15",
  totalPGs: 3,
  totalBookings: 24,
  totalRevenue: 45000,
  profileImage: null
};

export const staticPGs = [
  {
    id: 1,
    name: "Sunrise PG for Boys",
    type: "Boys",
    address: "123 College Street, Downtown",
    city: "Mumbai",
    rent: 8000,
    deposit: 5000,
    rooms: 20,
    occupiedRooms: 18,
    amenities: ["WiFi", "AC", "Laundry", "Mess", "Security"],
    images: [],
    description: "Modern PG accommodation with all basic amenities",
    status: "active",
    createdAt: "2023-06-15"
  },
  {
    id: 2,
    name: "Green Valley Girls Hostel",
    type: "Girls",
    address: "456 Park Avenue, Green Valley",
    city: "Mumbai", 
    rent: 9500,
    deposit: 6000,
    rooms: 15,
    occupiedRooms: 12,
    amenities: ["WiFi", "AC", "Laundry", "Mess", "Security", "Gym"],
    images: [],
    description: "Safe and comfortable accommodation for working women",
    status: "active",
    createdAt: "2023-08-20"
  },
  {
    id: 3,
    name: "Executive PG",
    type: "Co-ed",
    address: "789 Business District, Tech Park",
    city: "Mumbai",
    rent: 12000,
    deposit: 8000,
    rooms: 25,
    occupiedRooms: 22,
    amenities: ["WiFi", "AC", "Laundry", "Mess", "Security", "Gym", "Pool"],
    images: [],
    description: "Premium PG for working professionals",
    status: "active",
    createdAt: "2023-04-10"
  }
];

export const staticBookings = [
  {
    id: 1,
    pgId: 1,
    pgName: "Sunrise PG for Boys",
    tenantName: "Rahul Kumar",
    tenantPhone: "+91 98765 43210",
    tenantEmail: "rahul.kumar@email.com",
    roomNumber: "101",
    checkIn: "2024-01-15",
    checkOut: null,
    rent: 8000,
    deposit: 5000,
    status: "active",
    paymentStatus: "paid",
    lastPayment: "2024-08-01"
  },
  {
    id: 2,
    pgId: 2,
    pgName: "Green Valley Girls Hostel",
    tenantName: "Priya Sharma",
    tenantPhone: "+91 87654 32109",
    tenantEmail: "priya.sharma@email.com", 
    roomNumber: "205",
    checkIn: "2024-03-10",
    checkOut: null,
    rent: 9500,
    deposit: 6000,
    status: "active",
    paymentStatus: "paid",
    lastPayment: "2024-08-01"
  },
  {
    id: 3,
    pgId: 1,
    pgName: "Sunrise PG for Boys",
    tenantName: "Amit Patel",
    tenantPhone: "+91 76543 21098",
    tenantEmail: "amit.patel@email.com",
    roomNumber: "102",
    checkIn: "2024-02-20",
    checkOut: "2024-07-15",
    rent: 8000,
    deposit: 5000,
    status: "completed",
    paymentStatus: "paid",
    lastPayment: "2024-07-01"
  },
  {
    id: 4,
    pgId: 3,
    pgName: "Executive PG",
    tenantName: "Sarah Johnson",
    tenantPhone: "+91 65432 10987",
    tenantEmail: "sarah.johnson@email.com",
    roomNumber: "301",
    checkIn: "2024-05-01",
    checkOut: null,
    rent: 12000,
    deposit: 8000,
    status: "active",
    paymentStatus: "pending",
    lastPayment: "2024-07-01"
  },
  {
    id: 5,
    pgId: 2,
    pgName: "Green Valley Girls Hostel",
    tenantName: "Neha Gupta",
    tenantPhone: "+91 54321 09876",
    tenantEmail: "neha.gupta@email.com",
    roomNumber: "103",
    checkIn: "2024-06-15",
    checkOut: null,
    rent: 9500,
    deposit: 6000,
    status: "active",
    paymentStatus: "paid",
    lastPayment: "2024-08-01"
  }
];

export const dashboardStats = {
  totalPGs: staticPGs.length,
  totalBookings: staticBookings.filter(b => b.status === 'active').length,
  totalRevenue: staticBookings
    .filter(b => b.status === 'active')
    .reduce((sum, b) => sum + b.rent, 0),
  occupancyRate: Math.round(
    (staticPGs.reduce((sum, pg) => sum + pg.occupiedRooms, 0) /
     staticPGs.reduce((sum, pg) => sum + pg.rooms, 0)) * 100
  ),
  pendingPayments: staticBookings.filter(b => b.paymentStatus === 'pending').length,
  monthlyRevenue: [
    { month: 'Jan', revenue: 35000 },
    { month: 'Feb', revenue: 42000 },
    { month: 'Mar', revenue: 38000 },
    { month: 'Apr', revenue: 45000 },
    { month: 'May', revenue: 48000 },
    { month: 'Jun', revenue: 52000 },
    { month: 'Jul', revenue: 49000 },
    { month: 'Aug', revenue: 55000 }
  ]
};
