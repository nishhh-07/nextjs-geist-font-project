'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface User {
  id: number
  email: string
  type: string
  name: string
}

interface WorkoutPlan {
  id: number
  name: string
  description: string
  exercises: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  createdAt: string
}

export default function WorkoutPage() {
  const [user, setUser] = useState<User | null>(null)
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    exercises: '',
    duration: '',
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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
    loadWorkoutPlans()
  }, [router])

  const loadWorkoutPlans = () => {
    // Load from localStorage for demo purposes
    const savedPlans = localStorage.getItem('workoutPlans')
    if (savedPlans) {
      setWorkoutPlans(JSON.parse(savedPlans))
    } else {
      // Default workout plans
      const defaultPlans: WorkoutPlan[] = [
        {
          id: 1,
          name: 'Morning Cardio',
          description: 'High-intensity cardio workout to start your day',
          exercises: 'Running (20 min), Jumping Jacks (3x30), Burpees (3x15), Mountain Climbers (3x20)',
          duration: '45 minutes',
          difficulty: 'Intermediate',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Strength Training',
          description: 'Full body strength workout focusing on major muscle groups',
          exercises: 'Squats (4x12), Deadlifts (4x10), Bench Press (4x10), Pull-ups (3x8)',
          duration: '60 minutes',
          difficulty: 'Advanced',
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Beginner Routine',
          description: 'Perfect for those just starting their fitness journey',
          exercises: 'Walking (15 min), Bodyweight Squats (2x10), Push-ups (2x8), Plank (2x30s)',
          duration: '30 minutes',
          difficulty: 'Beginner',
          createdAt: new Date().toISOString()
        }
      ]
      setWorkoutPlans(defaultPlans)
      localStorage.setItem('workoutPlans', JSON.stringify(defaultPlans))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name || !formData.description || !formData.exercises || !formData.duration) {
      setError('All fields are required')
      return
    }

    const newPlan: WorkoutPlan = {
      id: editingPlan ? editingPlan.id : Date.now(),
      name: formData.name,
      description: formData.description,
      exercises: formData.exercises,
      duration: formData.duration,
      difficulty: formData.difficulty,
      createdAt: editingPlan ? editingPlan.createdAt : new Date().toISOString()
    }

    let updatedPlans
    if (editingPlan) {
      updatedPlans = workoutPlans.map(plan => plan.id === editingPlan.id ? newPlan : plan)
      setSuccess('Workout plan updated successfully!')
    } else {
      updatedPlans = [...workoutPlans, newPlan]
      setSuccess('Workout plan created successfully!')
    }

    setWorkoutPlans(updatedPlans)
    localStorage.setItem('workoutPlans', JSON.stringify(updatedPlans))
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      exercises: '',
      duration: '',
      difficulty: 'Beginner'
    })
    setEditingPlan(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (plan: WorkoutPlan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      description: plan.description,
      exercises: plan.exercises,
      duration: plan.duration,
      difficulty: plan.difficulty
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    const updatedPlans = workoutPlans.filter(plan => plan.id !== id)
    setWorkoutPlans(updatedPlans)
    localStorage.setItem('workoutPlans', JSON.stringify(updatedPlans))
    setSuccess('Workout plan deleted successfully!')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
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
                Workout Plans
              </h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingPlan(null)
                  setFormData({
                    name: '',
                    description: '',
                    exercises: '',
                    duration: '',
                    difficulty: 'Beginner'
                  })
                }}>
                  Create New Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingPlan ? 'Edit Workout Plan' : 'Create New Workout Plan'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingPlan ? 'Update your workout plan details.' : 'Create a personalized workout plan for your fitness goals.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Plan Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Morning Cardio"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g., 45 minutes"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the workout plan"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exercises">Exercises</Label>
                    <Textarea
                      id="exercises"
                      value={formData.exercises}
                      onChange={(e) => setFormData(prev => ({ ...prev, exercises: e.target.value }))}
                      placeholder="List exercises with sets and reps (e.g., Push-ups 3x15, Squats 4x12)"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <select
                      id="difficulty"
                      value={formData.difficulty}
                      onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingPlan ? 'Update Plan' : 'Create Plan'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
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

        <Card>
          <CardHeader>
            <CardTitle>Your Workout Plans</CardTitle>
            <CardDescription>
              Manage and track your personalized workout routines
            </CardDescription>
          </CardHeader>
          <CardContent>
            {workoutPlans.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No workout plans created yet.
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  Create Your First Plan
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workoutPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{plan.description}</TableCell>
                      <TableCell>{plan.duration}</TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(plan.difficulty)}>
                          {plan.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(plan)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(plan.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
