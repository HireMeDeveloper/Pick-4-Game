const clearButton = document.querySelector('[data-deselect-button]');
const submitButton = document.querySelector('[data-submit-button]'); 
const shuffleButton = document.querySelector('[data-shuffle-button]'); 

const gameBars = document.querySelectorAll('[data-game-bar]');
const mistakeIndicators = document.querySelectorAll('[data-mistake-indicator]');

const GAME_BAR_COLOUR_CLASSES = ['green', 'lime', 'lilac', 'orange'];
const GAME_TEXT_FIT_EPSILON = 1;

let scheduledGameTextFitFrame = null;

hasStartedGameLogic = false;

function fitTextToContainer(element, maxFontSize, minFontSize, step = 0.02) {
    if (!element || element.clientWidth === 0 || element.clientHeight === 0) return;

    let fontSize = maxFontSize;
    element.style.fontSize = `${fontSize}em`;

    while (
        fontSize > minFontSize
        && (
            element.scrollWidth > element.clientWidth + GAME_TEXT_FIT_EPSILON
            || element.scrollHeight > element.clientHeight + GAME_TEXT_FIT_EPSILON
        )
    ) {
        fontSize = Math.max(minFontSize, Number((fontSize - step).toFixed(2)));
        element.style.fontSize = `${fontSize}em`;

        if (fontSize === minFontSize) break;
    }
}

function fitGameButtonText(button) {
    fitTextToContainer(button, 0.9, 0.52);
}

function fitGameBarText(bar) {
    const titleElement = bar.querySelector('.game-bar-title');
    const wordsElement = bar.querySelector('.game-bar-words');

    fitTextToContainer(titleElement, 1, 0.52);
    fitTextToContainer(wordsElement, 0.82, 0.48);
}

function fitAllGameText() {
    document.querySelectorAll('.game-button').forEach(fitGameButtonText);
    gameBars.forEach(fitGameBarText);
}

function scheduleGameTextFit() {
    if (scheduledGameTextFitFrame !== null) {
        cancelAnimationFrame(scheduledGameTextFitFrame);
    }

    scheduledGameTextFitFrame = requestAnimationFrame(() => {
        scheduledGameTextFitFrame = null;
        fitAllGameText();
    });
}

function getDisplayCategoryName(category) {
    const normalizedCategory = String(category || '').replace(/_/g, ' ');

    let displayCategory = '';
    let shouldCapitalize = true;

    for (const character of normalizedCategory) {
        if (shouldCapitalize && /[a-zA-Z]/.test(character)) {
            displayCategory += character.toUpperCase();
            shouldCapitalize = false;
            continue;
        }

        displayCategory += character;

        if (/\s|[\-\/([{"]/.test(character)) {
            shouldCapitalize = true;
        } else if (character !== "'") {
            shouldCapitalize = false;
        }
    }

    return displayCategory;
}

function renderGameBar(bar, category, words, fallbackColour, emphasize = false) {
    if (!bar) return;

    const resolvedColour = typeof window.resolveCategoryColour === 'function'
        ? window.resolveCategoryColour(category, fallbackColour)
        : fallbackColour;
    const backgroundColour = typeof window.getGameBarColourValue === 'function'
        ? window.getGameBarColourValue(resolvedColour)
        : '';

    const titleElement = document.createElement('div');
    titleElement.className = 'game-bar-title';
    titleElement.textContent = getDisplayCategoryName(category);

    const wordsElement = document.createElement('div');
    wordsElement.className = 'game-bar-words';
    wordsElement.textContent = words.join(', ');

    bar.replaceChildren(titleElement, wordsElement);
    bar.classList.remove(...GAME_BAR_COLOUR_CLASSES);
    if (resolvedColour) {
        bar.classList.add(resolvedColour);
        bar.dataset.barColour = resolvedColour;
    } else {
        delete bar.dataset.barColour;
    }

    if (backgroundColour) {
        bar.style.backgroundColor = backgroundColour;
    } else {
        bar.style.removeProperty('background-color');
    }

    bar.dataset.barCategory = category;

    bar.classList.remove('hidden');
    bar.classList.remove('emphasize');

    if (emphasize) {
        void bar.offsetWidth;
        bar.classList.add('emphasize');
    }

    scheduleGameTextFit();
}

function hideButtonsForRow(rowIndex) {
    const buttons = Array.from(document.querySelectorAll('.game-button'));
    const rowButtons = buttons.slice(rowIndex * 4, rowIndex * 4 + 4);

    rowButtons.forEach(button => {
        button.classList.add('hidden');
        button.classList.add('submitted');
        button.classList.remove('selected');
    });
}

function showAllGameButtons() {
    document.querySelectorAll('.game-button').forEach(button => {
        button.classList.remove('hidden');
    });
}

function resetGameLogic() {
    hasStartedGameLogic = false;

    gameBars.forEach(bar => {
        bar.replaceChildren();
        bar.classList.remove(...GAME_BAR_COLOUR_CLASSES);
        bar.style.removeProperty('background-color');
        bar.classList.add('hidden');
        delete bar.dataset.barCategory;
        delete bar.dataset.barColour;
    });

    mistakeIndicators.forEach(indicator => {
        indicator.classList.remove('used');
    });

    document.querySelectorAll('.game-button').forEach(btn => {
        btn.classList.remove('selected', 'submitted', 'tile', 'hidden');
        btn.style.removeProperty('transform');
    });
}

function startupGameLogic() {
    if (hasStartedGameLogic) return;
    hasStartedGameLogic = true;

    window.addEventListener('resize', scheduleGameTextFit);

    fireEvent("onGameStart");

    gameState.hasOpenedPuzzle = true
    storeGameStateData()

    // Setup event listeners for game buttons (clone to remove any prior listeners)
    document.querySelectorAll('.game-button').forEach(button => {
        const fresh = button.cloneNode(true);
        button.replaceWith(fresh);
        fresh.addEventListener('click', () => {
            if (fresh.classList.contains('submitted')) return;

            // Count selected buttons
            const beforeCount = document.querySelectorAll('.game-button.selected').length;

            // Can only select 4 elements
            if (beforeCount < 4 || fresh.classList.contains('selected')) {
                fresh.classList.toggle('selected');
            }

            updateButtons();
        });
    });

    // Setup shuffle button (remove first to avoid duplicate listeners)
    shuffleButton.removeEventListener('click', shuffleButtons);
    shuffleButton.addEventListener('click', shuffleButtons);

    populateButtons();
    showAllGameButtons();
    document.querySelectorAll('.game-button').forEach(btn => btn.classList.add('tile'));
    updateRemainingFailuresDisplay();
    initializeSubmittedGroups();
    scheduleGameTextFit();

    if (gameState.isComplete) {
        disableAllGameButtons();
        showAnswers(false);
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
            btn.textContent = item.text.trim();
            btn.dataset.category = item.category;
            btn.dataset.itemIndex = gameState.items.indexOf(item);
            btn.classList.remove('selected');
        } else {
            // If there are fewer items than buttons, clear the extra buttons
            btn.textContent = '';
            btn.dataset.category = '';
            btn.classList.remove('selected');
        }
    });

    updateButtons();
    scheduleGameTextFit();
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
        gameState.items.find(item => item.text.trim() === btn.textContent.trim() && !item.submitted)
    );

    const guess = selectedItems.map(item => item.text).sort();

    if (gameState.incorrectGuesses.some(g => JSON.stringify(g) === JSON.stringify(guess))) {
        showAlert("Already guessed");
        return;
    }

    if (!allSameCategory(selectedItems)) {
        // Determine message
        const categories = selectedItems.map(item => item.category);
        const categoryCounts = {};
        categories.forEach(cat => categoryCounts[cat] = (categoryCounts[cat] || 0) + 1);
        const counts = Object.values(categoryCounts);
        let message = "";
        if (counts.includes(3) && counts.includes(1)) {
            message = "One away...";
        } else {
            message = "Incorrect";
        }
        // Add to incorrect guesses
        gameState.incorrectGuesses.push(guess);
        gameState.consecutiveCorrect = 0;
        storeGameStateData();
        handleIncorrectSelection(selectedButtons, message);
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
    const orderedCategories = Object.keys(puzzles[targetPuzzleIndex] || {}).filter(category => completedGroups[category]);

    // Iterate over each group and show the bars
    orderedCategories.forEach((category, index) => {
        const group = completedGroups[category];
        if (group.length === 4) {
            const bar = bars[index];
            if (bar) {
                const words = group.map(item => item.text);
                renderGameBar(bar, category, words, group[0].colour);
                hideButtonsForRow(index);
            }
        }
    });

    storeGameStateData();
}

// Handles incorrect selections: shake buttons, keep selection, then update buttons
function handleIncorrectSelection(selectedButtons, message) {
    let finished = 0;
    selectedButtons.forEach(btn => {
        btn.classList.add("shake");
        btn.addEventListener("animationend", () => {
            btn.classList.remove("shake");
            // Keep selections so user can modify

            finished++;
            if (finished === selectedButtons.length) {
                // After all shakes finish, update buttons
                updateButtons();
                setTimeout(() => {
                    gameState.remainingFailures--;
                    const selectedItems = selectedButtons.map(button => {
                        const itemIndex = parseInt(button.dataset.itemIndex);
                        return gameState.items[itemIndex];
                    });
                    gameState.attempts.push({colors: selectedItems.map(item => item.colour)});
                    storeGameStateData();
                    updateRemainingFailuresDisplay();
                    if (gameState.remainingFailures === 0) {
                        // Game over logic here
                        EndGame(false);
                    } else {
                        showAlert(message);
                    }
                }, 200);
            }
        }, { once: true });
    });
}

function updateRemainingFailuresDisplay() {
    for (let i = 0; i < mistakeIndicators.length; i++) {
        if (i >= gameState.remainingFailures) {
            mistakeIndicators[i].classList.add("hidden");
        } else {
            mistakeIndicators[i].classList.remove("hidden");
        }
    }
 }

function EndGame(isWin) {
    if (typeof completePlayTimeTracking === 'function') {
        completePlayTimeTracking();
    }

    // Disable all buttons
    disableAllGameButtons();

    if (isWin) {
        // Handle win logic
        showAlert("You Win!", true, 5000);
    } else {
        // Handle loss logic
        showAlert("Better luck next time!", false, 5000);
    }

    showAnswers(true);

    gameState.isComplete = true;
    gameState.isWin = isWin;
    storeGameStateData();

    fireEvent("onCompletion");

    // After 6 seconds (to allow time for all staggered bars to show), go to stats page
    setTimeout(() => showPage("stats"), 6000);
}

function showAnswers(staggered = false) {
    // Update header text
    const headerText = document.querySelector("[data-game-header-info]");
    headerText.textContent = "Answers";

    // Categories are already in puzzle difficulty order.
    const allCats = Object.keys(puzzles[targetPuzzleIndex] || {});
    const completedCats = allCats.filter(cat =>
        gameState.items
            .filter(item => item.category === cat)
            .every(item => item.completed)
    );
    const unresolvedCats = allCats.filter(cat => !completedCats.includes(cat));

    if (staggered) {
        unresolvedCats.forEach((cat, unresolvedIndex) => {
            setTimeout(() => {
                const catItems = gameState.items.filter(item => item.category === cat);
                const buttons = catItems.map(item => {
                    // Find button by item index
                    return document.querySelector(`.game-button[data-item-index="${gameState.items.indexOf(item)}"]`);
                }).filter(btn => btn); // Filter out any nulls

                const targetRowIndex = completedCats.length + unresolvedIndex;

                // Animate the row to position
                animateRowToPosition(buttons, targetRowIndex);

                // After animation completes (including reset), show the bar
                setTimeout(() => {
                    const bar = gameBars[targetRowIndex];
                    if (bar) {
                        const words = catItems.map(item => item.text);
                        renderGameBar(bar, cat, words, catItems[0].colour, true);
                        hideButtonsForRow(targetRowIndex);
                    }

                    // After the last bar is shown, reorder all bars to difficulty order
                    if (unresolvedIndex === unresolvedCats.length - 1) {
                        setTimeout(() => reorderBarsToDifficultyOrder(), 500);
                    }
                }, 600); // Wait for full animation + reset
            }, unresolvedIndex * 1500); // 1.5s delay between rows
        });
    } else {
        let catIndex = 0;
        gameBars.forEach(bar => {
            if (catIndex < allCats.length) {
                const cat = allCats[catIndex];
                const catItems = gameState.items.filter(item => item.category === cat);
                const words = catItems.map(item => item.text);
                renderGameBar(bar, cat, words, catItems[0].colour, true);
                hideButtonsForRow(catIndex);
                catIndex++;
            }
        });
    }
}

function reorderBarsToDifficultyOrder() {
    const allCats = Object.keys(puzzles[targetPuzzleIndex] || {});
    const bars = Array.from(gameBars);

    // Snapshot current content of each bar
    const barSnapshots = bars.map(bar => {
        const titleEl = bar.querySelector('.game-bar-title');
        const wordsEl = bar.querySelector('.game-bar-words');
        return {
            category: bar.dataset.barCategory || null,
            barColour: bar.dataset.barColour || null,
            bgColor: bar.style.backgroundColor,
            colourClass: ['green', 'lime', 'lilac', 'orange'].find(c => bar.classList.contains(c)) || null,
            titleText: titleEl ? titleEl.textContent : '',
            wordsText: wordsEl ? wordsEl.textContent : ''
        };
    });

    // Build the target content order aligned to allCats difficulty order
    const targetSnapshots = allCats.map(cat => barSnapshots.find(s => s.category === cat) || null);

    // Check if already in correct order — skip animation if so
    const alreadyOrdered = allCats.every((cat, i) => barSnapshots[i]?.category === cat);
    if (alreadyOrdered) return;

    // Phase 1: record start positions of each bar (FLIP — record)
    const overlayGrid = document.querySelector('.overlay-grid');
    const gridRect = overlayGrid.getBoundingClientRect();
    const startY = bars.map(bar => bar.getBoundingClientRect().top - gridRect.top);

    // Phase 2: swap content into target order (instantaneous DOM update)
    bars.forEach((bar, i) => {
        const snap = targetSnapshots[i];
        if (!snap) return;

        const titleEl = bar.querySelector('.game-bar-title');
        const wordsEl = bar.querySelector('.game-bar-words');

        bar.dataset.barCategory = snap.category;
        bar.dataset.barColour = snap.barColour;
        bar.style.backgroundColor = snap.bgColor;
        bar.classList.remove('green', 'lime', 'lilac', 'orange');
        if (snap.colourClass) bar.classList.add(snap.colourClass);
        if (titleEl) titleEl.textContent = snap.titleText;
        if (wordsEl) wordsEl.textContent = snap.wordsText;
    });

    // Phase 3: compute end positions after swap and apply reverse transforms (FLIP — invert)
    const endY = bars.map(bar => bar.getBoundingClientRect().top - gridRect.top);

    bars.forEach((bar, i) => {
        const sourceIndex = barSnapshots.findIndex(s => s.category === targetSnapshots[i]?.category);
        if (sourceIndex === -1) return;

        const deltaY = startY[sourceIndex] - endY[i];
        if (deltaY === 0) return;

        bar.style.transition = 'none';
        bar.style.transform = `translateY(${deltaY}px)`;
    });

    // Force reflow so transforms are applied before animating
    bars.forEach(bar => bar.offsetHeight);

    // Phase 4: animate to final position (FLIP — play)
    requestAnimationFrame(() => {
        bars.forEach(bar => {
            bar.style.transition = 'transform 0.6s ease';
            bar.style.transform = '';
        });

        setTimeout(() => {
            bars.forEach(bar => {
                bar.style.transition = '';
                bar.style.transform = '';
            });
            document.querySelectorAll('.game-button').forEach(btn => btn.classList.add('hidden'));
            scheduleGameTextFit();
        }, 650);
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
    // Add dance animation with stagger
    const allButtons = Array.from(document.querySelectorAll('.game-button'));
    const sortedSelected = selectedButtons.sort((a, b) => allButtons.indexOf(a) - allButtons.indexOf(b));
    const delayStep = 100; // ms between each button starting dance
    const totalDelay = (sortedSelected.length - 1) * delayStep + 500; // 500 is animation duration

    sortedSelected.forEach((btn, i) => {
        setTimeout(() => {
            btn.classList.add('dance');
            setTimeout(() => btn.classList.remove('dance'), 500);
        }, i * delayStep);
    });

    gameState.consecutiveCorrect++;

    setTimeout(() => {
        updateSubmittedButtons(selectedButtons, selectedItems);
        storeGameStateData();

        if (gameState.consecutiveCorrect === 1) {
            showAlert("Well done", false, 2000);
        } else if (gameState.consecutiveCorrect === 2) {
            showAlert("Amazing", false, 2000);
        } else if (gameState.consecutiveCorrect === 3) {
            showAlert("Genius", false, 2000);
        }

        // Mark items as completed
        selectedItems.forEach(item => {
            item.completed = true;
        });

        gameState.submittedCount++;
        gameState.attempts.push({colors: selectedItems.map(item => item.colour)});
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
    }, totalDelay);
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
        targetBtn.textContent = originalBtn.textContent.trim();
        targetBtn.dataset.category = originalBtn.dataset.category;
        targetBtn.classList.remove('selected');

        // Swap content back to original button
        originalBtn.textContent = tempText.trim();
        originalBtn.dataset.category = tempCategory;
        originalBtn.classList.remove('selected');

        // Mark completed
        item.submitted = true;
        item.completed = true;
        
        targetBtn.classList.add('submitted');

        // Clear original button
        originalBtn.classList.remove('selected');

        fitGameButtonText(targetBtn);
        fitGameButtonText(originalBtn);
    });

    // Show the category bar
    const category = selectedItems[0].category;
    const words = selectedItems.map(item => item.text);
    renderGameBar(bar, category, words, selectedItems[0].colour, true);
    hideButtonsForRow(barIndex);
}


function shuffleButtons() {
    const buttons = Array.from(document.querySelectorAll('.game-button'));

    // Step 1: save currently selected items (objects, not just text)
    const selectedItems = buttons
        .filter(btn => btn.classList.contains('selected'))
        .map(btn => gameState.items.find(item => item.text.trim() === btn.textContent.trim()));

    // Step 2: get all unsubmitted items
    const remainingItems = gameState.items.filter(item => !item.completed);

    // Step 3: shuffle remaining items
    const shuffledItems = shuffleArray(remainingItems);

    // Step 4: assign shuffled items only to buttons not behind a placed bar
    buttons.forEach(btn => {
        const currentItem = gameState.items.find(it => it.text.trim() === btn.textContent.trim());
        if (!currentItem || !currentItem.completed) {
            const newItem = shuffledItems.shift();
            if (newItem) {
                btn.textContent = newItem.text.trim();
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
    scheduleGameTextFit();
}

// Animated shuffle for a specific row: Move correct buttons to the target row (without showing bar)
function animateRowToPosition(correctButtons, targetRowIndex) {
    if (correctButtons.length !== 4) return; // Ensure exactly 4 buttons

    const grid = document.querySelector('.game-grid');
    const allButtons = Array.from(grid.children);
    const rowStartIndex = targetRowIndex * 4;
    const animationDuration = 500;

    // Get positions before animation
    const getPosition = (button) => {
        const gridRect = grid.getBoundingClientRect();
        const rect = button.getBoundingClientRect();
        return {
            x: rect.left - gridRect.left,
            y: rect.top - gridRect.top
        };
    };

    const startPositions = new Map(allButtons.map(button => [button, getPosition(button)]));
    const slotPositions = allButtons.map(button => startPositions.get(button));
    const finalOrder = [...allButtons];

    // Keep rows with already-shown bars fixed by only shuffling the unresolved section.
    const movableOrder = finalOrder.slice(rowStartIndex);
    for (let i = 0; i < 4; i++) {
        const desiredButton = correctButtons[i];
        const currentPoolIndex = movableOrder.indexOf(desiredButton);

        if (currentPoolIndex === -1 || currentPoolIndex === i) continue;

        [movableOrder[i], movableOrder[currentPoolIndex]] = [movableOrder[currentPoolIndex], movableOrder[i]];
    }

    for (let i = 0; i < movableOrder.length; i++) {
        finalOrder[rowStartIndex + i] = movableOrder[i];
    }

    // Animate each tile directly to its unique final slot position
    allButtons.forEach((button) => {
        const fromPos = startPositions.get(button);
        const toIndex = finalOrder.indexOf(button);
        const toPos = slotPositions[toIndex];

        if (!fromPos || !toPos) return;

        const deltaX = toPos.x - fromPos.x;
        const deltaY = toPos.y - fromPos.y;

        if (deltaX === 0 && deltaY === 0) {
            button.style.transition = '';
            button.style.transform = '';
            return;
        }

        button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        button.style.transition = 'transform 0.5s ease';
    });

    // After animation, commit DOM order so next row uses accurate tile positions
    setTimeout(() => {
        finalOrder.forEach(button => grid.appendChild(button));

        allButtons.forEach((button) => {
            button.style.transition = '';
            button.style.transform = '';
        });

        const committedRowButtons = finalOrder.slice(rowStartIndex, rowStartIndex + 4);
        committedRowButtons.forEach(button => {
            button.classList.add('hidden');
            button.classList.add('submitted');
            button.classList.remove('selected');
        });
    }, animationDuration + 20);
}

// Animated shuffle for a specific row: Move correct buttons to the target row, then show the bar
function animateRowShuffle(correctButtons, targetRowIndex) {
    animateRowToPosition(correctButtons, targetRowIndex);

    // After animation, show the bar
    setTimeout(() => {
        const bar = document.querySelector(`[data-game-bar="${targetRowIndex + 1}"]`);
        if (bar) {
            bar.classList.remove('hidden');
        }
    }, 500);
}