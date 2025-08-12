// Application Data
const appData = {
  supplements: [
    {
      name: "Probiotic (Bifidobacterium Lactis)",
      dosage: "2 Tablets",
      doseAmount: 2, // Number of pills per dose
      inventory: 240, // Total pills in a full container
      times: ["morning"],
      description: "3 Billion CFUs to promote digestive health."
    },
    {
      name: "Vegan Omega 3-6-9",
      dosage: "2 Vegetarian Softgels",
      doseAmount: 2,
      inventory: 60,
      times: ["morning"],
      description: "Vegetarian blend of various oils."
    },
    {
      name: "Gut Health Blend",
      dosage: "1-3 Soft-gels",
      doseAmount: 1, // Defaulting to 1, user can adjust
      inventory: 90,
      times: ["midday"],
      description: "Tributyrin, Vitamin D3, Vitamin K2."
    },
    {
      name: "Turmeric Curcumin Complex",
      dosage: "3 Vegan Capsules",
      doseAmount: 3,
      inventory: 90,
      times: ["evening"],
      description: "With Ginger & BioPerine."
    },
    {
      name: "Vitamin B12",
      dosage: "1 Softgel (5000 mcg)",
      doseAmount: 1,
      inventory: 90, // Assumed amount
      times: ["morning"],
      description: "As Cyanocobalamin."
    },
    {
      name: "L-Glutamine",
      dosage: "1 Veg Capsule (500 mg)",
      doseAmount: 1,
      inventory: 120, // Assumed amount
      times: ["evening"],
      description: "Free-Form Amino Acid."
    },
    {
      name: "Zinc",
      dosage: "1 Veg Capsule (50 mg)",
      doseAmount: 1,
      inventory: 120, // Assumed amount
      times: ["evening"],
      description: "From Zinc Picolinate."
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
    { name: "Phase 1: Initiation", duration: "Weeks 1-4", focus: "Starting supplements and diet changes" },
    { name: "Phase 2: Restoration", duration: "Weeks 4-12", focus: "Microbiome rebuilding" },
    { name: "Phase 3: Maintenance", duration: "3+ months", focus: "Long-term health" }
  ],
  achievements: [
    {name: "First Steps", description: "Complete your first day", points: 50},
    {name: "Week Warrior", description: "Complete 7 days in a row", points: 200},
    // ... other achievements
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
        if (!this.isStarted) {
            Tone.start();
            this.isStarted = true;
            console.log("Audio context started.");
        }
    },
    playSound(type) {
        if (!this.isStarted) return;
        try {
            switch (type) {
                case 'click':
                    this.synths.click.triggerAttackRelease('C5', '8n');
                    break;
                case 'success':
                    this.synths.success.triggerAttackRelease('G5', '8n', Tone.now());
                    this.synths.success.triggerAttackRelease('E6', '8n', Tone.now() + 0.1);
                    break;
                case 'complete':
                    this.synths.complete.triggerAttackRelease('C2', '8n');
                    break;
                case 'timerTick':
                    this.synths.timerTick.triggerAttackRelease('C6', '16n');
                    break;
                case 'timerEnd':
                     this.synths.timerEnd.triggerAttackRelease('G5', '4n');
                    break;
            }
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    }
};

// --- TIMER STATE ---
let timerInterval = null;
let timeLeft = 0;
let initialTime = 0;


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupEventListeners();
  loadDashboard();
  updateUserStats();
});

function initializeApp() {
  // Initialize supplement inventory from appData
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
  
  // Setup timer buttons
  document.getElementById('timerStartBtn').addEventListener('click', startTimer);
  document.getElementById('timerPauseBtn').addEventListener('click', pauseTimer);
  document.getElementById('timerResetBtn').addEventListener('click', resetTimer);

  // ... other event listeners ...
}

function switchTab(tabName) {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
  if (tabName === 'analytics') {
    setTimeout(() => { updateAnalytics(); }, 100);
  }
  if (tabName === 'dashboard') {
    loadDashboard();
  }
}

// --- SUPPLEMENTS & INVENTORY ---
function generateSupplements() {
    const container = document.getElementById('supplementsContainer');
    if (!container) return;

    container.innerHTML = appData.supplements.map(supp => {
        const currentStock = appState.supplementInventory[supp.name] || 0;
        const isLowStock = currentStock < (supp.doseAmount * 7); // Warning if less than a week's supply
        const keyBase = supp.name.replace(/\s+/g, '_');

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
                <input type="number" id="stock_${keyBase}" class="inventory-input ${isLowStock ? 'low-stock' : ''}" 
                       value="${currentStock}" onchange="updateInventory('${supp.name}', this.value)">
                ${isLowStock ? '<span>⚠️</span>' : ''}
            </div>
        </div>`;
    }).join('');
}

function toggleSupplement(key) {
    const [suppName, time] = key.split('_');
    const supplement = appData.supplements.find(s => s.name === suppName);
    if (!supplement) return;

    const wasTaken = appState.daily.supplements[key];
    appState.daily.supplements[key] = !wasTaken;

    if (!wasTaken) {
        // Just took it
        appState.supplementInventory[suppName] -= supplement.doseAmount;
        addPoints(10);
        soundEngine.playSound('success');
    } else {
        // Undoing it
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
        generateSupplements(); // Re-render to update low stock warning
        saveProgress();
    }
}


// --- EXERCISE & TIMER ---
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

    if (!todayExercise) {
        alert('No workout scheduled for today!');
        return;
    }

    const modal = document.getElementById('workoutModal');
    const infoContent = document.getElementById('workoutInfo');
    
    infoContent.innerHTML = `
        <h4>${todayExercise.name}</h4>
        <p class="exercise-duration">${todayExercise.duration}</p>
        <p>${todayExercise.description || todayExercise.exercises?.join(', ') || ''}</p>
    `;

    initialTime = parseDuration(todayExercise.duration);
    resetTimer(false); // Reset timer without sound
    
    modal.classList.remove('hidden');
    soundEngine.playSound('click');
}

function startTimer() {
    soundEngine.playSound('click');
    if (timerInterval) return; // Already running

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
  const todayExercises = appData.exercises.filter(ex => ex.days.includes(today));
  
  todayExercises.forEach(ex => { appState.daily.exercise[ex.name] = true; });
  
  addPoints(20);
  soundEngine.playSound('complete');
  saveProgress();
  updateProgressCircles();
  generateQuickTasks();
  generateExerciseSchedule();
  checkAchievements();
  
  closeModal('workoutModal');
  
  // Show success message
  // alert('Great job completing your workout! 💪'); // Replaced by sound
}

function closeModal(modalId) {
  pauseTimer(); // Ensure timer stops when modal is closed
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Stubs for other functions to keep it runnable
function loadDashboard() { generateQuickTasks(); updateProgressCircles(); }
function generateQuickTasks() { /* ... */ }
function updateProgressCircles() { /* ... */ }
function addPoints(p) { appState.user.points += p; updateUserStats(); }
function updateUserStats() { 
    document.getElementById('userLevel').textContent = appState.user.level;
    document.getElementById('userPoints').textContent = appState.user.points;
    document.getElementById('userStreak').textContent = appState.user.streak;
}
function saveProgress() { console.log("Progress saved.", appState); }
function formatDate(d) { return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }); }
function generateWaterGlasses() { /* ... */ }
function addWater() { appState.daily.water += 250; soundEngine.playSound('click'); /* ... */ }
function resetWater() { appState.daily.water = 0; soundEngine.playSound('click'); /* ... */ }
function generatePrebioticChecklist() { /* ... */ }
function addFiber() { appState.daily.fiber += 5; soundEngine.playSound('click'); /* ... */ }
function planMeal(type) { soundEngine.playSound('click'); /* ... */ }
function saveMeal() { soundEngine.playSound('success'); /* ... */ }
function logCustomWorkout() { soundEngine.playSound('click'); /* ... */ }
function generateExerciseSchedule() { /* ... */ }
function initializeAnalyticsChart() { /* ... */ }
function updateAnalytics() { /* ... */ }
function handleStarRating() { soundEngine.playSound('click'); /* ... */ }
function generateAchievements() { /* ... */ }
function checkAchievements() { /* ... */ }
function exportData() { soundEngine.playSound('click'); /* ... */ }
function updateCurrentPhase() { /* ... */ }
function resetDailyState() { /* ... */ }
