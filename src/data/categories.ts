export interface CategoryData {
    name: string;
    words: string[];
}

export const FALLBACK_CATEGORIES: CategoryData[] = [
    {
        name: 'Comida',
        words: ['Pizza', 'Tacos', 'Sushi', 'Hamburguesa', 'Paella', 'Chocolate', 'Helado', 'Ensalada', 'Sopa', 'Torta']
    },
    {
        name: 'Animales',
        words: ['Perro', 'Gato', 'Elefante', 'León', 'Jirafa', 'Delfín', 'Águila', 'Pingüino', 'Tigre', 'Oso']
    },
    {
        name: 'Profesiones',
        words: ['Doctor', 'Bombero', 'Policía', 'Maestro', 'Astronauta', 'Chef', 'Futbolista', 'Cantante', 'Carpintero', 'Jardinero']
    },
    {
        name: 'Lugares',
        words: ['Playa', 'Montaña', 'Escuela', 'Hospital', 'Cine', 'Parque', 'Aeropuerto', 'Biblioteca', 'Museo', 'Supermercado']
    },
    {
        name: 'Objetos',
        words: ['Teléfono', 'Computadora', 'Mesa', 'Silla', 'Cama', 'Cuchara', 'Reloj', 'Lámpara', 'Mochila', 'Libro']
    },
    {
        name: 'Transporte',
        words: ['Avión', 'Bicicleta', 'Barco', 'Tren', 'Autobús', 'Coche', 'Moto', 'Helicóptero', 'Submarino', 'Patineta']
    },
    {
        name: 'Deportes',
        words: ['Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Voleibol', 'Béisbol', 'Boxeo', 'Golf', 'Hockey', 'Rugby']
    }
];

export const getRandomFallbackWord = () => {
    const randomCategory = FALLBACK_CATEGORIES[Math.floor(Math.random() * FALLBACK_CATEGORIES.length)];
    const randomWord = randomCategory.words[Math.floor(Math.random() * randomCategory.words.length)];
    return { word: randomWord, category: randomCategory.name };
};
