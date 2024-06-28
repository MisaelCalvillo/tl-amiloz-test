import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testPaymentFrequencyRead() {
    try {
        console.log('Starting PaymentFrequency read test...');

        // Read all PaymentFrequencies
        const allFrequencies = await prisma.paymentFrequency.findMany();
        
        console.log('All PaymentFrequencies:');
            allFrequencies.forEach(frequency => {
            console.log(`- ID: ${frequency.id}, Description: ${frequency.description}, Days: ${frequency.days}`);
        });

        // Validate the data
        console.assert(allFrequencies.length > 0, 'There should be at least one PaymentFrequency');
        
        // Check for expected frequency types
        const expectedFrequencies = ['daily', 'weekly', 'biweekly', 'monthly'];
        expectedFrequencies.forEach(expectedId => {
            const found = allFrequencies.some(freq => freq.id === expectedId);
            console.assert(found, `There should be a ${expectedId} payment frequency`);
        });

        // Validate data types
        allFrequencies.forEach(frequency => {
            console.assert(typeof frequency.id === 'string', `ID should be a string: ${frequency.id}`);
            console.assert(typeof frequency.description === 'string', `Description should be a string: ${frequency.description}`);
            console.assert(typeof frequency.days === 'number', `Days should be a number: ${frequency.days}`);
            console.assert(frequency.days > 0, `Days should be positive: ${frequency.days}`);
        });

        console.log('PaymentFrequency read test completed successfully!');
    } catch (error) {
        console.error('Error occurred during PaymentFrequency testing:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testPaymentFrequencyRead();
