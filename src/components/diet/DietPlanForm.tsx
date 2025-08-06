'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'

interface DietPlanFormProps {
  onSubmit: (data: {
    height: number
    weight: number
    age: number
    gender: 'male' | 'female'
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
    goal: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle'
    healthConditions: string[]
    allergies: string
    dietaryPreferences: string[]
  }) => Promise<void>
  isLoading: boolean
}

export default function DietPlanForm({ onSubmit, isLoading }: DietPlanFormProps) {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: 'male' as 'male' | 'female',
    activityLevel: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
    goal: 'maintain_weight' as 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle',
    healthConditions: [] as string[],
    allergies: '',
    dietaryPreferences: [] as string[]
  })
  const [error, setError] = useState('')

  const healthConditionOptions = [
    'Diabetes',
    'High Blood Pressure',
    'High Cholesterol',
    'Heart Disease',
    'Thyroid Issues',
    'PCOS',
    'Celiac Disease',
    'IBS',
    'Kidney Disease',
    'None'
  ]

  const dietaryPreferenceOptions = [
    'Vegetarian',
    'Vegan',
    'Keto',
    'Paleo',
    'Mediterranean',
    'Low Carb',
    'High Protein',
    'Gluten Free',
    'Dairy Free',
    'No Restrictions'
  ]

  const handleHealthConditionChange = (condition: string, checked: boolean) => {
    if (condition === 'None') {
      setFormData(prev => ({
        ...prev,
        healthConditions: checked ? ['None'] : []
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        healthConditions: checked
          ? [...prev.healthConditions.filter(c => c !== 'None'), condition]
          : prev.healthConditions.filter(c => c !== condition)
      }))
    }
  }

  const handleDietaryPreferenceChange = (preference: string, checked: boolean) => {
    if (preference === 'No Restrictions') {
      setFormData(prev => ({
        ...prev,
        dietaryPreferences: checked ? ['No Restrictions'] : []
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        dietaryPreferences: checked
          ? [...prev.dietaryPreferences.filter(p => p !== 'No Restrictions'), preference]
          : prev.dietaryPreferences.filter(p => p !== preference)
      }))
    }
  }

  const validateForm = () => {
    const height = parseFloat(formData.height)
    const weight = parseFloat(formData.weight)
    const age = parseInt(formData.age)

    if (!height || height < 100 || height > 250) {
      throw new Error('Please enter a valid height between 100-250 cm')
    }
    if (!weight || weight < 30 || weight > 300) {
      throw new Error('Please enter a valid weight between 30-300 kg')
    }
    if (!age || age < 16 || age > 100) {
      throw new Error('Please enter a valid age between 16-100 years')
    }
    if (formData.healthConditions.length === 0) {
      throw new Error('Please select at least one health condition option')
    }
    if (formData.dietaryPreferences.length === 0) {
      throw new Error('Please select at least one dietary preference')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      validateForm()
      await onSubmit({
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        age: parseInt(formData.age),
        gender: formData.gender,
        activityLevel: formData.activityLevel,
        goal: formData.goal,
        healthConditions: formData.healthConditions,
        allergies: formData.allergies,
        dietaryPreferences: formData.dietaryPreferences
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please check your input')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Personal Health Assessment</CardTitle>
        <CardDescription>
          Provide your health metrics to receive personalized nutrition recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="30"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Gender and Activity Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="activityLevel">Activity Level</Label>
              <select
                id="activityLevel"
                value={formData.activityLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, activityLevel: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              >
                <option value="sedentary">Sedentary (little/no exercise)</option>
                <option value="light">Light (light exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
                <option value="active">Active (hard exercise 6-7 days/week)</option>
                <option value="very_active">Very Active (very hard exercise, physical job)</option>
              </select>
            </div>
          </div>

          {/* Goal */}
          <div className="space-y-2">
            <Label htmlFor="goal">Fitness Goal</Label>
            <select
              id="goal"
              value={formData.goal}
              onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              disabled={isLoading}
            >
              <option value="lose_weight">Lose Weight</option>
              <option value="maintain_weight">Maintain Weight</option>
              <option value="gain_weight">Gain Weight</option>
              <option value="build_muscle">Build Muscle</option>
            </select>
          </div>

          {/* Health Conditions */}
          <div className="space-y-3">
            <Label>Health Conditions (select all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {healthConditionOptions.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={`health-${condition}`}
                    checked={formData.healthConditions.includes(condition)}
                    onCheckedChange={(checked) => handleHealthConditionChange(condition, checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label htmlFor={`health-${condition}`} className="text-sm">
                    {condition}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="space-y-3">
            <Label>Dietary Preferences (select all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {dietaryPreferenceOptions.map((preference) => (
                <div key={preference} className="flex items-center space-x-2">
                  <Checkbox
                    id={`diet-${preference}`}
                    checked={formData.dietaryPreferences.includes(preference)}
                    onCheckedChange={(checked) => handleDietaryPreferenceChange(preference, checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label htmlFor={`diet-${preference}`} className="text-sm">
                    {preference}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="space-y-2">
            <Label htmlFor="allergies">Food Allergies or Intolerances (optional)</Label>
            <Textarea
              id="allergies"
              placeholder="e.g., nuts, shellfish, lactose intolerant..."
              value={formData.allergies}
              onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Generating Diet Plan...' : 'Generate Personalized Diet Plan'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
