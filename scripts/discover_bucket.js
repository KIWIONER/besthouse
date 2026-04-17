const SUPABASE_URL = 'https://ybqzcxabblyzqhezanaf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_srdA6MTx8hiKPHBV1ahM2w_xZBX85Eb';

async function testBuckets() {
    const bucketsToTest = ['inmuebles', 'inmobiliaria', 'besthouse', 'fotos', 'images', 'assets'];
    
    for (const bucket of bucketsToTest) {
        try {
            console.log(`Testing bucket: ${bucket}...`);
            const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${bucket}/test.txt`, {
                method: 'GET'
            });
            const text = await res.text();
            console.log(`Result for ${bucket}: ${res.status} ${res.statusText}`);
            if (text.includes('Bucket not found')) {
                console.log(`  -> ${bucket} definitely does not exist.`);
            } else if (res.status === 400 || res.status === 404) {
                console.log(`  -> ${bucket} exists but file not found or private.`);
            } else {
                console.log(`  -> ${bucket} might exist! (or other error)`);
            }
        } catch (e) {
            console.log(`Error testing ${bucket}: ${e.message}`);
        }
    }
}

testBuckets();
