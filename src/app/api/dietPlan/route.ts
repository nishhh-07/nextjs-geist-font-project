import { NextRequest, NextResponse } from 'next/server'

interface DietPlanRequest {
  height: number
  weight: number
  age: number
  gender: 'male' | 'female'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  goal: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle'
  healthConditions: string[]
  allergies: string
  dietaryPreferences: string[]
}

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

// Rule-based diet plan generation
function generateRuleBasedPlan(data: DietPlanRequest): DietPlan {
  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr: number
  if (data.gender === 'male') {
    bmr = 88.362 + (13.397 * data.weight) + (4.799 * data.height) - (5.677 * data.age)
  } else {
    bmr = 447.593 + (9.247 * data.weight) + (3.098 * data.height) - (4.330 * data.age)
  }

  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  }

  let tdee = bmr * activityMultipliers[data.activityLevel]

  // Adjust calories based on goal
  let targetCalories = tdee
  switch (data.goal) {
    case 'lose_weight':
      targetCalories = tdee - 500 // 1 lb per week loss
      break
    case 'gain_weight':
      targetCalories = tdee + 500 // 1 lb per week gain
      break
    case 'build_muscle':
      targetCalories = tdee + 300 // Moderate surplus for muscle building
      break
    // maintain_weight uses tdee as is
  }

  // Calculate macros
  let proteinRatio = 0.25 // 25% protein
  let fatRatio = 0.25 // 25% fat
  let carbRatio = 0.50 // 50% carbs

  // Adjust for goals
  if (data.goal === 'build_muscle') {
    proteinRatio = 0.30
    carbRatio = 0.45
  } else if (data.goal === 'lose_weight') {
    proteinRatio = 0.30
    fatRatio = 0.30
    carbRatio = 0.40
  }

  // Adjust for dietary preferences
  if (data.dietaryPreferences.includes('Keto')) {
    proteinRatio = 0.25
    fatRatio = 0.70
    carbRatio = 0.05
  } else if (data.dietaryPreferences.includes('High Protein')) {
    proteinRatio = 0.35
    fatRatio = 0.25
    carbRatio = 0.40
  } else if (data.dietaryPreferences.includes('Low Carb')) {
    proteinRatio = 0.30
    fatRatio = 0.50
    carbRatio = 0.20
  }

  const protein = Math.round((targetCalories * proteinRatio) / 4) // 4 cal per gram
  const fat = Math.round((targetCalories * fatRatio) / 9) // 9 cal per gram
  const carbs = Math.round((targetCalories * carbRatio) / 4) // 4 cal per gram

  // Generate meals based on preferences
  const isVegetarian = data.dietaryPreferences.includes('Vegetarian') || data.dietaryPreferences.includes('Vegan')
  const isVegan = data.dietaryPreferences.includes('Vegan')
  const isGlutenFree = data.dietaryPreferences.includes('Gluten Free') || data.healthConditions.includes('Celiac Disease')
  const isDairyFree = data.dietaryPreferences.includes('Dairy Free') || isVegan

  // Sample meals (would be more sophisticated in production)
  const breakfast = []
  const lunch = []
  const dinner = []
  const snacks = []

  // Breakfast options
  if (isVegan) {
    breakfast.push('Oatmeal with almond milk, berries, and chia seeds (300 cal)')
    breakfast.push('Avocado toast on whole grain bread (250 cal)')
    breakfast.push('Green smoothie with spinach, banana, and plant protein (280 cal)')
  } else if (isVegetarian) {
    breakfast.push('Greek yogurt with granola and mixed berries (320 cal)')
    breakfast.push('Vegetable omelet with whole grain toast (350 cal)')
    breakfast.push('Overnight oats with nuts and honey (300 cal)')
  } else {
    breakfast.push('Scrambled eggs with spinach and whole grain toast (320 cal)')
    breakfast.push('Protein smoothie with banana and oats (300 cal)')
    breakfast.push('Greek yogurt parfait with granola (280 cal)')
  }

  // Lunch options
  if (isVegan) {
    lunch.push('Quinoa Buddha bowl with roasted vegetables (450 cal)')
    lunch.push('Lentil soup with whole grain bread (400 cal)')
    lunch.push('Chickpea salad wrap with hummus (420 cal)')
  } else if (isVegetarian) {
    lunch.push('Caprese salad with whole grain bread (380 cal)')
    lunch.push('Vegetarian chili with brown rice (450 cal)')
    lunch.push('Quinoa salad with feta and vegetables (400 cal)')
  } else {
    lunch.push('Grilled chicken salad with mixed greens (400 cal)')
    lunch.push('Turkey and avocado wrap (450 cal)')
    lunch.push('Salmon with quinoa and steamed broccoli (480 cal)')
  }

  // Dinner options
  if (isVegan) {
    dinner.push('Stir-fried tofu with brown rice and vegetables (500 cal)')
    dinner.push('Black bean and sweet potato tacos (450 cal)')
    dinner.push('Lentil curry with quinoa (480 cal)')
  } else if (isVegetarian) {
    dinner.push('Vegetarian pasta with marinara sauce (500 cal)')
    dinner.push('Stuffed bell peppers with quinoa and cheese (450 cal)')
    dinner.push('Eggplant parmesan with side salad (480 cal)')
  } else {
    dinner.push('Grilled chicken breast with sweet potato and green beans (500 cal)')
    dinner.push('Baked salmon with quinoa and asparagus (520 cal)')
    dinner.push('Lean beef stir-fry with brown rice (480 cal)')
  }

  // Snack options
  if (isVegan) {
    snacks.push('Apple with almond butter (200 cal)')
    snacks.push('Mixed nuts and dried fruit (180 cal)')
  } else {
    snacks.push('Greek yogurt with berries (150 cal)')
    snacks.push('Cottage cheese with cucumber (120 cal)')
  }

  // Generate recommendations
  const recommendations = []
  recommendations.push('Eat meals at regular intervals to maintain stable blood sugar levels')
  recommendations.push('Include a source of protein with each meal to support muscle maintenance')
  recommendations.push('Choose whole grains over refined carbohydrates when possible')
  recommendations.push('Aim for at least 5 servings of fruits and vegetables daily')

  if (data.goal === 'lose_weight') {
    recommendations.push('Focus on portion control and mindful eating')
    recommendations.push('Include high-fiber foods to help you feel full longer')
  } else if (data.goal === 'build_muscle') {
    recommendations.push('Consume protein within 30 minutes after workouts')
    recommendations.push('Don\'t skip meals, especially post-workout nutrition')
  }

  // Health condition specific recommendations
  if (data.healthConditions.includes('Diabetes')) {
    recommendations.push('Monitor carbohydrate intake and pair carbs with protein or healthy fats')
    recommendations.push('Choose low glycemic index foods to help manage blood sugar')
  }
  if (data.healthConditions.includes('High Blood Pressure')) {
    recommendations.push('Limit sodium intake to less than 2300mg per day')
    recommendations.push('Include potassium-rich foods like bananas and leafy greens')
  }
  if (data.healthConditions.includes('High Cholesterol')) {
    recommendations.push('Include soluble fiber from oats, beans, and fruits')
    recommendations.push('Choose lean proteins and limit saturated fats')
  }

  // Hydration recommendations
  const baseWater = Math.round(data.weight * 35) // 35ml per kg body weight
  const hydration = `Drink at least ${Math.round(baseWater / 250)} glasses (${baseWater}ml) of water daily. Increase intake on workout days.`

  // Supplement recommendations
  const supplements = []
  if (isVegan) {
    supplements.push('Vitamin B12 supplement (essential for vegans)')
    supplements.push('Vitamin D3 (if limited sun exposure)')
  }
  if (data.goal === 'build_muscle') {
    supplements.push('Whey or plant-based protein powder (if needed to meet protein goals)')
    supplements.push('Creatine monohydrate (3-5g daily)')
  }
  if (data.age > 50) {
    supplements.push('Calcium and Vitamin D (for bone health)')
  }

  // Generate notes
  let notes = 'This plan is based on general nutritional guidelines. '
  if (data.healthConditions.length > 1 && !data.healthConditions.includes('None')) {
    notes += 'Given your health conditions, please consult with a healthcare provider before starting this plan. '
  }
  if (data.allergies) {
    notes += `Please ensure all foods are free from your mentioned allergies: ${data.allergies}. `
  }

  return {
    calories: Math.round(targetCalories),
    macros: { protein, carbs, fat },
    meals: {
      breakfast: breakfast.slice(0, 2),
      lunch: lunch.slice(0, 2),
      dinner: dinner.slice(0, 2),
      snacks: snacks.slice(0, 2)
    },
    recommendations,
    hydration,
    supplements,
    notes,
    source: 'rule-based'
  }
}

// AI-powered diet plan generation (fallback to rule-based if API fails)
async function generateAIPoweredPlan(data: DietPlanRequest): Promise<DietPlan> {
  try {
    // Check if OpenRouter API key is available
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      console.log('OpenRouter API key not found, falling back to rule-based plan')
      return generateRuleBasedPlan(data)
    }

    // Prepare the prompt for AI
    const prompt = `Create a personalized diet plan for a ${data.age}-year-old ${data.gender} who is ${data.height}cm tall, weighs ${data.weight}kg, has ${data.activityLevel} activity level, and wants to ${data.goal.replace('_', ' ')}.

Health conditions: ${data.healthConditions.join(', ')}
Dietary preferences: ${data.dietaryPreferences.join(', ')}
Allergies: ${data.allergies || 'None'}

Please provide a detailed diet plan in JSON format with the following structure:
{
  "calories": number,
  "macros": {"protein": number, "carbs": number, "fat": number},
  "meals": {
    "breakfast": ["meal1", "meal2"],
    "lunch": ["meal1", "meal2"], 
    "dinner": ["meal1", "meal2"],
    "snacks": ["snack1", "snack2"]
  },
  "recommendations": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "hydration": "hydration advice",
  "supplements": ["supplement1", "supplement2"],
  "notes": "important notes about the plan"
}

Make sure all recommendations are specific to their health conditions and goals. Include calorie counts for each meal option.`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional nutritionist and dietitian. Provide evidence-based, safe, and personalized nutrition advice. Always include appropriate disclaimers about consulting healthcare providers.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const result = await response.json()
    const aiResponse = result.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Parse the AI response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse AI response as JSON')
    }

    const aiPlan = JSON.parse(jsonMatch[0])
    
    // Validate and return AI plan
    return {
      calories: aiPlan.calories || 2000,
      macros: aiPlan.macros || { protein: 150, carbs: 250, fat: 67 },
      meals: aiPlan.meals || {
        breakfast: ['Oatmeal with berries'],
        lunch: ['Grilled chicken salad'],
        dinner: ['Salmon with vegetables'],
        snacks: ['Greek yogurt']
      },
      recommendations: aiPlan.recommendations || ['Eat balanced meals'],
      hydration: aiPlan.hydration || 'Drink 8 glasses of water daily',
      supplements: aiPlan.supplements || [],
      notes: aiPlan.notes || 'Consult with a healthcare provider before starting this plan.',
      source: 'ai-powered'
    }

  } catch (error) {
    console.error('AI diet plan generation failed:', error)
    console.log('Falling back to rule-based plan')
    return generateRuleBasedPlan(data)
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: DietPlanRequest = await request.json()

    // Validate input
    if (!data.height || !data.weight || !data.age || !data.gender || !data.activityLevel || !data.goal) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate ranges
    if (data.height < 100 || data.height > 250) {
      return NextResponse.json(
        { error: 'Height must be between 100-250 cm' },
        { status: 400 }
      )
    }

    if (data.weight < 30 || data.weight > 300) {
      return NextResponse.json(
        { error: 'Weight must be between 30-300 kg' },
        { status: 400 }
      )
    }

    if (data.age < 16 || data.age > 100) {
      return NextResponse.json(
        { error: 'Age must be between 16-100 years' },
        { status: 400 }
      )
    }

    // Try AI-powered generation first, fall back to rule-based
    const dietPlan = await generateAIPoweredPlan(data)

    return NextResponse.json({
      success: true,
      dietPlan
    })

  } catch (error) {
    console.error('Diet plan generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate diet plan' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
