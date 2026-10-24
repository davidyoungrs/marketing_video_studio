const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.join(__dirname, '../..');
const recordingsDir = path.join(rootDir, 'recordings');
const audioDir = path.join(rootDir, 'audio');
const overlaysDir = path.join(rootDir, 'overlays');
const outputDir = path.join(rootDir, 'output');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Build concatenated audio track aligned to storyboard beats
// Beat 1: start 0.0s (9.67s duration)
// Beat 2: start 10.0s (6.10s duration)
// Beat 3: start 17.0s (8.30s duration)
// Beat 4: start 26.0s (6.38s duration)
// Beat 5: start 33.0s (4.91s duration)
// Total video is 39.08s

console.log('Step 1: Assembling multi-track narration with delay timings...');
const fullNarrationWav = path.join(audioDir, 'full_narration.wav');

const filterComplexAudio = [
  '[0:a]adelay=0|0[a1]',
  '[1:a]adelay=10000|10000[a2]',
  '[2:a]adelay=17000|17000[a3]',
  '[3:a]adelay=26000|26000[a4]',
  '[4:a]adelay=33000|33000[a5]',
  '[a1][a2][a3][a4][a5]amix=inputs=5:duration=longest:normalize=0[aout]'
].join(';');

execSync(`ffmpeg -y \
  -i "${path.join(audioDir, 'beat1.wav')}" \
  -i "${path.join(audioDir, 'beat2.wav')}" \
  -i "${path.join(audioDir, 'beat3.wav')}" \
  -i "${path.join(audioDir, 'beat4.wav')}" \
  -i "${path.join(audioDir, 'beat5.wav')}" \
  -filter_complex "${filterComplexAudio}" \
  -map "[aout]" -ar 48000 -ac 2 "${fullNarrationWav}"`);

console.log('Audio assembled successfully.');

// Step 2: Overlay badges at designated time windows
// Beat 1: 0.5s to 9.5s
// Beat 2: 10.0s to 16.5s
// Beat 3: 17.0s to 25.5s
// Beat 4: 26.0s to 32.5s
// Beat 5: 33.0s to 38.5s

console.log('Step 2: Composing video with genuine footage, overlay badges, and narration...');
const rawFootage = path.join(recordingsDir, 'raw_footage.mp4');
const intermediateVideo = path.join(outputDir, 'raw_mix.mp4');

const filterComplexVideo = [
  '[0:v][1:v]overlay=enable=\'between(t,0.5,9.5)\'[v1]',
  '[v1][2:v]overlay=enable=\'between(t,10.0,16.5)\'[v2]',
  '[v2][3:v]overlay=enable=\'between(t,17.0,25.5)\'[v3]',
  '[v3][4:v]overlay=enable=\'between(t,26.0,32.5)\'[v4]',
  '[v4][5:v]overlay=enable=\'between(t,33.0,38.5)\'[vout]'
].join(';');

execSync(`ffmpeg -y \
  -i "${rawFootage}" \
  -i "${path.join(overlaysDir, 'beat1.png')}" \
  -i "${path.join(overlaysDir, 'beat2.png')}" \
  -i "${path.join(overlaysDir, 'beat3.png')}" \
  -i "${path.join(overlaysDir, 'beat4.png')}" \
  -i "${path.join(overlaysDir, 'beat5.png')}" \
  -i "${fullNarrationWav}" \
  -filter_complex "${filterComplexVideo}" \
  -map "[vout]" -map 6:a \
  -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 192k \
  -shortest "${intermediateVideo}"`);

console.log('Intermediate video rendered at:', intermediateVideo);

// Step 3: Loudness normalization pass to standard -14 LUFS (EBU R128 / YouTube standard)
console.log('Step 3: Two-pass EBU R128 Loudness Normalization to -14 LUFS...');
const finalVideo = path.join(outputDir, 'RS-FEAT-001-free-card-setup.mp4');

// Run first pass loudnorm measurement
const pass1Output = execSync(`ffmpeg -y -i "${intermediateVideo}" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1`, { encoding: 'utf-8' });
const jsonMatch = pass1Output.match(/\{[\s\S]*"input_i"[\s\S]*\}/);

if (jsonMatch) {
  const normData = JSON.parse(jsonMatch[0]);
  console.log('Measured Loudness:', normData);
  const loudnormFilter = `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${normData.input_i}:measured_TP=${normData.input_tp}:measured_LRA=${normData.input_lra}:measured_thresh=${normData.input_thresh}:offset=${normData.target_offset}:linear=true`;
  
  execSync(`ffmpeg -y -i "${intermediateVideo}" -c:v copy -af "${loudnormFilter}" -c:a aac -b:a 192k "${finalVideo}"`);
} else {
  // Fallback single pass if json parse fails
  execSync(`ffmpeg -y -i "${intermediateVideo}" -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 192k "${finalVideo}"`);
}

// Step 4: Extract poster frame
console.log('Step 4: Generating high-resolution poster frame thumbnail...');
const posterPath = path.join(outputDir, 'RS-FEAT-001-free-card-setup-poster.jpg');
execSync(`ffmpeg -y -ss 00:00:28.000 -i "${finalVideo}" -vframes 1 -q:v 2 "${posterPath}"`);

console.log('Production assembly complete!');
console.log('Final Master:', finalVideo);
console.log('Poster Thumbnail:', posterPath);
