<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}"
      class="h-full bg-gray-100">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet"/>

    <!-- Scripts -->
    @routes

    @vite(['resources/css/app.css', 'resources/js/Console/app.ts', "resources/js/Console/Pages/{$page['component']}.vue"])

    @inertiaHead
</head>
<body class="font-sans antialiased h-full">
@inertia
</body>
</html>
