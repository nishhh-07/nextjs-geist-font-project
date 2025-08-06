'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface User {
  id: number
  email: string
  type: string
  name: string
}

interface Equipment {
  id: number
  name: string
  category: string
  status: 'Available' | 'In Use' | 'Maintenance' | 'Out of Order'
  location: string
  lastMaintenance: string
  nextMaintenance: string
  usageCount: number
}

export default function EquipmentPage() {
  const [user, setUser] = useState<User | null>(null)
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    loadEquipmentData()
  }, [router])

  const loadEquipmentData = () => {
    // Load from localStorage or use demo data
    const savedEquipment = localStorage.getItem('equipmentData')
    
    if (savedEquipment) {
      const data = JSON.parse(savedEquipment)
      setEquipment(data)
      setFilteredEquipment(data)
    } else {
      const defaultEquipment: Equipment[] = [
        {
          id: 1,
          name: 'Treadmill Pro X1',
          category: 'Cardio',
          status: 'Available',
          location: 'Cardio Zone A',
          lastMaintenance: '2024-02-15',
          nextMaintenance: '2024-04-15',
          usageCount: 245
        },
        {
          id: 2,
          name: 'Elliptical Trainer E200',
          category: 'Cardio',
          status: 'In Use',
          location: 'Cardio Zone A',
          lastMaintenance: '2024-02-10',
          nextMaintenance: '2024-04-10',
          usageCount: 189
        },
        {
          id: 3,
          name: 'Bench Press Station',
          category: 'Strength',
          status: 'Available',
          location: 'Weight Room B',
          lastMaintenance: '2024-01-20',
          nextMaintenance: '2024-03-20',
          usageCount: 312
        },
        {
          id: 4,
          name: 'Leg Press Machine',
          category: 'Strength',
          status: 'Maintenance',
          location: 'Weight Room B',
          lastMaintenance: '2024-03-01',
          nextMaintenance: '2024-03-15',
          usageCount: 156
        },
        {
          id: 5,
          name: 'Rowing Machine R500',
          category: 'Cardio',
          status: 'Available',
          location: 'Cardio Zone B',
          lastMaintenance: '2024-02-25',
          nextMaintenance: '2024-04-25',
          usageCount: 98
        },
        {
          id: 6,
          name: 'Cable Machine Multi-Station',
          category: 'Strength',
          status: 'Available',
          location: 'Weight Room A',
          lastMaintenance: '2024-02-05',
          nextMaintenance: '2024-04-05',
          usageCount: 278
        },
        {
          id: 7,
          name: 'Stationary Bike B300',
          category: 'Cardio',
          status: 'Out of Order',
          location: 'Cardio Zone A',
          lastMaintenance: '2024-01-15',
          nextMaintenance: '2024-03-15',
          usageCount: 423
        },
        {
          id: 8,
          name: 'Smith Machine',
          category: 'Strength',
          status: 'In Use',
          location: 'Weight Room A',
          lastMaintenance: '2024-02-20',
          nextMaintenance: '2024-04-20',
          usageCount: 201
        },
        {
          id: 9,
          name: 'Dumbbells Set (5-50 lbs)',
          category: 'Free Weights',
          status: 'Available',
          location: 'Free Weight Area',
          lastMaintenance: '2024-03-01',
          nextMaintenance: '2024-05-01',
          usageCount: 567
        },
        {
          id: 10,
          name: 'Yoga Mats (Set of 20)',
          category: 'Accessories',
          status: 'Available',
          location: 'Group Exercise Room',
          lastMaintenance: '2024-02-28',
          nextMaintenance: '2024-04-28',
          usageCount: 89
        }
      ]
      setEquipment(defaultEquipment)
      setFilteredEquipment(defaultEquipment)
      localStorage.setItem('equipmentData', JSON.stringify(defaultEquipment))
    }
  }

  useEffect(() => {
    // Filter equipment based on search and filters
    let filtered = equipment

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterCategory !== 'All') {
      filtered = filtered.filter(item => item.category === filterCategory)
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter(item => item.status === filterStatus)
    }

    setFilteredEquipment(filtered)
  }, [searchTerm, filterCategory, filterStatus, equipment])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'In Use': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Out of Order': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getMaintenanceStatus = (nextMaintenance: string) => {
    const today = new Date()
    const maintenanceDate = new Date(nextMaintenance)
    const daysUntil = Math.ceil((maintenanceDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
    
    if (daysUntil < 0) return { text: 'Overdue', color: 'text-red-600 dark:text-red-400' }
    if (daysUntil <= 7) return { text: `${daysUntil} days`, color: 'text-yellow-600 dark:text-yellow-400' }
    return { text: `${daysUntil} days`, color: 'text-green-600 dark:text-green-400' }
  }

  const categories = ['All', ...Array.from(new Set(equipment.map(item => item.category)))]
  const statuses = ['All', 'Available', 'In Use', 'Maintenance', 'Out of Order']

  const stats = {
    total: equipment.length,
    available: equipment.filter(item => item.status === 'Available').length,
    inUse: equipment.filter(item => item.status === 'In Use').length,
    maintenance: equipment.filter(item => item.status === 'Maintenance' || item.status === 'Out of Order').length
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-500 mr-4">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Equipment Management
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Equipment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Equipment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.available}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                In Use
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.inUse}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Needs Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.maintenance}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Equipment Directory</CardTitle>
            <CardDescription>
              Search and filter gym equipment by category, status, and location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search equipment or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {filteredEquipment.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  No equipment found matching your criteria.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Usage Count</TableHead>
                    <TableHead>Next Maintenance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipment.map((item) => {
                    const maintenanceStatus = getMaintenanceStatus(item.nextMaintenance)
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.usageCount}</TableCell>
                        <TableCell>
                          <span className={maintenanceStatus.color}>
                            {maintenanceStatus.text}
                          </span>
                          <div className="text-xs text-gray-500">
                            {new Date(item.nextMaintenance).toLocaleDateString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Maintenance Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Alerts</CardTitle>
            <CardDescription>
              Equipment requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {equipment
                .filter(item => {
                  const maintenanceStatus = getMaintenanceStatus(item.nextMaintenance)
                  return item.status === 'Maintenance' || item.status === 'Out of Order' || maintenanceStatus.text === 'Overdue' || maintenanceStatus.color.includes('yellow')
                })
                .map((item) => {
                  const maintenanceStatus = getMaintenanceStatus(item.nextMaintenance)
                  return (
                    <Alert key={item.id} className={
                      item.status === 'Out of Order' || maintenanceStatus.text === 'Overdue' 
                        ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' 
                        : 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
                    }>
                      <AlertDescription>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{item.name}</span> - {item.location}
                            <div className="text-sm">
                              {item.status === 'Out of Order' ? 'Equipment is out of order' :
                               item.status === 'Maintenance' ? 'Currently under maintenance' :
                               maintenanceStatus.text === 'Overdue' ? 'Maintenance overdue' :
                               `Maintenance due in ${maintenanceStatus.text}`}
                            </div>
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )
                })}
              {equipment.filter(item => {
                const maintenanceStatus = getMaintenanceStatus(item.nextMaintenance)
                return item.status === 'Maintenance' || item.status === 'Out of Order' || maintenanceStatus.text === 'Overdue' || maintenanceStatus.color.includes('yellow')
              }).length === 0 && (
                <div className="text-center py-4">
                  <p className="text-green-600 dark:text-green-400">
                    All equipment is in good condition! No maintenance alerts.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
