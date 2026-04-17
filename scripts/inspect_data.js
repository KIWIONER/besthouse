import { obtenerInmueblesAN8N } from './services/api.js';

async function test() {
    try {
        const data = await obtenerInmueblesAN8N();
        console.log('--- DATA FROM SUPABASE ---');
        console.log(JSON.stringify(data.slice(0, 5), null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

test();
