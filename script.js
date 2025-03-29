let container = document.querySelector('.container');
let gridButton = document.getElementById('submit-grid');
let clearGridButton = document.getElementById('clear-grid');
let gridWidth = document.getElementById('width-range');
let gridHeight = document.getElementById('height-range');
let colorButton = document.getElementById('color-input');
let eraseBtn = document.getElementById('erase-btn');
let paintBtn = document.getElementById('paint-btn');
let widthValue = document.getElementById('width-value');
let heightValue = document.getElementById('height-value');

// Define eventos de mouse e toque para suportar diferentes dispositivos
let events = {
    mouse: {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup"
    },
    touch: {
        down: "touchstart",
        move: "touchmove",
        up: "touchend",
    },
};

let deviceType = ""; // Variável para armazenar o tipo de dispositivo

let draw = false; // Controla se o usuário está desenhando
let erase = false; // Controla se o usuário está apagando

// Variáveis para o sistema de desfazer (Ctrl+Z)
let history = []; // Array para armazenar todos os traços realizados
let currentStroke = []; // Armazena as alterações do traço atual em progresso

// Função para detectar se o dispositivo suporta toque
const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent"); // Testa se eventos de toque são suportados
        deviceType = "touch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false;
    }
};

isTouchDevice(); // Verifica o tipo de dispositivo ao carregar a página

// Evento de clique para gerar a grade
gridButton.addEventListener('click', () => {
    container.innerHTML = ""; // Limpa a grade antes de gerar uma nova
    history = []; // Limpa o histórico ao criar nova grade
    let count = 0; // Contador para identificar os elementos da grade

    for (let i = 0; i < gridHeight.value; i++) {
        count += 2;
        let div = document.createElement('div');
        div.classList.add('gridRow'); // Cria uma linha na grade

        for (let j = 0; j < gridWidth.value; j++) {
            count += 2;
            let col = document.createElement('div');
            col.classList.add('gridCol'); // Cria uma célula da grade
            col.setAttribute('id', `gridCol${count}`);

            // Adiciona evento para detectar o clique e iniciar o desenho ou apagamento
            col.addEventListener(events[deviceType].down, () => {
                draw = true;
                currentStroke = []; // Inicia um novo traço (para o Ctrl+Z)
                if (erase) {
                    saveState(col); // Salva estado antes de apagar (para poder desfazer)
                    col.style.backgroundColor = "transparent"; // Apaga a cor
                } else {
                    saveState(col); // Salva estado antes de pintar (para poder desfazer)
                    col.style.backgroundColor = colorButton.value; // Pinta com a cor selecionada
                }
            });

            // Adiciona evento para desenhar enquanto o mouse ou dedo se move sobre a grade
            col.addEventListener(events[deviceType].move, (e) => {
                let elementId = document.elementFromPoint(
                    !isTouchDevice() ? e.clientX : e.touches[0].clientX,
                    !isTouchDevice() ? e.clientY : e.touches[0].clientY,
                ).id;
                checker(elementId); // Verifica qual elemento está sendo afetado
            });

            // Evento para parar de desenhar quando o botão do mouse ou toque for liberado
            col.addEventListener(events[deviceType].up, () => {
                if (draw && currentStroke.length > 0) {
                    history.push(currentStroke); // Salva o traço completo no histórico
                    currentStroke = []; // Reseta para o próximo traço
                }
                draw = false;
            });

            div.appendChild(col); // Adiciona a célula à linha
        }

        container.appendChild(div); // Adiciona a linha ao container da grade
    }
});

// Função para verificar qual elemento está sendo desenhado/apagado
function checker(elementId) {
    let gridColumns = document.querySelectorAll(".gridCol");
    gridColumns.forEach((element) => {
        if (elementId == element.id) {
            if (draw) {
                // Determina a nova cor com base no modo (pintura ou borracha)
                const newColor = erase ? "transparent" : colorButton.value;
                
                // Só altera e salva no histórico se a cor for diferente
                if (element.style.backgroundColor !== newColor) {
                    saveState(element); // Salva o estado atual antes de modificar
                    element.style.backgroundColor = newColor; // Aplica a nova cor
                }
            }
        }
    });
}

// Função para salvar o estado atual de um elemento no histórico
function saveState(element) {
    currentStroke.push({
        element: element, // Referência ao elemento da grade
        color: element.style.backgroundColor // Cor atual antes da modificação
    });
}

// Função para desfazer o último traço (Ctrl+Z)
function undoLastAction() {
    if (history.length > 0) {
        let lastStroke = history.pop(); // Remove o último traço do histórico
        // Reverte as alterações na ordem inversa (importante para consistência)
        for (let i = lastStroke.length - 1; i >= 0; i--) {
            let action = lastStroke[i];
            action.element.style.backgroundColor = action.color; // Restaura a cor original
        }
    }
}

// Adiciona o evento de teclado para o Ctrl+Z
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "z") {
        e.preventDefault(); // Evita o comportamento padrão do Ctrl+Z no navegador
        undoLastAction(); // Executa a função de desfazer
    }
});

// Botão para limpar a grade completamente
clearGridButton.addEventListener("click", () => {
    container.innerHTML = "";
    history = []; // Limpa o histórico quando a grade é resetada
});

// Botão para ativar o modo borracha
eraseBtn.addEventListener("click", () => {
    erase = true;
});

// Botão para ativar o modo de pintura
paintBtn.addEventListener("click", () => {
    erase = false;
});

// Atualiza o valor exibido da largura da grade conforme o usuário ajusta
gridWidth.addEventListener("input", () => {
    widthValue.innerHTML = gridWidth.value < 9 ? `0${gridWidth.value}` : gridWidth.value;
});

// Atualiza o valor exibido da altura da grade conforme o usuário ajusta
gridHeight.addEventListener("input", () => {
    heightValue.innerHTML = gridHeight.value < 9 ? `0${gridHeight.value}` : gridHeight.value;
});

// Reseta os valores da grade ao carregar a página
window.onload = () => {
    gridHeight.value = 0;
    gridWidth.value = 0;
};