// ==========================================================================
// SCRIPT PRINCIPAL: RRHH + CHASBOT (INTEGRADO FULL - SOLO NOMBRE)
// ==========================================================================

// --- VARIABLES DE ESTADO ---
let userName = localStorage.getItem('rrhh_user_name') || "";
let currentPath = ['main'];
let isBotThinking = false;

// --- CONSTANTES ---
const IMG_BOT_NORMAL = 'logo.png';
const IMG_BOT_PENSANDO = 'logo.png';

// --- CONFIGURACIÓN DE MENÚS (RRHH + CHASBOT) ---
const MENUS = {
    main: {
        title: (name) => `¡Hola <b>${name}</b>! 👋 ¿En qué puedo ayudarte hoy? Acá tenés los accesos de 🫱🏻‍🫲🏿 RRHH y 🏛️ Servicios al Ciudadano:`,
        options: [
            { id: 'rrhh_menu', label: '🫱🏻‍🫲🏿 RRHH - Personal Municipal', type: 'submenu' },
            { id: 'servicios_municipales', label: '🏛️ Servicios al Ciudadano' }
        ]
    },
    menu_completo: {
        title: () => 'Todas las opciones disponibles:',
        options: [
            { id: 'rrhh_menu', label: '🫱🏻‍🫲🏿 RRHH - Personal Municipal' },
            { id: 'servicios_municipales', label: '🏛️ Servicios al Ciudadano' },
            { id: 'main', label: '🏠 Volver al inicio' }
        ]
    },
    servicios_municipales: {
        title: () => '📱 Servicios al Ciudadano (ChasBot):',
        options: [
            { id: 'politicas_gen', label: '💜 GÉNERO (Urgencias)', type: 'leaf', apiKey: 'politicas_gen' },
            { id: 'politicas_comu', label: '🛍️ Módulos (alimentos)', type: 'leaf', apiKey: 'asistencia_social' },
            { id: 'ojos_en_alerta', label: '👁️ Ojos en Alerta (Seguridad)', type: 'leaf', apiKey: 'ojos_en_alerta' },
            { id: 'el_digital', label: '📰 Kiosco Digital' },
            { id: 'educacion', label: '📚 Educación', type: 'submenu' },
            { id: 'turismo', label: '🏖️ Turismo' },
            { id: 'deportes', label: '⚽ Deportes' },
            { id: 'salud_menu', label: '🏥 Salud' },
            { id: 'obras', label: '🚧 Reclamos 147' },
            { id: 'seguridad', label: '🛡️ Seguridad' },
            { id: 'produccion', label: '🏭 Producción y Empleo' },
            { id: 'habilitaciones', label: '💰 Habilitaciones' },
            { id: 'omic', label: '🏦 Denuncias Omic', type: 'leaf', apiKey: 'omic_info' },
            { id: 'cultura', label: '🎭 Cultura y Agenda' },
            { id: 'habitat', label: '🏡 Reg demanda Habitacional', type: 'submenu' },
            { id: 'pago_deuda', label: '🅿️ago: Auto, Agua, Inmueble', type: 'submenu' },
            { id: 'contacto_op', label: '☎️ Hablar con Operador', type: 'leaf', apiKey: 'contacto_gral' },
            { id: 'back', label: '⬅️ Volver a Inicio' }
        ]
    },
    rrhh_menu: {
        title: () => '🫱🏻‍🫲🏿 RRHH - Personal Municipal:',
        options: [
            { id: 'medicina_menu', label: '⚕️ Medicina Laboral' },
            { id: 'sueldos_menu', label: '💰 Sueldos y Horas Extra' },
            { id: 'licencias_menu', label: '📅 Vacaciones y Licencias' },
            { id: 'tramites_menu', label: '📝 Certificados y Trámites' },
            { id: 'soy_municipal', label: '🎁 Beneficios Soy Municipal' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    medicina_menu: {
        type: 'card',
        title: () => '⚕️ Medicina Laboral',
        image: 'medicina_laboral.png',
        footer: 'Departamento de Medicina Laboral', 
        options: [{ id: 'back', label: '⬅️ Volver' }]
    },
    sueldos_menu: {
        title: () => '💰 Consultas de Haberes:',
        options: [
            { id: 'recibo', label: '📄 Último Recibo', type: 'leaf', apiKey: 'info_recibos' },
            { id: 'extras', label: '⏰ Horas Extra', type: 'leaf', apiKey: 'construccion' },
            { id: 'sac', label: '💸 Aguinaldo (SAC)', type: 'leaf', apiKey: 'info_sac' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    licencias_menu: {
        title: () => '📅 Gestión de Ausencias:',
        options: [
            { id: 'vacas', label: '🏖️ Mis Vacaciones', type: 'leaf', apiKey: 'construccion' },
            { id: 'medica', label: '🚑 Licencia Médica', type: 'leaf', apiKey: 'info_licencias' },
            { id: 'examen', label: '📚 Licencia por Examen', type: 'leaf', apiKey: 'construccion' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    tramites_menu: {
        title: () => '📝 Trámites de Personal:',
        options: [
            { id: 'esc', label: '🎒 Escolaridad', type: 'leaf', apiKey: 'info_escolaridad' },
            { id: 'antig', label: '🎖️ Certif. Antigüedad', type: 'leaf', apiKey: 'construccion' },
            { id: 'familiar', label: '👥 Grupo Familiar', type: 'leaf', apiKey: 'construccion' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    soy_municipal: {
        title: () => 'Beneficios del Programa Soy Municipal:',
        options: [
            { id: 'soy_desc', label: '🎁 Descuentos y Beneficios', type: 'leaf', apiKey: 'construccion' },
            { id: 'soy_como', label: '📋 ¿Cómo acceder?', type: 'leaf', apiKey: 'construccion' },
            { id: 'soy_reg', label: '📝 Registro y Renovación', type: 'leaf', apiKey: 'construccion' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    // SUBMENÚS DE CHASBOT
    ojos_en_alerta: {
        title: () => '👁️ Ojos en Alerta:',
        options: [
            { id: 'oea_link', label: '🔗 Contacto WhatsApp', link: 'https://wa.me/5492241557444' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    cultura: {
        title: () => '🎭 Agenda Cultural:',
        options: [
            { id: 'ag_actual', label: '📅 Agenda Dinámica', type: 'leaf', apiKey: 'agenda_dinamica' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    el_digital: {
        type: 'card',
        title: () => '🗞️ Kiosco Digital',
        subtitle: 'Noticias y Boletín Oficial',
        image: 'el_digi.png',
        footer: 'Portal Unificado',
        description: `
            Accedé a la información local y oficial desde aquí:<br><br>
            📰 <b>El Digital Chascomús</b><br>
            <i>Noticias y actualidad al instante.</i><br>
            <a href="https://www.eldigitalchascomus.com.ar/" target="_blank" class="wa-btn" style="background-color: #03045e !important; color: white; text-align: center; display: block; margin-top: 5px;">
            🚀 Leer El Digital
            </a> 
            <hr style="border-top: 1px dashed #ccc; margin: 15px 0;">   
            📜 <b>Boletín Oficial (SIBOM)</b><br>
            <i>Decretos y normativas municipales.</i><br>
            <a href="https://sibom.slyt.gba.gob.ar/cities/31/" target="_blank" class="wa-btn" style="background-color: #7f8c8d !important; color: white; text-align: center; display: block; margin-top: 5px;">
            🏛️ Ver Boletín Oficial
            </a>
        `,
        options: [{ id: 'back', label: '⬅️ Volver' }]
    },
    educacion: {
        title: () => '📚 Educación:',
        options: [
            { id: 'edu_info', label: '🎓 Educación y Tribunal', type: 'leaf', apiKey: 'educacion_info' },
            { id: 'ap_info', label: '📢 Actos Públicos (Horarios)', type: 'leaf', apiKey: 'actos_publicos' },
            { id: 'cartelera_web', label: '📊 Cartelera y Listados', type: 'leaf', apiKey: 'cartelera_docente' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    turismo: {
        title: () => 'Turismo y Cultura:',
        options: [
            { id: 't_info', label: 'ℹ️ Oficinas y Contacto', type: 'leaf', apiKey: 'turismo_info' },
            { id: 't_link', label: '🔗 Web de Turismo', link: 'https://linktr.ee/turismoch', target: '_blank' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    deportes: {
        title: () => 'Deportes:',
        options: [
            { id: 'd_info', label: '📍 Dirección de Deportes', type: 'leaf', apiKey: 'deportes_info' },
            { id: 'd_calle', label: '🏃 Circuito de Calle', type: 'leaf', apiKey: 'deportes_circuito' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    desarrollo_menu: {
        title: () => 'Desarrollo Social y Comunitaria:',
        options: [
            { id: 'mediacion', label: '⚖️ Mediación Vecinal', type: 'leaf', apiKey: 'mediacion_info' },
            { id: 'uda', label: '📍 Puntos UDA', type: 'leaf', apiKey: 'uda_info' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    habitat: {
        title: () => 'Secretaría de Hábitat:',
        options: [
            { id: 'habitat', label: '🔑 Info de Hábitat', type: 'leaf', apiKey: 'info_habitat' },
            { id: 'hab_info', label: '📍 Dirección y Contacto', type: 'leaf', apiKey: 'habitat_info' },
            { id: 'hab_plan', label: '🏘️ Planes Habitacionales', type: 'leaf', apiKey: 'habitat_planes' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    salud_menu: {
        title: () => 'Gestión de Salud Pública:',
        options: [
            { id: 'centros', label: '🏥 CAPS (Salitas)' },
            { id: 'hospital_menu', label: '🏥 Hospital' },
            { id: 'f_lista', label: '💊 Farmacias y Turnos', type: 'leaf', apiKey: 'farmacias_lista' },
            { id: 'zoonosis', label: '🐾 Zoonosis', type: 'leaf', apiKey: 'zoo_rabia' },
            { id: 'vac_hu', label: '💉 Vacunatorio', type: 'leaf', apiKey: 'vacunacion_info' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    centros: {
        title: () => 'Centros de Atención Primaria (CAPS):',
        options: [
            { id: 'c_map', label: '📍 Ver Ubicaciones (Mapas)', type: 'leaf', apiKey: 'caps_mapas' },
            { id: 'c_wa', label: '📞 Números de WhatsApp', type: 'leaf', apiKey: 'caps_wa' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    hospital_menu: {
        title: () => 'Hospital Municipal:',
        options: [
            { id: 'h_tur', label: '📅 WhatsApp Turnos', type: 'leaf', apiKey: 'h_turnos' },
            { id: 'h_espec_menu', label: '🩺 Especialidades', type: 'submenu' },
            { id: 'h_guardia', label: '🚨 Guardia e Info', type: 'leaf', apiKey: 'h_info' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    h_espec_menu: {
        title: () => '🩺 Seleccioná la especialidad:',
        options: [
            { id: 'esp_pediatria', label: '👶 Pediatría', type: 'leaf', apiKey: 'info_pediatria' },
            { id: 'esp_clinica', label: '🩺 Clínica Médica', type: 'leaf', apiKey: 'info_clinica' },
            { id: 'esp_gineco', label: '🤰 Ginecología / Obstetricia', type: 'leaf', apiKey: 'info_gineco' },
            { id: 'esp_cardio', label: '❤️ Cardiología', type: 'leaf', apiKey: 'info_cardio' },
            { id: 'esp_trauma', label: '🦴 Traumatología', type: 'leaf', apiKey: 'info_trauma' },
            { id: 'esp_oftalmo', label: '👁️ Oftalmología', type: 'leaf', apiKey: 'info_oftalmo' },
            { id: 'esp_nutri', label: '🍎 Nutrición', type: 'leaf', apiKey: 'info_nutri' },
            { id: 'esp_cirugia', label: '🔪 Cirugía', type: 'leaf', apiKey: 'info_cirugia' },
            { id: 'esp_neuro', label: '🧠 Neurología / Psiquiatría', type: 'leaf', apiKey: 'info_neuro_psiq' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    seguridad: {
        title: () => 'Seguridad y Trámites:',
        options: [
            { id: 'seg_video_a', label: '🎥 Ver Video alcohol al volante', type: 'leaf', apiKey: 'alcohol_info' },
            { id: 'pamuv', label: '🆘 Asistencia Víctima (PAMUV)', type: 'leaf', apiKey: 'pamuv' },
            { id: 'seg_video_b', label: '🎥 Ver Video Instructivo Basapp ', type: 'leaf', apiKey: 'Basapp_info' },
            { id: 'apps_seg', label: '📲 Descargar Apps (Basapp y SEM)', type: 'leaf', apiKey: 'apps_seguridad' },
            { id: 'def_civil', label: '🌪️ Defensa Civil (103)', type: 'leaf', apiKey: 'defensa_civil' },
            { id: 'lic_tramite', label: '🪪 Licencia (Carnet)', type: 'leaf', apiKey: 'lic_turno' },
            { id: 'seg_academia', label: '🚗 Academia Conductores', type: 'leaf', apiKey: 'seg_academia' },
            { id: 'seg_infracciones', label: '⚖️ Mis Infracciones', type: 'leaf', apiKey: 'seg_infracciones' },
            { id: 'poli', label: '📞 Monitoreo y Comisaría', type: 'leaf', apiKey: 'poli' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    habilitaciones: {
        title: () => 'Gestión de Habilitaciones:',
        options: [
            { id: 'hab_video', label: '🎥 Ver Video Instructivo', type: 'leaf', apiKey: 'hab_video_info' },
            { id: 'hab_gral', label: '🏢 Comercio e Industria', type: 'leaf', apiKey: 'hab_gral' },
            { id: 'hab_eventos', label: '🎉 Eventos y Salones', type: 'leaf', apiKey: 'hab_eventos' },
            { id: 'hab_espacio', label: '🍔 Patios y Carros (Foodtruck)', type: 'leaf', apiKey: 'hab_espacio' },
            { id: 'hab_reba', label: '🍷 REBA (Alcohol)', type: 'leaf', apiKey: 'hab_reba' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    pago_deuda: {
        title: () => 'Pago de Deudas y Boletas:',
        options: [
            { id: 'deuda_video', label: '🎥 Ver Video Instructivo', type: 'leaf', apiKey: 'deuda_video_info' },
            { id: 'deuda', label: '🔍 Ver Deuda / Pagar', type: 'leaf', apiKey: 'deuda' },
            { id: 'agua', label: '💧 Agua', type: 'leaf', apiKey: 'agua' },
            { id: 'boleta', label: '📧 Boleta Digital', type: 'leaf', apiKey: 'boleta' },
            { id: 'consulta_tributaria', label: '💸 Consulta Tributaria', type: 'leaf', apiKey: 'consulta_tributaria' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    omic: {
        title: () => 'OMIC - Defensa del Consumidor:',
        options: [
            { id: 'omic_info', label: '📢 OMIC (Defensa Consumidor)', type: 'leaf', apiKey: 'omic_info' }, 
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    produccion: {
        title: () => '🏭 Producción y Empleo:',
        options: [
            { id: 'prod_eco_social', label: '🟢 Economía Social', type: 'submenu' },
            { id: 'prod_of_empleo', label: '🔵 Oficina de Empleo (Busco Trabajo)', type: 'submenu' },
            { id: 'prod_empresas', label: '🟠 Empresas y Emprendedores', type: 'submenu' },
            { id: 'prod_empleadores', label: '🟣 Empleadores (Busco Personal)', type: 'submenu' },
            { id: 'prod_manipulacion', label: '🔴 Carnet Manipulación Alimentos', type: 'leaf', apiKey: 'res_manipulacion' },
            { id: 'prod_contacto', label: '📍 Contacto y Dirección', type: 'leaf', apiKey: 'prod_contacto' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    prod_eco_social: {
        title: () => '🟢 Economía Social:',
        options: [
            { id: 'pe_compre', label: '🤝 Compre Chascomús', type: 'leaf', apiKey: 'res_compre_chascomus' },
            { id: 'pe_frescos', label: '🥦 Productores Alimentos Frescos', type: 'leaf', apiKey: 'res_prod_frescos' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    prod_of_empleo: {
        title: () => '🔵 Oficina de Empleo:',
        options: [
            { id: 'oe_inscripcion', label: '📝 Inscripción / Actualizar CV', type: 'leaf', apiKey: 'res_oe_inscripcion' },
            { id: 'oe_promover', label: '♿ Programa Promover (Discapacidad)', type: 'leaf', apiKey: 'res_oe_promover' },
            { id: 'oe_taller_cv', label: '📄 Taller Armado de CV', type: 'leaf', apiKey: 'res_oe_taller_cv' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    prod_empresas: {
        title: () => '🟠 Empresas y Emprendedores:',
        options: [
            { id: 'emp_chasco', label: '🚀 Chascomús Emprende', type: 'leaf', apiKey: 'res_emp_chasco' }, 
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    prod_empleadores: {
        title: () => '🟣 Empleadores:',
        options: [
            { id: 'empl_busqueda', label: '🔎 Publicar Búsqueda Laboral', type: 'leaf', apiKey: 'res_empl_busqueda' },
            { id: 'empl_madrinas', label: '🤝 Empresas Madrinas', type: 'leaf', apiKey: 'res_empl_madrinas' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    },
    obras: {
        title: () => 'Atención al Vecino 147:',
        options: [
            { id: 'info_147', label: '📝 Iniciar Reclamo 147 (Chat), ℹ️ Info, Web y Teléfonos', type: 'leaf', apiKey: 'link_147' },
            { id: 'poda', label: '🌿 Poda', type: 'leaf', apiKey: 'poda' },
            { id: 'obras_basura', label: '♻️ Recolección', type: 'leaf', apiKey: 'obras_basura' },
            { id: 'back', label: '⬅️ Volver' }
        ]
    }
};

// --- RESPUESTAS (BASE DE DATOS INTEGRADA) ---
const RES = {
    'construccion': `
        <div class="info-card">
            🚧 <b>Módulo en mantenimiento</b><br>
            Estamos actualizando esta información. Por favor, consultá en la oficina de personal.
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
            <strong>💰 Información de Sueldos</strong><br><br>
            Aquí podrás consultar información relacionada con tus sueldos y beneficios.<br><br>
            📅 <b>Período:</b> Primer Medio Aguinaldo (Junio): Suele acreditarse entre el 23 y el 27 de junio.<br>
            📅 <b>Período:</b> Segundo Medio Aguinaldo (Diciembre): Generalmente se deposita alrededor del 20 de diciembre, antes de las festividades.<br>
            📌 <b>Acreditación:</b> El municipio <b>GARANTIZA</b> que los fondos estén disponibles en las cuentas de los empleados antes de finalizar el mes correspondiente..<br>
            📎 <b>Formato:</b> PDF o Documento Digital.<br>
            📎 <b>Intranet:</b> <a href="https://intranet.chascomus.gob.ar" target="_blank" class="wa-btn">📤 Ingresar a la Intranet</a>
        </div>`,

    'info_escolaridad': `
        <div class="info-card">
            <strong>🎒 Certificado de Escolaridad</strong><br><br>
            Recordá que para cobrar la Ayuda Escolar Anual es obligatorio presentar el certificado.<br><br>
            📅 <b>Vencimiento:</b> 31 de Marzo.<br>
            📎 <b>Formato:</b> PDF o Foto clara.<br>
            <a href="https://forms.gle/tu_link_de_google_forms" target="_blank" class="wa-btn">📤 Subir Certificado Acá</a>
        </div>`,
    'info_licencias': `
        <div class="info-card">
            <strong>🚑 Licencias Médicas</strong><br><br>
            Si estás enfermo, debés avisar antes de las 9:00 AM.<br><br>
            📞 <b>Auditoría Médica:</b> 43-1234<br>
            📍 <b>Lugar:</b> Hospital Municipal (Consultorio 4).<br>
            <i>Recordá llevar certificado con diagnóstico y días de reposo.</i>
        </div>`,
    'agenda_dinamica': `<div class="info-card">⚠️ <b>Cargando agenda...</b><br>Si esto no cambia en unos segundos, revisá tu conexión.</div>`,
    'error_busqueda': `
        <div class="info-card" style="border-left: 5px solid #ffc107;">
            <div style="font-size: 1.1rem; margin-bottom: 8px;">🤔 <b>¡Ups! No encontré eso</b></div>
            <p style="font-size: 0.9rem; margin-bottom: 15px; color: #333;">
                Todavía estoy aprendiendo. ¿Probamos con otra palabra o querés ver el menú completo?
            </p>
            <button onclick="resetToMain()" class="menu-btn" style="width: 100%; padding: 12px; background-color: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px;">
                ☰ Ver Menú Completo
            </button>
        </div>`,
    'educacion_info': `
        <div class="info-card">
            <strong>🎓 Educación, Infancias y Juventudes</strong><br>
            <i>Subsecretario: Lic. Enrique Inciarte</i><br><br>
            📍 <b>Dirección de Educación:</b><br>
            Mendoza 95, esq. Moreno.<br>
            ⏰ Lun a Vie de 8 a 14 hs.<br><br>
            📞 <b>Vías de contacto:</b><br>
            <div style="display:flex; gap:5px; flex-wrap:wrap; margin-top:5px;">
                <a href="tel:02241430332" class="wa-btn" style="flex:1; background-color:#004a7c !important; text-align:center; min-width: 120px;">📞 Fijo 43-0332</a>
               <a href="https://wa.me/5492241569898" target="_blank" class="wa-btn" style="flex:1; background-color:#25D366 !important; text-align:center; min-width: 120px;">
                💬 WhatsApp 56-9898</a>
            </div> <br> 📧 <a href="mailto:educacion@chascomus.gob.ar">educacion@chascomus.gob.ar</a><br>
            <small><i>Admin: M. Lastero y L. Dellavalle</i></small>
            <hr style="border-top: 1px dashed #ccc; margin: 15px 0;">
            ⚖️ <b>Tribunal de Clasificación Docente</b><br>
            📅 Lunes y Miércoles 16 a 17:30 hs.<br>
            👥 <i>Sallenave, Ganuza, Esain e Inciarte.</i><br><br>
            📧 <a href="mailto:tribunalmunicipalchascomus@gmail.com" class="wa-btn" style="background-color:#e67e22 !important; display:block; text-align:center;">✉️ Email Tribunal</a>
        </div>`,
    'actos_publicos': `
        <div class="info-card" style="border-left: 5px solid #2980b9;">
            <strong>📢 Actos Públicos Presenciales (AP)</strong><br>
            <i>Designación de cargos docentes</i><br><br>
            📅 <b>¿Cuándo?</b><br>
            Se realizan todos los días (Lun a Vie).<br><br>
            ⏰ <b>Horarios (Puntual):</b><br>
            ☀️ Mañana: <b>08:45 hs</b><br>
            🕐 Tarde: <b>12:45 hs</b><br><br>
            📍 <b>Lugar:</b> Mendoza 95.<br><br>
            ⚠️ <b>Requisito Excluyente:</b><br>
            Presentarse con <b style="color:#c0392b; text-decoration: underline;">DNI FÍSICO</b>.<br>
            <small>(No se acepta DNI digital en el celular).</small><br><br>
            <hr style="border-top: 1px dashed #ccc; margin: 10px 0;">
            👤 <b>¿Envías un representante?</b><br>
            Debe presentar sin excepción:<br><br>
            1️⃣ <a href="https://docs.google.com/document/d/1EMRh4aS-bGvaayc7RrXReb950zW4dXHrOxODatNoark/edit?tab=t.0&usp=sharing" target="_blank" style="color: #2980b9; font-weight: bold; text-decoration: underline;">📄 Descargar Acta Poder</a><br>
            2️⃣ Copia de DNI (del docente y del representante).<br>
            3️⃣ <a href="https://docs.google.com/document/d/19iBlPe4QvzMT1G1_SI5KmNOJ9MjSJxHy/edit?usp=sharing" target="_blank" style="color: #2980b9; font-weight: bold; text-decoration: underline;">📜 Estatuto Docente Municipal</a><br><br>
            <a href="https://www.google.com/maps/search/?api=1&query=Mendoza+95+Chascomus" target="_blank" class="wa-btn" style="background-color: #004a7c !important;">
                📍 Ver Ubicación en Mapa
            </a>
        </div>`,
    'cartelera_docente': `
        <div class="info-card" style="border-left: 5px solid #27ae60;">
            <strong>📊 Cartelera en Línea (Actos Públicos)</strong><br>
            <i>Actualización en tiempo real</i><br><br>
            En esta planilla se publican los <b>cargos/horas a cubrir</b> y los resultados (designaciones o desiertos).<br><br>
            <a href="https://docs.google.com/spreadsheets/d/15w5mnPVqRsaebkZ-zAmrum8ndqh5MhoWkMDc9j8J7tM/edit?gid=0#gid=0" target="_blank" class="wa-btn" style="background-color: #27ae60 !important; text-align: center; display: block;">
                ✅ Ver Cartelera y Designaciones</a>
            <hr style="border-top: 1px dashed #ccc; margin: 15px 0;">
            <strong>🏆 Resultados Titularizaciones 2026</strong><br>
            <small>📅 Publicado: 22/12/2025</small><br><br>
            Los resultados del Acto de Titularizaciones pueden observarse aquí:<br><br>
            <a href="https://docs.google.com/spreadsheets/d/1ZzYjG5drCNG50gWmmdheHYfUygtz0XK1hWfLSoAwcyk/edit?gid=0#gid=0" target="_blank" class="wa-btn" style="background-color: #2980b9 !important; text-align: center; display: block;">
                📄 Ver Planilla Titularizaciones</a>
            <hr style="border-top: 1px dashed #ccc; margin: 15px 0;">
            <strong>📂 Listados Oficiales 2026</strong><br>
            <small style="color: #e67e22;">🚧 (En proceso de actualización)</small><br><br>
            👇 <i>Consultá por nivel:</i><br>
            <ul style="padding-left: 20px; margin-top: 5px;">
                <li>🎒 <b>Inicial</b></li>
                <li>✏️ <b>Primaria</b></li>
                <li>📖 <b>Secundaria</b></li>
               <li>🤝 <b>Psicología (EOE)</b></li>
            </ul> <br><a href="https://docs.google.com/spreadsheets/d/15731Nf1EuRPRv8Z8isPW_-_VNawWyiuHMhnFWH70W14/edit?gid=0#gid=0" target="_blank" class="wa-btn" style="background-color: #7f8c8d !important; font-size: 0.85rem;">
                🔗 Ver carpeta de Listados
            </a>
        </div>`,
    'omic_info': `
        <div class="info-card">
            <strong>📢 OMIC (Defensa del Consumidor)</strong><br>
            Oficina Municipal de Información al Consumidor.<br><br>
            ⚖️ <b>Asesoramiento y Reclamos:</b><br>
            Protección de derechos en compras y servicios.<br><br>
            📍 <b>Dirección:</b> Dorrego 229 (Estación Ferroautomotora).<br>
            ⏰ <b>Horario:</b> Lunes a Viernes de 8:00 a 13:00 hs.<br>
            📞 <b>Teléfonos:</b> 43-1287 / 42-5558
        </div>`,
    'caps_wa': `
        <div class="info-card">
            <strong>📞 WhatsApp de los CAPS:</strong><br><br>
            🟢 <b>30 de Mayo:</b> <a href="https://wa.me/5492241588248">2241-588248</a><br>
            🟢 <b>Barrio Jardín:</b> <a href="https://wa.me/5492241498087">2241-498087</a><br>
            🟢 <b>San Luis:</b> <a href="https://wa.me/5492241604874">2241-604874</a><br>
            🟢 <b>El Porteño:</b> <a href="https://wa.me/5492241409316">2241-409316</a><br>
            🟢 <b>Gallo Blanco:</b> <a href="https://wa.me/5492241469267">2241-469267</a><br>
            🟢 <b>Iporá:</b> <a href="https://wa.me/5492241588247">2241-588247</a><br>
            🟢 <b>La Noria:</b> <a href="https://wa.me/5492241604872">2241-604872</a><br>
            🟢 <b>San Cayetano:</b> <a href="https://wa.me/5492241511430">2241-511430</a>
        </div>`,
    'caps_mapas': `
        <div class="info-card">
            <strong>📍 Ubicaciones CAPS (Toque para ver mapa):</strong><br><br>
            • <a href="https://www.google.com/maps/search/?api=1&query=CIC+30+de+Mayo+Chascomus" target="_blank">CIC 30 de Mayo</a> (Bvd. 5 y Calle 2)<br>
            • <a href="https://www.google.com/maps/search/?api=1&query=Barrio+Jardin+Chascomus" target="_blank">Barrio Jardín</a> (Tucumán e/ Quintana)<br>
            • <a href="https://www.google.com/maps/search/?api=1&query=CAPS+San+Luis+Chascomus" target="_blank">San Luis</a> (Chubut 755)<br>
            • <a href="https://www.google.com/maps/search/?api=1&query=CAPS+El+Porteño+Chascomus" target="_blank">El Porteño</a> (Lucio Mansilla)<br>
            • <a href="https://www.google.com/maps/search/?api=1&query=CAPS+Gallo+Blanco+Chascomus" target="_blank">Gallo Blanco</a> (Estados Unidos)<br>
            • <a href="https://www.google.com/maps/search/?api=1&query=CAPS+Ipora+Chascomus" target="_blank">Iporá</a> (Sargento Cabral 387)<br>
            • <a href="https://www.google.com/maps/search/?api=1&query=CAPS+La+Noria+Chascomus" target="_blank">La Noria</a> (Grito de Dolores)<br>
            • <a href="https://www.google.com/maps/search/?api=1&query=CAPS+San+Cayetano+Chascomus" target="_blank">San Cayetano</a> (Gabino Ezeiza)
        </div>`,
    'link_147': `
        <div class="info-card">
            <strong>📝 ATENCIÓN AL VECINO 147</strong><br><br>
            💻 <b>Primera opción:</b> Web Autogestión (24/7):<br>
            Cargá tu ticket y seguí el caso.<br>
            🔗 <a href="https://147.chascomus.gob.ar" target="_blank">147.chascomus.gob.ar</a><br><br>
            📧 <b>Correo:</b> <a href="mailto:atencionalvecino@chascomus.gob.ar">atencionalvecino@chascomus.gob.ar</a><br><br>
            <b>Utilizar como última opción:</b><br>
            📞 <b>Teléfono (Línea 147):</b><br>
            Lun a Vie de 8 a 15 horas.<br>
        </div>`,
    'poda': `<div class="info-card"><strong>🌿 Poda</strong><br>🔗 <a href="https://apps.chascomus.gob.ar/podaresponsable/solicitud.php">Solicitud Poda</a></div>`,
    'obras_basura': `<div class="info-card"><strong>♻️ Recolección</strong><br>Lun a Sáb 20hs (Húmedos)<br>Jueves 14hs (Reciclables)</div>`,
    'farmacias_lista': `
        <div class="info-card">
            <strong>📍 Farmacias en Chascomús:</strong><br><br>
            • <b>Alfonsín:</b> Libres del Sur 121<br>
            • <b>Aprile:</b> Av. Lastra 115<br>
            • <b>Batastini:</b> Cramer 70<br>
            • <b>Belgrano:</b> Belgrano 649<br>
            • <b>Bellingieri:</b> H. Yrigoyen 78<br>
            • <b>Cangialosi:</b> Garay 56<br>
            • <b>Chascomús:</b> Av. Lastra 350<br>
            • <b>Del Norte:</b> El Ombú 102<br>
            • <b>Farmasur:</b> Bahía Blanca 91<br>
            • <b>Malena:</b> Escribano y Machado<br>
            • <b>Moriset:</b> Av. Lastra 591<br>
            • <b>Oria:</b> Libres del Sur 413<br>
            • <b>Pasteur:</b> Libres del Sur 302<br>
            • <b>Pensa:</b> H. Yrigoyen 710<br>
            • <b>Pozzi:</b> Rioja 28<br>
            • <b>Puyssegur:</b> Libres del Sur 946<br><br>
            💊 <a href="https://farmaciasdeturnoya.com.ar/localidad/chascomus-P0-C29-Z9" target="_blank" class="wa-btn" style="background:#2ecc71 !important;">VER FARMACIAS DE TURNO</a>
        </div>`,
    'zoo_rabia': `
        <div class="info-card" style="border-left: 5px solid #f1c40f;">
            <strong style="color:#d35400;">🐾 Quirófano Móvil (Castración)</strong><br><br>
            📅 <b>Lunes 3 de Febrero</b><br>
            ⏰ <b>A partir de las 8:30hs</b><br>
            📍 <b>Barrio Los Sauces</b> (Destacamento policial)<br><br>
            ✅ <b>GRATIS</b> - Revisación Clínica.<br>
            🐕 <b>Requisito:</b> Llevar la mascota con collar, correa y/o transportadora.<br><br>
            🏢 <b>Sede Zoonosis:</b> Mendoza 95.
        </div>`,
    'vacunacion_info': `
        <div class="info-card">
            <strong>💉 Vacunación</strong><br><br>
            🏥 <b>Hospital San Vicente de Paul:</b><br>
            Vacunatorio central. Prioridad: Niños (6m a 2a), gestantes y puérperas.<br><br>
            🏠 <b>Puntos Barriales:</b><br>
            CIC "Dr. Quintín" (30 de Mayo) y otros CAPS.<br><br>
            📋 <b>Info Importante:</b><br>
            • <b>Demanda espontánea</b> (No requiere orden médica).<br>
            • <b>Requisitos:</b> Llevar DNI y Libreta de Vacunación.<br><br>
            📱 <i>Consultá las redes de "Secretaría de Salud Chascomús" para horarios actualizados.</i>
        </div>`,
    'info_habitat': `
        <div class="info-card">
            <strong>🔑 Info de Hábitat</strong><br>
            • Registro de Demanda (Mayores de 18).<br>
            • Bien de Familia (Protección jurídica).<br>
            • Gestión de Tierras y Catastro.<br><br>
            👇 <b>Seleccioná una opción:</b>
        </div>`,
    'habitat_info': `
        <div class="info-card">
            <strong>📍 Dirección y contacto</strong><br>
            <i>Dirección de Hábitat y Tierras</i><br><br>
            <a href="https://wa.me/5492241559412" target="_blank" class="wa-btn" style="background-color: #25D366 !important; margin-bottom: 8px;">
                💬 Consultas WhatsApp
            </a>
            <a href="https://www.google.com/maps/search/?api=1&query=Dorrego+y+Bolivar+Chascomus" target="_blank" class="wa-btn" style="background-color: #e67e22 !important; margin-bottom: 8px;">
                📍 Dorrego y Bolivar (Ex IOMA)
            </a>
        </div>`,
    'habitat_planes': `
        <div class="info-card">
            <strong>🏘️ Planes Habitacionales</strong><br>
            <i>Programas de vivienda social y acceso a la tierra</i><br><br>
            📋 <b>Trámites Disponibles:</b><br>
            1. Registro de Demanda Habitacional.<br>
            2. Solicitud de Bien de Familia.<br>
            3. Consultas sobre Planes de Vivienda.<br><br>
            <a href="https://apps.chascomus.gob.ar/vivienda/" target="_blank" class="wa-btn" style="background-color: #004a7c !important;">
            🔗 Planes Habitacionales
            </a>
        </div>`,
    'ojos_en_alerta': `
        <div class="info-card">
            <strong>👀 OJOS (En alerta)</strong><br>
            Programa de seguridad ciudadana.<br><br>
            ⚖️ <b>Denuncias, Robo, Accidentes, Actitudes sospechosas, etc.:</b><br>
            Protección de derechos del ciudadano.<br><br>
            📍 <b>Dirección:</b> Arenales y Julian quintana.<br>
            ⏰ <b>Horario:</b> Lunes a Lunes 24hs.<br>
            <a href="https://wa.me/5492241557444" target="_blank" class="wa-btn" style="background-color: #efe8e3ff !important; color: #333;">
            📲 Por cualquier info (WhatsApp)
            </a>
        </div>`,
    'pamuv': `<div class="info-card" style="border-left: 5px solid #c0392b;"><strong style="color: #c0392b;">🆘 PAMUV (Asistencia a la Víctima)</strong><br><br>Atención, contención y asesoramiento a personas víctimas de delitos o situaciones de violencia.<br><br>🛡️ <b>Plan Integral de Seguridad 2025-2027</b><br><br>🚨 <b>ATENCIÓN 24 HORAS:</b><br>Línea permanente para emergencias o consultas.<br><a href="https://wa.me/5492241514881" class="wa-btn" style="background-color: #c0392b !important;">📞 2241-514881 (WhatsApp)</a></div>`,
    'defensa_civil': `<div class="info-card" style="border-left: 5px solid #c0392b;">
        <strong style="color: #c0392b;">🌪️ Defensa Civil</strong><br><br>
        🚨 <b>LÍNEA DE EMERGENCIA:</b><br>
        Atención ante temporales, caída de árboles y riesgo en vía pública.<br>
        📞 <a href="tel:103" class="wa-btn" style="background-color: #c0392b !important; text-align:center; display:block;">LLAMAR AL 103</a><br>
        📧 <a href="mailto:defensa.civil@chascomus.gob.ar">Enviar Correo Electrónico</a></div>`,
    'Basapp_info': `
        <div class="info-card">
            <strong>🎥 Guía de Basapp</strong><br><br>
            <video width="100%" height="auto" controls style="border-radius: 8px; border: 1px solid #ddd;">
                <source src="videos/Basapp.mp4" type="video/mp4">
                Tu navegador no soporta el video.
            </video>
            <br><br>
            <p style="font-size: 0.85rem; color: #555;">
                Mirá este breve tutorial sobre cómo usar la app Basapp.
            </p>
        </div>`,
    'apps_seguridad': `
        <div class="info-card">
            <strong>📲 Aplicaciones de Seguridad y Tránsito</strong><br><br>
            🔔 <b>BASAPP (Alerta Vecinal):</b><br>
            Botón antipánico y reportes.<br>
            🤖 <a href="https://play.google.com/store/apps/details?id=ar.com.basapp.android.client" target="_blank" rel="noopener noreferrer">Descargar Android</a><br>
            🍎 <a href="https://apps.apple.com/ar/app/basapp/id1453051463" target="_blank" rel="noopener noreferrer">Descargar iPhone</a><br><br>
            
            🅿️ <b>SEM (Estacionamiento Medido):</b><br>
            Gestioná tu estacionamiento.<br>
            🤖 <a href="https://play.google.com/store/apps/details?id=ar.edu.unlp.semmobile.chascomus" target="_blank" rel="noopener noreferrer">Descargar Android</a><br>
            🍎 <a href="https://apps.apple.com/ar/app/sem-mobile/id1387705895" target="_blank" rel="noopener noreferrer">Descargar iPhone</a>
        </div>`,
    'alcohol_info': `
        <div class="info-card">
            <strong>🎥 Guía de alcohol al volante</strong><br><br>
            <video width="100%" height="auto" controls style="border-radius: 8px; border: 1px solid #ddd;">
                <source src="videos/Alcohol_al_volante.mp4" type="video/mp4">
                Tu navegador no soporta el video.
            </video>
            <br><br>
            <p style="font-size: 0.85rem; color: #555;">
                Mirá este breve tutorial sobre alcohol al volante.
            </p>
        </div>`,
    'seg_infracciones': `<div class="info-card"><strong>⚖️ Infracciones:</strong><br>🔗 <a href="https://chascomus.gob.ar/municipio/estaticas/consultaInfracciones" style="background-color:#25D366" target="_blank">VER MIS MULTAS</a></div>`,
    'seg_academia': `<div class="info-card"><strong>🚗 Academia de Conductores</strong><br>Turnos para cursos y exámenes teóricos.<br>🔗 <a href="https://apps.chascomus.gob.ar/academia/" target="_blank">INGRESAR A LA WEB</a></div>`,
    'seg_medido': `<div class="info-card"><strong>🅿️ Estacionamiento Medido</strong><br>Gestioná tu estacionamiento desde el celular.<br><br>📲 <b>Descargar App:</b><br>🤖 <a href="https://play.google.com/store/apps/details?id=ar.edu.unlp.sem.mobile.chascomus" target="_blank">Android (Google Play)</a><br>🍎 <a href="https://apps.apple.com/ar/app/sem-mobile/id1387705895" target="_blank">iPhone (App Store)</a><br><br>💻 <a href="https://chascomus.gob.ar/estacionamientomedido/" target="_blank">Gestión vía Web</a></div>`,
    'lic_turno': `<b>📅 Turno Licencia:</b><br>🔗 <a href="https://apps.chascomus.gob.ar/academia/">SOLICITAR TURNO</a>`,
    'poli': `
        <div class="info-card">
            <strong>🎥 (MONITOREO)</strong><br><br>
            Secretaría de Seguridad Ciudadana y el Centro de Monitoreo.<br><br>
            ☎️ <b>Para comunicarte:</b><br>
            <a href="tel:43-1333" class="wa-btn" style="background-color:#25D366 !important; text-align:center;">📞 43-1333</a><br>
            <small><i>⚠️ Solo emergencias.</i></small><br><br>
             🚔 <b>POLICIA:</b><br>
            Solicitalo a <a href="tel:422222" class="wa-btn" style="background-color:#25D366 !important; text-align:center;">📞 42-2222</a><br><br>
        </div>`,
    'turismo_info': `<div class="info-card"><strong>🏖️ Subsecretaría de Turismo</strong><br>📍 Av. Costanera España 25<br>📞 <a href="tel:02241615542">02241 61-5542</a><br>📧 <a href="mailto:turismo@chascomus.gob.ar">Enviar Email</a><br>🔗 <a href="https://linktr.ee/turismoch" target="_blank">Más info en Linktree</a></div>`,
    'deportes_info': `<div class="info-card"><strong>⚽ Dirección de Deportes</strong><br>📍 Av. Costanera España y Av. Lastra<br>📞 <a href="tel:02241424649">(02241) 42-4649</a></div>`,
    'deportes_circuito': `<div class="info-card"><strong>🏃 Circuito de Calle</strong><br>Inscripciones, cronograma y resultados oficiales.<br>🔗 <a href="https://apps.chascomus.gob.ar/deportes/circuitodecalle/" target="_blank">IR A LA WEB</a></div>`,
    'politicas_gen': `
        <div class="info-card" style="border-left: 5px solid #9b59b6;">
            <strong style="color: #8e44ad; font-size: 1rem;">💜 Género y Diversidad</strong><br><br>
            <div style="font-size: 0.85rem; margin-bottom: 12px;">
                🚨 <b>Guardia 24/7:</b> Orientación y acompañamiento en casos de violencia.<br>
                🧠 <b>Equipo Técnico:</b> Abogadas, psicólogas y trabajadoras sociales.<br>
                🏠 <b>Hogar de Tránsito:</b> Alojamiento temporal para mujeres en riesgo.<br>
                🗣️ <b>Varones:</b> Espacio de abordaje y deconstrucción de conductas violentas.<br>
                👮‍♀️ <b>Articulación:</b> Trabajo conjunto con Comisaría de la Mujer.
            </div>
            <div style="background: #fdf2ff; padding: 10px; border-radius: 8px; font-size: 0.9rem;">
                📍 <b>Oficina:</b> Moreno 259 (Lun-Vie 9-14hs)<br>
                ☎️ <b>Fijo Oficina:</b> <a href="tel:02241530448">2241-530448</a><br>
                🚓 <b>Comisaría Mujer:</b> <a href="tel:02241422653">42-2653</a>
            </div>
            <a href="https://wa.me/5492241559397" target="_blank" class="wa-btn" style="background-color: #8e44ad !important;">🚨 GUARDIA 24HS (WhatsApp)</a>
        </div>`,
    'asistencia_social': `
        <div class="info-card" style="border-left: 5px solid #e67e22;">
            <strong style="color: #d35400; font-size: 1rem;">🍎 Módulos Alimentarios (CAM)</strong><br><br>
            <div style="font-size: 0.85rem; margin-bottom: 12px;">
                📦 <b>RETIRO DE MERCADERÍA:</b><br>
                Entrega mensual de módulos de alimentos secos para familias empadronadas.<br><br>
                📋 <b>Requisitos al retirar:</b><br>
                • Presentar DNI del titular (Obligatorio).<br>
                • Certificado médico (si corresponde a dieta celíaca).
            </div>
            <div style="background: #edb482ff; padding: 10px; border-radius: 8px; font-size: 0.9rem; border: 1px solid #ffe0b2;">
                📍 <b>Lugar de Retiro:</b><br>
                Depósito de calle Juárez (casi esquina Mazzini).<br><br>
                ⏰ <b>Horario:</b><br>
                Lunes a Viernes de 8:00 a 14:00 hs.<br><br>
                🏢 <b>Trámites y Empadronamiento:</b><br>
                Secretaría de Desarrollo (Moreno 259).
            </div><br>
            <a href="https://wa.me/5492241530478" target="_blank" class="wa-btn" style="background-color: #d35400 !important;">📲 Consultar Cronograma (WhatsApp)</a>
        </div>`,
    'ninez': `<div class="info-card"><strong>👶 Niñez:</strong> Mendoza Nº 95. 📞 43-1146.</div>`,
    'mediacion_info': `<div class="info-card"><strong>⚖️ Mediación Comunitaria</strong><br>Resolución pacífica y gratuita de conflictos vecinales (ruidos, mascotas, edilicios).<br>📍 <b>Acercate a:</b> Moreno 259.</div>`,
    'uda_info': `<div class="info-card"><strong>📍 Puntos UDA (Atención en Barrios)</strong><br><i>Acercate a tu punto más cercano:</i><br><br>🔹 <b>UDA 1 (San Luis):</b> Chubut 755 (Mar/Vie 9-12).<br>🔹 <b>UDA 2 (San José Obrero):</b> F. Chapa 625 (Mar/Vie 9-12).<br>🔹 <b>UDA 3 (El Porteño):</b> Mansilla y Calle 3 (Vie 9-12).<br>🔹 <b>UDA 4 (30 de Mayo):</b> Bvd. 5 y Calle 2 (Vie 9-12).<br>🔹 <b>UDA 5 (B. Jardín):</b> J. Quintana e/ Misiones (Mar/Mié 9-12).<br>🔹 <b>UDA 6 (Gallo Blanco):</b> EE.UU. y Las Flores (Lun 9-12).<br>🔹 <b>UDA 7 (San Cayetano):</b> Comedor (Mar 9-12).<br>🔹 <b>UDA 8 (Políticas Com.):</b> Sarmiento 42 (Lun-Vie 8-12).<br>🔹 <b>UDA 9 (Iporá):</b> Perú y S. Cabral (Jue 9-12).<br><br>🚨 <b>Guardia 24hs:</b> <a href="https://wa.me/5492241559397">2241-559397</a></div>`,
    'hac_tomasa': `<div class="info-card"><strong>🌾 TOMASA:</strong><br>ℹ️ Portal de autogestión.<br>🔗 <a href="https://tomasa.chascomus.gob.ar/">INGRESAR</a></div>`,
    'deuda_video_info': `
        <div class="info-card">
            <strong>🎥 La muni Invierte</strong><br><br>
            <video width="100%" height="auto" controls style="border-radius: 8px; border: 1px solid #ddd;">
                <source src="videos/" type="video/mp4">
                Tu navegador no soporta el video.
            </video>
            <br><br>
            <p style="font-size: 0.85rem; color: #555;">
                Mirá este breve tutorial sobre cómo iniciar tu trámite de habilitación comercial 100% online.
            </p>
        </div>`,
    'boleta': `<div class="info-card"><strong>📧 BOLETA DIGITAL</strong><br>🟢 <i>Para inscribirse comunicarse por estas vías:</i><br>📲: <a href="https://wa.me/5492241557616">2241-557616</a><br>📧 <a href="mailto:ingresospublicos@chascomus.gob.ar">Email</a></div>`,
    'agua': `<div class="info-card"><strong>💧 CONSUMO DE AGUA</strong><br>ℹ️ Para conocer y pagar su consumo ingrese a este Link:<br>🔗 <a href="https://apps.chascomus.gob.ar/caudalimetros/consulta.php">VER MI CONSUMO</a></div>`,
    'consulta_tributaria': `
        <div class="info-card">
            <strong>💸 CONSULTA TRIBUTARIA</strong><br><br>
            Ingresos Públicos.<br><br>
            ☎️ <b>Para comunicarte:</b><br>
            📲 <a href="https://wa.me/5492241557616">2241-557616</a><br>
            📧 <a href="mailto:ingresospublicos@chascomus.gob.ar">ingresospublicos@chascomus.gob.ar</a><br><br>
            Seleccione tipo de cuenta 🏠<b>INMUEBLE</b> para deudas de Servicios Sanitarios y Alumbrado Público Empresas (ALPEM).<br>
            Seleccione tipo de cuenta 🏢<b>COMERCIO</b> para deudas de Seguridad e Higiene.<br>
            Seleccione tipo de cuenta 🚗<b>VEHÍCULOS</b> para deudas relacionadas con Impuesto Automotor o Patentes de Rodados Menores.<br>
            Seleccione tipo de cuenta 👤<b>CONTRIBUYENTE</b> para deudas de Marcas y señales (Guías) y 16 Viviendas.<br>
            Seleccione <b>PERÍODOS ADEUDADOS</b> para listar los períodos impagos de tasas.<br>
            Seleccione <b>CUOTAS DE CONVENIO</b> para listar las cuotas de convenio de pago vigentes.<br><br>
            🔗 <a href="https://deuda.chascomus.gob.ar/consulta.php">CONSULTAR AQUÍ</a>
        </div>`,
    'deuda': `<div class="info-card"><strong>🔍 CONSULTA DEUDA</strong><br>💸 Para ver sus impuestos:<br>🏠<b>INMOBILIARIO</b><br>👤<b>CONTRIBUYENTE</b><br>⚰️<b>CEMENTERIO</b><br>🔗 <a href="https://pagos.chascomus.gob.ar/#destino=imponible">CONSULTAR AQUÍ</a></div>`,
    'hab_gral': `
        <div class="info-card">
            <strong>🏢 Habilitación Comercial / Industrial</strong><br><br>
            <i>Para comercios, industrias y servicios.</i><br><br>
            📋 <b>Requisitos Principales:</b><br>
            • DNI (Mayor de 21 años).<br>
            • Constancia CUIT e IIBB.<br>
            • Título Propiedad/Alquiler (Firmas certificadas).<br>
            • Libre deuda Tasas Municipales.<br>
            • Certificado Urbanístico.<br><br>
            📍 <b>Presencial:</b> Maipú 415 (Producción).<br><br>
            🚀 <a href="https://apps.chascomus.gob.ar/habilitaciones/habilitacionComercial.php" target="_blank" class="wa-btn">INICIAR TRÁMITE ONLINE</a>
        </div>`,
    'hab_eventos': `
        <div class="info-card">
            <strong>🎉 Eventos y Salones de Fiesta</strong><br>
            <i>Regulado por Ord. 5660, 5672 y 5923.</i><br><br>
            ⚠️ <b>Plazos:</b><br>
            Solicitar con <b>10 días hábiles</b> de anticipación.<br><br>
            🚒 <b>Requisito Bomberos:</b><br>
            Se exige certificado final de obra (Bomberos Dolores).<br>
            📧 tecnica_dolores@hotmail.com<br>
            📞 (02245) 44-6107<br><br>
            📝 <a href="https://apps.chascomus.gob.ar/habilitaciones/habilitacionEventoPrivado2.0.php" target="_blank">IR AL FORMULARIO</a>
        </div>`,
    'hab_espacio': `
        <div class="info-card">
            <strong>🍔 Uso de Espacio Público</strong><br>
            <i>Patios gastronómicos y Foodtrucks.</i><br><br>
            📋 <b>Requisitos:</b><br>
            • DNI y CUIT del titular.<br>
            • Curso manipulación de alimentos (todo el personal).<br>
            • Título del vehículo/carro.<br>
            • Seguros (Vehículo + Responsabilidad Civil).<br>
            • Domicilio en Chascomús.<br><br>
            📝 <a href="https://apps.chascomus.gob.ar/habilitaciones/habilitacionCarro.php" target="_blank">SOLICITAR PERMISO</a>
        </div>`,
    'hab_reba': `
        <div class="info-card">
            <strong>🍷 Registro de Alcohol (REBA)</strong><br><br>
            Obligatorio para comercializar bebidas alcohólicas.<br><br>
            📲 <b>WhatsApp HABILITACIONES:</b><br>
            <a href="https://wa.me/5492241559389" class="wa-btn" style="background-color:#25D366 !important; text-align:center;">💬 2241-559389</a><br>
            <small><i>⚠️ Solo mensajes escritos o audios. No llamadas.</i></small><br><br>
            📧 <b>Por Email:</b><br>
            Solicitalo a <a href="mailto:habilitaciones@chascomus.gob.ar">habilitaciones@chascomus.gob.ar</a><br><br>
            🏦 <b>Pago:</b> Recibirás una boleta para abonar en Banco Provincia.
        </div>`,
    'h_turnos': `
        <div class="info-card">
            <strong>📍 Hospital Municipal:</strong> Av. Alfonsín e Yrigoyen.<br>🚨 Guardia 24 hs.<br>
            <a href="https://wa.me/5492241466977" target="_blank" class="wa-btn" style="background-color: #efe8e3ff !important; color: #333;">
                📲 Consultar por turnos (WhatsApp)
            </a>
        </div>`,
    'info_pediatria': `
        <div class="info-card">
            <strong>👶 Pediatría</strong><br>
            <i>Atención en Consultorios Externos</i><br><br>
            📅 <b>Días:</b> Lunes, Martes y Jueves.<br><br>
            👇 <i>Sacá turno por WhatsApp:</i>
            <a href="https://wa.me/5492241466977" target="_blank" class="wa-btn">📅 SOLICITAR TURNO</a>
        </div>`,
    'info_clinica': `
        <div class="info-card">
            <strong>🩺 Clínica Médica</strong><br><br>
            📅 <b>Días:</b> Lunes, Miércoles y Viernes.<br><br>
            👇 <i>Sacá turno por WhatsApp:</i>
            <a href="https://wa.me/5492241466977" target="_blank" class="wa-btn">📅 SOLICITAR TURNO</a>
        </div>`,
    'info_gineco': `
        <div class="info-card">
            <strong>🤰 Salud de la Mujer</strong><br><br>
            🔹 <b>Ginecología:</b> Lunes.<br>
            🔹 <b>Obstetricia:</b> Miércoles.<br><br>
            👇 <i>Sacá turno por WhatsApp:</i>
            <a href="https://wa.me/5492241466977" target="_blank" class="wa-btn">📅 SOLICITAR TURNO</a>
        </div>`,
    'info_cardio': `
        <div class="info-card">
            <strong>❤️ Cardiología</strong><br><br>
            📅 <b>Días:</b> Martes.<br><br>
            👇 <i>Sacá turno por WhatsApp:</i>
            <a href="https://wa.me/5492241466977" target="_blank" class="wa-btn">📅 SOLICITAR TURNO</a>
        </div>`,
    'info_trauma': `
        <div class="info-card">
            <strong>🦴 Traumatología</strong><br><br>
            📅 <b>Días:</b> Martes.<br><br>
            👇 <i>Sacá turno por WhatsApp:</i>
            <a href="https://wa.me/5492241466977" target="_blank" class="wa-btn">📅 SOLICITAR TURNO</a>
        </div>`,
    'info_oftalmo': `
        <div class="info-card">
            <strong>👁️ Oftalmología</strong><br><br>
            📅 <b>Días:</b> Miércoles.<br><br>
            👇 <i>Sacá turno por WhatsApp:</i>
            <a href="https://wa.me/5492241466977" target="_blank" class="wa-btn">📅 SOLICITAR TURNO</a>
        </div>`,
    'info_nutri': `
        <div class="info-card">
            <strong>🍎 Nutrición</strong><br><br>
            📅 <b>Días:</b> Jueves.<br><br>
            👇 <i>Sacá turno por WhatsApp:</i>
            <a href="https://wa.me/5492241466977" target="_blank" class="wa-btn">📅 SOLICITAR TURNO</a>
        </div>`,
    'info_cirugia': `
        <div class="info-card">
            <strong>🔪 Cirugía General</strong><br><br>
            📅 <b>Días:</b> Jueves.<br><br>
            👇 <i>Sacá turno por WhatsApp:</i>
            <a href="https://wa.me/5492241466977" target="_blank" class="wa-btn">📅 SOLICITAR TURNO</a>
        </div>`,
    'info_neuro_psiq': `
        <div class="info-card">
            <strong>🧠 Salud Mental y Neurología</strong><br><br>
            🔹 <b>Neurología:</b> Viernes.<br>
            🔹 <b>Psiquiatría:</b> Viernes.<br><br>
            👇 <i>Sacá turno por WhatsApp:</i>
            <a href="https://wa.me/5492241466977" target="_blank" class="wa-btn">📅 SOLICITAR TURNO</a>
        </div>`,
    'res_compre_chascomus': `
        <div class="info-card">
            <strong>🤝 Compre Chascomús - Producción Local</strong><br><br>
            Vinculamos a la economía social con comerciantes locales (Micro, Pequeños y Grandes) con habilitación.<br><br>
            📋 <b>Requisitos para inscripción:</b><br>
            Tener foto de: AFIP, ARBA, Habilitación Municipal y DNI.<br><br>
            👇 <i>Completá el formulario y la Dirección de Producción te contactará:</i><br>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSfa4LPccR6dYwkQFWhG31HELnaKMCSgUF7Jqy1xfiSNR_fA_g/viewform" target="_blank" class="wa-btn">📝 FORMULARIO DE INSCRIPCIÓN</a>
        </div>`,
    'res_prod_frescos': `
        <div class="info-card">
            <strong>🥦 Orientación Productores Alimentos Frescos</strong><br><br>
            Para productores de alimentos agroecológicos, agricultura familiar, cooperativas y PyMEs de Chascomús.<br><br>
            <i>Acompañamos el desarrollo de tu unidad económica.</i><br><br>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSeMzImHt14uXF4ZSk3wiJEqfxK4U2Tw9bSJrJXaKGLv5kLGew/closedform" target="_blank" class="wa-btn">📝 FORMULARIO PRODUCTORES</a>
        </div>`,
    'res_oe_inscripcion': `
        <div class="info-card">
            <strong>📝 Inscripción / Actualización Laboral</strong><br><br>
            Para mayores de 18 años residentes en Chascomús en búsqueda activa.<br><br>
            1. Completá el formulario con tus datos y perfil.<br>
            2. Te contactaremos (Lun a Vie 8 a 14hs) para una entrevista y asesoramiento.<br><br>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSfl7uzaIU0u8G-S3uTjtddZl7y4o5jajZUzNuftZEyfqPdDKg/viewform" target="_blank" class="wa-btn">📝 CARGAR MI CV / DATOS</a>
        </div>`,
    'res_oe_promover': `
        <div class="info-card">
            <strong>♿ Programa Nacional Promover</strong><br><br>
            Para mayores de 18 años desempleados que posean <b>Certificado Único de Discapacidad (CUD)</b>.<br><br>
            Ofrece formación, capacitación y acompañamiento en el perfil laboral.<br><br>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSdGoPi4Xmg0zD2VtBzTr1sFol1QtLAM5G0oDA6vExM_cvIYbQ/viewform" target="_blank" class="wa-btn">📝 INSCRIPCIÓN PROMOVER</a>
        </div>`,
    'res_oe_taller_cv': `
        <div class="info-card">
            <strong>📄 Armado de CV y Búsqueda de Empleo</strong><br><br>
            ¿No sabés por dónde empezar a buscar trabajo? ¿Querés mejorar tu Currículum?<br><br>
            Te ofrecemos información y estrategias para tener la mejor herramienta de presentación.<br><br>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSdQkEPZZx7gXZXO9vAb7u3Klxj8g5cwSe1fXqz6Zmo4jjMNBg/viewform" target="_blank" class="wa-btn">📝 INSCRIBIRSE AL TALLER</a>
        </div>`,
    'res_emp_chasco': `
        <div class="info-card">
            <strong>🚀 Programa Chascomús Emprende</strong><br><br>
            Objetivo: Fortalecer y acompañar unidades productivas.<br><br>
            Al completar el formulario, ingresás al listado para coordinar una entrevista de diagnóstico y orientación.<br><br>
            <a href="https://uploads.chascomus.gob.ar/produccion/PROGRAMA%20CHASCOMUS%20EMPRENDE.pdf" target="_blank" class="wa-btn">📝 INSCRIPCIÓN EMPRENDEDORES</a>
        </div>`,
    'res_empl_busqueda': `
        <div class="info-card">
            <strong>🔎 Búsqueda de Personal</strong><br><br>
            Si sos empleador, completá el formulario describiendo el puesto.<br><br>
            ✅ La Dirección de Producción realizará una preselección y te presentará una <b>terna final de candidatos</b>.<br><br>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSdOeVRsshYtc8JF-sTXyEqQgJl2hyTbxyfDPb0G7SsiGBMj_g/viewform" target="_blank" class="wa-btn">📝 PUBLICAR PUESTO</a>
        </div>`,
    'res_empl_madrinas': `
        <div class="info-card">
            <strong>🤝 Programa Formando Red - Empresas Madrinas</strong><br><br>
            Vinculamos empresas con compromiso social que deseen capacitar a futuros trabajadores, favoreciendo la igualdad de oportunidades.<br><br>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSe7SA_eKKQw-EDuFU9pDBIE_nUjzLOX6AZrHI_KfO3bwufVSA/viewform" target="_blank" class="wa-btn">📝 QUIERO SER EMPRESA MADRINA</a>
        </div>`,
    'res_manipulacion': `
        <div class="info-card">
            <strong>🔴 Carnet de Manipulación de Alimentos</strong><br><br>
            Obligatorio (Código Alimentario Argentino) para quien elabore, transporte o comercialice alimentos.<br><br>
            ✅ <b>Validez:</b> 3 años (Nacional).<br>
            🎓 <b>Requisito:</b> Aprobar el Curso de Manipulación Segura.<br><br>
            <i>Modalidad presencial (y próximamente virtual).</i><br><br>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSctX7eGQxBNei5howcIjXhIzlBTKQQb_RIBImnKXjVPvIVrvw/closedform" target="_blank" class="wa-btn">📝 INSCRIPCIÓN AL CURSO</a>
        </div>`,
    'prod_contacto': `
        <div class="info-card">
            <strong>📍 Dirección de Producción</strong><br><br>
            📍 <b>Dirección:</b> Maipú 415, Chascomús.<br>
            📞 <b>Teléfonos:</b> <a href="tel:02241436365">43-6365</a> / <a href="tel:02241430841">43-0841</a><br>
            📧 <a href="mailto:produccion@chascomus.gob.ar">produccion@chascomus.gob.ar</a><br><br>
            ℹ️ <b>Atención:</b><br>
            Orientación a productores de alimentos frescos, PYMES y cooperativas, impulsando la economía social y la agricultura familiar.
        </div>`,
    'contacto_gral': `
        <div class="info-card">
            <strong>🏛️ Contacto Municipalidad</strong><br>
            <i>Canales de atención directa:</i><br><br>
            📞 <b>Teléfono Fijo (Conmutador):</b><br>
            Atención de 7:30 a 13:30 hs.<br>
            <a href="tel:02241431341" class="wa-btn" style="background-color: #004a7c !important; text-align:center;">📞 LLAMAR AL 43-1341</a><br>
            
            📲 <b>WhatsApp Operador:</b><br>
            Consultas y reclamos.<br>
            <a href="https://wa.me/5492241000000" class="wa-btn" style="text-align:center;">💬 CHATEAR AHORA</a><br>
            
            📍 <b>Mesa de Entradas:</b><br>
            Cr. Cramer 270.
        </div>`
};

// --- PALABRAS CLAVE (BUSCADOR INTELIGENTE) ---
const PALABRAS_CLAVE = {
    // Redirecciones a menús
    'rrhh': { id: 'main', label: '👥 Recursos Humanos' },
    'habilitacion': { id: 'habilitaciones', label: '🏢 Habilitaciones' },
    '147': { id: 'obras', label: '📝 Reclamos 147' },
    'farmacia': { id: 'salud_menu', label: '💊 Farmacias' },
    'hospital': { id: 'hospital_menu', label: '🏥 Hospital' },
    
    // Redirecciones directas a tarjetas (Respuestas finales)
    'tramite': { apiKey: 'hab_gral', label: '🏢 Habilitación Comercial' },
    'eventos': { apiKey: 'hab_eventos', label: '🎉 Eventos' },
    'espacio': { apiKey: 'hab_espacio', label: '🍔 Uso de Espacio Público' },
    'reba': { apiKey: 'hab_reba', label: '🍷 Registro de Alcohol (REBA)' },
    'pediatria': { apiKey: 'info_pediatria', label: '👶 Pediatría' },
    'clinica': { apiKey: 'info_clinica', label: '🩺 Clínica Médica' },
    'gineco': { apiKey: 'info_gineco', label: '🤰 Salud de la Mujer' },
    'cardio': { apiKey: 'info_cardio', label: '❤️ Cardiología' },
    'trauma': { apiKey: 'info_trauma', label: '🦴 Traumatología' },
    'oftalmo': { apiKey: 'info_oftalmo', label: '👁️ Oftalmología' },
    'nutri': { apiKey: 'info_nutri', label: '🍎 Nutrición' },
    'cirugia': { apiKey: 'info_cirugia', label: '🔪 Cirugía General' },
    'neuro_psiq': { apiKey: 'info_neuro_psiq', label: '🧠 Salud Mental y Neurología' },
    'boleta': { apiKey: 'boleta', label: '📧 Boleta Digital' },
    'agua': { apiKey: 'agua', label: '💧 Consumo de Agua' },
    'deuda': { apiKey: 'deuda', label: '🔍 Consulta de Deuda' },
    'recibo': { apiKey: 'construccion', label: '📄 Recibos de Sueldo' },
    'extras': { apiKey: 'construccion', label: '📄 Extras' },
    'liquidacion': { apiKey: 'construccion', label: '📄 Liquidaciones' },
    'vacaciones': { apiKey: 'construccion', label: '📅 Vacaciones' },
    'licencia': { apiKey: 'info_licencias', label: '📅 Licencias' },
    'beneficios': { apiKey: 'construccion', label: '🎁 Beneficios Soy Municipal' },
    'soy_municipal': { apiKey: 'construccion', label: '🎁 Beneficios Soy Municipal' },
    'certificado': { apiKey: 'info_escolaridad', label: '🎒 Certificado Escolar' },
    'familia': { apiKey: 'construccion', label: '👥 Grupo Familiar' },
    'escolaridad': { apiKey: 'info_escolaridad', label: '🎒 Certificado Escolar' },
    'sac': { apiKey: 'construccion', label: '💰 SAC - Sueldo Anual Complementario' },
    'antiguedad': { apiKey: 'construccion', label: '📆 Antigüedad Laboral' },
    'grupo': { apiKey: 'construccion', label: '👥 Grupo familiar' },
    'manipulacion': { apiKey: 'res_manipulacion', label: '🔴 Carnet Manipulación Alimentos' },
    'deudas': { apiKey: 'consulta_tributaria', label: '💸 Consulta de Deudas' },
    'comprar': { apiKey: 'res_compre_chascomus', label: '🤝 Compre Chascomús' },
    'turismo': { apiKey: 'turismo_info', label: '🏖️ Turismo' },
    'deporte': { apiKey: 'deportes_info', label: '⚽ Deportes' },
    'cultura': { apiKey: 'agenda_dinamica', label: '🎭 Cultura' },
    'produccion': { apiKey: 'prod_contacto', label: '📍 Contacto Producción' },
    'empleo': { apiKey: 'res_oe_inscripcion', label: '📝 Inscripción Laboral' },
    'promover': { apiKey: 'res_oe_promover', label: '♿ Programa Promover' },
    'taller_cv': { apiKey: 'res_oe_taller_cv', label: '📄 Taller de CV' },
    'emp_chasco': { apiKey: 'res_emp_chasco', label: '🚀 Programa Chascomús Emprende' },
    'busqueda': { apiKey: 'res_empl_busqueda', label: '🔎 Búsqueda de Personal' },
    'madrinas': { apiKey: 'res_empl_madrinas', label: '🤝 Empresas Madrinas' },
    'contacto': { apiKey: 'contacto_gral', label: '🏛️ Contacto Municipalidad' },
    'agenda': { apiKey: 'agenda_dinamica', label: '📅 Agenda Actualizada' }
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
                        <small style="color:#666;">${m.subtitle}</small>
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

function showNavControls() {
    addMessage("", "bot", [{ id: 'main', label: '🏠 Inicio' }]);
}

// --- CONEXIÓN CON GOOGLE SHEETS (LOGS) ---
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz5MD_2b-vySciW0EUE3gHbAVynkoeucvG91W9gFAznnRGoba-ttOsiqE67yzDbB6E/exec';

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
        headers: {
            'Content-Type': 'application/json'
        },
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
        registrarEnPlanilla('Nuevo Registro: Ingresó el nombre ' + userName); 
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
            addMessage("No estoy seguro de entender. ¿Buscás algo de RRHH o del Municipio?", "bot", [
                { id: 'main', label: 'Menú Principal' }
            ]);
        }, 600);
    }
}

function processInput() {
    const input = document.getElementById('userInput');
    const val = input.value.trim();
    if (!val || isBotThinking) return;

    addMessage(val, 'user');
    input.value = "";

    if (!userName) {
        registrarDato(val);
    } else {
        registrarEnPlanilla('Búsqueda de Texto: Buscó "' + val + '"'); 
        ejecutarBusqueda(val);
    }
}

function handleAction(opt) {
    if (opt.id === 'back') { 
        currentPath.pop(); 
        showMenu(currentPath[currentPath.length - 1]); 
        registrarEnPlanilla('Navegación: Tocó el botón Volver Atrás'); 
        return; 
    }
    if (opt.link) {
        registrarEnPlanilla('Enlace Externo: Abrió el link de ' + opt.label); 
        window.open(opt.link, '_blank');
        return;
    }

    addMessage(opt.label, 'user');
    showTyping();
    
    registrarEnPlanilla('Clic en Botón: Eligió la opción ' + opt.label); 
    setTimeout(() => {
        if (opt.apiKey) {
            addMessage(RES[opt.apiKey]);
            showNavControls();
        } else if (MENUS[opt.id]) {
            currentPath.push(opt.id);
            showMenu(opt.id);
        }
    }, 800);
}

// --- GESTOR DE AGENDA DINÁMICA (GOOGLE SHEETS) ---
async function cargarAgendaDinamica() {
    const BASE_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTl9D6xP_nenB_S-xlnMgAd9rBjY17-fGNiGrVnKgOvlQ3I23giB2VgCnN62JYRB6qX_cVEfpdx6g6k/pub?output=csv'; 
    const SHEET_URL = `${BASE_URL}&t=${Date.now()}`;

    RES['agenda_dinamica'] = `<div class="info-card">⚠️ <b>Cargando agenda...</b><br>Si esto no cambia en unos segundos, revisá tu conexión.</div>`;

    try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error("Error de conexión");
        
        const data = await response.text();
        const filas = data.split('\n').slice(1); 
        
        if (filas.length < 1 || !data.includes(',')) throw new Error("Archivo vacío o formato incorrecto");

        let htmlAgenda = '<div class="info-card"><strong>📅 AGENDA ACTUALIZADA</strong><br><i>En tiempo real</i><br><br>';
        
        filas.forEach(fila => {
            const cols = fila.split(','); 
            if (cols.length >= 5) { 
                const fecha = cols[0] ? cols[0].trim() : '';
                const titulo = cols[1] ? cols[1].trim() : '';
                const lugar = cols[2] ? cols[2].trim() : '';
                const hora = cols[3] ? cols[3].trim() : '';
                const precio = cols[4] ? cols[4].trim() : '';
                const estado = cols[5] ? cols[5].trim() : 'Confirmado';

                if (titulo) {
                    let iconoEstado = '⚫'; 
                    if (estado.toLowerCase().includes('cancelado')) iconoEstado = '🔴';
                    if (estado.toLowerCase().includes('reprogramado')) iconoEstado = '🟠';

                    htmlAgenda += `
                        ${iconoEstado} <b>${fecha} - ${titulo}</b><br>
                        📍 ${lugar} | ⏰ ${hora} | 🎟️ ${precio}<br>
                        <hr style="border-top: 1px dashed #eee; margin: 8px 0;">
                    `;
                }
            }
        });
        htmlAgenda += '</div>';
        RES['agenda_dinamica'] = htmlAgenda;

    } catch (e) {
        console.error(e);
        RES['agenda_dinamica'] = `<div class="info-card">⚠️ Error al cargar la agenda.<br>Intentá nuevamente más tarde.</div>`;
    }
}

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    // Si no hay un nombre guardado, el bot pide el nombre. Si ya lo hay, muestra el menú principal.
    if (!userName) {
        addMessage("¡Hola! 👋 Soy ChasBot, tu asistente municipal. Para empezar, por favor escribí tu <b>Nombre Completo</b>:", "bot");
    } else {
        showMenu('main');
    }

    // Splash Screen
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
    
    cargarAgendaDinamica();
    
    /* ==========================================================================
       LÓGICA DE INSTALACIÓN PWA (ANDROID / PC)
       ========================================================================== */
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
                console.log(`User response to the install prompt: ${outcome}`);
                deferredPrompt = null;
            });
        }
    });

    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        const installBtn = document.getElementById('installBtn');
        if(installBtn) installBtn.classList.add('hidden');
    });
});