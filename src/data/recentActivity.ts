import { Settings2, UsersRound, ShieldCheck, Library } from 'lucide-react';
import type { ActivityItem } from '../types';

export const recentActivityData: ActivityItem[] = [
  { 
    id: 1,
    title: 'General settings updated', 
    detail: 'Loan period, Fine per day changed', 
    module: 'General', 
    updatedBy: 'Admin User', 
    date: 'May 15, 2026',
    time: '10:30 AM',
    icon: Settings2,
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400',
    badge: 'emerald'
  },
  { 
    id: 2,
    title: 'New user added: Ana Lim', 
    detail: 'Assigned as Student Librarian', 
    module: 'Users & Roles', 
    updatedBy: 'Admin User', 
    date: 'May 14, 2026',
    time: '04:22 PM',
    icon: UsersRound,
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400',
    badge: 'violet'
  },
  { 
    id: 3,
    title: 'Password changed', 
    detail: 'Admin password was updated', 
    module: 'Account Security', 
    updatedBy: 'Admin User', 
    date: 'May 13, 2026',
    time: '09:15 AM',
    icon: ShieldCheck,
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400',
    badge: 'blue'
  },
  { 
    id: 4,
    title: 'Library Information updated', 
    detail: 'Library address and contact information changed', 
    module: 'Library Profile', 
    updatedBy: 'Admin User', 
    date: 'May 12, 2026',
    time: '02:45 PM',
    icon: Library,
    color: 'text-teal-600 bg-teal-50 dark:bg-teal-500/10 dark:text-teal-400',
    badge: 'sky'
  }
];
