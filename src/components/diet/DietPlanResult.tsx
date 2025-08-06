'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface DietPlan {
  calories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
  meals: {
    breakfast: string[]
    lunch: string[]
    dinner: string[]
    snacks: string[]
  }
  recommendations: string[]
  hydration: string
  supplements: string[]
  notes: string
  source: 'rule-based' | 'ai-powered'
}

interface DietPlanResultProps {
  dietPlan: DietPlan
  onGenerateNew: () => void
}

export default function DietPlanResult({ dietPlan, onGenerateNew }: DietPlanResultProps) {
  const handleSavePlan = () => {
    // Save to localStorage for demo purposes
    const savedPlans = JSON.parse(localStorage.getItem('savedDietPlans') || '[]')
    const newPlan = {
      ...dietPlan,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    savedPlans.push(newPlan)
    localStorage.setItem('savedDietPlans', JSON.stringify(savedPlans))
    alert('Diet plan saved successfully!')
  }

  const handlePrintPlan = () => {
    window.print()
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Your Personalized Diet Plan</CardTitle>
              <CardDescription>
                Generated on {new Date().toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={dietPlan.source === 'ai-powered' ? 'default' : 'secondary'}>
                {dietPlan.source === 'ai-powered' ? 'AI-Powered' : 'Rule-Based'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleSavePlan}>Save Plan</Button>
            <Button variant="outline" onClick={handlePrintPlan}>Print Plan</Button>
            <Button variant="outline" onClick={onGenerateNew}>Generate New Plan</Button>
          </div>
        </CardContent>
      </Card>

      {/* Daily Targets */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Nutritional Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {dietPlan.calories}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {dietPlan.macros.protein}g
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {dietPlan.macros.carbs}g
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Carbohydrates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {dietPlan.macros.fat}g
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Fat</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Meal Plan</CardTitle>
          <CardDescription>
            Suggested meals and portions for optimal nutrition
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Breakfast */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
                <span className="text-orange-600 dark:text-orange-400 font-bold text-sm">B</span>
              </div>
              Breakfast
            </h3>
            <ul className="space-y-2">
              {dietPlan.meals.breakfast.map((item, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Lunch */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 dark:text-green-400 font-bold text-sm">L</span>
              </div>
              Lunch
            </h3>
            <ul className="space-y-2">
              {dietPlan.meals.lunch.map((item, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Dinner */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">D</span>
              </div>
              Dinner
            </h3>
            <ul className="space-y-2">
              {dietPlan.meals.dinner.map((item, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Snacks */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">S</span>
              </div>
              Snacks
            </h3>
            <ul className="space-y-2">
              {dietPlan.meals.snacks.map((item, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations and Hydration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nutritional Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {dietPlan.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2"></div>
                  <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hydration & Supplements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Daily Hydration</h4>
              <p className="text-gray-700 dark:text-gray-300">{dietPlan.hydration}</p>
            </div>
            
            {dietPlan.supplements.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Suggested Supplements</h4>
                <ul className="space-y-2">
                  {dietPlan.supplements.map((supplement, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">{supplement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Important Notes */}
      {dietPlan.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Important Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-800 dark:text-yellow-200">{dietPlan.notes}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Disclaimer:</strong> This diet plan is for informational purposes only and should not replace professional medical advice. 
              Please consult with a healthcare provider or registered dietitian before making significant changes to your diet, 
              especially if you have any health conditions or are taking medications.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
