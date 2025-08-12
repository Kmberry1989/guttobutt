// Application Data
const appData = {
  supplements: [
    { name: "Probiotic (Bifidobacterium Lactis)", dosage: "2 Tablets", doseAmount: 2, inventory: 240, times: ["morning"], description: "3 Billion CFUs to promote digestive health." },
    { name: "Vegan Omega 3-6-9", dosage: "2 Vegetarian Softgels", doseAmount: 2, inventory: 60, times: ["morning"], description: "Vegetarian blend of various oils." },
    { name: "Gut Health Blend", dosage: "1-3 Soft-gels", doseAmount: 1, inventory: 90, times: ["midday"], description: "Tributyrin, Vitamin D3, Vitamin K2." },
    { name: "Turmeric Curcumin Complex", dosage: "3 Vegan Capsules", doseAmount: 3, inventory: 90, times: ["evening"], description: "With Ginger & BioPerine." },
    { name: "Vitamin B12", dosage: "1 Softgel (5000 mcg)", doseAmount: 1, inventory: 90, times: ["morning"], description: "As Cyanocobalamin." },
    { name: "L-Glutamine", dosage: "1 Veg Capsule (500 mg)", doseAmount: 1, inventory: 120, times: ["evening"], description: "Free-Form Amino Acid." },
    { name: "Zinc", dosage: "1 Veg Capsule (50 mg)", doseAmount: 1, inventory: 120, times: ["evening"], description: "From Zinc Picolinate." }
  ],
  dietFoods: {
    proteins: ["Chicken breast", "Turkey", "Eggs", "Greek yogurt", "Beans", "Lentils", "Chickpeas", "Tofu", "Tempeh", "Nuts", "Seeds"],
    vegetables: ["Spinach", "Kale", "Broccoli", "Artichokes", "Garlic", "Onions", "Tomatoes", "Bell peppers", "Zucchini", "Eggplant"],
    fruits: ["Berries", "Apples", "Oranges", "Grapes", "Figs", "Dates", "Pomegranates", "Avocados"],
    grains: ["Quinoa", "Brown rice", "Oats", "Whole wheat bread", "Barley", "Farro"],
    prebiotics: ["Inulin powder", "Resistant starch", "Jerusalem artichokes", "Asparagus", "Banana (green)", "Garlic", "Onions"]
  },
  exercises: [
    { name: "Walking/Light Cardio", duration: "20 minutes", days: ["Monday", "Wednesday", "Friday"], type: "cardio", description: "Moderate pace, talking possible but not singing" },
    { name: "Strength Training", duration: "15 minutes", days: ["Monday", "Wednesday", "Friday"], type: "strength", exercises: ["Bicep curls", "Squats", "Leg presses", "Resistance bands"] },
    { name: "Yoga/Tai Chi", duration: "30 minutes", days: ["Tuesday", "Thursday"], type: "flexibility", description: "Focus on balance, posture, and stability" },
    { name: "Stretching", duration: "15 minutes", days: ["Tuesday", "Thursday"], type: "flexibility", exercises: ["Arm circles", "Deep breathing", "Dynamic stretches"] }
  ],
  phases: [
    { name: "Phase 1: Initiation", duration: "Weeks 1-4", focus: "Starting supplements and diet changes" },
    { name: "Phase 2: Restoration", duration: "Weeks 4-12", focus: "Microbiome rebuilding" },
    { name: "Phase 3: Maintenance", duration: "3+ months", focus: "Long-term health" }
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

// --- APPLICATION STATE ---
let appState = {
  user: { level: 1, points: 0, streak: 0, joinDate: new Date().toISOString().split('T')[0] },
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
  supplementInventory: {},
  history: [],
  achievements: appData.achievements.map(a => ({...a, unlocked: false, unlockedDate: null})),
  currentPhase: 0,
  selectedMealType: '',
  selectedMealItems: []
};

// --- SOUND ENGINE ---
const soundEngine = {
    isStarted: false,
    synths: {
        click: new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 } }).toDestination(),
        success: new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 } }).toDestination(),
        complete: new Tone.MembraneSynth().toDestination(),
        timerTick: new Tone.Synth({ oscillator: { type: 'sine' }, volume: -10, envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.1 } }).toDestination(),
        timerEnd: new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.4, sustain: 0, release: 0.1 } }).toDestination(),
    },
    start() {
        if (!this.isStarted && typeof Tone !== 'undefined') {
            Tone.start();
            this.isStarted = true;
            console.log("Audio context started.");
        }
    },
    playSound(type) {
        if (!this.isStarted) return;
        try {
            switch (type) {
                case 'click': this.synths.click.triggerAttackRelease('C5', '8n'); break;
                case 'success': this.synths.success.triggerAttackRelease('G5', '8n', Tone.now()); this.synths.success.triggerAttackRelease('E6', '8n', Tone.now() + 0.1); break;
                case 'complete': this.synths.complete.triggerAttackRelease('C2', '8n'); break;
                case 'timerTick': this.synths.timerTick.triggerAttackRelease('C6', '16n'); break;
                case 'timerEnd': this.synths.timerEnd.triggerAttackRelease('G5', '4n'); break;
            }
        } catch (error) { console.error("Error playing sound:", error); }
    }
};

// --- TIMER STATE ---
let timerInterval = null;
let timeLeft = 0;
let initialTime = 0;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
  loadDashboard();
  updateUserStats();
});

function initializeApp() {
  appData.supplements.forEach(supp => {
      appState.supplementInventory[supp.name] = supp.inventory;
  });
  document.getElementById('currentDate').textContent = formatDate(new Date());
  const today = new Date().toISOString().split('T')[0];
  if (appState.daily.date !== today) {
    resetDailyState();
    appState.daily.date = today;
  }
  updateCurrentPhase();
  generateSupplements();
  generateWaterGlasses();
  generatePrebioticChecklist();
  generateExerciseSchedule();
  generateAchievements();
  setTimeout(() => { initializeAnalyticsChart(); }, 100);
}

function setupEventListeners() {
  document.body.addEventListener('click', () => soundEngine.start(), { once: true });
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      soundEngine.playSound('click');
      switchTab(this.dataset.tab);
    });
  });
  document.getElementById('timerStartBtn').addEventListener('click', startTimer);
  document.getElementById('timerPauseBtn').addEventListener('click', pauseTimer);
  document.getElementById('timerResetBtn').addEventListener('click', resetTimer);
  document.querySelectorAll('.star-rating').forEach(rating => {
    rating.querySelectorAll('.star').forEach(star => {
      star.addEventListener('click', () => handleStarRating(rating.id, parseInt(star.dataset.rating)));
    });
  });
  const sleepSlider = document.getElementById('sleepHours');
  if(sleepSlider) sleepSlider.addEventListener('input', (e) => { document.getElementById('sleepValue').textContent = e.target.value; appState.daily.sleep.hours = parseInt(e.target.value); saveProgress(); });
  const tremorSlider = document.getElementById('tremorSeverity');
  if(tremorSlider) tremorSlider.addEventListener('input', (e) => { document.getElementById('tremorValue').textContent = e.target.value; appState.daily.symptoms.tremor = parseInt(e.target.value); saveProgress(); });
  const stiffnessSlider = document.getElementById('stiffnessSeverity');
  if(stiffnessSlider) stiffnessSlider.addEventListener('input', (e) => { document.getElementById('stiffnessValue').textContent = e.target.value; appState.daily.symptoms.stiffness = parseInt(e.target.value); saveProgress(); });
  const balanceSlider = document.getElementById('balanceSeverity');
  if(balanceSlider) balanceSlider.addEventListener('input', (e) => { document.getElementById('balanceValue').textContent = e.target.value; appState.daily.symptoms.balance = parseInt(e.target.value); saveProgress(); });
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
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
  if (tabName === 'analytics') setTimeout(() => { updateAnalytics(); }, 100);
  if (tabName === 'dashboard') loadDashboard();
}

function resetDailyState() {
  if (appState.daily.date) appState.history.push({ ...appState.daily });
  appState.daily = { date: new Date().toISOString().split('T')[0], supplements: {}, water: 0, fiber: 0, meals: {breakfast: '', lunch: '', dinner: ''}, prebiotics: {}, exercise: {}, mood: 0, energy: 0, sleep: {hours: 8, quality: ''}, symptoms: {tremor: 5, stiffness: 5, balance: 5} };
  updateStreak();
  generateWaterGlasses();
  updateFiberProgress();
  resetMeals();
  updateProgressCircles();
}

function updateCurrentPhase() {
  const daysSince = Math.floor((new Date() - new Date(appState.user.joinDate)) / 86400000);
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
  appData.supplements.forEach(supp => supp.times.forEach(time => tasks.push({ id: `${supp.name}_${time}`, text: `Take ${supp.name} (${time})`, completed: appState.daily.supplements[`${supp.name}_${time}`] || false, type: 'supplement' })));
  const today = new Date().toLocaleDateString('en-US', {weekday: 'long'});
  appData.exercises.forEach(ex => { if (ex.days.includes(today)) tasks.push({ id: ex.name, text: `${ex.name} (${ex.duration})`, completed: appState.daily.exercise[ex.name] || false, type: 'exercise' }); });
  container.innerHTML = tasks.slice(0, 6).map(task => `<div class="task-item ${task.completed ? 'completed' : ''}"><input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}', '${task.type}')"><span>${task.text}</span></div>`).join('');
}

function toggleTask(taskId, type) {
  if (type === 'supplement') appState.daily.supplements[taskId] = !appState.daily.supplements[taskId];
  else if (type === 'exercise') {
    appState.daily.exercise[taskId] = !appState.daily.exercise[taskId];
    if (appState.daily.exercise[taskId]) addPoints(20);
  }
  saveProgress();
  updateProgressCircles();
  generateQuickTasks();
  checkAchievements();
}

function updateProgressCircles() {
  const totalSupps = appData.supplements.reduce((acc, supp) => acc + supp.times.length, 0);
  const completedSupps = Object.values(appState.daily.supplements).filter(Boolean).length;
  const suppProgress = totalSupps > 0 ? Math.round((completedSupps / totalSupps) * 100) : 0;
  const waterProgress = Math.min((appState.daily.water / 2000) * 100, 100);
  const fiberProgress = Math.min((appState.daily.fiber / 30) * 100, 100);
  const mealProgress = (Object.values(appState.daily.meals).filter(m => m).length / 3) * 100;
  const dietProgress = Math.round((waterProgress + fiberProgress + mealProgress) / 3);
  const today = new Date().toLocaleDateString('en-US', {weekday: 'long'});
  const todayEx = appData.exercises.filter(ex => ex.days.includes(today));
  const completedEx = todayEx.filter(ex => appState.daily.exercise[ex.name]).length;
  const exProgress = todayEx.length > 0 ? Math.round((completedEx / todayEx.length) * 100) : 0;
  updateProgressCircle('supplementProgress', suppProgress);
  updateProgressCircle('dietProgress', dietProgress);
  updateProgressCircle('exerciseProgress', exProgress);
}

function updateProgressCircle(id, progress) {
  const el = document.getElementById(id);
  if (el) {
    el.querySelector('.percentage').textContent = `${progress}%`;
    el.style.background = `conic-gradient(var(--color-primary) ${progress * 3.6}deg, var(--color-secondary) 0deg)`;
  }
}

function generateMotivation() {
  const msg = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  document.getElementById('motivationalMessage').textContent = msg;
  soundEngine.playSound('click');
}

function generateSupplements() {
    const container = document.getElementById('supplementsContainer');
    if (!container) return;
    container.innerHTML = appData.supplements.map(supp => {
        const stock = appState.supplementInventory[supp.name] || 0;
        const lowStock = stock < (supp.doseAmount * 7);
        const keyBase = supp.name.replace(/[^\w]/g, '_');
        return `
        <div class="supplement-card">
            <div class="supplement-header">
                <div>
                    <h3 class="supplement-name">${supp.name}</h3>
                    <p class="supplement-dosage">Dose: ${supp.dosage}</p>
                    <p class="supplement-description">${supp.description}</p>
                </div>
            </div>
            <div class="supplement-times">
                ${supp.times.map(time => {
                    const key = `${supp.name}_${time}`;
                    const taken = appState.daily.supplements[key] || false;
                    return `<span class="time-badge ${taken ? 'taken' : ''}" onclick="toggleSupplement('${key}')">${time} ${taken ? '✓' : ''}</span>`;
                }).join('')}
            </div>
            <div class="inventory-controls">
                <label for="stock_${keyBase}">Stock:</label>
                <input type="number" id="stock_${keyBase}" class="inventory-input ${lowStock ? 'low-stock' : ''}" value="${stock}" onchange="updateInventory('${supp.name}', this.value)">
                ${lowStock ? '<span>⚠️</span>' : ''}
            </div>
        </div>`;
    }).join('');
}

function toggleSupplement(key) {
    const [suppName] = key.split('_');
    const supplement = appData.supplements.find(s => s.name === suppName);
    if (!supplement) return;
    const wasTaken = appState.daily.supplements[key];
    appState.daily.supplements[key] = !wasTaken;
    if (!wasTaken) {
        appState.supplementInventory[suppName] -= supplement.doseAmount;
        addPoints(10);
        soundEngine.playSound('success');
    } else {
        appState.supplementInventory[suppName] += supplement.doseAmount;
        soundEngine.playSound('click');
    }
    saveProgress();
    generateSupplements();
    updateProgressCircles();
    generateQuickTasks();
    checkAchievements();
}

function updateInventory(suppName, newValue) {
    const newStock = parseInt(newValue, 10);
    if (!isNaN(newStock)) {
        appState.supplementInventory[suppName] = newStock;
        soundEngine.playSound('click');
        generateSupplements();
        saveProgress();
    }
}

function generateWaterGlasses() {
  const container = document.getElementById('waterGlasses');
  if (!container) return;
  container.innerHTML = Array(8).fill(0).map((_, i) => `<div class="water-glass ${i < (appState.daily.water / 250) ? 'filled' : ''}"></div>`).join('');
  document.getElementById('waterCount').textContent = `${appState.daily.water}ml / 2000ml`;
}

function addWater() {
  appState.daily.water = Math.min(2000, appState.daily.water + 250);
  if (appState.daily.water >= 2000) addPoints(15);
  soundEngine.playSound('click');
  generateWaterGlasses();
  updateProgressCircles();
  saveProgress();
}

function resetWater() {
  appState.daily.water = 0;
  soundEngine.playSound('click');
  generateWaterGlasses();
  updateProgressCircles();
  saveProgress();
}

function addFiber() {
  appState.daily.fiber = Math.min(50, appState.daily.fiber + 5);
  if (appState.daily.fiber >= 30) addPoints(15);
  soundEngine.playSound('click');
  updateFiberProgress();
  updateProgressCircles();
  saveProgress();
}

function updateFiberProgress() {
  const progress = Math.min((appState.daily.fiber / 30) * 100, 100);
  document.getElementById('fiberProgress').style.width = `${progress}%`;
  document.getElementById('fiberCount').textContent = `${appState.daily.fiber}g / 30g`;
}

function generatePrebioticChecklist() {
  const container = document.getElementById('prebioticChecklist');
  if (!container) return;
  container.innerHTML = appData.dietFoods.prebiotics.map(food => `<div class="checklist-item"><input type="checkbox" ${appState.daily.prebiotics[food] ? 'checked' : ''} onchange="togglePrebiotic('${food}')"><span>${food}</span></div>`).join('');
}

function togglePrebiotic(food) {
  appState.daily.prebiotics[food] = !appState.daily.prebiotics[food];
  if (appState.daily.prebiotics[food]) { addPoints(5); addFiber(); }
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
  content.innerHTML = Object.keys(appData.dietFoods).filter(k => k !== 'prebiotics').map(category => `
    <div class="meal-category"><h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4><div class="meal-options-grid">
    ${appData.dietFoods[category].map(food => `<div class="meal-option" onclick="toggleMealOption(this, '${food}')">${food}</div>`).join('')}
    </div></div>`).join('');
  modal.classList.remove('hidden');
  soundEngine.playSound('click');
}

function toggleMealOption(element, food) {
    if (appState.selectedMealItems.includes(food)) {
        appState.selectedMealItems = appState.selectedMealItems.filter(item => item !== food);
        element.classList.remove('selected');
    } else {
        appState.selectedMealItems.push(food);
        element.classList.add('selected');
    }
    soundEngine.playSound('click');
}

function saveMeal() {
  if (appState.selectedMealItems.length > 0) {
    appState.daily.meals[appState.selectedMealType] = appState.selectedMealItems.join(', ');
    document.getElementById(`${appState.selectedMealType}Meal`).textContent = appState.daily.meals[appState.selectedMealType];
    addPoints(15);
    soundEngine.playSound('success');
    saveProgress();
    updateProgressCircles();
  }
  closeModal('mealModal');
}

function resetMeals() {
  appState.daily.meals = {breakfast: '', lunch: '', dinner: ''};
  document.getElementById('breakfastMeal').textContent = 'Click to plan';
  document.getElementById('lunchMeal').textContent = 'Click to plan';
  document.getElementById('dinnerMeal').textContent = 'Click to plan';
}

function generateExerciseSchedule() {
  const container = document.getElementById('exerciseSchedule');
  if (!container) return;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  container.innerHTML = days.map((day, i) => {
    const exercises = appData.exercises.filter(ex => ex.days.includes(fullDays[i]));
    const completed = exercises.some(ex => appState.daily.exercise[ex.name]);
    return `<div class="day-slot ${exercises.length ? 'has-exercise' : ''} ${completed ? 'completed' : ''}"><div>${day}</div>${exercises.length ? `<div>${exercises[0].type}</div>` : '<div>Rest</div>'}</div>`;
  }).join('');
  updateTodaysWorkout();
}

function updateTodaysWorkout() {
  const today = new Date().toLocaleDateString('en-US', {weekday: 'long'});
  const todayExercises = appData.exercises.filter(ex => ex.days.includes(today));
  const container = document.getElementById('todaysWorkout');
  if (!container) return;
  if (todayExercises.length) {
    container.innerHTML = todayExercises.map(ex => `<div class="exercise-item"><h4>${ex.name}</h4><p class="exercise-duration">${ex.duration}</p><p>${ex.description || ex.exercises?.join(', ') || ''}</p></div>`).join('');
  } else {
    container.innerHTML = '<p>No workout scheduled for today - enjoy your rest day! 😊</p>';
  }
}

function parseDuration(durationString) {
    const minutes = parseInt(durationString.split(' ')[0], 10);
    return isNaN(minutes) ? 0 : minutes * 60;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startWorkout() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayExercise = appData.exercises.find(ex => ex.days.includes(today));
    if (!todayExercise) { alert('No workout scheduled for today!'); return; }
    const modal = document.getElementById('workoutModal');
    document.getElementById('workoutInfo').innerHTML = `<h4>${todayExercise.name}</h4><p>${todayExercise.duration}</p><p>${todayExercise.description || ''}</p>`;
    initialTime = parseDuration(todayExercise.duration);
    resetTimer(false);
    modal.classList.remove('hidden');
    soundEngine.playSound('click');
}

function startTimer() {
    soundEngine.playSound('click');
    if (timerInterval) return;
    document.getElementById('timerStartBtn').classList.add('hidden');
    document.getElementById('timerPauseBtn').classList.remove('hidden');
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('workoutTimerDisplay').textContent = formatTime(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            soundEngine.playSound('timerEnd');
            document.getElementById('workoutTimerDisplay').textContent = "Done!";
            completeWorkout();
        } else {
            soundEngine.playSound('timerTick');
        }
    }, 1000);
}

function pauseTimer() {
    soundEngine.playSound('click');
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById('timerStartBtn').classList.remove('hidden');
    document.getElementById('timerPauseBtn').classList.add('hidden');
}

function resetTimer(playSound = true) {
    if (playSound) soundEngine.playSound('click');
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = initialTime;
    document.getElementById('workoutTimerDisplay').textContent = formatTime(timeLeft);
    document.getElementById('timerStartBtn').classList.remove('hidden');
    document.getElementById('timerPauseBtn').classList.add('hidden');
}

function completeWorkout() {
  const today = new Date().toLocaleDateString('en-US', {weekday: 'long'});
  appData.exercises.filter(ex => ex.days.includes(today)).forEach(ex => { appState.daily.exercise[ex.name] = true; });
  addPoints(20);
  soundEngine.playSound('complete');
  saveProgress();
  updateProgressCircles();
  generateQuickTasks();
  generateExerciseSchedule();
  checkAchievements();
  closeModal('workoutModal');
}

function logCustomWorkout() {
  const workoutName = prompt('What type of workout did you do?');
  if (workoutName) {
    appState.daily.exercise[workoutName] = true;
    addPoints(15);
    soundEngine.playSound('success');
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
  if (!ctx || !window.Chart) return;
  const last7Days = Array(7).fill(0).map((_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}); }).reverse();
  complianceChart = new Chart(ctx.getContext('2d'), {
    type: 'line',
    data: { labels: last7Days, datasets: [{ label: 'Daily Compliance %', data: Array(7).fill(0).map(() => Math.floor(Math.random() * 40) + 60), borderColor: '#1FB8CD', backgroundColor: 'rgba(31, 184, 205, 0.1)', borderWidth: 3, fill: true, tension: 0.4 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: value => value + '%' } } } }
  });
}

function updateAnalytics() {
  if (complianceChart) {
    complianceChart.data.datasets[0].data = Array(7).fill(0).map(() => Math.floor(Math.random() * 40) + 60);
    complianceChart.update();
  }
}

function handleStarRating(ratingId, value) {
  const container = document.getElementById(ratingId);
  if (!container) return;
  container.querySelectorAll('.star').forEach((star, index) => star.classList.toggle('active', index < value));
  if (ratingId === 'energyRating') appState.daily.energy = value;
  else if (ratingId === 'moodRating') appState.daily.mood = value;
  soundEngine.playSound('click');
  saveProgress();
}

function generateAchievements() {
  const container = document.getElementById('achievementsContainer');
  if (!container) return;
  container.innerHTML = appState.achievements.map(a => `<div class="achievement-card ${a.unlocked ? 'unlocked' : ''}"><div class="achievement-icon">${a.unlocked ? '🏆' : '🔒'}</div><h4 class="achievement-name">${a.name}</h4><p class="achievement-description">${a.description}</p><span class="achievement-points">${a.points} pts</span></div>`).join('');
  updateAchievementCounts();
}

function updateAchievementCounts() {
  const unlocked = appState.achievements.filter(a => a.unlocked).length;
  document.getElementById('unlockedCount').textContent = unlocked;
  document.getElementById('totalCount').textContent = appState.achievements.length;
}

function checkAchievements() {
  let newAchievements = false;
  const hasActivity = Object.values(appState.daily.supplements).some(Boolean) || Object.values(appState.daily.exercise).some(Boolean) || appState.daily.water > 0;
  if (!appState.achievements[0].unlocked && hasActivity) { unlockAchievement(0); newAchievements = true; }
  if (!appState.achievements[1].unlocked && appState.user.streak >= 7) { unlockAchievement(1); newAchievements = true; }
  if (newAchievements) generateAchievements();
}

function unlockAchievement(index) {
  appState.achievements[index].unlocked = true;
  appState.achievements[index].unlockedDate = new Date().toISOString();
  addPoints(appState.achievements[index].points);
  soundEngine.playSound('complete');
  setTimeout(() => { alert(`🎉 Achievement Unlocked: ${appState.achievements[index].name}! +${appState.achievements[index].points} points`); }, 500);
}

function addPoints(points) {
  appState.user.points += points;
  const newLevel = Math.floor(appState.user.points / 100) + 1;
  if (newLevel > appState.user.level) {
    appState.user.level = newLevel;
    soundEngine.playSound('success');
    alert(`🎉 Level Up! You're now level ${newLevel}!`);
  }
  updateUserStats();
  saveProgress();
}

function updateStreak() {
  const hasActivity = Object.values(appState.daily.supplements).some(Boolean) || Object.values(appState.daily.exercise).some(Boolean) || appState.daily.water > 0;
  if (hasActivity) appState.user.streak++;
  else if (appState.user.streak > 0) appState.user.streak = 0;
  updateUserStats();
}

function updateUserStats() {
  document.getElementById('userLevel').textContent = appState.user.level;
  document.getElementById('userPoints').textContent = appState.user.points;
  document.getElementById('userStreak').textContent = appState.user.streak;
}

function saveProgress() {
  console.log("Progress saved.", appState);
  // In a real app, this would save to localStorage or a backend.
}

function exportData() {
  const dataStr = JSON.stringify({ user: appState.user, daily: appState.daily, history: appState.history, achievements: appState.achievements, inventory: appState.supplementInventory }, null, 2);
  const blob = new Blob([dataStr], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gut-health-data-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  soundEngine.playSound('click');
}

function closeModal(modalId) {
  pauseTimer();
  document.getElementById(modalId).classList.add('hidden');
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// Make functions globally accessible for HTML onclicks
window.toggleSupplement = toggleSupplement;
window.updateInventory = updateInventory;
window.startWorkout = startWorkout;
window.completeWorkout = completeWorkout;
window.logCustomWorkout = logCustomWorkout;
window.closeModal = closeModal;
window.addWater = addWater;
window.resetWater = resetWater;
window.addFiber = addFiber;
window.togglePrebiotic = togglePrebiotic;
window.planMeal = planMeal;
window.toggleMealOption = toggleMealOption;
window.saveMeal = saveMeal;
window.generateMotivation = generateMotivation;
window.exportData = exportData;
window.toggleTask = toggleTask;
