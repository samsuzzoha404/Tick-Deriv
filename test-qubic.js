// Simple test to verify @qubic-lib/qubic-ts-library works
import QubicLib from '@qubic-lib/qubic-ts-library';

const { QubicHelper } = QubicLib;

async function testQubicLib() {
  try {
    console.log('Testing Qubic Library...');
    const helper = new QubicHelper();
    console.log('✓ QubicHelper initialized');
    
    // Test with a valid seed (55 lowercase letters)
    const testSeed = 'a'.repeat(55);
    console.log('Testing createIdPackage with seed:', testSeed);
    
    const idPackage = await helper.createIdPackage(testSeed);
    console.log('✓ ID Package created');
    console.log('Address:', idPackage.publicId);
    console.log('Public Key length:', idPackage.publicKey.length);
    
    console.log('\n✅ Qubic library is working correctly!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

testQubicLib();
