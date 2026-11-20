<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Star Energy Geothermal - Web GIS Portal Panas Bumi Nasional</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
    
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb'><path d='M12 2L2 22h20L12 2zm0 3.5L18.5 19H5.5L12 5.5z'/><circle cx='12' cy='14' r='2' fill='%232563eb'/></svg>">

    <!-- Built Assets -->
    @php
        $manifestPath = public_path('build/manifest.json');
        $manifest = file_exists($manifestPath) ? json_decode(file_get_contents($manifestPath), true) : [];
        $cssFile = $manifest['resources/css/app.css']['file'] ?? 'assets/app-CtI-qXiY.css';
        $jsFile = $manifest['resources/js/app.jsx']['file'] ?? 'assets/app-CvrP4dFz.js';
    @endphp
    @if(file_exists(public_path('hot')))
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @else
        <link rel="stylesheet" href="{{ asset('build/' . $cssFile) }}">
        <script type="module" src="{{ asset('build/' . $jsFile) }}"></script>
    @endif
</head>
<body class="bg-white text-slate-900 antialiased overflow-x-hidden min-h-screen font-sans selection:bg-blue-600 selection:text-white">
    <div id="root"></div>
</body>
</html>
