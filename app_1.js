// Application Data
const appData = {
  supplements: [
    {
      name: "Multi-strain Probiotic",
      dosage: "1 capsule",
      times: ["morning"],
      phase1: true,
      phase2: true,
      phase3: true,
      description: "Contains Lactobacillus and Bifidobacterium strains"
    },
    {
      name: "Sodium Butyrate",
      dosage: "500mg",
      times: ["midday"],
      phase1: true,
      phase2: true,
      phase3: true,
      description: "Enteric-coated for gut delivery"
    },
    {
      name: "L-Glutamine",
      dosage: "5-15g",
      times: ["morning", "evening"],
      phase1: "5g",
      phase2: "10g",
      phase3: "10g",
      description: "Intestinal barrier repair"
    },
    {
      name: "Zinc Picolinate",
      dosage: "15mg",
      times: ["evening"],
      phase1: true,
      phase2: true,
      phase3: true,
      description: "Supports tight junction proteins"
    },
    {
      name: "Vitamin D3",
      dosage: "2000 IU",
      times: ["evening"],
      phase1: true,
      phase2: true,
      phase3: true,
      description: "Regulates intestinal barrier function"
    },
    {
      name: "Curcumin",
      dosage: "500mg",
      times: ["evening"],
      phase1: true,
      phase2: true,
      phase3: true,
      description: "With piperine for anti-inflammation"
    },
    {
      name: "Algae-based Omega-3",
      dosage: "500mg EPA/DHA",
      times: ["morning"],
      phase1: true,
      phase2: true,
      phase3: true,
      description: "Plant-based alternative to fish oil"
    }
  ],
  dietFoods: {
    proteins: ["Chicken breast", "Turkey", "Eggs", "Greek yogurt", "Beans", "Lentils", "Chickpeas", "Tofu", "Tempeh", "Nuts", "Seeds"],
    vegetables: ["Spinach", "Kale", "Broccoli", "Artichokes", "Garlic", "Onions", "Tomatoes", "Bell peppers", "Zucchini", "Eggplant"],
    fruits: ["Berries", "Apples", "Oranges", "Grapes", "Figs", "Dates", "Pomegranates", "Avocados"],
    grains: ["Quinoa", "Brown rice", "Oats", "Whole wheat bread", "Barley", "Farro"],
    prebiotics: ["Inulin powder", "Resistant starch", "Jerusalem artichokes", "Asparagus", "Banana (green)", "Garlic", "Onions"]
  },
  exercises: [
    {
      name: "Walking/Light Cardio",
      duration: "20 minutes",
      days: ["Monday", "Wednesday", "Friday"],
      type: "cardio",
      description: "Moderate pace, talking possible but not singing"
    },
    {
      name: "Strength Training",
      duration: "15 minutes",
      days: ["Monday", "Wednesday", "Friday"],
      type: "strength",
      exercises: ["Bicep curls", "Squats", "Leg presses", "Resistance bands"]
    },
    {
      name: "Yoga/Tai Chi",
      duration: "30 minutes",
      days: ["Tuesday", "Thursday"],
      type: "flexibility",
      description: "Focus on balance, posture, and stability"
    },
    {
      name: "Stretching",
      duration: "15 minutes",
      days: ["Tuesday", "Thursday"],
      type: "flexibility",
      exercises: ["Arm circles", "Deep breathing", "Dynamic stretches"]
    }
  ],
  phases: [
    {
      name: "Phase 1: Initiation",
      duration: "Weeks 1-4",
      focus: "Starting supplements and diet changes",
      goals: ["Establish routine", "Reduce inflammation", "Begin barrier repair"]
    },
    {
      name: "Phase 2: Restoration", 
      duration: "Weeks 4-12",
      focus: "Microbiome rebuilding",
      goals: ["Increase beneficial bacteria", "Improve gut diversity", "Monitor symptoms"]
    },
    {
      name: "Phase 3: Maintenance",
      duration: "3+ months",
      focus: "Long-term health",
      goals: ["Sustain improvements", "Prevent relapse", "Optimize function"]
    }
  ],
  achievements: [
    {name: "First Steps", description: "Complete your first day", points: 50},
    {name: "Week Warrior", description: "Complete 7 days in a row", points: 200},
    {name: "Supplement Streak", description: "Take all supplements for 14 days", points: 300},
    {name: "Exercise Enthusiast", description: "Complete 10 workouts", points: 250},
    {name: "Gut Guardian", description: "Track symptoms for 30 days", points: 400},
    {name: "Phase Pioneer", description: "Complete Phase 1", points: 500}
  ]
};

// Application State
let appState = {
  user: {
    level: 1,
    points: 0,
    streak: 0,
    joinDate: new Date().toISOString().split('T')[0]
  },
  daily: {
    date: new Date().toISOString().split('T')[0],
    supplements: {},
    water: 0,
    fiber: 0,
    meals: {breakfast: '', lunch: '', dinner: ''},
    prebiotics: {},
    exercise: {},
    mood: 0,
    energy: 0,
    sleep: {hours: 8, quality: ''},
    symptoms: {tremor: 5, stiffness: 5, balance: 5}
  },
  history: [],
  achievements: appData.achievements.map(a => ({...a, unlocked: false, unlockedDate: null})),
  currentPhase: 0,
  selectedMealType: '',
  selectedMealItems: []
};

// Motivational Messages
const motivationalMessages = [
  "Every small step counts towards your healing journey! 🌟",
  "You're building a healthier gut microbiome one day at a time! 💪",
  "Consistency is key - keep up the amazing work! 🚀",
  "Your body is healing and getting stronger every day! 🌱",
  "Remember: healing takes time, but you're on the right path! ⭐",
  "Each supplement, each healthy meal matters - you've got this! 💚",
  "Your commitment to health is inspiring! Keep going! 🔥",
  "Progress isn't always visible, but it's happening! 📈",
  "You're investing in your future health - that's incredible! 🎯",
  "Small consistent actions lead to big transformations! ✨"
];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupEventListeners();
  loadDashboard();
  updateUserStats();
});

function initializeApp() {
  // Set current date
  document.getElementById('currentDate').textContent = formatDate(new Date());
  
  // Initialize daily state if new day
  const today = new Date().toISOString().split('T')[0];
  if (appState.daily.date !== today) {
    resetDailyState();
    appState.daily.date = today;
  }
  
  // Calculate current phase
  updateCurrentPhase();
  
  // Generate initial content
  generateSupplements();
  generateWaterGlasses();
  generatePrebioticChecklist();
  generateExerciseSchedule();
  generateAchievements();
  
  // Setup chart
  setTimeout(() => {
    initializeAnalyticsChart();
  }, 100);
}

function setupEventListeners() {
  // Tab navigation - Fixed implementation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const tabName = this.dataset.tab;
      switchTab(tabName);
    });
  });
  
  // Star ratings
  document.querySelectorAll('.star-rating').forEach(rating => {
    rating.querySelectorAll('.star').forEach(star => {
      star.addEventListener('click', () => handleStarRating(rating.id, parseInt(star.dataset.rating)));
    });
  });
  
  // Range sliders
  const sleepSlider = document.getElementById('sleepHours');
  if (sleepSlider) {
    sleepSlider.addEventListener('input', (e) => {
      document.getElementById('sleepValue').textContent = e.target.value;
      appState.daily.sleep.hours = parseInt(e.target.value);
      saveProgress();
    });
  }
  
  const tremorSlider = document.getElementById('tremorSeverity');
  if (tremorSlider) {
    tremorSlider.addEventListener('input', (e) => {
      document.getElementById('tremorValue').textContent = e.target.value;
      appState.daily.symptoms.tremor = parseInt(e.target.value);
      saveProgress();
    });
  }
  
  const stiffnessSlider = document.getElementById('stiffnessSeverity');
  if (stiffnessSlider) {
    stiffnessSlider.addEventListener('input', (e) => {
      document.getElementById('stiffnessValue').textContent = e.target.value;
      appState.daily.symptoms.stiffness = parseInt(e.target.value);
      saveProgress();
    });
  }
  
  const balanceSlider = document.getElementById('balanceSeverity');
  if (balanceSlider) {
    balanceSlider.addEventListener('input', (e) => {
      document.getElementById('balanceValue').textContent = e.target.value;
      appState.daily.symptoms.balance = parseInt(e.target.value);
      saveProgress();
    });
  }
  
  // Sleep quality buttons
  document.querySelectorAll('.quality-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      appState.daily.sleep.quality = btn.dataset.quality;
      saveProgress();
    });
  });
}

function switchTab(tabName) {
  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  
  // Update tab content
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  const targetTab = document.getElementById(tabName);
  if (targetTab) {
    targetTab.classList.add('active');
  }
  
  // Refresh content if needed
  if (tabName === 'analytics') {
    setTimeout(() => {
      updateAnalytics();
    }, 100);
  }
  
  // Refresh dashboard when switching to it
  if (tabName === 'dashboard') {
    loadDashboard();
  }
}

function resetDailyState() {
  const prevDaily = { ...appState.daily };
  
  appState.daily = {
    date: new Date().toISOString().split('T')[0],
    supplements: {},
    water: 0,
    fiber: 0,
    meals: {breakfast: '', lunch: '', dinner: ''},
    prebiotics: {},
    exercise: {},
    mood: 0,
    energy: 0,
    sleep: {hours: 8, quality: ''},
    symptoms: {tremor: 5, stiffness: 5, balance: 5}
  };
  
  // Save previous day to history
  if (prevDaily.date) {
    appState.history.push(prevDaily);
  }
  
  // Check for streak continuation
  updateStreak();
  
  // Reset UI elements
  generateWaterGlasses();
  updateFiberProgress();
  resetMeals();
  updateProgressCircles();
}

function updateCurrentPhase() {
  // Simple phase calculation based on days since start
  const startDate = new Date(appState.user.joinDate);
  const today = new Date();
  const daysSince = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  
  let phase = 0;
  if (daysSince >= 28) phase = 1;
  if (daysSince >= 84) phase = 2;
  
  appState.currentPhase = phase;
  
  const phaseInfo = appData.phases[phase];
  document.getElementById('currentPhase').textContent = phaseInfo.name;
  document.getElementById('phaseDescription').textContent = phaseInfo.focus;
}

function loadDashboard() {
  generateQuickTasks();
  updateProgressCircles();
  generateMotivation();
}

function generateQuickTasks() {
  const container = document.getElementById('quickTasks');
  if (!container) return;
  
  const tasks = [];
  
  // Supplement tasks
  appData.supplements.forEach(supp => {
    supp.times.forEach(time => {
      const key = `${supp.name}_${time}`;
      const completed = appState.daily.supplements[key] || false;
      tasks.push({
        id: key,
        text: `Take ${supp.name} (${time})`,
        completed,
        type: 'supplement'
      });
    });
  });
  
  // Exercise tasks
  const today = new Date().toLocaleDateString('en-US', {weekday: 'long'});
  appData.exercises.forEach(ex => {
    if (ex.days.includes(today)) {
      const completed = appState.daily.exercise[ex.name] || false;
      tasks.push({
        id: ex.name,
        text: `${ex.name} (${ex.duration})`,
        completed,
        type: 'exercise'
      });
    }
  });
  
  // Limit to 6 tasks for dashboard
  const limitedTasks = tasks.slice(0, 6);
  
  container.innerHTML = limitedTasks.map(task => `
    <div class="task-item ${task.completed ? 'completed' : ''}">
      <input type="checkbox" class="task-checkbox" 
             ${task.completed ? 'checked' : ''} 
             onchange="toggleTask('${task.id}', '${task.type}')">
      <span>${task.text}</span>
    </div>
  `).join('');
}

function toggleTask(taskId, type) {
  if (type === 'supplement') {
    appState.daily.supplements[taskId] = !appState.daily.supplements[taskId];
  } else if (type === 'exercise') {
    appState.daily.exercise[taskId] = !appState.daily.exercise[taskId];
    if (appState.daily.exercise[taskId]) {
      addPoints(20);
    }
  }
  
  saveProgress();
  updateProgressCircles();
  generateQuickTasks();
  checkAchievements();
}

function updateProgressCircles() {
  // Supplements progress
  const totalSupplementTasks = appData.supplements.reduce((acc, supp) => acc + supp.times.length, 0);
  const completedSupplementTasks = Object.values(appState.daily.supplements).filter(Boolean).length;
  const supplementProgress = totalSupplementTasks > 0 ? Math.round((completedSupplementTasks / totalSupplementTasks) * 100) : 0;
  
  // Diet progress (water + fiber + meals)
  const waterProgress = Math.min((appState.daily.water / 2000) * 100, 100);
  const fiberProgress = Math.min((appState.daily.fiber / 30) * 100, 100);
  const mealCount = Object.values(appState.daily.meals).filter(meal => meal).length;
  const mealProgress = (mealCount / 3) * 100;
  const dietProgress = Math.round((waterProgress + fiberProgress + mealProgress) / 3);
  
  // Exercise progress
  const today = new Date().toLocaleDateString('en-US', {weekday: 'long'});
  const todayExercises = appData.exercises.filter(ex => ex.days.includes(today));
  const completedExercises = todayExercises.filter(ex => appState.daily.exercise[ex.name]).length;
  const exerciseProgress = todayExercises.length > 0 ? Math.round((completedExercises / todayExercises.length) * 100) : 0;
  
  updateProgressCircle('supplementProgress', supplementProgress);
  updateProgressCircle('dietProgress', dietProgress);
  updateProgressCircle('exerciseProgress', exerciseProgress);
}

function updateProgressCircle(id, progress) {
  const element = document.getElementById(id);
  if (!element) return;
  
  const percentage = element.querySelector('.percentage');
  if (percentage) {
    percentage.textContent = `${progress}%`;
  }
  
  element.style.background = `conic-gradient(var(--color-primary) ${progress * 3.6}deg, var(--color-secondary) 0deg)`;
}

function generateMotivation() {
  const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  const messageElement = document.getElementById('motivationalMessage');
  if (messageElement) {
    messageElement.textContent = message;
  }
}

function generateSupplements() {
  const container = document.getElementById('supplementsContainer');
  if (!container) return;
  
  container.innerHTML = appData.supplements.map(supp => `
    <div class="supplement-card">
      <div class="supplement-header">
        <div>
          <h3 class="supplement-name">${supp.name}</h3>
          <p class="supplement-dosage">${supp.dosage}</p>
          <p class="supplement-description">${supp.description}</p>
        </div>
      </div>
      
      <div class="supplement-times">
        ${supp.times.map(time => {
          const key = `${supp.name}_${time}`;
          const taken = appState.daily.supplements[key] || false;
          return `
            <span class="time-badge ${taken ? 'taken' : ''}" 
                  onclick="toggleSupplement('${key}')">
              ${time} ${taken ? '✓' : ''}
            </span>
          `;
        }).join('')}
      </div>
      
      <div class="dosage-controls">
        <button class="dosage-btn" onclick="adjustDosage('${supp.name}', -1)">-</button>
        <span>Stock: <span id="stock_${supp.name.replace(/\s+/g, '_')}">30</span></span>
        <button class="dosage-btn" onclick="adjustDosage('${supp.name}', 1)">+</button>
      </div>
    </div>
  `).join('');
}

function toggleSupplement(key) {
  appState.daily.supplements[key] = !appState.daily.supplements[key];
  
  if (appState.daily.supplements[key]) {
    addPoints(10);
  }
  
  saveProgress();
  generateSupplements();
  updateProgressCircles();
  generateQuickTasks();
  checkAchievements();
}

function adjustDosage(suppName, change) {
  const stockId = `stock_${suppName.replace(/\s+/g, '_')}`;
  const stockElement = document.getElementById(stockId);
  if (!stockElement) return;
  
  let currentStock = parseInt(stockElement.textContent);
  currentStock = Math.max(0, Math.min(100, currentStock + change));
  stockElement.textContent = currentStock;
  
  if (currentStock < 5) {
    stockElement.style.color = 'var(--color-error)';
    stockElement.parentElement.innerHTML = `Stock: <span style="color: var(--color-error);">${currentStock} ⚠️ Low Stock</span>`;
  }
}

function generateWaterGlasses() {
  const container = document.getElementById('waterGlasses');
  if (!container) return;
  
  const glasses = [];
  
  for (let i = 0; i < 8; i++) {
    const filled = i < (appState.daily.water / 250);
    glasses.push(`<div class="water-glass ${filled ? 'filled' : ''}"></div>`);
  }
  
  container.innerHTML = glasses.join('');
  
  const waterCount = document.getElementById('waterCount');
  if (waterCount) {
    waterCount.textContent = `${appState.daily.water}ml / 2000ml`;
  }
}

function addWater() {
  appState.daily.water = Math.min(2000, appState.daily.water + 250);
  generateWaterGlasses();
  updateProgressCircles();
  saveProgress();
  
  if (appState.daily.water >= 2000) {
    addPoints(15);
  }
}

function resetWater() {
  appState.daily.water = 0;
  generateWaterGlasses();
  updateProgressCircles();
  saveProgress();
}

function addFiber() {
  appState.daily.fiber = Math.min(50, appState.daily.fiber + 5);
  updateFiberProgress();
  updateProgressCircles();
  saveProgress();
  
  if (appState.daily.fiber >= 30) {
    addPoints(15);
  }
}

function updateFiberProgress() {
  const progress = Math.min((appState.daily.fiber / 30) * 100, 100);
  const progressElement = document.getElementById('fiberProgress');
  const countElement = document.getElementById('fiberCount');
  
  if (progressElement) {
    progressElement.style.width = `${progress}%`;
  }
  
  if (countElement) {
    countElement.textContent = `${appState.daily.fiber}g / 30g`;
  }
}

function generatePrebioticChecklist() {
  const container = document.getElementById('prebioticChecklist');
  if (!container) return;
  
  container.innerHTML = appData.dietFoods.prebiotics.map(food => {
    const checked = appState.daily.prebiotics[food] || false;
    return `
      <div class="checklist-item">
        <input type="checkbox" ${checked ? 'checked' : ''} 
               onchange="togglePrebiotic('${food}')">
        <span>${food}</span>
      </div>
    `;
  }).join('');
}

function togglePrebiotic(food) {
  appState.daily.prebiotics[food] = !appState.daily.prebiotics[food];
  
  if (appState.daily.prebiotics[food]) {
    addPoints(5);
    addFiber(); // Prebiotics count towards fiber
  }
  
  saveProgress();
  generatePrebioticChecklist();
  updateProgressCircles();
}

function planMeal(mealType) {
  appState.selectedMealType = mealType;
  appState.selectedMealItems = [];
  
  const modal = document.getElementById('mealModal');
  const content = document.getElementById('mealOptions');
  
  if (!modal || !content) return;
  
  content.innerHTML = `
    <div class="meal-category">
      <h4>🥩 Proteins</h4>
      <div class="meal-options-grid">
        ${appData.dietFoods.proteins.map(food => `
          <div class="meal-option" onclick="toggleMealOption('${food}')">
            ${food}
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="meal-category">
      <h4>🥬 Vegetables</h4>
      <div class="meal-options-grid">
        ${appData.dietFoods.vegetables.map(food => `
          <div class="meal-option" onclick="toggleMealOption('${food}')">
            ${food}
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="meal-category">
      <h4>🍎 Fruits</h4>
      <div class="meal-options-grid">
        ${appData.dietFoods.fruits.map(food => `
          <div class="meal-option" onclick="toggleMealOption('${food}')">
            ${food}
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="meal-category">
      <h4>🌾 Grains</h4>
      <div class="meal-options-grid">
        ${appData.dietFoods.grains.map(food => `
          <div class="meal-option" onclick="toggleMealOption('${food}')">
            ${food}
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  modal.classList.remove('hidden');
}

function toggleMealOption(food) {
  const element = event.target;
  
  if (appState.selectedMealItems.includes(food)) {
    appState.selectedMealItems = appState.selectedMealItems.filter(item => item !== food);
    element.classList.remove('selected');
  } else {
    appState.selectedMealItems.push(food);
    element.classList.add('selected');
  }
}

function saveMeal() {
  if (appState.selectedMealItems.length > 0) {
    appState.daily.meals[appState.selectedMealType] = appState.selectedMealItems.join(', ');
    const mealElement = document.getElementById(`${appState.selectedMealType}Meal`);
    if (mealElement) {
      mealElement.textContent = appState.daily.meals[appState.selectedMealType];
    }
    addPoints(15);
    saveProgress();
    updateProgressCircles();
  }
  
  closeModal('mealModal');
}

function resetMeals() {
  appState.daily.meals = {breakfast: '', lunch: '', dinner: ''};
  
  const breakfastElement = document.getElementById('breakfastMeal');
  const lunchElement = document.getElementById('lunchMeal');
  const dinnerElement = document.getElementById('dinnerMeal');
  
  if (breakfastElement) breakfastElement.textContent = 'Click to plan';
  if (lunchElement) lunchElement.textContent = 'Click to plan';
  if (dinnerElement) dinnerElement.textContent = 'Click to plan';
}

function generateExerciseSchedule() {
  const container = document.getElementById('exerciseSchedule');
  if (!container) return;
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  container.innerHTML = days.map((day, index) => {
    const fullDay = fullDays[index];
    const exercises = appData.exercises.filter(ex => ex.days.includes(fullDay));
    const hasExercise = exercises.length > 0;
    const completed = exercises.some(ex => appState.daily.exercise[ex.name]);
    
    return `
      <div class="day-slot ${hasExercise ? 'has-exercise' : ''} ${completed ? 'completed' : ''}">
        <div>${day}</div>
        ${hasExercise ? `<div>${exercises[0].type}</div>` : '<div>Rest</div>'}
      </div>
    `;
  }).join('');
  
  // Update today's workout
  updateTodaysWorkout();
}

function updateTodaysWorkout() {
  const today = new Date().toLocaleDateString('en-US', {weekday: 'long'});
  const todayExercises = appData.exercises.filter(ex => ex.days.includes(today));
  const container = document.getElementById('todaysWorkout');
  
  if (!container) return;
  
  if (todayExercises.length > 0) {
    container.innerHTML = todayExercises.map(ex => `
      <div class="exercise-item">
        <h4>${ex.name}</h4>
        <p class="exercise-duration">${ex.duration}</p>
        <p>${ex.description || ex.exercises?.join(', ') || ''}</p>
      </div>
    `).join('');
  } else {
    container.innerHTML = '<p>No workout scheduled for today - enjoy your rest day! 😊</p>';
  }
}

function startWorkout() {
  const today = new Date().toLocaleDateString('en-US', {weekday: 'long'});
  const todayExercises = appData.exercises.filter(ex => ex.days.includes(today));
  
  if (todayExercises.length === 0) {
    alert('No workout scheduled for today!');
    return;
  }
  
  const modal = document.getElementById('workoutModal');
  const content = document.getElementById('workoutContent');
  
  if (!modal || !content) return;
  
  content.innerHTML = todayExercises.map(ex => `
    <div class="exercise-item">
      <h4>${ex.name}</h4>
      <p class="exercise-duration">Duration: ${ex.duration}</p>
      ${ex.description ? `<p><strong>Focus:</strong> ${ex.description}</p>` : ''}
      ${ex.exercises ? `
        <p><strong>Exercises:</strong></p>
        <ul>
          ${ex.exercises.map(exercise => `<li>${exercise}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  `).join('');
  
  modal.classList.remove('hidden');
}

function completeWorkout() {
  const today = new Date().toLocaleDateString('en-US', {weekday: 'long'});
  const todayExercises = appData.exercises.filter(ex => ex.days.includes(today));
  
  todayExercises.forEach(ex => {
    appState.daily.exercise[ex.name] = true;
  });
  
  addPoints(20);
  saveProgress();
  updateProgressCircles();
  generateQuickTasks();
  generateExerciseSchedule();
  checkAchievements();
  
  closeModal('workoutModal');
  
  // Show success message
  alert('Great job completing your workout! 💪');
}

function logCustomWorkout() {
  const workoutName = prompt('What type of workout did you do?');
  if (workoutName) {
    appState.daily.exercise[workoutName] = true;
    addPoints(15);
    saveProgress();
    updateProgressCircles();
    generateQuickTasks();
    checkAchievements();
    alert('Custom workout logged! 🎉');
  }
}

let complianceChart;

function initializeAnalyticsChart() {
  const ctx = document.getElementById('complianceChart');
  if (!ctx) return;
  
  const context = ctx.getContext('2d');
  
  // Generate sample data for the last 7 days
  const last7Days = [];
  const complianceData = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push(date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}));
    complianceData.push(Math.floor(Math.random() * 40) + 60); // Random 60-100%
  }
  
  complianceChart = new Chart(context, {
    type: 'line',
    data: {
      labels: last7Days,
      datasets: [{
        label: 'Daily Compliance %',
        data: complianceData,
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
}

function updateAnalytics() {
  // Update chart with current data
  if (complianceChart) {
    // In a real app, this would pull from appState.history
    const newData = Array(7).fill().map(() => Math.floor(Math.random() * 40) + 60);
    complianceChart.data.datasets[0].data = newData;
    complianceChart.update();
  }
}

function handleStarRating(ratingId, value) {
  const container = document.getElementById(ratingId);
  if (!container) return;
  
  const stars = container.querySelectorAll('.star');
  
  stars.forEach((star, index) => {
    star.classList.toggle('active', index < value);
  });
  
  if (ratingId === 'energyRating') {
    appState.daily.energy = value;
  } else if (ratingId === 'moodRating') {
    appState.daily.mood = value;
  }
  
  saveProgress();
}

function generateAchievements() {
  const container = document.getElementById('achievementsContainer');
  if (!container) return;
  
  container.innerHTML = appState.achievements.map((achievement, index) => `
    <div class="achievement-card ${achievement.unlocked ? 'unlocked' : ''}">
      <div class="achievement-icon">${achievement.unlocked ? '🏆' : '🔒'}</div>
      <h4 class="achievement-name">${achievement.name}</h4>
      <p class="achievement-description">${achievement.description}</p>
      <span class="achievement-points">${achievement.points} pts</span>
    </div>
  `).join('');
  
  updateAchievementCounts();
}

function updateAchievementCounts() {
  const unlocked = appState.achievements.filter(a => a.unlocked).length;
  const total = appState.achievements.length;
  
  const unlockedElement = document.getElementById('unlockedCount');
  const totalElement = document.getElementById('totalCount');
  
  if (unlockedElement) unlockedElement.textContent = unlocked;
  if (totalElement) totalElement.textContent = total;
}

function checkAchievements() {
  let newAchievements = false;
  
  // First Steps - Complete first day
  if (!appState.achievements[0].unlocked) {
    const hasAnyActivity = Object.values(appState.daily.supplements).some(Boolean) || 
                          Object.values(appState.daily.exercise).some(Boolean) ||
                          appState.daily.water > 0;
    
    if (hasAnyActivity) {
      unlockAchievement(0);
      newAchievements = true;
    }
  }
  
  // Week Warrior - 7 day streak
  if (!appState.achievements[1].unlocked && appState.user.streak >= 7) {
    unlockAchievement(1);
    newAchievements = true;
  }
  
  // Supplement Streak - all supplements for 14 days
  if (!appState.achievements[2].unlocked) {
    // This would check historical data in a real app
    const supplementsToday = Object.values(appState.daily.supplements).filter(Boolean).length;
    const totalSupplements = appData.supplements.reduce((acc, supp) => acc + supp.times.length, 0);
    
    if (supplementsToday === totalSupplements && appState.user.streak >= 14) {
      unlockAchievement(2);
      newAchievements = true;
    }
  }
  
  // Exercise Enthusiast - 10 workouts (simplified check)
  if (!appState.achievements[3].unlocked) {
    const exercisesToday = Object.values(appState.daily.exercise).filter(Boolean).length;
    if (exercisesToday > 0 && appState.user.points >= 200) { // Simplified check
      unlockAchievement(3);
      newAchievements = true;
    }
  }
  
  if (newAchievements) {
    generateAchievements();
  }
}

function unlockAchievement(index) {
  appState.achievements[index].unlocked = true;
  appState.achievements[index].unlockedDate = new Date().toISOString();
  addPoints(appState.achievements[index].points);
  
  // Show celebration
  setTimeout(() => {
    alert(`🎉 Achievement Unlocked: ${appState.achievements[index].name}! +${appState.achievements[index].points} points`);
  }, 500);
}

function addPoints(points) {
  appState.user.points += points;
  
  // Level up check
  const newLevel = Math.floor(appState.user.points / 100) + 1;
  if (newLevel > appState.user.level) {
    appState.user.level = newLevel;
    alert(`🎉 Level Up! You're now level ${newLevel}!`);
  }
  
  updateUserStats();
  saveProgress();
}

function updateStreak() {
  // Simplified streak calculation
  const today = new Date().toISOString().split('T')[0];
  const hasActivityToday = Object.values(appState.daily.supplements).some(Boolean) || 
                          Object.values(appState.daily.exercise).some(Boolean) ||
                          appState.daily.water > 0;
  
  if (hasActivityToday) {
    appState.user.streak += 1;
  } else if (appState.user.streak > 0) {
    appState.user.streak = 0; // Break streak if no activity
  }
  
  updateUserStats();
}

function updateUserStats() {
  const levelElement = document.getElementById('userLevel');
  const pointsElement = document.getElementById('userPoints');
  const streakElement = document.getElementById('userStreak');
  
  if (levelElement) levelElement.textContent = appState.user.level;
  if (pointsElement) pointsElement.textContent = appState.user.points;
  if (streakElement) streakElement.textContent = appState.user.streak;
}

function saveProgress() {
  // In a real app, this would save to a backend
  // For now, we'll just trigger UI updates
  updateProgressCircles();
}

function exportData() {
  const dataToExport = {
    user: appState.user,
    currentDaily: appState.daily,
    history: appState.history,
    achievements: appState.achievements,
    exportDate: new Date().toISOString()
  };
  
  const dataStr = JSON.stringify(dataToExport, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `gut-health-data-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  alert('Data exported successfully! 📁');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
  }
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Global functions that need to be accessible from HTML
window.generateMotivation = generateMotivation;
window.toggleTask = toggleTask;
window.toggleSupplement = toggleSupplement;
window.adjustDosage = adjustDosage;
window.addWater = addWater;
window.resetWater = resetWater;
window.addFiber = addFiber;
window.togglePrebiotic = togglePrebiotic;
window.planMeal = planMeal;
window.toggleMealOption = toggleMealOption;
window.saveMeal = saveMeal;
window.startWorkout = startWorkout;
window.completeWorkout = completeWorkout;
window.logCustomWorkout = logCustomWorkout;
window.closeModal = closeModal;
window.exportData = exportData;

// Initialize fiber progress and other UI elements on load
setTimeout(() => {
  updateFiberProgress();
  generateExerciseSchedule();
  updateProgressCircles();
}, 100);