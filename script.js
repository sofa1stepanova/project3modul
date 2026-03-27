document.addEventListener('DOMContentLoaded', () => {
    const block1 = document.getElementById('block_1');
    const block2 = document.getElementById('block_2');

    const existingSquares = block1.querySelectorAll('.fly-square');
    existingSquares.forEach(sq => sq.remove());

    block1.style.position = 'relative';
    block1.style.overflow = 'hidden';

    block2.style.position = 'relative';
    block2.style.overflow = 'hidden';
    
    const imagePaths = [
        "assets/клубника.png",
        "assets/яблоко.png",
        "assets/банан.png",
        "assets/апельсин.png",
        "assets/яблоко.png"
    ];

    const sizes = [95, 200, 300, 200, 170];
    const squares = [];
    let wobbleAnimations = [];
    
    const gameImages = [
        "assets/яблоко.png", 
        "assets/апельсин.png", 
        "assets/банан.png", 
        "assets/клубника.png", 
        "assets/мусор.png", 
        "assets/огрызок.png" 
    ];

    let currentCardIndex = 0;
    let leftCount = 0;
    let rightCount = 0;
    let gameActive = false;
    let currentFlyingCard = null;
    let leftZone = null;
    let rightZone = null;
    let leftCardsContainer = null;
    let rightCardsContainer = null;

    const getBlock2Center = () => {
        const width = block2.clientWidth;
        const height = block2.clientHeight;
        return {
            x: width / 2,
            y: height / 2
        };
    };

    const createSortingZones = () => {
        const oldLeftZone = document.getElementById('left-zone');
        const oldRightZone = document.getElementById('right-zone');
        if (oldLeftZone) oldLeftZone.remove();
        if (oldRightZone) oldRightZone.remove();

        leftZone = document.createElement('div');
        leftZone.id = 'left-zone';
        leftZone.style.position = 'absolute';
        leftZone.style.left = '20px';
        leftZone.style.top = '50%';
        leftZone.style.transform = 'translateY(-50%)';
        leftZone.style.width = '280px';
        leftZone.style.minHeight = '80%';
        leftZone.style.backgroundColor = 'rgba(100, 200, 100, 0.25)';
        leftZone.style.border = '3px dashed #4caf50';
        leftZone.style.borderRadius = '20px';
        leftZone.style.display = 'flex';
        leftZone.style.flexDirection = 'column';
        leftZone.style.alignItems = 'center';
        leftZone.style.zIndex = '100';
        leftZone.style.fontFamily = 'Arial';
        leftZone.style.padding = '15px';
        leftZone.style.backdropFilter = 'blur(2px)';

        const leftTitle = document.createElement('div');
        leftTitle.style.backgroundColor = 'rgba(0,0,0,0.6)';
        leftTitle.style.padding = '8px 15px';
        leftTitle.style.borderRadius = '10px';
        leftTitle.style.color = '#4caf50';
        leftTitle.style.fontWeight = 'bold';
        leftTitle.style.marginBottom = '15px';
        leftTitle.style.width = '100%';
        leftTitle.style.textAlign = 'center';
        leftTitle.innerHTML = `СЮДА (0/4)`;
        leftTitle.id = 'left-title';

        leftCardsContainer = document.createElement('div');
        leftCardsContainer.id = 'left-cards';
        leftCardsContainer.style.display = 'flex';
        leftCardsContainer.style.flexWrap = 'wrap';
        leftCardsContainer.style.gap = '10px';
        leftCardsContainer.style.justifyContent = 'center';
        leftCardsContainer.style.alignItems = 'center';
        leftCardsContainer.style.minHeight = '400px';
        leftCardsContainer.style.width = '100%';

        leftZone.appendChild(leftTitle);
        leftZone.appendChild(leftCardsContainer);

        rightZone = document.createElement('div');
        rightZone.id = 'right-zone';
        rightZone.style.position = 'absolute';
        rightZone.style.right = '20px';
        rightZone.style.top = '50%';
        rightZone.style.transform = 'translateY(-50%)';
        rightZone.style.width = '280px';
        rightZone.style.minHeight = '80%';
        rightZone.style.backgroundColor = 'rgba(255, 150, 100, 0.25)';
        rightZone.style.border = '3px dashed #ff9800';
        rightZone.style.borderRadius = '20px';
        rightZone.style.display = 'flex';
        rightZone.style.flexDirection = 'column';
        rightZone.style.alignItems = 'center';
        rightZone.style.zIndex = '100';
        rightZone.style.fontFamily = 'Arial';
        rightZone.style.padding = '15px';
        rightZone.style.backdropFilter = 'blur(2px)';

        const rightTitle = document.createElement('div');
        rightTitle.style.backgroundColor = 'rgba(0,0,0,0.6)';
        rightTitle.style.padding = '8px 15px';
        rightTitle.style.borderRadius = '10px';
        rightTitle.style.color = '#ff9800';
        rightTitle.style.fontWeight = 'bold';
        rightTitle.style.marginBottom = '15px';
        rightTitle.style.width = '100%';
        rightTitle.style.textAlign = 'center';
        rightTitle.innerHTML = `СЮДА (0/2)`;
        rightTitle.id = 'right-title';

        rightCardsContainer = document.createElement('div');
        rightCardsContainer.id = 'right-cards';
        rightCardsContainer.style.display = 'flex';
        rightCardsContainer.style.flexWrap = 'wrap';
        rightCardsContainer.style.gap = '10px';
        rightCardsContainer.style.justifyContent = 'center';
        rightCardsContainer.style.alignItems = 'center';
        rightCardsContainer.style.minHeight = '400px';
        rightCardsContainer.style.width = '100%';

        rightZone.appendChild(rightTitle);
        rightZone.appendChild(rightCardsContainer);

        block2.appendChild(leftZone);
        block2.appendChild(rightZone);

        return { leftZone, rightZone };
    };

    const updateZoneCounters = () => {
        const leftTitle = document.getElementById('left-title');
        const rightTitle = document.getElementById('right-title');
        if (leftTitle) leftTitle.innerHTML = `СЮДА (${leftCount}/4)`;
        if (rightTitle) rightTitle.innerHTML = `СЮДА (${rightCount}/2)`;
    };

    const addCardToZone = (zone, cardImage, cardIndex) => {
        const card = document.createElement('div');
        const size = 100;
        card.style.width = `${size}px`;
        card.style.height = `${size}px`;
        card.style.backgroundImage = `url('${cardImage}')`;
        card.style.backgroundSize = 'contain';
        card.style.backgroundPosition = 'center';
        card.style.backgroundRepeat = 'no-repeat';
        card.style.borderRadius = '12px';
        card.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
        card.style.animation = 'cardLand 0.3s ease-out';

        if (zone === 'left') {
            leftCardsContainer.appendChild(card);
        } else {
            rightCardsContainer.appendChild(card);
        }

        if (!document.querySelector('#card-animation-style')) {
            const style = document.createElement('style');
            style.id = 'card-animation-style';
            style.textContent = `
                @keyframes cardLand {
                    0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    };

    const showErrorMessage = () => {
        const errorMsg = document.createElement('div');
        errorMsg.id = 'error-message';
        errorMsg.innerHTML = ':(';
        errorMsg.style.position = 'absolute';
        errorMsg.style.top = '50%';
        errorMsg.style.left = '50%';
        errorMsg.style.transform = 'translate(-50%, -50%)';
        errorMsg.style.backgroundColor = 'rgba(0,0,0,0.9)';
        errorMsg.style.color = '#ff4444';
        errorMsg.style.fontSize = '80px';
        errorMsg.style.fontWeight = 'bold';
        errorMsg.style.padding = '30px 50px';
        errorMsg.style.borderRadius = '30px';
        errorMsg.style.zIndex = '200';
        errorMsg.style.fontFamily = 'Arial';
        errorMsg.style.textAlign = 'center';
        errorMsg.style.cursor = 'pointer';
        errorMsg.style.animation = 'shake 0.3s ease';

        errorMsg.addEventListener('click', () => {
            errorMsg.remove();
        });

        setTimeout(() => {
            if (errorMsg.parentNode) errorMsg.remove();
        }, 1500);

        block2.appendChild(errorMsg);

        if (!document.querySelector('#shake-style')) {
            const style = document.createElement('style');
            style.id = 'shake-style';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translate(-50%, -50%) translateX(0); }
                    25% { transform: translate(-50%, -50%) translateX(-10px); }
                    75% { transform: translate(-50%, -50%) translateX(10px); }
                }
            `;
            document.head.appendChild(style);
        }
    };

    const showWinMessage = () => {
        gameActive = false;

        const winMessage = document.createElement('div');
        winMessage.id = 'win-message';
        winMessage.innerHTML = 'ВЫ ОТСОРТИРОВАЛИ ВСЕ ФРУКТЫ, МОЛОДЕЦ!';
        winMessage.style.position = 'absolute';
        winMessage.style.top = '50%';
        winMessage.style.left = '50%';
        winMessage.style.transform = 'translate(-50%, -50%)';
        winMessage.style.backgroundColor = 'rgba(0,0,0,0.9)';
        winMessage.style.color = '#ffd700';
        winMessage.style.fontSize = '24px';
        winMessage.style.fontWeight = 'bold';
        winMessage.style.padding = '20px 40px';
        winMessage.style.borderRadius = '30px';
        winMessage.style.zIndex = '200';
        winMessage.style.fontFamily = 'Arial';
        winMessage.style.textAlign = 'center';
        winMessage.style.boxShadow = '0 0 50px rgba(255,215,0,0.5)';
        winMessage.style.animation = 'bounce 0.5s ease';
        winMessage.style.cursor = 'pointer';

        winMessage.addEventListener('click', () => {
            winMessage.remove();
            if (leftZone) leftZone.remove();
            if (rightZone) rightZone.remove();
        });

        block2.appendChild(winMessage);

        if (!document.querySelector('#bounce-style')) {
            const style = document.createElement('style');
            style.id = 'bounce-style';
            style.textContent = `
                @keyframes bounce {
                    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                    50% { transform: translate(-50%, -50%) scale(1.1); }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    };

    const showNextCard = () => {
        if (currentCardIndex >= 6) {
            if (leftCount === 4 && rightCount === 2) {
                showWinMessage();
            }
            return;
        }

        if (currentFlyingCard && currentFlyingCard.parentNode) {
            currentFlyingCard.remove();
        }

        const card = document.createElement('div');
        card.className = 'flying-card';
        card.setAttribute('data-index', currentCardIndex);
        card.setAttribute('draggable', 'true');

        const size = 180;
        card.style.position = 'absolute';
        card.style.width = `${size}px`;
        card.style.height = `${size}px`;
        card.style.backgroundImage = `url('${gameImages[currentCardIndex]}')`;
        card.style.backgroundSize = 'contain';
        card.style.backgroundPosition = 'center';
        card.style.backgroundRepeat = 'no-repeat';
        card.style.cursor = 'grab';
        card.style.zIndex = '150';
        card.style.borderRadius = '15px';
        card.style.filter = 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))';

        const center = getBlock2Center();
        card.style.left = `${center.x - size/2}px`;
        card.style.top = `${center.y - size/2}px`;

        card.style.transform = 'scale(0)';
        card.style.transition = 'transform 0.2s ease-out';

        block2.appendChild(card);

        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 10);

        currentFlyingCard = card;

        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', currentCardIndex);
            e.dataTransfer.effectAllowed = 'move';
            card.style.opacity = '0.5';
        });

        card.addEventListener('dragend', (e) => {
            card.style.opacity = '1';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    };

    const setupDropZones = () => {
        const handleDragOver = (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        };

        const handleLeftDrop = (e) => {
            e.preventDefault();
            if (!gameActive || !currentFlyingCard) return;

            const cardIndex = currentCardIndex;
            const shouldGoLeft = cardIndex < 4;

            if (shouldGoLeft) {
                if (leftCount < 4) {
                    addCardToZone('left', gameImages[cardIndex], cardIndex);
                    currentFlyingCard.remove();
                    leftCount++;
                    updateZoneCounters();
                    currentCardIndex++;

                    if (currentCardIndex >= 6) {
                        if (leftCount === 4 && rightCount === 2) {
                            showWinMessage();
                        }
                    } else {
                        showNextCard();
                    }
                } else {
                    showErrorMessage();
                }
            } else {
                showErrorMessage();
            }
        };

        const handleRightDrop = (e) => {
            e.preventDefault();
            if (!gameActive || !currentFlyingCard) return;

            const cardIndex = currentCardIndex;
            const shouldGoRight = cardIndex >= 4;

            if (shouldGoRight) {
                if (rightCount < 2) {
                    addCardToZone('right', gameImages[cardIndex], cardIndex);
                    currentFlyingCard.remove();
                    rightCount++;
                    updateZoneCounters();
                    currentCardIndex++;

                    if (currentCardIndex >= 6) {
                        if (leftCount === 4 && rightCount === 2) {
                            showWinMessage();
                        }
                    } else {
                        showNextCard();
                    }
                } else {
                    showErrorMessage();
                }
            } else {
                showErrorMessage();
            }
        };

        if (leftZone) {
            leftZone.removeEventListener('dragover', handleDragOver);
            leftZone.removeEventListener('drop', handleLeftDrop);
            leftZone.addEventListener('dragover', handleDragOver);
            leftZone.addEventListener('drop', handleLeftDrop);
        }

        if (rightZone) {
            rightZone.removeEventListener('dragover', handleDragOver);
            rightZone.removeEventListener('drop', handleRightDrop);
            rightZone.addEventListener('dragover', handleDragOver);
            rightZone.addEventListener('drop', handleRightDrop);
        }
    };

    const startGame = () => {
        const oldLeft = document.getElementById('left-zone');
        const oldRight = document.getElementById('right-zone');
        const oldWin = document.getElementById('win-message');
        const oldError = document.getElementById('error-message');
        if (oldLeft) oldLeft.remove();
        if (oldRight) oldRight.remove();
        if (oldWin) oldWin.remove();
        if (oldError) oldError.remove();
        if (currentFlyingCard && currentFlyingCard.parentNode) currentFlyingCard.remove();

        currentCardIndex = 0;
        leftCount = 0;
        rightCount = 0;
        gameActive = true;

        createSortingZones();

        setTimeout(() => {
            setupDropZones();
        }, 100);

        showNextCard();
    };
    
    for (let i = 0; i < 5; i++) {
        const square = document.createElement('div');
        square.className = 'fly-square';

        const size = sizes[i];

        square.style.position = 'absolute';
        square.style.width = `${size}px`;
        square.style.height = `${size}px`;
        square.style.borderRadius = '0px';
        square.style.boxSizing = 'border-box';
        square.style.zIndex = '10';
        square.style.cursor = 'default';
        square.style.overflow = 'visible';
        square.style.backgroundImage = `url('${imagePaths[i]}')`;
        square.style.backgroundSize = 'contain';
        square.style.backgroundPosition = 'center';
        square.style.backgroundRepeat = 'no-repeat';
        square.style.backgroundColor = 'transparent';
        square.style.border = 'none';
        square.style.opacity = '0';
        square.style.transform = 'scale(0)';
        square.style.willChange = 'transform, left, top';

        block1.appendChild(square);
        squares.push(square);
    }

    const getCenterForSquare = (square) => {
        const rect = block1.getBoundingClientRect();
        const width = parseFloat(square.style.width);
        const height = parseFloat(square.style.height);
        return {
            x: rect.width / 2 - width / 2,
            y: rect.height / 2 - height / 2
        };
    };

    const setInitialPositions = () => {
        squares.forEach(square => {
            const center = getCenterForSquare(square);
            square.style.left = `${center.x}px`;
            square.style.top = `${center.y}px`;
            square.style.opacity = '0';
            square.style.transform = 'scale(0)';
        });
    };

    const directions = [
        { x: -280, y: -100, rotate: -38, scale: 1.04 },
        { x: -170, y: -150, rotate: -22, scale: 0.97 },
        { x: 70, y: -170, rotate: 5, scale: 1.01 },
        { x: 220, y: -20, rotate: -8, scale: 0.98 },
        { x: -50, y: 60, rotate: -15, scale: 0.95 }
    ];

    const startDelays = [0, 110, 60, 170, 90];
    const durations = [620, 560, 590, 640, 680];

    const launchSquares = () => {
        squares.forEach((square, idx) => {
            const dir = directions[idx];
            const startDelay = startDelays[idx];
            const duration = durations[idx];

            setTimeout(() => {
                square.style.transition = 'opacity 0.15s ease-out, transform 0.15s ease-out';
                square.style.opacity = '1';
                square.style.transform = 'scale(1)';

                setTimeout(() => {
                    const center = getCenterForSquare(square);
                    const targetX = center.x + dir.x;
                    const targetY = center.y + dir.y;

                    square.style.transition = `left ${duration}ms cubic-bezier(0.32, 1.08, 0.45, 0.98), top ${duration}ms cubic-bezier(0.32, 1.08, 0.45, 0.98), transform ${duration}ms cubic-bezier(0.32, 1.08, 0.45, 0.98)`;
                    square.style.left = `${targetX}px`;
                    square.style.top = `${targetY}px`;
                    square.style.transform = `scale(${dir.scale}) rotate(${dir.rotate}deg)`;

                    square.setAttribute('data-final-left', targetX);
                    square.setAttribute('data-final-top', targetY);
                    square.setAttribute('data-final-scale', dir.scale);
                    square.setAttribute('data-final-rotate', dir.rotate);

                }, 20);

            }, startDelay);
        });
    };

    const startWobble = (square, idx) => {
        const originalRotate = parseFloat(square.getAttribute('data-final-rotate') || 0);
        const originalScale = parseFloat(square.getAttribute('data-final-scale') || 1);

        const speeds = [2800, 2400, 3100, 2700, 2900];
        const amplitudes = [1.8, 2.0, 1.6, 2.2, 1.7];

        let direction = 1;
        let currentOffset = 0;

        const wobbleInterval = setInterval(() => {
            if (Math.abs(currentOffset) >= amplitudes[idx % amplitudes.length]) {
                direction = -direction;
            }
            currentOffset += direction * 0.12;

            const newRotate = originalRotate + currentOffset;
            square.style.transition = `transform 0.05s linear`;
            square.style.transform = `scale(${originalScale}) rotate(${newRotate}deg)`;

        }, speeds[idx % speeds.length] / 60);

        wobbleAnimations.push(wobbleInterval);

        let scaleDirection = 1;
        let currentScaleOffset = 0;

        const scaleWobble = setInterval(() => {
            if (Math.abs(currentScaleOffset) >= 0.01) {
                scaleDirection = -scaleDirection;
            }
            currentScaleOffset += scaleDirection * 0.0007;

            const currentRotate = parseFloat(square.style.transform.match(/rotate\(([^)]+)\)/)?.[1] || originalRotate);
            square.style.transform = `scale(${originalScale + currentScaleOffset}) rotate(${currentRotate}deg)`;

        }, 160);

        wobbleAnimations.push(scaleWobble);
    };

    const startAllWobbles = () => {
        squares.forEach((square, idx) => {
            startWobble(square, idx);
        });
    };

    setInitialPositions();

    setTimeout(() => {
        launchSquares();
    }, 50);

    setTimeout(() => {
        startAllWobbles();
    }, 1000);

    let animationComplete = false;

    setTimeout(() => {
        animationComplete = true;
    }, 1200);

    window.addEventListener('resize', () => {
        if (animationComplete) {
            squares.forEach((square, idx) => {
                const center = getCenterForSquare(square);
                const dir = directions[idx];
                const newLeft = center.x + dir.x;
                const newTop = center.y + dir.y;

                square.style.left = `${newLeft}px`;
                square.style.top = `${newTop}px`;

                square.setAttribute('data-final-left', newLeft);
                square.setAttribute('data-final-top', newTop);
            });
        }
    });

    const gameTrigger = document.createElement('div');
    gameTrigger.id = 'game-trigger';
    gameTrigger.innerHTML = 'НАЧАТЬ СОРТИРОВКУ';
    gameTrigger.style.position = 'absolute';
    gameTrigger.style.top = '30px';
    gameTrigger.style.left = '50%';
    gameTrigger.style.transform = 'translateX(-50%)';
    gameTrigger.style.backgroundColor = '#A14C20';
    gameTrigger.style.color = '#FAD9B7';
    gameTrigger.style.padding = '12px 25px';
    gameTrigger.style.borderRadius = '20px';
    gameTrigger.style.fontSize = '16px';
    gameTrigger.style.fontWeight = 'bold';
    gameTrigger.style.cursor = 'pointer';
    gameTrigger.style.zIndex = '100';
    gameTrigger.style.fontFamily = 'Arial';
    gameTrigger.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    gameTrigger.style.transition = 'all 0.3s ease';
    gameTrigger.style.border = 'none';

    gameTrigger.addEventListener('mouseenter', () => {
        gameTrigger.style.transform = 'translateX(-50%) scale(1.05)';
    });
    gameTrigger.addEventListener('mouseleave', () => {
        gameTrigger.style.transform = 'translateX(-50%) scale(1)';
    });

    gameTrigger.addEventListener('click', () => {
        startGame();
    });

    block2.appendChild(gameTrigger);

    const block3 = document.getElementById('block_3');

    if (block3) {
        block3.style.position = 'relative';
        block3.style.display = 'flex';
        block3.style.flexDirection = 'row';
        block3.style.padding = '40px';
        block3.style.gap = '60px';
        block3.style.alignItems = 'center';
        block3.style.justifyContent = 'center';

        const leftImage = document.createElement('div');
        leftImage.id = 'selected-fruit-image';
        leftImage.style.flex = '1.2';
        leftImage.style.height = '70%';
        leftImage.style.backgroundColor = 'rgba(255,255,255,0.1)';
        leftImage.style.borderRadius = '30px';
        leftImage.style.backgroundSize = 'contain';
        leftImage.style.backgroundPosition = 'center';
        leftImage.style.backgroundRepeat = 'no-repeat';
        leftImage.style.display = 'flex';
        leftImage.style.alignItems = 'center';
        leftImage.style.justifyContent = 'center';
        leftImage.style.fontSize = '20px';
        leftImage.style.color = 'white';
        leftImage.style.fontFamily = 'Arial';
        leftImage.style.position = 'relative';
        leftImage.style.left = '-9%';
        leftImage.innerHTML = '';

        const rightPanel = document.createElement('div');
        rightPanel.style.flex = '0.5';
        rightPanel.style.padding = '20px';
        rightPanel.style.position = 'relative';
        rightPanel.style.left = '-10%';  

        const title = document.createElement('h3');
        title.innerHTML = 'ВЫБЕРИТЕ ФРУКТ ДЛЯ СВОЕГО АССОРТИ';
        title.style.color = 'black';
        title.style.fontSize = '20px';
        title.style.marginBottom = '25px';
        title.style.fontFamily = 'Arial';
        title.style.textAlign = 'left';
        title.style.fontWeight = '500';
        rightPanel.appendChild(title);

        const fruits = ['БАНАН', 'АПЕЛЬСИН', 'КЛУБНИКА', 'ЯБЛОКО'];

        const fruitImages = [
            "assets/бананы.png",
            "assets/апельсины.png",
            "assets/клубники.png",
            "assets/яблоки.png"
        ];

        const listContainer = document.createElement('div');
        listContainer.style.display = 'flex';
        listContainer.style.flexDirection = 'column';
        listContainer.style.gap = '12px';

        fruits.forEach((fruit, index) => {
            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.gap = '12px';
            item.style.cursor = 'pointer';
            item.style.padding = '8px 0';
            item.style.transition = 'all 0.2s ease';

            const checkbox = document.createElement('div');
            checkbox.style.width = '24px';
            checkbox.style.height = '24px';
            checkbox.style.border = '2px solid black';
            checkbox.style.borderRadius = '6px';
            checkbox.style.backgroundColor = 'transparent';
            checkbox.style.transition = 'all 0.2s ease';

            const label = document.createElement('span');
            label.innerHTML = fruit;
            label.style.color = 'black';
            label.style.fontSize = '18px';
            label.style.fontFamily = 'Arial';
            label.style.fontWeight = '400';

            item.appendChild(checkbox);
            item.appendChild(label);

            item.addEventListener('click', () => {
                const allItems = listContainer.querySelectorAll('.fruit-item');
                allItems.forEach(i => {
                    const cb = i.querySelector('.fruit-checkbox');
                    if (cb) {
                        cb.style.backgroundColor = 'transparent';
                    }
                });

                checkbox.style.backgroundColor = '#4caf50';

                leftImage.style.backgroundImage = `url('${fruitImages[index]}')`;
                leftImage.style.backgroundSize = 'contain';
                leftImage.style.backgroundPosition = 'center';
                leftImage.style.backgroundRepeat = 'no-repeat';
                leftImage.innerHTML = '';
            });

            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(5px)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateX(0)';
            });

            item.classList.add('fruit-item');
            const cb = checkbox;
            cb.classList.add('fruit-checkbox');

            listContainer.appendChild(item);
        });

        rightPanel.appendChild(listContainer);

        block3.appendChild(leftImage);
        block3.appendChild(rightPanel);
    }

    const block4 = document.getElementById('block_4');

    if (block4) {
        block4.style.position = 'relative';
        block4.style.display = 'flex';
        block4.style.flexDirection = 'column';
        block4.style.alignItems = 'center';
        block4.style.justifyContent = 'center';
        block4.style.gap = '30px';
        block4.style.padding = '40px';

        const facts = [
            'Бананы — это ягоды, а не фрукты!',
            'Апельсины — это гибрид помело и мандарина.',
            'Клубника — единственный фрукт с семенами снаружи.',
            'Яблоки тонут в воде, потому что на 25% состоят из воздуха.',
            'Арбуз на 92% состоит из воды.',
            'Гранат может содержать до 1000 семян.',
            'Киви содержит больше витамина C, чем апельсин.',
            'Ананас — это ягода, собранная из множества цветков.',
            'Манго — самый популярный фрукт в мире.',
            'Лимоны содержат больше сахара, чем клубника.'
        ];

        const firstButton = document.createElement('button');
        firstButton.innerHTML = 'НАЖМИТЕ ЧТОБЫ УЗНАТЬ СЛУЧАЙНЫЙ ФАКТ О ФРУКТАХ';
        firstButton.style.padding = '30px 30px';
        firstButton.style.fontSize = '30px';
        firstButton.style.backgroundColor = '#FF6C45';
        firstButton.style.color = 'white';
        firstButton.style.border = 'none';
        firstButton.style.borderRadius = '25px';
        firstButton.style.cursor = 'pointer';
        firstButton.style.fontFamily = 'Arial';
        firstButton.style.fontWeight = 'bold';
        firstButton.style.transition = 'all 0.3s ease';
        firstButton.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
        firstButton.style.whiteSpace = 'normal';      
        firstButton.style.wordWrap = 'break-word';    
        firstButton.style.maxWidth = '600px';         
        firstButton.style.lineHeight = '1.4';

        firstButton.addEventListener('mouseenter', () => {
            firstButton.style.transform = 'scale(1.05)';
            firstButton.style.backgroundColor = '#FF593A';
        });
        firstButton.addEventListener('mouseleave', () => {
            firstButton.style.transform = 'scale(1)';
            firstButton.style.backgroundColor = '#FF6C45';
        });

        const secondButton = document.createElement('button');
        secondButton.id = 'fact-button';
        secondButton.innerHTML = '???';
        secondButton.style.padding = '50px 100px';
        secondButton.style.fontSize = '30px';
        secondButton.style.backgroundColor = '#FC9930';
        secondButton.style.color = 'white';
        secondButton.style.border = 'none';
        secondButton.style.borderRadius = '20px';
        secondButton.style.cursor = 'pointer';
        secondButton.style.fontFamily = 'Arial';
        secondButton.style.fontWeight = 'bold';
        secondButton.style.textAlign = 'center';
        secondButton.style.transition = 'all 0.3s ease';
        secondButton.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        secondButton.style.maxWidth = '80%';
        secondButton.style.wordWrap = 'break-word';
        secondButton.style.whiteSpace = 'normal';
        secondButton.style.lineHeight = '1.4';

        secondButton.addEventListener('mouseenter', () => {
            secondButton.style.transform = 'scale(1.02)';
        });
        secondButton.addEventListener('mouseleave', () => {
            secondButton.style.transform = 'scale(1)';
        });

        firstButton.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * facts.length);
            const randomFact = facts[randomIndex];
            secondButton.innerHTML = randomFact;

            secondButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                secondButton.style.transform = 'scale(1)';
            }, 100);
        });

        block4.appendChild(firstButton);
        block4.appendChild(secondButton);
    }
});
