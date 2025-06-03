/* FILE NAME   : index.js
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

// Start php
async function runPHP() {
    const php = require('php');
    const output = await php.run('index.php');
    console.log(output);
}
runPHP();

/** END OF 'index.js' FILE */