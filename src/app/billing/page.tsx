'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface User {
  id: number
  email: string
  type: string
  name: string
}

interface BillingRecord {
  id: number
  date: string
  description: string
  amount: number
  status: 'Paid' | 'Pending' | 'Overdue'
  method: string
}

interface PaymentMethod {
  id: number
  type: 'Credit Card' | 'Debit Card' | 'Bank Transfer'
  last4: string
  expiry: string
  isDefault: boolean
}

export default function BillingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [billingHistory, setBillingHistory] = useState<BillingRecord[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'Credit Card' as 'Credit Card' | 'Debit Card' | 'Bank Transfer',
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
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
    loadBillingData()
  }, [router])

  const loadBillingData = () => {
    // Load billing history from localStorage or use demo data
    const savedBilling = localStorage.getItem('billingHistory')
    const savedPaymentMethods = localStorage.getItem('paymentMethods')

    if (savedBilling) {
      setBillingHistory(JSON.parse(savedBilling))
    } else {
      const defaultBilling: BillingRecord[] = [
        {
          id: 1,
          date: '2024-01-15',
          description: 'Monthly Membership - January 2024',
          amount: 49.99,
          status: 'Paid',
          method: 'Credit Card ****1234'
        },
        {
          id: 2,
          date: '2024-02-15',
          description: 'Monthly Membership - February 2024',
          amount: 49.99,
          status: 'Paid',
          method: 'Credit Card ****1234'
        },
        {
          id: 3,
          date: '2024-03-15',
          description: 'Monthly Membership - March 2024',
          amount: 49.99,
          status: 'Pending',
          method: 'Credit Card ****1234'
        },
        {
          id: 4,
          date: '2024-03-20',
          description: 'Personal Training Session',
          amount: 75.00,
          status: 'Paid',
          method: 'Debit Card ****5678'
        }
      ]
      setBillingHistory(defaultBilling)
      localStorage.setItem('billingHistory', JSON.stringify(defaultBilling))
    }

    if (savedPaymentMethods) {
      setPaymentMethods(JSON.parse(savedPaymentMethods))
    } else {
      const defaultPaymentMethods: PaymentMethod[] = [
        {
          id: 1,
          type: 'Credit Card',
          last4: '1234',
          expiry: '12/26',
          isDefault: true
        },
        {
          id: 2,
          type: 'Debit Card',
          last4: '5678',
          expiry: '08/25',
          isDefault: false
        }
      ]
      setPaymentMethods(defaultPaymentMethods)
      localStorage.setItem('paymentMethods', JSON.stringify(defaultPaymentMethods))
    }
  }

  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!newPaymentMethod.cardNumber || !newPaymentMethod.expiry || !newPaymentMethod.cvv || !newPaymentMethod.name) {
      setError('All fields are required')
      return
    }

    if (newPaymentMethod.cardNumber.length !== 16) {
      setError('Card number must be 16 digits')
      return
    }

    const newMethod: PaymentMethod = {
      id: Date.now(),
      type: newPaymentMethod.type,
      last4: newPaymentMethod.cardNumber.slice(-4),
      expiry: newPaymentMethod.expiry,
      isDefault: paymentMethods.length === 0
    }

    const updatedMethods = [...paymentMethods, newMethod]
    setPaymentMethods(updatedMethods)
    localStorage.setItem('paymentMethods', JSON.stringify(updatedMethods))

    setNewPaymentMethod({
      type: 'Credit Card',
      cardNumber: '',
      expiry: '',
      cvv: '',
      name: ''
    })
    setIsPaymentDialogOpen(false)
    setSuccess('Payment method added successfully!')
  }

  const handleSetDefault = (id: number) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }))
    setPaymentMethods(updatedMethods)
    localStorage.setItem('paymentMethods', JSON.stringify(updatedMethods))
    setSuccess('Default payment method updated!')
  }

  const handleDeletePaymentMethod = (id: number) => {
    const updatedMethods = paymentMethods.filter(method => method.id !== id)
    setPaymentMethods(updatedMethods)
    localStorage.setItem('paymentMethods', JSON.stringify(updatedMethods))
    setSuccess('Payment method removed successfully!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const totalPaid = billingHistory.filter(record => record.status === 'Paid').reduce((sum, record) => sum + record.amount, 0)
  const pendingAmount = billingHistory.filter(record => record.status === 'Pending').reduce((sum, record) => sum + record.amount, 0)

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
                Billing & Payments
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <AlertDescription className="text-green-800 dark:text-green-200">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Billing Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Paid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${totalPaid.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                ${pendingAmount.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Next Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                15 days
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                April 15, 2024
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                Your payment history and transaction records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-xs">
                        <div>
                          <p className="font-medium">{record.description}</p>
                          <p className="text-xs text-gray-500">{record.method}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${record.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Payment Methods
                <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">Add New</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Payment Method</DialogTitle>
                      <DialogDescription>
                        Add a new payment method to your account
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="type">Payment Type</Label>
                        <select
                          id="type"
                          value={newPaymentMethod.type}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, type: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="Credit Card">Credit Card</option>
                          <option value="Debit Card">Debit Card</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name">Cardholder Name</Label>
                        <Input
                          id="name"
                          value={newPaymentMethod.name}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          value={newPaymentMethod.cardNumber}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, cardNumber: e.target.value.replace(/\D/g, '') }))}
                          placeholder="1234567890123456"
                          maxLength={16}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            value={newPaymentMethod.expiry}
                            onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, expiry: e.target.value }))}
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            value={newPaymentMethod.cvv}
                            onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                            placeholder="123"
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Add Payment Method</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
              <CardDescription>
                Manage your saved payment methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                        <span className="text-xs font-bold">
                          {method.type === 'Credit Card' ? 'CC' : method.type === 'Debit Card' ? 'DC' : 'BT'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{method.type} ****{method.last4}</p>
                        <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                      </div>
                      {method.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {!method.isDefault && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSetDefault(method.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePaymentMethod(method.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
