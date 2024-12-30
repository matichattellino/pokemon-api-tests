const { spawn } = require('child_process');
const { platform } = require('os');

interface TestResult {
    mode: 'parallel' | 'serial';
    startTime: number;
    endTime: number;
    duration: number;
}

interface TestError extends Error {
    code?: string | number;
    signal?: string;
}

async function executeTests(isParallel: boolean): Promise<TestResult> {
    const mode = isParallel ? 'parallel' : 'serial';
    const workers = isParallel ? 2 : 1;
    
    console.log(`\n🚀 Ejecutando tests en modo ${mode}`);
    console.log('====================================');
    
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
        const npx = platform() === 'win32' ? 'npx.cmd' : 'npx';
        const child = spawn(npx, ['playwright', 'test', `--workers=${workers}`], {
            stdio: 'inherit'
        });

        child.on('error', (error: TestError) => {
            console.error('❌ Error ejecutando tests:', error.message);
            reject(error);
        });

        child.on('close', (code: number | null) => {
            const endTime = Date.now();
            const duration = endTime - startTime;

            if (code !== 0) {
                console.error(`❌ Tests fallaron con código: ${code}`);
            }

            resolve({
                mode,
                startTime,
                endTime,
                duration
            });
        });
    });
}

async function compareExecutions(): Promise<void> {
    try {
        console.log('\n🔍 Comparando modos de ejecución...');
        
        // Ejecutar en serie
        console.log('\nEjecutando tests en serie...');
        const serialResult = await executeTests(false);
        
        // Pausa entre ejecuciones
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Ejecutar en paralelo
        console.log('\nEjecutando tests en paralelo...');
        const parallelResult = await executeTests(true);
        
        // Calcular diferencias
        const timeSaved = serialResult.duration - parallelResult.duration;
        const percentageSaved = ((timeSaved / serialResult.duration) * 100).toFixed(2);
        
        // Mostrar resultados
        console.log('\n📊 Resultados de la comparación:');
        console.log('=====================================');
        console.log(`Tiempo en serie:    ${(serialResult.duration / 1000).toFixed(2)}s`);
        console.log(`Tiempo en paralelo: ${(parallelResult.duration / 1000).toFixed(2)}s`);
        console.log(`Tiempo ahorrado:    ${(timeSaved / 1000).toFixed(2)}s (${percentageSaved}%)`);
        console.log('=====================================\n');
    } catch (error) {
        if (error instanceof Error) {
            console.error('❌ Error en la comparación:', error.message);
        } else {
            console.error('❌ Error desconocido:', error);
        }
    }
}

// Ejecutar la comparación
compareExecutions().catch((error: unknown) => {
    if (error instanceof Error) {
        console.error('❌ Error fatal:', error.message);
    } else {
        console.error('❌ Error desconocido:', error);
    }
});