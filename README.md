# 📐 Room Card - Tarjeta Personalizada para Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz/) 
![version](https://img.shields.io/badge/version-1.0.0-blue)

**Room Card** es una tarjeta completamente personalizable para Home Assistant que permite controlar dispositivos y monitorizar sensores dentro de cualquier habitación de manera atractiva y funcional.

<!-- ![Room Card Preview](url-de-la-imagen-de-previa-aquí) MODIFICAR -->

## ✨ Características Principales

- 📊 **Visualización de Datos**: Muestra la información de cualquier sensor en la esquina superior.
- 🖼️ **Fondos Dinámicos**: Añade imágenes de fondo personalizadas o dinámicas según las condiciones de los sensores.
- 🔌 **Controles de Dispositivos**: Controla luces, persianas, ventiladores, y más desde una sola tarjeta.
- 🎨 **Totalmente Personalizable**: Colores, iconos, textos y estilos a tu medida.
- 🔄 **Acciones Personalizadas**: Define las acciones al hacer clic en los dispositivos.

---

## 🚀 Instalación

### Opción 1: HACS (Recomendado)
1. Añadir el repositorio manualmente a HACS.
2. Instalar la tarjeta y añadir el recurso:
    ```yaml
    resources:
      - url: /hacsfiles/room-card/room-card.js
        type: module
    ```

### Opción 2: Manual
1. Descargar el archivo `room-card.js` y colocarlo en `/config/www/`.
2. Añadir el recurso a `ui-lovelace.yaml`:
    ```yaml
    resources:
      - url: /local/room-card.js
        type: module
    ```

---

## ⚙️ Configuración Básica

```yaml
type: custom:room-card 
title: Habitación Principal
background: /local/room-card/bedroom.webp
display_entity: sensor.habitacion_ninos_temperatura
display_icon: mdi:thermometer
display_unit: '°C'
on_color: '#fdd835'
off_color: '#757575'
text_color: '#ffffff'
background_overlay: true
icon_size: '80px'
controls:
  - entity: light.habitacion_ninos_luz
    name: Luz Principal
    icon: mdi:ceiling-light
    tap_action:
      action: toggle
  - entity: media_player.habitacion_ninos_tv
    name: TV
    icon: mdi:television
    tap_action:
      action: toggle

```

---

## 🎨 Posibilidades de Personalización

Room Card es completamente personalizable. Aquí tienes las opciones más comunes:

| **Atributo**         | **Descripción**                                                   | **Ejemplo**                |
|----------------------|-------------------------------------------------------------------|----------------------------|
| `title`              | Título que aparecerá en la parte superior                         | `Habitación Niños`          |
| `background`         | Imagen de fondo para la tarjeta                                   | `/local/room.jpg`           |
| `display_entity`     | Entidad de Home Assistant que se mostrará en la esquina superior   | `sensor.temperatura_habitacion` |
| `display_icon`       | Ícono que se mostrará junto al valor del sensor                   | `mdi:thermometer`           |
| `display_unit`       | Unidad que se mostrará junto al valor                             | `'°C'`                      |
| `on_color`           | Color del ícono cuando el dispositivo está encendido              | `#fdd835`                   |
| `off_color`          | Color del ícono cuando el dispositivo está apagado                | `#757575`                   |
| `icon_size`          | Tamaño del ícono del dispositivo                                  | `'80px'`                    |
| `name_font_size`     | Tamaño del texto del nombre del dispositivo                       | `'18px'`                    |
| `on_icon_background` | Fondo o degradado detrás del ícono cuando el dispositivo está encendido | `linear-gradient(135deg, #ff9800 0%, #ffc107 100%)` |

---

## 💡 Ejemplos de Uso

### 1. Control de una habitación con múltiples dispositivos:

```yaml
type: custom:room-card
title: Habitación Principal
background: /local/room-card/bedroom_main.webp
display_entity: sensor.habitacion_principal_temperatura
display_icon: mdi:thermometer
display_unit: '°C'
on_color: '#4caf50'
off_color: '#f44336'
controls:
  - entity: light.habitacion_principal_luz
    name: Luz Principal
    icon: mdi:lightbulb
    tap_action:
      action: toggle
  - entity: switch.habitacion_principal_ventilador
    name: Ventilador
    icon: mdi:fan
    tap_action:
      action: toggle
```

### 2. Monitorización de la temperatura y control de ventilador:

```yaml
type: custom:room-card
title: Sala de Estar
background: /local/room-card/livingroom.webp
display_entity: sensor.sala_estar_temperatura
display_icon: mdi:thermometer
display_unit: '°C'
on_color: '#2196F3'
off_color: '#BDBDBD'
controls:
  - entity: light.sala_estar_luz
    name: Luz Principal
    icon: mdi:lightbulb
    tap_action:
      action: toggle
  - entity: switch.sala_estar_ventilador
    name: Ventilador
    icon: mdi:fan
    tap_action:
      action: toggle
```

### 3. Control de una habitación infantil con luces y persianas:

```yaml
type: custom:room-card
title: Habitación Niños
background: /local/room-card/kids_room.webp
display_entity: sensor.habitacion_ninos_humedad
display_icon: mdi:water-percent
display_unit: '%'
on_color: '#FFEB3B'
off_color: '#BDBDBD'
controls:
  - entity: light.habitacion_ninos_luz
    name: Luz Principal
    icon: mdi:ceiling-light
    tap_action:
      action: toggle
  - entity: cover.habitacion_ninos_persiana
    name: Persiana
    icon: mdi:window-shutter
    tap_action:
      action: toggle
```

---

## 🛠️ Futuras Funcionalidades

- 💾 **Compilación**: En futuras versiones, se planea compilar la tarjeta para mejorar el rendimiento.
- 🌐 **Soporte Multilenguaje**: Añadir soporte completo para múltiples idiomas.

---

## 📜 Licencia

Este proyecto está bajo la Licencia [AGPL](https://opensource.org/licenses/AGPL-3.0).
