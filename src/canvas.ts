const canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('mycanvas');
const canvasCtx = canvas.getContext('2d');

export function renderVisuals(analyser: AnalyserNode) {

    let frequencyData = new Uint8Array(analyser.frequencyBinCount);
    
    function renderFrame() {
        requestAnimationFrame(renderFrame);
        // update data in frequencyData
        analyser.getByteFrequencyData(frequencyData);
        // render frame based on values in frequencyData
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < frequencyData.length; i = i + 3) {
            let rect = canvasCtx.fillRect(i / 3, canvas.height, 1, -frequencyData[i]);
        }
    }
    renderFrame();
}