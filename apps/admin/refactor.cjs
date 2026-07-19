const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const pagesDir = path.join(srcDir, 'pages');
const utilsDir = path.join(srcDir, 'utils');

if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir, { recursive: true });
if (!fs.existsSync(utilsDir)) fs.mkdirSync(utilsDir, { recursive: true });

const content = fs.readFileSync(path.join(srcDir, 'App.jsx'), 'utf-8');
const lines = content.split('\n');
const getLines = (start, end) => lines.slice(start - 1, end).join('\n');

// 1. Helpers
const helpersCode = `import React from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
${getLines(64, 113)}
export { getStatusBadge, getPriorityBadge, getRoleBadge, getMessageStatusBadge };`;
fs.writeFileSync(path.join(utilsDir, 'helpers.jsx'), helpersCode);

// 2. MockData
const mockDataCode = `
export const mockDossiers = [];
export const mockTasks = [];
export const mockInbox = [];
export const mockContactInbox = [];
export const mockRecrutementInbox = [];
export const mockClients = [];
export const mockRoles = [
  { id: 'R-001', name: 'ADMIN', users: 1, permissions: 'Accès total, Configuration', status: 'Actif' },
  { id: 'R-002', name: 'SUPERVISOR', users: 1, permissions: 'Gestion des dossiers, Assignations', status: 'Actif' },
  { id: 'R-003', name: 'COLLABORATOR', users: 2, permissions: 'Traitement des dossiers, Messages', status: 'Actif' },
  { id: 'R-004', name: 'PRESTATAIRE', users: 1, permissions: 'Accès dossiers assignés', status: 'Actif' },
  { id: 'R-005', name: 'READ_ONLY', users: 0, permissions: 'Consultation uniquement', status: 'Inactif' }
];
`;
fs.writeFileSync(path.join(utilsDir, 'mockData.js'), mockDataCode);

// 3. Pages
const commonImports = `import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Files, Users, Settings, Bell, Search, LogOut, Briefcase,
  MoreVertical, CheckCircle, Clock, AlertCircle, Mail, MessageSquare,
  Pencil, Eye, Trash, X, Shield, Inbox, ChevronDown
} from 'lucide-react';
import { getStatusBadge, getPriorityBadge, getRoleBadge, getMessageStatusBadge } from '../utils/helpers';
import { mockDossiers, mockTasks, mockInbox, mockContactInbox, mockRecrutementInbox, mockClients, mockRoles } from '../utils/mockData';

`;

fs.writeFileSync(path.join(pagesDir, 'DashboardPage.jsx'), commonImports + getLines(116, 180) + `\nexport default DashboardPage;`);
fs.writeFileSync(path.join(pagesDir, 'InboxPage.jsx'), commonImports + getLines(181, 634) + `\nexport default InboxPage;`);
fs.writeFileSync(path.join(pagesDir, 'DossiersPage.jsx'), commonImports + getLines(635, 1029) + `\nexport default DossiersPage;`);
fs.writeFileSync(path.join(pagesDir, 'TasksPage.jsx'), commonImports + getLines(1030, 1327) + `\nexport default TasksPage;`);
fs.writeFileSync(path.join(pagesDir, 'RolesPage.jsx'), commonImports + getLines(1328, 1604) + `\nexport default RolesPage;`);
fs.writeFileSync(path.join(pagesDir, 'UsersPage.jsx'), commonImports + getLines(1605, 2403) + `\nexport default UsersPage;`);
fs.writeFileSync(path.join(pagesDir, 'LoginPage.jsx'), commonImports + getLines(2404, 2458) + `\nexport default LoginPage;`);

// 4. App.jsx
const newAppImports = `import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Files, Users, Settings, Inbox, ChevronDown, LogOut } from 'lucide-react';

import DashboardPage from './pages/DashboardPage';
import DossiersPage from './pages/DossiersPage';
import InboxPage from './pages/InboxPage';
import TasksPage from './pages/TasksPage';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import LoginPage from './pages/LoginPage';

const MOCK_USER = {
  id: 'U-001',
  name: 'Marie Claire',
  role: 'ADMIN',
  email: 'm.claire@menua.fr',
  status: 'Actif',
  lastLogin: 'Il y a 2h'
};
`;
const newAppCode = newAppImports + '\n' + getLines(2459, lines.length);
fs.writeFileSync(path.join(srcDir, 'App.jsx'), newAppCode);

console.log("Refactoring complete");
