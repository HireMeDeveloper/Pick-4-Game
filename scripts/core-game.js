const clearButton = document.querySelector('[data-deselect-button]');
const submitButton = document.querySelector('[data-submit-button]'); 
const shuffleButton = document.querySelector('[data-shuffle-button]'); 

const gameBars = document.querySelectorAll('[data-game-bar]');
const mistakeIndicators = document.querySelectorAll('[data-mistake-indicator]');

hasStartedGameLogic = false;

function startupGameLogic() {
    if (hasStartedGameLogic) return;
    hasStartedGameLogic = true;

    gameState.hasOpenedPuzzle = true
    storeGameStateData()

    // Setup event listeners for game buttons
    document.querySelectorAll('.game-button').forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('submitted')) return;

            // Count selected buttons
            const beforeCount = document.querySelectorAll('.game-button.selected').length;

            // Can only select 4 elements
            if (beforeCount < 4 || button.classList.contains('selected')) {
                button.classList.toggle('selected');
            }

            updateButtons();
        });
    });

    gameState.items.forEach(item => {
        item.submitted = false;
    });

    populateButtons();
    updateRemainingFailuresDisplay();
    initializeSubmittedGroups();

    if (gameState.isComplete) {
        disableAllGameButtons();
        showAnswers();
    }
}

function updateButtons() {
    // Recount selected buttons after toggle
    const selectedCount = document.querySelectorAll('.game-button.selected').length;
    console.log("Selected count: " + selectedCount);

    // Enable clear button if more than one selected
    if (selectedCount > 0) {
        clearButton.classList.remove('disabled');
    } else {
        clearButton.classList.add('disabled');
    }

    // Enable submit button if exactly four selected
    if (selectedCount === 4) {
        submitButton.classList.remove('disabled');
    } else {
        submitButton.classList.add('disabled');
    }

    // Disable shuffle button if all items submitted
    if (gameState.submittedCount >= gameState.items.length / 4) {
        shuffleButton.classList.add('disabled');
    }
}

function clearAllSelections() {
    document.querySelectorAll('.game-button.selected').forEach(button => {
        button.classList.remove('selected');
    });

    updateButtons();
}

function shuffleArray(array) {
    // Fisher–Yates shuffle
    const arr = [...array]; // copy so original is not mutated
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function allSameCategory(items) {
    console.log(items.length);
    const firstCategory = items[0].category;
    return items.every(item => item.category === firstCategory);
}

function populateButtons() {
    const buttons = Array.from(document.querySelectorAll('.game-button'));

    // Step 1: get all unsubmitted items
    const availableItems = gameState.items.filter(item => !item.submitted);

    // Step 2: shuffle them so each game starts randomized
    const shuffledItems = shuffleArray(availableItems);

    // Step 3: assign shuffled items to the buttons
    buttons.forEach((btn, index) => {
        const item = shuffledItems[index];

        if (item) {
            btn.textContent = item.text;
            btn.dataset.category = item.category;
            btn.classList.remove('selected');
        } else {
            // If there are fewer items than buttons, clear the extra buttons
            btn.textContent = '';
            btn.dataset.category = '';
            btn.classList.remove('selected');
        }
    });

    updateButtons();
}

function getNextHiddenGameBar() {
    return Array.from(gameBars)
        .sort((a, b) => a.dataset.gameBar - b.dataset.gameBar)
        .find(bar => bar.classList.contains('hidden'));
}

function submitSelections() {
    const selectedButtons = Array.from(document.querySelectorAll('.game-button.selected'));
    if (selectedButtons.length !== 4) return;

    // Map selected buttons to gameState items
    const selectedItems = selectedButtons.map(btn =>
        gameState.items.find(item => item.text === btn.textContent && !item.submitted)
    );

    if (!allSameCategory(selectedItems)) {
        handleIncorrectSelection(selectedButtons);
    } else {
        handleCorrectSelection(selectedButtons, selectedItems);
    }
}

function initializeSubmittedGroups() {
    // Group completed items by category
    const completedGroups = {};
    gameState.items.forEach(item => {
        if (item.completed) {
            if (!completedGroups[item.category]) {
                completedGroups[item.category] = [];
            }
            completedGroups[item.category].push(item);
        }
    });

    // Get all game bars in order
    const bars = Array.from(gameBars);

    // Iterate over each group and update completed buttons
    Object.values(completedGroups).forEach((group, index) => {
        if (group.length === 4) {
            // Find buttons corresponding to the completed items
            const completedButtons = group.map(item =>
                Array.from(document.querySelectorAll('.game-button')).find(btn => btn.textContent === item.text)
            );

            // Call updateSubmittedButtons for the group
            updateSubmittedButtons(completedButtons, group);
        }
    });

    storeGameStateData();
}

// Handles incorrect selections: shake buttons, clear selection, then update buttons
function handleIncorrectSelection(selectedButtons) {
    let finished = 0;
    selectedButtons.forEach(btn => {
        btn.classList.add("shake");
        btn.addEventListener("animationend", () => {
            btn.classList.remove("shake");
            btn.classList.remove("selected");

            finished++;
            if (finished === selectedButtons.length) {
                // After all shakes finish, update buttons
                updateButtons();
            }
        }, { once: true });
    });

    gameState.remainingFailures--;
    storeGameStateData();

    updateRemainingFailuresDisplay();

    if (gameState.remainingFailures === 0) {
        // Game over logic here
        EndGame(false);
    }
}

function updateRemainingFailuresDisplay() {
    for (let i = 0; i < mistakeIndicators.length; i++) {
        if (i >= gameState.remainingFailures) {
            mistakeIndicators[i].classList.add("hidden");
        }
    }
 }

function EndGame(isWin) {
    // Disable all buttons
    disableAllGameButtons();

    if (isWin) {
        // Handle win logic
        showAlert("You Win!");
    } else {
        // Handle loss logic
        showAlert("Game Over!");
        showAnswers();
    }

    gameState.isComplete = true;
    gameState.isWin = isWin;
    storeGameStateData();
}

function showAnswers() {
    // Handle loss logic
    // Update header text
    const headerText = document.querySelector("[data-game-header-info]");
    headerText.textContent = "Answers";

    // Show remaining categories in hidden bars
    const remainingCategories = new Set();
    gameState.items.forEach(item => {
        if (!item.completed) {
            remainingCategories.add(item.category);
        }
    });
    const remainingCats = Array.from(remainingCategories);
    let catIndex = 0;
    gameBars.forEach(bar => {
        if (bar.classList.contains('hidden') && catIndex < remainingCats.length) {
            const cat = remainingCats[catIndex];
            const catItems = gameState.items.filter(item => item.category === cat && !item.completed);
            const words = catItems.map(item => item.text);
            bar.innerHTML = `<b>${cat.toUpperCase()}</b><br>${words.join(', ')}`;
            bar.classList.add(catItems[0].colour);
            bar.classList.remove('hidden');
            catIndex++;
        }
    });
}

function disableAllGameButtons() {
    for (let button of document.querySelectorAll('.game-button')) {
        button.classList.add('submitted');
    }

    clearButton.classList.add('disabled');
    submitButton.classList.add('disabled');
    shuffleButton.classList.add('disabled');
 }

// Handles correct selections: move buttons to row, mark submitted, show bar, shuffle remaining
function handleCorrectSelection(selectedButtons, selectedItems) {
    updateSubmittedButtons(selectedButtons, selectedItems);
    storeGameStateData();

    // Mark items as completed
    selectedItems.forEach(item => {
        item.completed = true;
    });

    gameState.submittedCount++;
    storeGameStateData();

    if (gameState.submittedCount === 1) {
        gameState.firstColour = selectedItems[0].colour;
        storeGameStateData();
    }

    if (gameState.submittedCount >= gameState.items.length / 4) {
        // All items submitted, player wins
        EndGame(true);
        return;
    }

    // Shuffle remaining unsubmitted items into empty buttons
    shuffleButtons();
}

function updateSubmittedButtons(selectedButtons, selectedItems) {
    // Get next hidden bar
    const bar = getNextHiddenGameBar();
    if (!bar) return;

    const barIndex = Array.from(gameBars).indexOf(bar);
    const buttons = Array.from(document.querySelectorAll('.game-button'));
    const rowButtons = buttons.slice(barIndex * 4, barIndex * 4 + 4);

    // Move selected buttons to the row corresponding to the bar
    selectedItems.forEach((item, i) => {
        const targetBtn = rowButtons[i];
        const originalBtn = selectedButtons[i];

        const tempText = targetBtn.textContent;
        const tempCategory = targetBtn.dataset.category;

        // Swap content
        targetBtn.textContent = originalBtn.textContent;
        targetBtn.dataset.category = originalBtn.dataset.category;
        targetBtn.classList.remove('selected');

        // Swap content back to original button
        originalBtn.textContent = tempText;
        originalBtn.dataset.category = tempCategory;
        originalBtn.classList.remove('selected');

        // Mark completed
        item.submitted = true;
        item.completed = true;
        
        targetBtn.classList.add('submitted');

        // Clear original button
        originalBtn.classList.remove('selected');
    });

    // Show the category bar
    const category = selectedItems[0].category;
    const words = selectedItems.map(item => item.text);
    bar.innerHTML = `<b>${category.toUpperCase()}</b><br>${words.join(', ')}`;
    bar.classList.add(selectedItems[0].colour);
    bar.classList.remove('hidden');
}


function shuffleButtons() {
    const buttons = Array.from(document.querySelectorAll('.game-button'));

    // Step 1: save currently selected items (objects, not just text)
    const selectedItems = buttons
        .filter(btn => btn.classList.contains('selected'))
        .map(btn => gameState.items.find(item => item.text === btn.textContent));

    // Step 2: get all unsubmitted items
    const remainingItems = gameState.items.filter(item => !item.completed);

    // Step 3: shuffle remaining items
    const shuffledItems = shuffleArray(remainingItems);

    // Step 4: assign shuffled items only to buttons that are not submitted
    buttons.forEach(btn => {
        const currentItem = gameState.items.find(it => it.text === btn.textContent);
        if (!currentItem || !currentItem.submitted) {
            const newItem = shuffledItems.shift();
            if (newItem) {
                btn.textContent = newItem.text;
                btn.dataset.category = newItem.category;
            } else {
                btn.textContent = '';
                btn.dataset.category = '';
            }
            btn.classList.remove('selected'); // clear selection for now
        }
    });

    // Step 5: reapply selected status
    buttons.forEach(btn => {
        const item = gameState.items.find(it => it.text === btn.textContent);
        if (selectedItems.includes(item)) {
            btn.classList.add('selected');
        }
    });

    // Step 6: update buttons UI
    updateButtons();
}