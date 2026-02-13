<div align="center">
  <h1 align="center">El Impostor</h1>
  <p align="center">
    Un juego de deducción social para encontrar al impostor.
  </p>
</div>

## 🤔 ¿Cómo funciona?

"El Impostor" es un juego multijugador local donde a todos los jugadores se les asigna una palabra secreta, excepto a uno: el impostor. Los jugadores luego se turnan para decir una palabra relacionada con la palabra secreta. El objetivo es identificar al impostor, mientras que el impostor debe intentar adivinar la palabra secreta para ganar.

### 🎮 Fases del juego

1.  **✍️ Configuración (Setup):** Los jugadores ingresan sus nombres.
2.  **🤫 Distribución de roles (Role Distribution):** A cada jugador se le asigna en secreto su rol (impostor o no) y la palabra secreta.
3.  **🗣️ Ronda de juego (Game Round):** Los jugadores, por turno, dan una pista sobre la palabra secreta.
4.  **🗳️ Votación (Voting):** Los jugadores votan para eliminar al jugador que creen que es el impostor.
5.  **🎉 Fin del juego (Game Over):** El juego termina cuando el impostor es eliminado o cuando el impostor adivina la palabra secreta.

### ✨ Generación de palabras con IA

La palabra secreta se genera dinámicamente utilizando la **API de Gemini de Google**, lo que garantiza una experiencia de juego única en cada partida. Si la API no está disponible, el juego utiliza una lista de palabras de respaldo.

## 🛠️ Stack tecnológico

-   **React:** Para construir la interfaz de usuario.
-   **TypeScript:** Para un código más robusto y mantenible.
-   **Vite:** Como herramienta de construcción y servidor de desarrollo.
-   **Tailwind CSS:** Para el diseño de la interfaz.
-   **Google Gemini API:** Para la generación de palabras secretas.

## 🚀 Cómo empezar

### Prerrequisitos

-   [Node.js](https://nodejs.org/) (versión 18 o superior)
-   [npm](https://www.npmjs.com/) (generalmente viene con Node.js)

### Pasos

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/grattener/impostor-app.git
    cd impostor-app
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto copiando el archivo de ejemplo:
    ```bash
    cp .env.example .env
    ```
    Luego, abre el archivo `.env` y añade tu clave de API de Gemini:
    ```
    VITE_API_KEY=tu_clave_de_api_aqui
    ```

4.  **Ejecuta la aplicación:**
    ```bash
    npm run dev
    ```
    Abre tu navegador y ve a `http://localhost:5173` (o la URL que se muestra en tu terminal).

## 📱 Aplicación Móvil (Android)

Este proyecto está configurado con **Capacitor** para generar una aplicación Android.

### Generar APK localmente

1.  **Sincronizar cambios:**
    ```bash
    npx cap sync
    ```

2.  **Abrir en Android Studio:**
    ```bash
    npx cap open android
    ```
    Desde Android Studio, puedes ejecutar la app en un emulador o dispositivo conectado.

### Generar APK con GitHub Actions

Cada vez que haces un push a la rama `main`, se ejecuta un flujo de trabajo que:

1.  Instala dependencias y construye el proyecto.
2.  Genera el APK de depuración (`app-debug.apk`).
3.  Lo sube como un "Artifact" que puedes descargar desde la pestaña "Actions" en GitHub.

---

Desarrollado con ❤️ por [grattener](https://github.com/grattener)
