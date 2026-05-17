export type LoanItem = {
  id: number; title: string; author: string; dueDate: string
  status: 'Overdue' | 'Due Soon' | 'Normal'; statusLabel: string
}
export type ReservationItem = {
  id: number; title: string; author: string; reservedOn: string
  status: 'Ready' | 'Pending'; statusLabel: string
}
export type ActivityItem = {
  dateTime: string; activity: string; description: string; performedBy: string
}
export type MemberDetailData = {
  name: string; memberId: string; email: string; phone: string; address: string
  initials: string; avatarColor: string
  type: string; department: string; status: 'Active' | 'Inactive' | 'Overdue'
  dateJoined: string; memberSince: string; lastUpdated: string
  totalLoans: number; currentLoans: number; reservationsCount: number; fines: string
  loansList: LoanItem[]; reservationsList: ReservationItem[]
  notes: string[]; activities: ActivityItem[]
}

export const mockMembersData: Record<number, MemberDetailData> = {
  1: {
    name: 'Juan Dela Cruz', memberId: 'MEM-2024-0001',
    email: 'juan.delacruz@email.com', phone: '0917 123 4567',
    address: '123 Rizal Street, Barangay 10 Manila, Metro Manila, 1000',
    initials: 'JD', avatarColor: 'bg-blue-500',
    type: 'Regular Member', department: 'BS Information Technology',
    status: 'Active', dateJoined: 'May 15, 2024', memberSince: '1 year',
    lastUpdated: 'May 15, 2024 by Admin User',
    totalLoans: 12, currentLoans: 2, reservationsCount: 1, fines: '₱0.00',
    loansList: [
      { id: 101, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', dueDate: 'May 28, 2025', status: 'Overdue', statusLabel: '7 days overdue' },
      { id: 102, title: 'Atomic Habits', author: 'James Clear', dueDate: 'Jun 05, 2025', status: 'Due Soon', statusLabel: 'Due in 2 days' }
    ],
    reservationsList: [
      { id: 201, title: 'The Psychology of Money', author: 'Morgan Housel', reservedOn: 'May 18, 2025', status: 'Ready', statusLabel: 'Ready for pickup' }
    ],
    notes: [],
    activities: [
      { dateTime: 'May 18, 2025 10:24 AM', activity: 'Reservation Placed', description: 'Reserved "The Psychology of Money"', performedBy: 'Juan Dela Cruz' },
      { dateTime: 'May 15, 2025 03:15 PM', activity: 'Book Borrowed', description: 'Borrowed "The Great Gatsby"', performedBy: 'Admin User' },
      { dateTime: 'May 15, 2025 03:14 PM', activity: 'Book Borrowed', description: 'Borrowed "Atomic Habits"', performedBy: 'Admin User' },
      { dateTime: 'May 15, 2025 02:30 PM', activity: 'Member Registered', description: 'New member account created', performedBy: 'Admin User' }
    ]
  },
  2: {
    name: 'Maria Santos', memberId: 'MEM-2024-0002',
    email: 'maria.santos@email.com', phone: '0921 456 7890',
    address: '456 Mabini St, Ermita, Manila, 1000',
    initials: 'MS', avatarColor: 'bg-pink-500',
    type: 'Regular Member', department: 'BS Education',
    status: 'Active', dateJoined: 'Jun 12, 2024', memberSince: '11 months',
    lastUpdated: 'Jun 12, 2024 by Admin User',
    totalLoans: 8, currentLoans: 1, reservationsCount: 0, fines: '₱0.00',
    loansList: [{ id: 103, title: 'Sosyolohiya sa Filipino', author: 'Kahayon, Alicia H.', dueDate: 'Jun 18, 2025', status: 'Normal', statusLabel: 'On Time' }],
    reservationsList: [], notes: ['Excellent reading student. Prefers textbooks.'],
    activities: [
      { dateTime: 'Jun 01, 2025 11:20 AM', activity: 'Book Borrowed', description: 'Borrowed "Sosyolohiya sa Filipino"', performedBy: 'Admin User' },
      { dateTime: 'Jun 12, 2024 09:30 AM', activity: 'Member Registered', description: 'New member account created', performedBy: 'Admin User' }
    ]
  },
  3: {
    name: 'Pedro Reyes', memberId: 'MEM-2024-0003',
    email: 'pedro.reyes@email.com', phone: '0999 555 1212',
    address: '789 Taft Avenue, Malate, Manila, 1000',
    initials: 'PR', avatarColor: 'bg-violet-500',
    type: 'Regular Member', department: 'BS Information Tech',
    status: 'Active', dateJoined: 'Aug 04, 2024', memberSince: '9 months',
    lastUpdated: 'Aug 04, 2024 by Admin User',
    totalLoans: 5, currentLoans: 0, reservationsCount: 1, fines: '₱0.00',
    loansList: [],
    reservationsList: [{ id: 202, title: 'Understanding Philippine social realities', author: 'Ramirez, Mina M.', reservedOn: 'May 16, 2025', status: 'Pending', statusLabel: 'Pending arrival' }],
    notes: [],
    activities: [
      { dateTime: 'May 16, 2025 04:10 PM', activity: 'Reservation Placed', description: 'Reserved "Understanding Philippine social realities"', performedBy: 'Pedro Reyes' },
      { dateTime: 'Aug 04, 2024 10:15 AM', activity: 'Member Registered', description: 'New member account created', performedBy: 'Admin User' }
    ]
  },
  4: {
    name: 'Ana Lim', memberId: 'MEM-2024-0004',
    email: 'ana.lim@email.com', phone: '0916 888 3434',
    address: '321 Aurora Blvd, Cubao, Quezon City, 1100',
    initials: 'AL', avatarColor: 'bg-rose-500',
    type: 'Regular Member', department: 'BS Psychology',
    status: 'Overdue', dateJoined: 'Sep 22, 2024', memberSince: '8 months',
    lastUpdated: 'Sep 22, 2024 by Admin User',
    totalLoans: 15, currentLoans: 3, reservationsCount: 0, fines: '₱120.00',
    loansList: [
      { id: 104, title: 'Filipino values today', author: 'Timberza, Florentino T.', dueDate: 'May 10, 2025', status: 'Overdue', statusLabel: '15 days overdue' },
      { id: 105, title: 'Deep Work', author: 'Cal Newport', dueDate: 'May 12, 2025', status: 'Overdue', statusLabel: '13 days overdue' },
      { id: 106, title: 'Sociology in the Philippine setting', author: 'Hunt, Chester L.', dueDate: 'May 20, 2025', status: 'Overdue', statusLabel: '5 days overdue' }
    ],
    reservationsList: [], notes: ['Has a pending warning for overdue books.'],
    activities: [
      { dateTime: 'May 03, 2025 09:05 AM', activity: 'Book Borrowed', description: 'Borrowed "Filipino values today"', performedBy: 'Admin User' },
      { dateTime: 'May 05, 2025 02:14 PM', activity: 'Book Borrowed', description: 'Borrowed "Deep Work"', performedBy: 'Admin User' },
      { dateTime: 'May 06, 2025 04:30 PM', activity: 'Book Borrowed', description: 'Borrowed "Sociology in the Philippine setting"', performedBy: 'Admin User' }
    ]
  }
}

