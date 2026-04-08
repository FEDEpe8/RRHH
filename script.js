// ==========================================================================
// SCRIPT PRINCIPAL: PORTAL INTERNO RRHH (SOLO RRHH)
// ==========================================================================

// --- VARIABLES DE ESTADO ---
let userName = localStorage.getItem('rrhh_user_name') || "";
let currentPath = ['main'];
let isBotThinking = false;
let isAwaitingPin = false; 
let isAwaitingDniRecibo = false;
let isAwaitingLegajoRecibo = false;
let currentDniRecibo = "";
const URL_API_INTRANET = 'https://intranet.chascomus.gob.ar/api/recibos.php'; 
const PIN_PRUEBA = ["1234"]; 
let currentPin = ""; 
const URL_API_LICENCIAS = 'https://script.google.com/macros/s/AKfycbz02VZfYKQ90GfrgmsqLZKdZeAu4T3ljDyzsEFP9gSEUAFpSe5hxCTmwJmSSiuc_WINxQ/exec';

// --- CONSTANTES ---
const IMG_BOT_NORMAL = 'logo.png';
const IMG_BOT_PENSANDO = 'logo.png';

// --- CONFIGURACIÓN DE MENÚS (SOLO RRHH) ---
const MENUS = {
    main: {
        title: (name) => `¡Hola <b>${name}</b>! 👋 Bienvenido al Portal Interno de RRHH. ¿En qué puedo ayudarte hoy?`,
        options: [
            { id: 'medicina_menu', label: '⚕️ Medicina Laboral' },
            { id: 'sueldos_menu', label: '💰 Sueldos y Aguinaldo' },
            { id: 'licencias_menu', label: '📅 Vacaciones y Licencias' },
            { id: 'tramites_menu', label: '📝 Certificados y Trámites' },
            { id: 'soy_municipal', label: '🎁 Beneficios Soy Municipal' },
            { id: 'btn_pedir_pin', label: '🔐 Acceso Referentes RRHH' }
        ]
    },
    menu_referentes_exclusivo: {
        title: () => '🔐 Panel de Referentes RRHH:',
        options: [
            { id: 'novedades', label: '⏰ Entrega de Novedades', type: 'leaf', apiKey: 'info_novedades' },
            { id: 'licencias_area', label: '📊 Ver licencias Medicas', type: 'leaf', apiKey: 'licencias_area_info' },
            { id: 'otras_licencias_dinamico', label: '🌴 Ver Otras licencias (Vacaciones, Maternidad, etc;)' },
            { id: 'back', label: '⬅️ Salir del panel' }
        ]
    },
    medicina_menu: {
        type: 'card',
        title: () => '⚕️ Medicina Laboral',
        image: 'medicina_laboral.png',
        footer: 'Departamento de Medicina Laboral', 
        description: `Para consultas médicas laborales, turnos o información sobre protocolos de salud en el ámbito laboral, puedes acceder al Departamento de Medicina Laboral a través del WhatsApp oficial. 
            Estamos para ayudarte con cualquier consulta relacionada con tu salud laboral.
            <br><br><a href="https://wa.me/5492241461777" target="_blank"
        class="wa-btn" style="background-color: #25D366 !important; color: white;
        text-align: center; display: block; margin-top: 3px;">📞 Contactar por WhatsApp</a><br><br></br>`,
        options: [{ id: 'back', label: '⬅️ Volver' }]
    },
    sueldos_menu: {
        title: () => '💰 Consultas de Haberes:',
        options: [
            { id: 'recibo', label: '📄 Último Recibo y Extras' }, 
            { id: 'info_sac', label: '💸 Información Aguinaldo', type: 'leaf', apiKey: 'info_sac' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    licencias_menu: {
        title: () => '📅 Gestión de Licencias Laborales:',
        options: [
            { id: 'vacas', label: '🏖️ Mis Vacaciones', type: 'leaf', apiKey: 'info_vacaciones' },
            { id: 'lic_med', label: '🚑 Licencias Médicas', type: 'leaf', apiKey: 'info_licencias' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    tramites_menu: {
        title: () => '📝 Trámites de Personal:',
        options: [
            { id: 'esc', label: '🎒 Escolaridad', type: 'leaf', apiKey: 'info_escolaridad' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    soy_municipal: {
        title: () => 'Beneficios del Programa Soy Municipal:',
        options: [
             { id: 'soy_como', label: '📋 ¿Cómo acceder?', type: 'leaf', apiKey: 'info_acceder' },
            { id: 'soy_desc', label: '🎁 Locales adheridos', type: 'leaf', apiKey: 'info_soy_municipal' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    }
};

// --- RESPUESTAS (BASE DE DATOS INTEGRADA - SOLO RRHH) ---
const RES = {
    'licencias_area_info': `
        <div class="info-card">
            <strong>📊 Licencias en mi Área</strong><br><br>
            Aquí podrás consultar un resumen de las licencias activas en tu área, incluyendo tipo de licencia, fechas y estado de aprobación.<br><br>
            📋 <b>Información mostrada:</b><br>
            - Nombre del empleado<br>
            - Tipo de licencia (vacaciones, médica, etc.)<br>
            - Fecha de inicio y fin<br>
            - Estado (aprobada, pendiente, rechazada)<br><br>
            📌 <b>Confidencialidad:</b> Solo podrás ver las licencias de los empleados de tu área directa.<br><br>
            📞 <b>Contacto RRHH:</b> Para consultas específicas, contactá a RRHH al <a href="https://wa.me/5492241461777" target="_blank" class="wa-btn">💬 WhatsApp 46-1777</a>
        </div>`,

    'info_otras_licencias': `
        <div class="info-card">
            <strong>🚑 Otras Licencias</strong><br><br>
            Aquí podrás consultar información sobre otras licencias, como vacaciones, maternidad, entre otras.<br><br>
            📋 <b>Información mostrada:</b><br>
            - Nombre del empleado<br>
            - Tipo de licencia<br>
            - Fecha de inicio y fin<br>
            - Estado (aprobada, pendiente, rechazada)<br><br>
            📌 <b>Confidencialidad:</b> Solo podrás ver las licencias de los empleados de tu área directa.<br><br>
           📞 <b>Contacto Oficina de Capital Humano:</b> Para consultas específicas, contactár al <a href="https://wa.me/5492241493410" target="_blank" class="wa-btn">
            💬 WhatsApp 49-3410</a>
        </div>`,

    'info_novedades': `
        <div class="info-card">
            🚧 <b>Entrega de Novedades</b><br>
            Por medio de la presente, se informa el cronograma con las fechas límite para la entrega y carga de novedades correspondientes a la liquidación del mes en curso.<br><br>
            <span style="color: red;">
           📅 <b>Horas Extras:</b><b> Lunes 9 de marzo de 2026</b><br>
           📅 <b>Personal Docente:</b><b> Viernes 13 de marzo de 2026</b><br>
           📅 <b>Sueldos (Novedades generales):</b><b> Jueves 19 de marzo de 2026</b><br>
           </span>
            Se solicita a todas las áreas respetar estrictamente estos plazos.<br><br>
        </div>`,

    'info_recibos': `
        <div class="info-card">
            <strong>💰 Información de Sueldos</strong><br><br>
            Aquí podrás consultar información relacionada con tus sueldos y beneficios.<br><br>
            📅 <b>Período:</b> Mensual.<br>
            📎 <b>Formato:</b> PDF o Documento Digital.<br>
            📎 <b>Intranet:</b> <a href="https://intranet.chascomus.gob.ar" target="_blank" class="wa-btn">📤 Ingresar a la Intranet</a>
        </div>`,

    'info_sac': `
        <div class="info-card">
            <strong>💰 Información de SAC (Aguinaldo)</strong><br><br>
            Aquí podrás consultar información relacionada con tu aguinaldo.<br><br>
            📅 <b>Primer Medio Aguinaldo (Junio):</b> Suele acreditarse entre el 23 y el 27 de junio.<br>
            📅 <b>Segundo Medio Aguinaldo (Diciembre):</b> Generalmente se deposita alrededor del 20 de diciembre.<br>
            📌 <b>Acreditación:</b> Gracias al uso de <b>FONDOS PROPIOS</b>, el municipio <b>ASEGURA</b> el depósito antes de que termine el mes.<br>
            📎 <b>Intranet:</b> <a href="https://intranet.chascomus.gob.ar" target="_blank" class="wa-btn">📤 Ingresar a la Intranet</a>
        </div>`,

    'info_escolaridad': `
        <div class="info-card">
            <strong>🎒 Certificado de Escolaridad</strong><br><br>
            Recordá que para cobrar la Ayuda Escolar Anual es obligatorio presentar el certificado.<br><br>
            <b>A partir de la fecha 25/02/2026</b>, y previo al comienzo de clases, se abonara el subsidio correspondiente.<br><br>
            📅 <b>Vencimiento:</b> 30 de Junio los que ya presentaron el certificado en 2025<br>
            📆 <b>Vencimiento:</b> 30 de Abril los que cobran por primera vez.<br>
            📎 <b>Entrega:</b> Oficina de Liquidaciones de 08:00hs - 13:00hs. (Cramer 270, Planta Baja).<br>
        </div>`,

    'info_vacaciones': `
        <div class="info-card">
            <strong>🏖️ Vacaciones Anuales</strong><br><br>
            Las vacaciones se otorgan según el régimen de cada empleado y la antigüedad en el cargo.<br><br>
            📅 <b>Período:</b> Se otorgan entre Octubre y Octubre.<br>
            📎 <b>Solicitud:</b> A través del referente de RRHH de tu área.<br>
            📎 <b>Duración (según antigüedad al 31/12):</b> <br>
               - Menos de 5 años: 14 días corridos.<br>
               - 5 a 10 años: 21 días corridos.<br>
               - 10 a 20 años: 28 días corridos.<br>
               - Más de 20 años: 35 días corridos.<br>
        </div>`,

    'info_licencias': `
        <div class="info-card">
            <strong>🚑 Licencias Médicas</strong><br><br>
            Si estás enfermo, debés avisar 24:00 hs. antes de la jornada laboral.<br><br>
            📞 <b>Auditoría Médica:</b> <a href="https://wa.me/5492241461777" target="_blank" class="wa-btn">💬 WhatsApp 46-1777</a><br>
            📍 <b>Lugar:</b> Medicina Laboral Dorrego y Bolivar (Ex centro cívico).<br>
            <i>Recordá llevar certificado con diagnóstico y días de reposo.</i>
        </div>`,

    'info_soy_municipal': `
        <div class="info-card">
            <strong>🛍️ Locales Adheridos - Soy Municipal</strong><br><br>
            <b>Alimentos:</b> SuperChas, Pastas La Bianca, Almacén de Descuentos, Verduleria Santa Elena.<br>
            <b>Gastronomía:</b> La Fonda, La Roti, Il Formagio.<br>
            <b>Carnicería:</b> La Carniceria.<br>
            <b>Heladerías:</b> Grido, Brinato.<br>
            <b>Belleza:</b> Lion Peluqueria, Multiespacio Capilar, Ana Chrestia, Peluquería Ídolos.<br>
            <b>Indumentaria:</b> Vado Di Piu, Stock Calzados, Bumerang, Indulab.<br>
            <b>Educación:</b> Join In, Universidad Siglo XXI.<br>
            <b>Servicios y Hogar:</b> Imprenta El Rayo, Corralon el Chaqueño, Pintureria Alvear, La casa del Tornillo, Chiquilandia.
        </div>`,

    'info_acceder': `
        <div class="info-card">
            <strong>🎁 Beneficios Soy Municipal</strong><br>
            El programa "Soy Municipal" ofrece descuentos exclusivos.<br><br>
            📋 <b>¿Cómo acceder?</b><br>
            1️⃣ Solicitala en la oficina de Recursos Humanos, en el Palacio Municipal.<br>
            2️⃣ Presentá tu credencial de empleado municipal en los locales adheridos.<br><br>
        </div>`,

    'error_busqueda': `
        <div class="info-card" style="border-left: 5px solid #ffc107;">
            <div style="font-size: 1.1rem; margin-bottom: 8px;">🤔 <b>No encontré eso</b></div>
            <p style="font-size: 0.9rem; margin-bottom: 15px; color: #333;">
                Asegurate de estar consultando sobre temas de Recursos Humanos (Sueldos, Licencias, Certificados, etc).
            </p>
            <button onclick="resetToMain()" class="menu-btn" style="width: 100%; padding: 12px; background-color: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px;">
                ☰ Ver Menú de RRHH
            </button>
        </div>`
};

// --- PALABRAS CLAVE (BUSCADOR INTELIGENTE - SOLO RRHH) ---
const PALABRAS_CLAVE = {
    'rrhh': { id: 'main', label: '👥 Recursos Humanos' },
    'menu': { id: 'main', label: '🏠 Menú Principal' },
    'recibo': { id: 'sueldos_menu', label: '📄 Recibos de Sueldo' },
    'extras': { id: 'sueldos_menu', label: '📄 Extras' },
    'liquidacion': { id: 'sueldos_menu', label: '📄 Liquidaciones' },
    'sueldo': { id: 'sueldos_menu', label: '💰 Sueldos' },
    'aguinaldo': { apiKey: 'info_sac', label: '💰 Aguinaldo' },
    'sac': { apiKey: 'info_sac', label: '💰 SAC' },
    'vacaciones': { apiKey: 'info_vacaciones', label: '📅 Vacaciones' },
    'licencia': { apiKey: 'info_licencias', label: '📅 Licencias Médicas' },
    'medica': { apiKey: 'info_licencias', label: '🚑 Medicina Laboral' },
    'enfermo': { apiKey: 'info_licencias', label: '🚑 Parte de Enfermo' },
    'beneficios': { apiKey: 'info_soy_municipal', label: '🎁 Beneficios Soy Municipal' },
    'soy_municipal': { apiKey: 'info_soy_municipal', label: '🎁 Beneficios Soy Municipal' },
    'certificado': { apiKey: 'info_escolaridad', label: '🎒 Certificado' },
    'escolaridad': { apiKey: 'info_escolaridad', label: '🎒 Escolaridad' },
    'maternidad': { apiKey: 'info_otras_licencias', label: '🚑 Maternidad / Otras licencias' },
    'referente': { id: 'btn_pedir_pin', label: '🔐 Acceso Referentes' }
};

// --- FUNCIONES VISUALES ---
function setMuniBotState(state) {
    const avatar = document.getElementById('avatar-bot');
    if (avatar) avatar.src = state === 'thinking' ? IMG_BOT_PENSANDO : IMG_BOT_NORMAL;
}

function showTyping() {
    isBotThinking = true;
    setMuniBotState('thinking');
    const container = document.getElementById('chatMessages');
    const wrapper = document.createElement('div');
    wrapper.id = 'typingWrapper';
    wrapper.innerHTML = `<div class="message bot"><span class="typing-dots">Escribiendo</span></div>`;
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
}

function addMessage(content, side = 'bot', options = null) {
    if (side === 'bot') {
        isBotThinking = false;
        const t = document.getElementById('typingWrapper');
        if (t) t.remove();
        setMuniBotState('normal');
    }
    const container = document.getElementById('chatMessages');
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${side}`;
    wrapper.innerHTML = `<div class="message ${side}">${content}</div>`;
    container.appendChild(wrapper);

    if (options) {
        const optDiv = document.createElement('div');
        optDiv.className = 'options-container';
        options.forEach(o => {
            const btn = document.createElement('button');
            btn.className = 'option-button';
            btn.innerText = o.label;
            btn.onclick = () => handleAction(o);
            optDiv.appendChild(btn);
        });
        container.appendChild(optDiv);
    }
    container.scrollTop = container.scrollHeight;
}

function showMenu(key) {
    const m = MENUS[key];
    if(m) {
        if (m.type === 'card') {
            const cardHtml = `
                <div class="info-card" style="padding:0; overflow:hidden;">
                    <img src="${m.image}" style="width:100%; height:auto; display:block;">
                    <div style="padding:15px;">
                        <h3 style="margin:0 0 5px 0; color:var(--primary);">${typeof m.title === 'function' ? m.title() : m.title}</h3>
                        <small style="color:#666;">${m.subtitle || ''}</small>
                        <p style="margin:10px 0; font-size:0.9rem;">${m.description}</p>
                        <hr style="border:0; border-top:1px dashed #ccc; margin:10px 0;">
                        <small><i>${m.footer}</i></small>
                    </div>
                </div>`;
            addMessage(cardHtml, 'bot', m.options);
        } else {
            addMessage(typeof m.title === 'function' ? m.title(userName) : m.title, 'bot', m.options);
        }
    } else {
        console.error("Menú no encontrado:", key);
        showMenu('main');
    }
}

// --- CONEXIÓN CON GOOGLE SHEETS (LOGS) ---
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxsykXV0qe7rta50BrM2i8flXktxx90NVpnZH3wHWwp6c0ymoioEcAeuUGjLm8y6Jpd/exec';

function registrarEnPlanilla(detalle) {
    if (!SCRIPT_URL || SCRIPT_URL.includes('TU_ID_DEL_SCRIPT_AQUI')) return;

    const payload = {
        fecha: new Date().toLocaleString('es-AR'), 
        usuario: userName || "Anónimo",
        detalle: detalle 
    };

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(() => {
        console.log("Registro guardado en Sheets:", detalle);
    }).catch(error => {
        console.error("Error al guardar en Sheets:", error);
    });
}

// --- FUNCIONES LÓGICAS ---
function normalizar(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function clearSession() {
    if (confirm("¿Cerrar sesión y borrar datos?")) {
        localStorage.clear();
        location.reload();
    }
}

function resetToMain() {
    currentPath = ['main'];
    showMenu('main');
}

// --- REGISTRO ÚNICO (Solo nombre) ---
function registrarDato(valor) {
    if (!userName) {
        userName = valor;
        localStorage.setItem('rrhh_user_name', userName);
        registrarEnPlanilla('Nuevo usuario registrado: ' + userName); 
        showMenu('main');
    }
}

function ejecutarBusqueda(texto) {
    const t = normalizar(texto);
    let encontrado = null;
    for (let key in PALABRAS_CLAVE) {
        if (t.includes(key)) { encontrado = PALABRAS_CLAVE[key]; break; }
    }
    if (encontrado) {
        showTyping();
        setTimeout(() => handleAction(encontrado), 500);
    } else {
        showTyping();
        setTimeout(() => {
            addMessage(RES['error_busqueda'], "bot");
        }, 600);
    }
}

function processInput() {
    const input = document.getElementById('userInput');
    let val = input.value.trim(); 
    if (!val || isBotThinking) return;

    addMessage(val, 'user');
    input.value = "";

    // Si todavía no registramos el nombre, lo tomamos y salimos
    if (!userName) {
        registrarDato(val);
        return;
    } 
    
    // --- Chequeo del PIN ---
    if (isAwaitingPin) {
        isAwaitingPin = false; 
        validarPinEnBaseDeDatos(val); 
        return; 
    }

    // --- Chequeo de DNI para Recibo ---
    if (isAwaitingDniRecibo) {
        currentDniRecibo = val.replace(/\./g, '').replace(/\s/g, ''); 
        
        if (currentDniRecibo.length < 5) {
             addMessage("❌ Ese número parece muy corto. Por favor, ingresá un DNI válido (sin puntos):", "bot", [
                { id: 'sueldos_menu', label: 'Cancelar' }
            ]);
            return;
        }

        isAwaitingDniRecibo = false;
        isAwaitingLegajoRecibo = true; 
        addMessage("🔢 Perfecto. Ahora ingresá tu número de **Legajo**:", "bot", [
            { id: 'sueldos_menu', label: 'Cancelar' }
        ]);
        return; 
    }

    // --- Chequeo de Legajo para Recibo ---
    if (isAwaitingLegajoRecibo) {
        let legajoLimpio = val.replace(/\s/g, '');
        isAwaitingLegajoRecibo = false;
        consultarReciboIntranet(currentDniRecibo, legajoLimpio); 
        return; 
    }

    // Búsqueda normal en el asistente
    registrarEnPlanilla('Búsqueda de Texto: Buscó "' + val + '"'); 
    ejecutarBusqueda(val);
}

// --- LÓGICA DE NAVEGACIÓN Y BOTONES ---
function handleAction(opt) {
    if (opt.id === 'back') { 
        currentPath.pop(); 
        showMenu(currentPath[currentPath.length - 1]); 
        return; 
    }
    if (opt.link) {
        window.open(opt.link, '_blank');
        return;
    }
    if (opt.id === 'licencias_area') {
        currentPath.push(opt.id); 
        buscarLicencias(currentPin);
        return; 
    }
    if (opt.id === 'otras_licencias_dinamico') {
        currentPath.push(opt.id);
        buscarOtrasLicencias(currentPin); 
        return; 
    }

    if (opt.id === 'recibo') {
        isAwaitingDniRecibo = true; 
        addMessage(opt.label, 'user');
        showTyping();
        setTimeout(() => {
            addMessage("👤 Por favor, ingresá tu número de **DNI** (sin puntos) para validar tu identidad:", "bot", [
                { id: 'sueldos_menu', label: 'Cancelar' }
            ]);
        }, 800);
        return;
    }
    
    if (opt.id === 'btn_pedir_pin') {
        isAwaitingPin = true; 
        addMessage(opt.label, 'user');
        showTyping();
        setTimeout(() => {
            addMessage("🔒 Por favor, ingresá tu PIN numérico de acceso exclusivo:", "bot", [
                { id: 'main', label: 'Cancelar' }
            ]);
        }, 800);
        return; 
    }

    // Flujo normal
    addMessage(opt.label, 'user');
    showTyping();
    
    setTimeout(() => {
        if (opt.type === 'submenu') {
            currentPath.push(opt.id);
            showMenu(opt.id);
        } else if (opt.type === 'leaf' && opt.apiKey) {
            currentPath.push(opt.id); 
            const res = RES[opt.apiKey] || "Lo siento, la información no está disponible en este momento.";
            addMessage(res, "bot", [{ id: 'back', label: '⬅️ Volver' }]);
        } else if (MENUS[opt.id]) {
            currentPath.push(opt.id);
            showMenu(opt.id);
        } else {
            showMenu('main');
        }
    }, 800);
}

// --- VALIDACIÓN DE PIN EN LA NUBE ---
async function validarPinEnBaseDeDatos(pin) {
    addMessage("Validando credenciales...", "bot");
    showTyping();

    try {
        const response = await fetch(`${URL_API_LICENCIAS}?action=validar&pin=${pin}`);
        const data = await response.json();

        if (data.valido === true) {
            currentPin = pin; 
            currentPath.push('menu_referentes_exclusivo');
            showMenu('menu_referentes_exclusivo');
        } else {
            addMessage("❌ PIN incorrecto o no registrado.", "bot", [
                { id: 'btn_pedir_pin', label: '🔄 Volver a intentar' },
                { id: 'main', label: '⬅️ Volver al Inicio' }
            ]);
        }
    } catch (error) {
        console.error("Error al validar:", error);
        addMessage("⚠️ Hubo un error de conexión al validar el PIN. Intentá de nuevo.", "bot", [
            { id: 'btn_pedir_pin', label: '🔄 Volver a intentar' },
            { id: 'main', label: '⬅️ Volver al Inicio' }
        ]);
    }
}

// --- BÚSQUEDA DINÁMICA DE LICENCIAS MEDICAS ---
async function buscarLicencias(pin) {
    addMessage("Buscando las licencias médicas actualizadas de tu área...", "bot");
    showTyping();

    try {
        const response = await fetch(`${URL_API_LICENCIAS}?action=licencias&pin=${pin}`);
        const data = await response.json();

        if (data.length === 0) {
            addMessage("No se encontraron licencias Médicas activas para tu área en este momento.", "bot", [
                { id: 'back', label: '⬅️ Volver al panel' } 
            ]);
            return;
        }

        let htmlResultados = `<div class="info-card"><strong>📊 Licencias Médicas Activas</strong><br><br>`;
        
        data.forEach(lic => {
            let semaforo = '⚪';
            if (lic.estado.toLowerCase().includes('activa')) semaforo = '🟢';
            if (lic.estado.toLowerCase().includes('pendiente')) semaforo = '🟡';
            if (lic.estado.toLowerCase().includes('finalizada')) semaforo = '🔴';

            htmlResultados += `
                👤 <b>${lic.empleado}</b><br>
                🏷️ Tipo: ${lic.tipo}<br>
                📅 Desde: ${lic.inicio} | Hasta: ${lic.fin}<br>
                ${semaforo} Estado: <b>${lic.estado}</b><br>
                <hr style="border-top: 1px dashed #ccc; margin: 10px 0;">
            `;
        });
        htmlResultados += `</div>`;

        addMessage(htmlResultados, "bot", [ { id: 'back', label: '⬅️ Volver al panel' } ]);

    } catch (error) {
        console.error("Error al traer las licencias:", error);
        addMessage("Hubo un error de conexión con la base de datos de Medicina Laboral. Intentá de nuevo más tarde.", "bot", [
            { id: 'back', label: '⬅️ Volver al panel' } 
        ]);
    }
}

// --- BÚSQUEDA DINÁMICA DE OTRAS LICENCIAS ---
async function buscarOtrasLicencias(pin) {
    addMessage("Buscando las licencias (Vacaciones, Maternidad, Artículos) de tu área...", "bot");
    showTyping();

    try {
        const response = await fetch(`${URL_API_LICENCIAS}?action=otras_licencias&pin=${pin}`);
        const data = await response.json();

        if (data.length === 0) {
            addMessage("No se encontraron otras licencias activas para tu área en este momento.", "bot", [
                { id: 'back', label: '⬅️ Volver al panel' }
            ]);
            return;
        }

        let htmlResultados = `<div class="info-card"><strong>🌴 Otras Licencias Activas</strong><br><br>`;
        
        data.forEach(lic => {
            let semaforo = '⚪';
            if (lic.estado.toLowerCase().includes('activa')) semaforo = '🟢';
            if (lic.estado.toLowerCase().includes('pendiente')) semaforo = '🟡';
            if (lic.estado.toLowerCase().includes('finalizada')) semaforo = '🔴';

            htmlResultados += `
                👤 <b>${lic.empleado}</b><br>
                🏷️ Tipo: ${lic.tipo}<br>
                📅 Desde: ${lic.inicio} | Hasta: ${lic.fin}<br>
                ${semaforo} Estado: <b>${lic.estado}</b><br>
                <hr style="border-top: 1px dashed #ccc; margin: 10px 0;">
            `;
        });
        htmlResultados += `</div>`;

        addMessage(htmlResultados, "bot", [ { id: 'back', label: '⬅️ Volver al panel' } ]);

    } catch (error) {
        console.error("Error al traer las licencias:", error);
        addMessage("Hubo un error de conexión con la base de datos. Intentá de nuevo más tarde.", "bot", [
            { id: 'back', label: '⬅️ Volver al panel' } 
        ]);
    }
}

// --- BÚSQUEDA DINÁMICA DE RECIBOS EN INTRANET (VÍA PHP SEGURO) ---
async function consultarReciboIntranet(dni, legajo) {
    addMessage("Validando identidad y buscando recibos...", "bot");
    showTyping();

    try {
        const response = await fetch(`${URL_API_INTRANET}?action=consultar&dni=${dni}&legajo=${legajo}`);
        const data = await response.json();

        if (data.exito === true) {
            let htmlRecibo = `
                <div class="info-card">
                    <strong>📄 Último Recibo de Sueldo</strong><br><br>
                    📅 <b>Período liquidado:</b> ${data.periodo}<br>
                    <hr style="border-top: 1px dashed #ccc; margin: 10px 0;">
                    <a href="${data.link_descarga}" target="_blank" class="wa-btn" style="background-color: var(--primary) !important; text-align: center; display: block;">
                        🔒 Ver / Descargar PDF
                    </a>
                </div>
            `;
            addMessage(htmlRecibo, "bot", [{ id: 'sueldos_menu', label: '⬅️ Volver a Sueldos' }]);
        } else {
            addMessage(`❌ ${data.mensaje}`, "bot", [
                { id: 'recibo', label: '🔄 Volver a intentar' },
                { id: 'sueldos_menu', label: '⬅️ Volver a Sueldos' }
            ]);
        }
    } catch (error) {
        console.error("Error al consultar recibo:", error);
        addMessage("⚠️ Hubo un error de conexión con el servidor. Intentá de nuevo más tarde.", "bot", [
            { id: 'recibo', label: '🔄 Volver a intentar' },
            { id: 'sueldos_menu', label: '⬅️ Volver a Sueldos' }
        ]);
    }
}

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    if (!userName) {
        addMessage("¡Hola! 👋 Bienvenido al Portal de Recursos Humanos. Para empezar, por favor escribí tu <b>Nombre Completo</b>:", "bot");
    } else {
        showMenu('main');
    }

    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if(splash) splash.classList.add('hidden');
    }, 2000);
    
    const sendBtn = document.getElementById('sendButton');
    const userInput = document.getElementById('userInput');
    
    if(sendBtn) sendBtn.onclick = processInput;
    if(userInput) {
        userInput.addEventListener('keydown', (e) => { 
            if (e.key === 'Enter') processInput(); 
        });
    }
    
    let deferredPrompt; 
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const installBtn = document.getElementById('installBtn');
        if (installBtn) {
            installBtn.classList.remove('hidden');
            installBtn.addEventListener('click', async () => {
                installBtn.classList.add('hidden');
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
            });
        }
    });

    window.addEventListener('appinstalled', () => {
        const installBtn = document.getElementById('installBtn');
        if(installBtn) installBtn.classList.add('hidden');
    });
});