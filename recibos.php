<?php
// 1. Encabezados para permitir la lectura desde el bot (CORS) y definir el tipo de respuesta
// Reemplazá el '*' por el dominio exacto del bot en producción por seguridad (ej: 'https://munibot.chascomus.gob.ar')
header('Access-Control-Allow-Origin: https://fedepe8.github.io/RRHH/'); 
header('Access-Control-Allow-Methods: GET');
header('Content-Type: application/json; charset=utf-8');

// 2. Capturamos y sanitizamos el parámetro 'legajo'
$legajo = isset($_GET['legajo']) ? intval($_GET['legajo']) : 0;

if ($legajo <= 0) {
    echo json_encode(['exito' => false, 'mensaje' => 'Legajo inválido']);
    exit;
}

// 3. Configuración de la Base de Datos
$host = 'localhost';
$db   = 'nombre_de_tu_base_intranet';
$user = 'usuario_db';
$pass = 'contraseña_db';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // En producción es mejor no mostrar el error real del servidor
    echo json_encode(['exito' => false, 'mensaje' => 'Error de conexión a la base de datos']);
    exit;
}

// 4. Consulta a la base de datos (Usando sentencias preparadas por seguridad)
// Adaptá los nombres de las tablas y columnas a la estructura de la Intranet
$sql = "SELECT nombre_completo, periodo_liquidacion, monto_neto, ruta_pdf 
        FROM recibos_sueldo 
        WHERE legajo = :legajo 
        ORDER BY fecha_generacion DESC 
        LIMIT 1";

$stmt = $pdo->prepare($sql);
$stmt->execute(['legajo' => $legajo]);
$recibo = $stmt->fetch();

// 5. Evaluamos el resultado y armamos la respuesta
if ($recibo) {
    // Encontramos el recibo, armamos el JSON de éxito
    $respuesta = [
        'exito'   => true,
        'nombre'  => $recibo['nombre_completo'],
        'periodo' => $recibo['periodo_liquidacion'],
        'monto'   => number_format($recibo['monto_neto'], 2, ',', '.'), // Formato moneda argentina
        'link_pdf'=> 'https://intranet.chascomus.gob.ar/' . $recibo['ruta_pdf'] // Armamos la URL completa
    ];
} else {
    // No hay recibos para ese legajo
    $respuesta = [
        'exito' => false,
        'mensaje' => 'No se encontraron recibos para este legajo'
    ];
}

// 6. Imprimimos el JSON final
echo json_encode($respuesta);
?>
