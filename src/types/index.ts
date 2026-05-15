import { LucideIcon } from 'lucide-react';

export type ThemeMode = 'light' | 'dark' | 'system';

export type ActivityItem = {
  id: number;
  title: string;
  detail: string;
  module: string;
  updatedBy: string;
  date: string;
  time: string;
  icon: LucideIcon;
  color: string;
  badge: string;
};

export type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export type User = {
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  login: string;
  color: string;
};

export type Role = {
  title: string;
  desc: string;
  users: string;
  icon: LucideIcon;
  color: string;
};
