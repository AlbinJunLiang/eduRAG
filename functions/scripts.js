
document.addEventListener('DOMContentLoaded', function () {

    const consultarAutor = {
        userPerfil: false, modelo: 'gemini-2.5-flash-lite-preview-06-17',
        userPerfil: origen = "google"

    };


    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Crear el indicador de escritura dinámicamente
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.id = 'typing-indicator';
    typingIndicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;

    // Respuestas predefinidas del bot
    const botResponses = [
        "Haz superado el límite de consultas, inténtelo mas tarde 😥",
    ];

    // Respuestas para preguntas específicas
    const specificResponses = {
        "hola": "¡Hola! ¿Cómo estás hoy?",
        "cómo estás": "Estoy funcionando perfectamente, ¡gracias por preguntar! ¿Y tú?",
        "qué puedes hacer": "Puedo responder preguntas, mantener conversaciones y ayudarte con información general. ¿Qué necesitas?",
        "quién te creó": "Fui creado por un desarrollador como proyecto de chatbot. ¡Es un placer conocerte!",
        "gracias": "¡De nada! Estoy aquí para ayudar. ¿Algo más en lo que pueda asistirte?",
        "adiós": "¡Hasta luego! Fue un placer conversar contigo. Vuelve cuando quieras."
    };

    // Función para copiar texto al portapapeles
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text)
            .then(() => {
                button.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                `;
                setTimeout(() => {
                    button.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    `;
                }, 2000);
            })
            .catch(err => {
                console.error('Error al copiar: ', err);
                button.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                `;
                setTimeout(() => {
                    button.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    `;
                }, 2000);
            });
    }
    // Función para agregar mensaje al chat
    function addMessage(message, isUser) {
        const messageContainer = document.createElement('div');
        messageContainer.className = `message-container ${isUser ? 'user-message-container' : 'bot-message-container'}`;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

        // Convertir **texto** a <strong>texto</strong> antes de insertar
        const formattedMessage = formatMarkdown(message);



        messageDiv.innerHTML = formattedMessage; // Usar innerHTML en lugar de textContent

        if (!isUser) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.title = "Copiar mensaje";
            copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        `;
            copyBtn.addEventListener('click', () => removeStrongTags(copyToClipboard(message, copyBtn)));
            messageContainer.appendChild(copyBtn);
        }

        messageContainer.appendChild(messageDiv);
        chatMessages.appendChild(messageContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }


    function removeStrongTags(html) {
        return html.replace(/<\/?strong>/g, '');
    }


    function formatMarkdown(text) {
        // Primero, proteger bloques de código con triple backticks (```...```)
        const codeBlockPattern = /```([\s\S]*?)```/g;
        const codeBlocks = [];
        text = text.replace(codeBlockPattern, (match, p1) => {
            codeBlocks.push(p1);
            return `@@CODEBLOCK${codeBlocks.length - 1}@@`;
        });

        // Luego, proteger inline code con un solo backtick (`...`)
        const inlineCodePattern = /`([^`\n]+)`/g;
        const inlineCodes = [];
        text = text.replace(inlineCodePattern, (match, p1) => {
            inlineCodes.push(p1);
            return `@@INLINECODE${inlineCodes.length - 1}@@`;
        });

        // Reemplazar negrita **texto**
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Reemplazar cursiva *texto*
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');

        // Restaurar inline code
        text = text.replace(/@@INLINECODE(\d+)@@/g, (_, index) => `<code>${inlineCodes[index]}</code>`);

        // Restaurar code blocks
        text = text.replace(/@@CODEBLOCK(\d+)@@/g, (_, index) => `<pre><code>${codeBlocks[index]}</code></pre>`);

        return text;
    }



    // Función para simular "escribiendo"
    function showTypingIndicator() {
        chatMessages.appendChild(typingIndicator);
        typingIndicator.style.display = 'flex';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }

    async function consultarIA(prompt) {
        try {
            const res = await axios.post(`https://bustling-tiny-angle.glitch.me/api/proxy?servicio=${consultarAutor.origen}`, {
                pregunta: prompt,
                modelo: consultarAutor.modelo

            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return res.data.respuesta;
        } catch (err) {
            console.error('Error al consultar la API:', err.response.data.message);

            if (err.response.status === 429) {
                return botResponses[0];
            } else {
                return err.response.data.message + "⚠️";
            }

            // Si falla la API, devolver una respuesta aleatoria local
        }
    }
    async function getBotResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase().trim();

        for (const [key, value] of Object.entries(specificResponses)) {
            if (key === "hola") {
                // Para "hola" solo match exacto
                if (lowerCaseMessage === "hola") {
                    return value;
                }
            } else {
                // Para otras palabras, match si está contenido
                if (lowerCaseMessage.includes(key)) {
                    return value;
                }
            }
        }

        // Si no hay coincidencia local, consultar la API
        return await consultarIA(userMessage);
    }


    // Función para manejar el envío de mensajes (ahora es async)
    async function handleSendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        addMessage(message, true);
        userInput.value = '';
        showTypingIndicator();

        try {
            const botResponse = await getBotResponse(message);

            hideTypingIndicator();
            addMessage(botResponse, false);
        } catch (error) {
            hideTypingIndicator();
            addMessage("Lo siento, ocurrió un error al procesar tu mensaje.", false);
            console.error("Error:", error);
        }
    }

    // Event listeners
    sendButton.addEventListener('click', handleSendMessage);

    userInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Agregar mensaje inicial del bot
    addMessage("¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?", false);
    userInput.focus();
    // JS dinámico
    document.querySelectorAll('.modelo-opcion').forEach(opcion => {
        opcion.addEventListener('click', function () {
            // Limpiar mensajes
            document.querySelector('.chat-messages').innerHTML = '';

            // Asignar el modelo desde el atributo data-modelo
            consultarAutor.modelo = this.dataset.modelo;
            consultarAutor.origen = this.dataset.origen;
            //     alert(this.dataset.modelo + " ----> "+this.dataset.origen)

            // Mensaje de bienvenida
            addMessage(`¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy? (<strong>${consultarAutor.modelo}</strong>)`, false);

            // Placeholder
            document.getElementById("user-input").placeholder = "Escribe tu mensaje...";

            // Quitar clase "selected" de todos y agregar solo al seleccionado
            document.querySelectorAll('.modelo-opcion').forEach(btn => btn.classList.remove("selected"));
            this.classList.add("selected");
        });
    });

    // Seleccionar una opción por defecto al cargar la página
    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("div-opcion1").classList.add("selected");
    });

    document.getElementById("div-info").addEventListener("click", function () {
        ModalService.open({
            title: 'Información importante',
            showCancel: false,
            confirmText: 'Entendido',
            content: 
            `<p><strong>1- </strong>La presente aplicación de chatbot está diseñada con fines recreativos y académicos.</p>
<p><strong>2- </strong>Se recomienda utilizar únicamente los modelos optimizados de Gemini debido a su mayor precisión.</p>
<p><strong>3- </strong>La aplicación está dirigida a la consulta de información básica sobre educación vial. Al estar asistida por inteligencia artificial, puede cometer errores, por lo que se sugiere usarla solo como una guía.</p>


`
        });
    });

});
