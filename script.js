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
                if (erase) {
                    col.style.backgroundColor = "transparent"; // Apaga a cor
                }
            });

            // Adiciona evento para desenhar enquanto o mouse ou dedo se move sobre a grade
            col.addEventListener(events[deviceType].move, (e) => {
                let elementId = document.elementFromPoint(
                    !isTouchDevice() ? e.clientX : e.touches[0].clientX,
                    !isTouchDevice() ? e.clientY : e.touches[0].clientY,
                ).id;
                checker(elementId);
            });

            // Evento para parar de desenhar quando o botão do mouse ou toque for liberado
            col.addEventListener(events[deviceType].up, () => {
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
            if (draw && !erase) {
                element.style.backgroundColor = colorButton.value; // Pinta a célula
            } else if (draw && erase) {
                element.style.backgroundColor = "transparent"; // Apaga a célula
            }
        }
    });
}

// Botão para limpar a grade
clearGridButton.addEventListener("click", () => {
    container.innerHTML = "";
});

// Botão para ativar o modo borracha
eraseBtn.addEventListener("click", () => {
    erase = true;
});

// Botão para ativar o modo de pintura
paintBtn.addEventListener("click", () => {
    erase = false;
});

// Atualiza os valores exibidos de largura e altura da grade
gridWidth.addEventListener("input", () => {
    widthValue.innerHTML = gridWidth.value < 9 ? `0${gridWidth.value}` : gridWidth.value;
});

gridHeight.addEventListener("input", () => {
    heightValue.innerHTML = gridHeight.value < 9 ? `0${gridHeight.value}` : gridHeight.value;
});

// Reseta os valores da grade ao carregar a página
window.onload = () => {
    gridHeight.value = 0;
    gridWidth.value = 0;
};
