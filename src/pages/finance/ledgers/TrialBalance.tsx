import React, { useMemo, useState } from 'react';
// File: src/pages/finance/reports/TrialBalance.tsx

import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Download,
  Printer,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Calendar,
  TrendingUp,
  TrendingDown,
  Scale,
  FileText,
  Filter,
  Search,
  Eye,
  Info,
  Building,
  Users,
  X } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
const branches = [
{
  id: 'all',
  name: 'All Branches'
},
{
  id: 'main',
  name: 'Main Campus'
},
{
  id: 'north',
  name: 'North Branch'
},
{
  id: 'south',
  name: 'South Branch'
},
{
  id: 'east',
  name: 'East Branch'
},
{
  id: 'west',
  name: 'West Branch'
}];

const batches = [
{
  value: 'all',
  label: 'All Batches'
},
{
  value: '2024-25',
  label: '2024-25'
},
{
  value: '2023-24',
  label: '2023-24'
},
{
  value: '2022-23',
  label: '2022-23'
},
{
  value: '2021-22',
  label: '2021-22'
}];

const ledgerDataBase = {
  assets: {
    title: 'Assets',
    type: 'Dr',
    color: 'blue',
    accounts: [
    {
      id: 1,
      code: '1001',
      name: 'Cash in Hand',
      branches: {
        main: {
          dr: 30000,
          cr: 0
        },
        north: {
          dr: 20000,
          cr: 0
        },
        south: {
          dr: 25000,
          cr: 0
        },
        east: {
          dr: 10000,
          cr: 0
        },
        west: {
          dr: 5000,
          cr: 0
        }
      }
    },
    {
      id: 2,
      code: '1002',
      name: 'Cash at Bank - HDFC',
      branches: {
        main: {
          dr: 150000,
          cr: 0
        },
        north: {
          dr: 100000,
          cr: 0
        },
        south: {
          dr: 80000,
          cr: 0
        },
        east: {
          dr: 40000,
          cr: 0
        },
        west: {
          dr: 30000,
          cr: 0
        }
      }
    },
    {
      id: 3,
      code: '1003',
      name: 'Cash at Bank - SBI',
      branches: {
        main: {
          dr: 75000,
          cr: 0
        },
        north: {
          dr: 40000,
          cr: 0
        },
        south: {
          dr: 30000,
          cr: 0
        },
        east: {
          dr: 20000,
          cr: 0
        },
        west: {
          dr: 10000,
          cr: 0
        }
      }
    },
    {
      id: 4,
      code: '1004',
      name: 'Petty Cash',
      branches: {
        main: {
          dr: 5000,
          cr: 0
        },
        north: {
          dr: 3000,
          cr: 0
        },
        south: {
          dr: 3000,
          cr: 0
        },
        east: {
          dr: 2000,
          cr: 0
        },
        west: {
          dr: 2000,
          cr: 0
        }
      }
    },
    {
      id: 5,
      code: '1101',
      name: 'Accounts Receivable',
      branches: {
        main: {
          dr: 75000,
          cr: 0
        },
        north: {
          dr: 40000,
          cr: 0
        },
        south: {
          dr: 30000,
          cr: 0
        },
        east: {
          dr: 20000,
          cr: 0
        },
        west: {
          dr: 10000,
          cr: 0
        }
      }
    },
    {
      id: 6,
      code: '1102',
      name: 'Student Fees Receivable',
      branches: {
        main: {
          dr: 200000,
          cr: 0
        },
        north: {
          dr: 150000,
          cr: 0
        },
        south: {
          dr: 120000,
          cr: 0
        },
        east: {
          dr: 80000,
          cr: 0
        },
        west: {
          dr: 50000,
          cr: 0
        }
      }
    },
    {
      id: 7,
      code: '1201',
      name: 'Furniture & Fixtures',
      branches: {
        main: {
          dr: 200000,
          cr: 0
        },
        north: {
          dr: 125000,
          cr: 0
        },
        south: {
          dr: 100000,
          cr: 0
        },
        east: {
          dr: 100000,
          cr: 0
        },
        west: {
          dr: 50000,
          cr: 0
        }
      }
    },
    {
      id: 8,
      code: '1202',
      name: 'Computer Equipment',
      branches: {
        main: {
          dr: 175000,
          cr: 0
        },
        north: {
          dr: 100000,
          cr: 0
        },
        south: {
          dr: 100000,
          cr: 0
        },
        east: {
          dr: 60000,
          cr: 0
        },
        west: {
          dr: 40000,
          cr: 0
        }
      }
    },
    {
      id: 9,
      code: '1203',
      name: 'Lab Equipment',
      branches: {
        main: {
          dr: 400000,
          cr: 0
        },
        north: {
          dr: 250000,
          cr: 0
        },
        south: {
          dr: 200000,
          cr: 0
        },
        east: {
          dr: 100000,
          cr: 0
        },
        west: {
          dr: 50000,
          cr: 0
        }
      }
    },
    {
      id: 10,
      code: '1204',
      name: 'Vehicles',
      branches: {
        main: {
          dr: 500000,
          cr: 0
        },
        north: {
          dr: 300000,
          cr: 0
        },
        south: {
          dr: 200000,
          cr: 0
        },
        east: {
          dr: 100000,
          cr: 0
        },
        west: {
          dr: 100000,
          cr: 0
        }
      }
    },
    {
      id: 11,
      code: '1205',
      name: 'Building',
      branches: {
        main: {
          dr: 2000000,
          cr: 0
        },
        north: {
          dr: 1200000,
          cr: 0
        },
        south: {
          dr: 1000000,
          cr: 0
        },
        east: {
          dr: 500000,
          cr: 0
        },
        west: {
          dr: 300000,
          cr: 0
        }
      }
    },
    {
      id: 12,
      code: '1301',
      name: 'Prepaid Insurance',
      branches: {
        main: {
          dr: 20000,
          cr: 0
        },
        north: {
          dr: 12000,
          cr: 0
        },
        south: {
          dr: 8000,
          cr: 0
        },
        east: {
          dr: 5000,
          cr: 0
        },
        west: {
          dr: 3000,
          cr: 0
        }
      }
    },
    {
      id: 13,
      code: '1302',
      name: 'Prepaid Rent',
      branches: {
        main: {
          dr: 30000,
          cr: 0
        },
        north: {
          dr: 20000,
          cr: 0
        },
        south: {
          dr: 15000,
          cr: 0
        },
        east: {
          dr: 10000,
          cr: 0
        },
        west: {
          dr: 5000,
          cr: 0
        }
      }
    }]

  },
  liabilities: {
    title: 'Liabilities',
    type: 'Cr',
    color: 'red',
    accounts: [
    {
      id: 14,
      code: '2001',
      name: 'Accounts Payable',
      branches: {
        main: {
          dr: 0,
          cr: 50000
        },
        north: {
          dr: 0,
          cr: 30000
        },
        south: {
          dr: 0,
          cr: 25000
        },
        east: {
          dr: 0,
          cr: 12000
        },
        west: {
          dr: 0,
          cr: 8000
        }
      }
    },
    {
      id: 15,
      code: '2002',
      name: 'Salaries Payable',
      branches: {
        main: {
          dr: 0,
          cr: 80000
        },
        north: {
          dr: 0,
          cr: 50000
        },
        south: {
          dr: 0,
          cr: 35000
        },
        east: {
          dr: 0,
          cr: 20000
        },
        west: {
          dr: 0,
          cr: 10000
        }
      }
    },
    {
      id: 16,
      code: '2003',
      name: 'Security Deposits',
      branches: {
        main: {
          dr: 0,
          cr: 150000
        },
        north: {
          dr: 0,
          cr: 100000
        },
        south: {
          dr: 0,
          cr: 80000
        },
        east: {
          dr: 0,
          cr: 45000
        },
        west: {
          dr: 0,
          cr: 25000
        }
      }
    },
    {
      id: 17,
      code: '2004',
      name: 'Advance Fees Received',
      branches: {
        main: {
          dr: 0,
          cr: 250000
        },
        north: {
          dr: 0,
          cr: 180000
        },
        south: {
          dr: 0,
          cr: 140000
        },
        east: {
          dr: 0,
          cr: 80000
        },
        west: {
          dr: 0,
          cr: 50000
        }
      }
    },
    {
      id: 18,
      code: '2101',
      name: 'Bank Loan - HDFC',
      branches: {
        main: {
          dr: 0,
          cr: 800000
        },
        north: {
          dr: 0,
          cr: 500000
        },
        south: {
          dr: 0,
          cr: 300000
        },
        east: {
          dr: 0,
          cr: 150000
        },
        west: {
          dr: 0,
          cr: 50000
        }
      }
    },
    {
      id: 19,
      code: '2102',
      name: 'Equipment Loan',
      branches: {
        main: {
          dr: 0,
          cr: 150000
        },
        north: {
          dr: 0,
          cr: 100000
        },
        south: {
          dr: 0,
          cr: 80000
        },
        east: {
          dr: 0,
          cr: 50000
        },
        west: {
          dr: 0,
          cr: 20000
        }
      }
    },
    {
      id: 20,
      code: '2201',
      name: 'TDS Payable',
      branches: {
        main: {
          dr: 0,
          cr: 8000
        },
        north: {
          dr: 0,
          cr: 4000
        },
        south: {
          dr: 0,
          cr: 3000
        },
        east: {
          dr: 0,
          cr: 2000
        },
        west: {
          dr: 0,
          cr: 1000
        }
      }
    },
    {
      id: 21,
      code: '2202',
      name: 'GST Payable',
      branches: {
        main: {
          dr: 0,
          cr: 22000
        },
        north: {
          dr: 0,
          cr: 12000
        },
        south: {
          dr: 0,
          cr: 10000
        },
        east: {
          dr: 0,
          cr: 5000
        },
        west: {
          dr: 0,
          cr: 3000
        }
      }
    },
    {
      id: 22,
      code: '2203',
      name: 'PF Payable',
      branches: {
        main: {
          dr: 0,
          cr: 12000
        },
        north: {
          dr: 0,
          cr: 7000
        },
        south: {
          dr: 0,
          cr: 5000
        },
        east: {
          dr: 0,
          cr: 3000
        },
        west: {
          dr: 0,
          cr: 1000
        }
      }
    }]

  },
  capital: {
    title: 'Capital & Reserves',
    type: 'Cr',
    color: 'purple',
    accounts: [
    {
      id: 51,
      code: '3001',
      name: 'Capital Account',
      branches: {
        main: {
          dr: 0,
          cr: 2000000
        },
        north: {
          dr: 0,
          cr: 1200000
        },
        south: {
          dr: 0,
          cr: 1000000
        },
        east: {
          dr: 0,
          cr: 500000
        },
        west: {
          dr: 0,
          cr: 300000
        }
      }
    },
    {
      id: 52,
      code: '3002',
      name: 'Reserves & Surplus',
      branches: {
        main: {
          dr: 0,
          cr: 700000
        },
        north: {
          dr: 0,
          cr: 450000
        },
        south: {
          dr: 0,
          cr: 350000
        },
        east: {
          dr: 0,
          cr: 170000
        },
        west: {
          dr: 0,
          cr: 80000
        }
      }
    },
    {
      id: 53,
      code: '3003',
      name: 'Retained Earnings',
      branches: {
        main: {
          dr: 0,
          cr: 300000
        },
        north: {
          dr: 0,
          cr: 200000
        },
        south: {
          dr: 0,
          cr: 160000
        },
        east: {
          dr: 0,
          cr: 90000
        },
        west: {
          dr: 0,
          cr: 50000
        }
      }
    }]

  },
  income: {
    title: 'Income',
    type: 'Cr',
    color: 'green',
    accounts: [
    {
      id: 23,
      code: '4001',
      name: 'Tuition Fees',
      branches: {
        main: {
          dr: 0,
          cr: 900000
        },
        north: {
          dr: 0,
          cr: 650000
        },
        south: {
          dr: 0,
          cr: 500000
        },
        east: {
          dr: 0,
          cr: 300000
        },
        west: {
          dr: 0,
          cr: 150000
        }
      }
    },
    {
      id: 24,
      code: '4002',
      name: 'Admission Fees',
      branches: {
        main: {
          dr: 0,
          cr: 120000
        },
        north: {
          dr: 0,
          cr: 90000
        },
        south: {
          dr: 0,
          cr: 70000
        },
        east: {
          dr: 0,
          cr: 45000
        },
        west: {
          dr: 0,
          cr: 25000
        }
      }
    },
    {
      id: 25,
      code: '4003',
      name: 'Examination Fees',
      branches: {
        main: {
          dr: 0,
          cr: 50000
        },
        north: {
          dr: 0,
          cr: 30000
        },
        south: {
          dr: 0,
          cr: 25000
        },
        east: {
          dr: 0,
          cr: 12000
        },
        west: {
          dr: 0,
          cr: 8000
        }
      }
    },
    {
      id: 26,
      code: '4004',
      name: 'Lab Fees',
      branches: {
        main: {
          dr: 0,
          cr: 30000
        },
        north: {
          dr: 0,
          cr: 18000
        },
        south: {
          dr: 0,
          cr: 15000
        },
        east: {
          dr: 0,
          cr: 8000
        },
        west: {
          dr: 0,
          cr: 4000
        }
      }
    },
    {
      id: 27,
      code: '4005',
      name: 'Library Fees',
      branches: {
        main: {
          dr: 0,
          cr: 18000
        },
        north: {
          dr: 0,
          cr: 12000
        },
        south: {
          dr: 0,
          cr: 8000
        },
        east: {
          dr: 0,
          cr: 5000
        },
        west: {
          dr: 0,
          cr: 2000
        }
      }
    },
    {
      id: 28,
      code: '4006',
      name: 'Sports Fees',
      branches: {
        main: {
          dr: 0,
          cr: 25000
        },
        north: {
          dr: 0,
          cr: 15000
        },
        south: {
          dr: 0,
          cr: 10000
        },
        east: {
          dr: 0,
          cr: 7000
        },
        west: {
          dr: 0,
          cr: 3000
        }
      }
    },
    {
      id: 29,
      code: '4007',
      name: 'Transport Fees',
      branches: {
        main: {
          dr: 0,
          cr: 70000
        },
        north: {
          dr: 0,
          cr: 45000
        },
        south: {
          dr: 0,
          cr: 35000
        },
        east: {
          dr: 0,
          cr: 20000
        },
        west: {
          dr: 0,
          cr: 10000
        }
      }
    },
    {
      id: 30,
      code: '4008',
      name: 'Hostel Fees',
      branches: {
        main: {
          dr: 0,
          cr: 180000
        },
        north: {
          dr: 0,
          cr: 120000
        },
        south: {
          dr: 0,
          cr: 80000
        },
        east: {
          dr: 0,
          cr: 50000
        },
        west: {
          dr: 0,
          cr: 20000
        }
      }
    },
    {
      id: 31,
      code: '4101',
      name: 'Interest Income',
      branches: {
        main: {
          dr: 0,
          cr: 10000
        },
        north: {
          dr: 0,
          cr: 6000
        },
        south: {
          dr: 0,
          cr: 5000
        },
        east: {
          dr: 0,
          cr: 3000
        },
        west: {
          dr: 0,
          cr: 1000
        }
      }
    },
    {
      id: 32,
      code: '4102',
      name: 'Miscellaneous Income',
      branches: {
        main: {
          dr: 0,
          cr: 6000
        },
        north: {
          dr: 0,
          cr: 4000
        },
        south: {
          dr: 0,
          cr: 3000
        },
        east: {
          dr: 0,
          cr: 1500
        },
        west: {
          dr: 0,
          cr: 500
        }
      }
    }]

  },
  expenses: {
    title: 'Expenses',
    type: 'Dr',
    color: 'orange',
    accounts: [
    {
      id: 33,
      code: '5001',
      name: 'Salaries & Wages',
      branches: {
        main: {
          dr: 700000,
          cr: 0
        },
        north: {
          dr: 450000,
          cr: 0
        },
        south: {
          dr: 350000,
          cr: 0
        },
        east: {
          dr: 200000,
          cr: 0
        },
        west: {
          dr: 100000,
          cr: 0
        }
      }
    },
    {
      id: 34,
      code: '5002',
      name: 'Staff Welfare',
      branches: {
        main: {
          dr: 18000,
          cr: 0
        },
        north: {
          dr: 11000,
          cr: 0
        },
        south: {
          dr: 9000,
          cr: 0
        },
        east: {
          dr: 5000,
          cr: 0
        },
        west: {
          dr: 2000,
          cr: 0
        }
      }
    },
    {
      id: 35,
      code: '5003',
      name: 'PF Contribution',
      branches: {
        main: {
          dr: 42000,
          cr: 0
        },
        north: {
          dr: 27000,
          cr: 0
        },
        south: {
          dr: 21000,
          cr: 0
        },
        east: {
          dr: 12000,
          cr: 0
        },
        west: {
          dr: 6000,
          cr: 0
        }
      }
    },
    {
      id: 36,
      code: '5004',
      name: 'ESI Contribution',
      branches: {
        main: {
          dr: 11000,
          cr: 0
        },
        north: {
          dr: 7000,
          cr: 0
        },
        south: {
          dr: 5000,
          cr: 0
        },
        east: {
          dr: 3000,
          cr: 0
        },
        west: {
          dr: 1000,
          cr: 0
        }
      }
    },
    {
      id: 37,
      code: '5101',
      name: 'Electricity Expenses',
      branches: {
        main: {
          dr: 50000,
          cr: 0
        },
        north: {
          dr: 30000,
          cr: 0
        },
        south: {
          dr: 22000,
          cr: 0
        },
        east: {
          dr: 12000,
          cr: 0
        },
        west: {
          dr: 6000,
          cr: 0
        }
      }
    },
    {
      id: 38,
      code: '5102',
      name: 'Water Charges',
      branches: {
        main: {
          dr: 7000,
          cr: 0
        },
        north: {
          dr: 5000,
          cr: 0
        },
        south: {
          dr: 3000,
          cr: 0
        },
        east: {
          dr: 2000,
          cr: 0
        },
        west: {
          dr: 1000,
          cr: 0
        }
      }
    },
    {
      id: 39,
      code: '5103',
      name: 'Internet & Communication',
      branches: {
        main: {
          dr: 14000,
          cr: 0
        },
        north: {
          dr: 9000,
          cr: 0
        },
        south: {
          dr: 7000,
          cr: 0
        },
        east: {
          dr: 4000,
          cr: 0
        },
        west: {
          dr: 2000,
          cr: 0
        }
      }
    },
    {
      id: 40,
      code: '5104',
      name: 'Maintenance & Repairs',
      branches: {
        main: {
          dr: 35000,
          cr: 0
        },
        north: {
          dr: 20000,
          cr: 0
        },
        south: {
          dr: 16000,
          cr: 0
        },
        east: {
          dr: 9000,
          cr: 0
        },
        west: {
          dr: 5000,
          cr: 0
        }
      }
    },
    {
      id: 41,
      code: '5201',
      name: 'Stationery & Printing',
      branches: {
        main: {
          dr: 17000,
          cr: 0
        },
        north: {
          dr: 10000,
          cr: 0
        },
        south: {
          dr: 8000,
          cr: 0
        },
        east: {
          dr: 5000,
          cr: 0
        },
        west: {
          dr: 2000,
          cr: 0
        }
      }
    },
    {
      id: 42,
      code: '5202',
      name: 'Books & Periodicals',
      branches: {
        main: {
          dr: 26000,
          cr: 0
        },
        north: {
          dr: 16000,
          cr: 0
        },
        south: {
          dr: 12000,
          cr: 0
        },
        east: {
          dr: 7000,
          cr: 0
        },
        west: {
          dr: 4000,
          cr: 0
        }
      }
    },
    {
      id: 43,
      code: '5203',
      name: 'Lab Consumables',
      branches: {
        main: {
          dr: 22000,
          cr: 0
        },
        north: {
          dr: 14000,
          cr: 0
        },
        south: {
          dr: 10000,
          cr: 0
        },
        east: {
          dr: 6000,
          cr: 0
        },
        west: {
          dr: 3000,
          cr: 0
        }
      }
    },
    {
      id: 44,
      code: '5301',
      name: 'Insurance Premium',
      branches: {
        main: {
          dr: 20000,
          cr: 0
        },
        north: {
          dr: 12000,
          cr: 0
        },
        south: {
          dr: 9000,
          cr: 0
        },
        east: {
          dr: 5000,
          cr: 0
        },
        west: {
          dr: 2000,
          cr: 0
        }
      }
    },
    {
      id: 45,
      code: '5302',
      name: 'Bank Charges',
      branches: {
        main: {
          dr: 3500,
          cr: 0
        },
        north: {
          dr: 2000,
          cr: 0
        },
        south: {
          dr: 1500,
          cr: 0
        },
        east: {
          dr: 1000,
          cr: 0
        },
        west: {
          dr: 500,
          cr: 0
        }
      }
    },
    {
      id: 46,
      code: '5303',
      name: 'Interest on Loan',
      branches: {
        main: {
          dr: 75000,
          cr: 0
        },
        north: {
          dr: 45000,
          cr: 0
        },
        south: {
          dr: 35000,
          cr: 0
        },
        east: {
          dr: 17000,
          cr: 0
        },
        west: {
          dr: 8000,
          cr: 0
        }
      }
    },
    {
      id: 47,
      code: '5401',
      name: 'Depreciation - Furniture',
      branches: {
        main: {
          dr: 20000,
          cr: 0
        },
        north: {
          dr: 12500,
          cr: 0
        },
        south: {
          dr: 10000,
          cr: 0
        },
        east: {
          dr: 5000,
          cr: 0
        },
        west: {
          dr: 2500,
          cr: 0
        }
      }
    },
    {
      id: 48,
      code: '5402',
      name: 'Depreciation - Equipment',
      branches: {
        main: {
          dr: 45000,
          cr: 0
        },
        north: {
          dr: 30000,
          cr: 0
        },
        south: {
          dr: 23000,
          cr: 0
        },
        east: {
          dr: 12000,
          cr: 0
        },
        west: {
          dr: 5000,
          cr: 0
        }
      }
    },
    {
      id: 49,
      code: '5403',
      name: 'Depreciation - Vehicles',
      branches: {
        main: {
          dr: 50000,
          cr: 0
        },
        north: {
          dr: 30000,
          cr: 0
        },
        south: {
          dr: 22000,
          cr: 0
        },
        east: {
          dr: 12000,
          cr: 0
        },
        west: {
          dr: 6000,
          cr: 0
        }
      }
    },
    {
      id: 50,
      code: '5404',
      name: 'Depreciation - Building',
      branches: {
        main: {
          dr: 40000,
          cr: 0
        },
        north: {
          dr: 25000,
          cr: 0
        },
        south: {
          dr: 20000,
          cr: 0
        },
        east: {
          dr: 10000,
          cr: 0
        },
        west: {
          dr: 5000,
          cr: 0
        }
      }
    }]

  }
};
const colorClasses: Record<
  string,
  {
    bg: string;
    border: string;
    text: string;
    light: string;
  }> =
{
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-500',
    text: 'text-blue-800',
    light: 'bg-blue-100'
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-500',
    text: 'text-red-800',
    light: 'bg-red-100'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-500',
    text: 'text-green-800',
    light: 'bg-green-100'
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-500',
    text: 'text-orange-800',
    light: 'bg-orange-100'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-500',
    text: 'text-purple-800',
    light: 'bg-purple-100'
  }
};
export function TrialBalance() {
  const navigate = useNavigate();
  const [asOnDate, setAsOnDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [expandedGroups, setExpandedGroups] = useState([
  'assets',
  'liabilities',
  'income',
  'expenses',
  'capital']
  );
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showZeroBalance, setShowZeroBalance] = useState(true);
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'consolidated' | 'branchwise'>(
    'consolidated'
  );
  const toggleBranch = (branchId: string) => {
    if (branchId === 'all') {
      setSelectedBranches(['all']);
    } else {
      setSelectedBranches((prev) => {
        const filtered = prev.filter((b) => b !== 'all');
        return filtered.includes(branchId) ?
        filtered.filter((b) => b !== branchId) :
        [...filtered, branchId];
      });
    }
  };
  const getActiveBranches = () => {
    if (selectedBranches.includes('all'))
    return ['main', 'north', 'south', 'east', 'west'];
    return selectedBranches;
  };
  const calculations = useMemo(() => {
    const activeBranches = getActiveBranches();
    let grandTotalDebit = 0,
      grandTotalCredit = 0;
    const groupTotals: Record<
      string,
      {
        debit: number;
        credit: number;
      }> =
    {};
    const branchTotals: Record<
      string,
      {
        debit: number;
        credit: number;
      }> =
    {};
    activeBranches.forEach((b) => {
      branchTotals[b] = {
        debit: 0,
        credit: 0
      };
    });
    Object.entries(ledgerDataBase).forEach(([key, group]) => {
      let groupDebit = 0,
        groupCredit = 0;
      group.accounts.forEach((account) => {
        activeBranches.forEach((branch) => {
          const branchData =
          account.branches[branch as keyof typeof account.branches];
          if (branchData) {
            groupDebit += branchData.dr;
            groupCredit += branchData.cr;
            branchTotals[branch].debit += branchData.dr;
            branchTotals[branch].credit += branchData.cr;
          }
        });
      });
      groupTotals[key] = {
        debit: groupDebit,
        credit: groupCredit
      };
      grandTotalDebit += groupDebit;
      grandTotalCredit += groupCredit;
    });
    return {
      groupTotals,
      grandTotalDebit,
      grandTotalCredit,
      branchTotals,
      isBalanced: grandTotalDebit === grandTotalCredit,
      difference: Math.abs(grandTotalDebit - grandTotalCredit)
    };
  }, [selectedBranches]);
  const getAccountBalance = (
  account: (typeof ledgerDataBase.assets.accounts)[0]) =>
  {
    const activeBranches = getActiveBranches();
    let dr = 0,
      cr = 0;
    activeBranches.forEach((branch) => {
      const data = account.branches[branch as keyof typeof account.branches];
      if (data) {
        dr += data.dr;
        cr += data.cr;
      }
    });
    return {
      dr,
      cr
    };
  };
  const formatCurrency = (amount: number) =>
  amount === 0 ? '-' : `₹${amount.toLocaleString('en-IN')}`;
  const handleDrillDown = (accountId: number, accountName: string) => {
    navigate(`/finance/ledger/${accountId}`, {
      state: {
        accountName,
        asOnDate,
        branches: selectedBranches,
        batch: selectedBatch
      }
    });
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trial Balance</h1>
          <p className="text-sm text-gray-500 mt-1">
            Summary of all ledger account balances as on selected date
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}>

            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button variant="primary">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <ReportFilters />

      {/* Balance Status Card */}
      <Card
        className={`p-4 ${calculations.isBalanced ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 ${calculations.isBalanced ? 'bg-green-500' : 'bg-red-500'} rounded-full`}>

              {calculations.isBalanced ?
              <CheckCircle className="w-6 h-6 text-white" /> :

              <AlertTriangle className="w-6 h-6 text-white" />
              }
            </div>
            <div>
              <h3
                className={`font-semibold ${calculations.isBalanced ? 'text-green-800' : 'text-red-800'}`}>

                {calculations.isBalanced ?
                'Trial Balance is Balanced' :
                'Warning: Trial Balance Mismatch!'}
              </h3>
              <p
                className={`text-sm ${calculations.isBalanced ? 'text-green-600' : 'text-red-600'}`}>

                {calculations.isBalanced ?
                'Total Debit equals Total Credit' :
                `Difference of ₹${calculations.difference.toLocaleString('en-IN')} detected`}
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Debit</p>
              <p className="text-xl font-bold text-green-600">
                ₹{calculations.grandTotalDebit.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Credit</p>
              <p className="text-xl font-bold text-red-600">
                ₹{calculations.grandTotalCredit.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Branch & Batch Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Building className="w-4 h-4 inline mr-1" />
              Branch (Multi-Select)
            </label>
            <div className="relative">
              <button
                onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                className="w-64 px-3 py-2 border rounded-lg bg-white text-left flex items-center justify-between">

                <span className="truncate">
                  {selectedBranches.includes('all') ?
                  'All Branches' :
                  `${selectedBranches.length} branch(es) selected`}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showBranchDropdown &&
              <div className="absolute z-10 w-64 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                  {branches.map((branch) =>
                <label
                  key={branch.id}
                  className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">

                      <input
                    type="checkbox"
                    checked={
                    selectedBranches.includes(branch.id) ||
                    branch.id !== 'all' &&
                    selectedBranches.includes('all')
                    }
                    onChange={() => toggleBranch(branch.id)}
                    className="w-4 h-4 mr-2 rounded" />

                      <span>{branch.name}</span>
                    </label>
                )}
                </div>
              }
            </div>
            {selectedBranches.length > 0 &&
            !selectedBranches.includes('all') &&
            <div className="flex flex-wrap gap-1 mt-2">
                  {selectedBranches.map((id) =>
              <span
                key={id}
                className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">

                      {branches.find((b) => b.id === id)?.name}
                      <X
                  className="w-3 h-3 ml-1 cursor-pointer"
                  onClick={() => toggleBranch(id)} />

                    </span>
              )}
                </div>
            }
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Users className="w-4 h-4 inline mr-1" />
              Batch
            </label>
            <Select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              options={batches}
              className="w-40" />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              As On Date
            </label>
            <Input
              type="date"
              value={asOnDate}
              onChange={(e) => setAsOnDate(e.target.value)}
              className="w-40" />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Eye className="w-4 h-4 inline mr-1" />
              View Mode
            </label>
            <Select
              value={viewMode}
              onChange={(e) =>
              setViewMode(e.target.value as 'consolidated' | 'branchwise')
              }
              options={[
              {
                value: 'consolidated',
                label: 'Consolidated'
              },
              {
                value: 'branchwise',
                label: 'Branch-wise'
              }]
              }
              className="w-40" />

          </div>

          <div className="flex items-end ml-auto gap-2">
            <Button variant="primary" size="sm">
              <RefreshCw className="w-4 h-4 mr-1" /> Generate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
              setExpandedGroups([
              'assets',
              'liabilities',
              'income',
              'expenses',
              'capital']
              )
              }>

              Expand All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedGroups([])}>

              Collapse All
            </Button>
          </div>
        </div>
      </Card>

      {/* Filters Section */}
      {showFilters &&
      <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Search className="w-4 h-4 inline mr-1" />
                Search Account
              </label>
              <Input
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Filter className="w-4 h-4 inline mr-1" />
                Account Type
              </label>
              <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
              {
                value: 'all',
                label: 'All Types'
              },
              {
                value: 'assets',
                label: 'Assets'
              },
              {
                value: 'liabilities',
                label: 'Liabilities'
              },
              {
                value: 'income',
                label: 'Income'
              },
              {
                value: 'expenses',
                label: 'Expenses'
              },
              {
                value: 'capital',
                label: 'Capital & Reserves'
              }]
              } />

            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={showZeroBalance}
                onChange={(e) => setShowZeroBalance(e.target.checked)}
                className="w-4 h-4 rounded" />

                <span className="text-sm text-gray-700">Show Zero Balance</span>
              </label>
            </div>
          </div>
        </Card>
      }

      {/* Branch-wise Summary Cards (when branch-wise view is enabled) */}
      {viewMode === 'branchwise' &&
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {getActiveBranches().map((branchId) => {
          const branch = branches.find((b) => b.id === branchId);
          const totals = calculations.branchTotals[branchId];
          return (
            <Card
              key={branchId}
              className="p-3 bg-gradient-to-br from-gray-50 to-gray-100">

                <h4 className="font-semibold text-gray-800 text-sm mb-2">
                  {branch?.name}
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Debit:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(totals?.debit || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Credit:</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(totals?.credit || 0)}
                    </span>
                  </div>
                </div>
              </Card>);

        })}
        </div>
      }

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
        {
          key: 'assets',
          title: 'Total Assets',
          color: 'blue',
          icon: TrendingUp,
          value: calculations.groupTotals.assets?.debit
        },
        {
          key: 'liabilities',
          title: 'Total Liabilities',
          color: 'red',
          icon: TrendingDown,
          value: calculations.groupTotals.liabilities?.credit
        },
        {
          key: 'income',
          title: 'Total Income',
          color: 'green',
          icon: TrendingUp,
          value: calculations.groupTotals.income?.credit
        },
        {
          key: 'expenses',
          title: 'Total Expenses',
          color: 'orange',
          icon: TrendingDown,
          value: calculations.groupTotals.expenses?.debit
        }].
        map((item) =>
        <Card
          key={item.key}
          className={`p-4 bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 border-${item.color}-200`}>

            <div className="flex items-center gap-3">
              <div className={`p-2 bg-${item.color}-500 rounded-lg`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`text-sm text-${item.color}-700`}>{item.title}</p>
                <p className={`text-xl font-bold text-${item.color}-900`}>
                  ₹{(item.value || 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Trial Balance Table */}
      <Card className="overflow-hidden">
        <div className="bg-gray-800 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="w-6 h-6" />
              <div>
                <h2 className="text-lg font-semibold">Trial Balance</h2>
                <p className="text-sm text-gray-300">
                  As on{' '}
                  {new Date(asOnDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-300">
              {selectedBranches.includes('all') ?
              'All Branches' :
              `${selectedBranches.length} Branch(es)`}{' '}
              | Batch: {selectedBatch === 'all' ? 'All' : selectedBatch}
            </div>
          </div>
        </div>

        {/* Column Headers */}
        <div className="bg-gray-100 border-b-2 border-gray-300">
          <div
            className={`grid ${viewMode === 'branchwise' ? 'grid-cols-14' : 'grid-cols-12'} gap-2 p-3 font-semibold text-gray-700 text-sm`}>

            <div className="col-span-1">Code</div>
            <div
              className={
              viewMode === 'branchwise' ? 'col-span-4' : 'col-span-6'
              }>

              Ledger Name
            </div>
            {viewMode === 'branchwise' &&
            <div className="col-span-2">Branch</div>
            }
            <div className="col-span-2 text-right">Debit (₹)</div>
            <div className="col-span-2 text-right">Credit (₹)</div>
            <div className="col-span-1 text-center">Action</div>
          </div>
        </div>

        {/* Account Groups */}
        <div className="divide-y divide-gray-200">
          {Object.entries(ledgerDataBase).
          filter(([key]) => filterType === 'all' || filterType === key).
          map(([key, group]) => {
            const isExpanded = expandedGroups.includes(key);
            const groupTotal = calculations.groupTotals[key];
            const colors = colorClasses[group.color];
            const filteredAccounts = group.accounts.filter((a) => {
              const balance = getAccountBalance(a);
              const matchesSearch =
              !searchTerm ||
              a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              a.code.includes(searchTerm);
              const hasBalance = balance.dr > 0 || balance.cr > 0;
              return matchesSearch && (showZeroBalance || hasBalance);
            });
            if (!filteredAccounts.length && searchTerm) return null;
            return (
              <div key={key}>
                  <div
                  className={`${colors.bg} px-4 py-3 flex justify-between items-center cursor-pointer hover:opacity-90 transition-colors border-l-4 ${colors.border}`}
                  onClick={() =>
                  setExpandedGroups((prev) =>
                  prev.includes(key) ?
                  prev.filter((id) => id !== key) :
                  [...prev, key]
                  )
                  }>

                    <div className="flex items-center gap-3">
                      {isExpanded ?
                    <ChevronDown className={`w-5 h-5 ${colors.text}`} /> :

                    <ChevronRight className={`w-5 h-5 ${colors.text}`} />
                    }
                      <span className={`font-semibold ${colors.text}`}>
                        {group.title}
                      </span>
                      <span
                      className={`text-sm ${colors.text} ${colors.light} px-2 py-0.5 rounded`}>

                        {filteredAccounts.length} accounts
                      </span>
                    </div>
                    <div className="flex gap-8">
                      <div className="text-right">
                        <span className="text-sm text-gray-500">Debit: </span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(groupTotal?.debit || 0)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">Credit: </span>
                        <span className="font-bold text-red-600">
                          {formatCurrency(groupTotal?.credit || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isExpanded &&
                <div className="bg-white">
                      {viewMode === 'consolidated' ?
                  filteredAccounts.map((account, index) => {
                    const balance = getAccountBalance(account);
                    return (
                      <div
                        key={account.id}
                        className={`grid grid-cols-12 gap-2 p-3 items-center hover:bg-gray-50 cursor-pointer transition-colors ${index !== filteredAccounts.length - 1 ? 'border-b border-gray-100' : ''}`}
                        onClick={() =>
                        handleDrillDown(account.id, account.name)
                        }>

                                <div className="col-span-1">
                                  <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {account.code}
                                  </span>
                                </div>
                                <div className="col-span-6">
                                  <span className="font-medium text-gray-900 hover:text-blue-600">
                                    {account.name}
                                  </span>
                                </div>
                                <div className="col-span-2 text-right">
                                  <span
                            className={`font-medium ${balance.dr > 0 ? 'text-green-600' : 'text-gray-400'}`}>

                                    {formatCurrency(balance.dr)}
                                  </span>
                                </div>
                                <div className="col-span-2 text-right">
                                  <span
                            className={`font-medium ${balance.cr > 0 ? 'text-red-600' : 'text-gray-400'}`}>

                                    {formatCurrency(balance.cr)}
                                  </span>
                                </div>
                                <div className="col-span-1 text-center">
                                  <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDrillDown(account.id, account.name);
                            }}>

                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>);

                  }) :
                  filteredAccounts.map((account) =>
                  <div
                    key={account.id}
                    className="border-b border-gray-100">

                              {getActiveBranches().map((branchId, bIndex) => {
                      const branchData =
                      account.branches[
                      branchId as keyof typeof account.branches];

                      const branch = branches.find(
                        (b) => b.id === branchId
                      );
                      if (
                      !branchData ||
                      !branchData.dr &&
                      !branchData.cr &&
                      !showZeroBalance)

                      return null;
                      return (
                        <div
                          key={`${account.id}-${branchId}`}
                          className={`grid grid-cols-14 gap-2 p-2 items-center hover:bg-gray-50 cursor-pointer ${bIndex === 0 ? 'bg-gray-50' : ''}`}
                          onClick={() =>
                          handleDrillDown(account.id, account.name)
                          }>

                                    <div className="col-span-1">
                                      {bIndex === 0 &&
                            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                                          {account.code}
                                        </span>
                            }
                                    </div>
                                    <div className="col-span-4">
                                      {bIndex === 0 &&
                            <span className="font-medium text-gray-900 text-sm">
                                          {account.name}
                                        </span>
                            }
                                    </div>
                                    <div className="col-span-2">
                                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                        {branch?.name}
                                      </span>
                                    </div>
                                    <div className="col-span-2 text-right">
                                      <span
                              className={`text-sm ${branchData.dr > 0 ? 'text-green-600' : 'text-gray-400'}`}>

                                        {formatCurrency(branchData.dr)}
                                      </span>
                                    </div>
                                    <div className="col-span-2 text-right">
                                      <span
                              className={`text-sm ${branchData.cr > 0 ? 'text-red-600' : 'text-gray-400'}`}>

                                        {formatCurrency(branchData.cr)}
                                      </span>
                                    </div>
                                    <div className="col-span-1 text-center">
                                      {bIndex === 0 &&
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 px-1">

                                          <ExternalLink className="w-3 h-3" />
                                        </Button>
                            }
                                    </div>
                                  </div>);

                    })}
                            </div>
                  )}
                      <div
                    className={`grid ${viewMode === 'branchwise' ? 'grid-cols-14' : 'grid-cols-12'} gap-2 p-3 ${colors.bg} border-t-2`}>

                        <div className="col-span-1"></div>
                        <div
                      className={
                      viewMode === 'branchwise' ?
                      'col-span-6' :
                      'col-span-6'
                      }>

                          <span className={`font-semibold ${colors.text}`}>
                            Subtotal - {group.title}
                          </span>
                        </div>
                        <div className="col-span-2 text-right">
                          <span className="font-bold text-green-700">
                            {formatCurrency(groupTotal?.debit || 0)}
                          </span>
                        </div>
                        <div className="col-span-2 text-right">
                          <span className="font-bold text-red-700">
                            {formatCurrency(groupTotal?.credit || 0)}
                          </span>
                        </div>
                        <div className="col-span-1"></div>
                      </div>
                    </div>
                }
                </div>);

          })}
        </div>

        {/* Grand Total Footer */}
        <div
          className={`p-4 ${calculations.isBalanced ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gradient-to-r from-red-600 to-red-700'} text-white`}>

          <div
            className={`grid ${viewMode === 'branchwise' ? 'grid-cols-14' : 'grid-cols-12'} gap-2 items-center`}>

            <div className="col-span-1">
              {calculations.isBalanced ?
              <CheckCircle className="w-6 h-6" /> :

              <AlertTriangle className="w-6 h-6" />
              }
            </div>
            <div
              className={
              viewMode === 'branchwise' ? 'col-span-6' : 'col-span-6'
              }>

              <span className="text-lg font-bold">GRAND TOTAL</span>
              {!calculations.isBalanced &&
              <p className="text-sm text-red-200">
                  ⚠️ Difference: ₹
                  {calculations.difference.toLocaleString('en-IN')}
                </p>
              }
            </div>
            <div className="col-span-2 text-right">
              <p className="text-sm opacity-80">Total Debit</p>
              <p className="text-2xl font-bold">
                ₹{calculations.grandTotalDebit.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="col-span-2 text-right">
              <p className="text-sm opacity-80">Total Credit</p>
              <p className="text-2xl font-bold">
                ₹{calculations.grandTotalCredit.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="col-span-1"></div>
          </div>
        </div>
      </Card>

      {/* Validation Message */}
      {!calculations.isBalanced &&
      <Card className="p-4 bg-yellow-50 border-yellow-300">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800">
                Trial Balance Validation Failed
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                The total debits (₹
                {calculations.grandTotalDebit.toLocaleString('en-IN')}) do not
                equal the total credits (₹
                {calculations.grandTotalCredit.toLocaleString('en-IN')}).
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                variant="outline"
                size="sm"
                className="border-yellow-500 text-yellow-700 hover:bg-yellow-100">

                  <Eye className="w-4 h-4 mr-1" /> Review Entries
                </Button>
                <Button
                variant="outline"
                size="sm"
                className="border-yellow-500 text-yellow-700 hover:bg-yellow-100">

                  <FileText className="w-4 h-4 mr-1" /> View Journal
                </Button>
              </div>
            </div>
          </div>
        </Card>
      }

      {/* Footer Info */}
      <Card className="p-3 bg-gray-50">
        <div className="flex flex-wrap justify-between items-center text-sm text-gray-600 gap-4">
          <span>
            <FileText className="w-4 h-4 inline mr-1" />
            <b>Generated:</b> {new Date().toLocaleString('en-IN')}
          </span>
          <span>
            <Building className="w-4 h-4 inline mr-1" />
            <b>Branches:</b>{' '}
            {selectedBranches.includes('all') ?
            'All' :
            selectedBranches.join(', ')}
          </span>
          <span>
            <Users className="w-4 h-4 inline mr-1" />
            <b>Batch:</b> {selectedBatch === 'all' ? 'All' : selectedBatch}
          </span>
          <span>
            <Calendar className="w-4 h-4 inline mr-1" />
            <b>As On:</b> {new Date(asOnDate).toLocaleDateString('en-IN')}
          </span>
          <span
            className={
            calculations.isBalanced ? 'text-green-600' : 'text-red-600'
            }>

            {calculations.isBalanced ?
            <CheckCircle className="w-4 h-4 inline mr-1" /> :

            <AlertTriangle className="w-4 h-4 inline mr-1" />
            }
            {calculations.isBalanced ? 'Balanced' : 'Unbalanced'}
          </span>
        </div>
      </Card>
    </div>);

}