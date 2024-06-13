document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const shapes = document.querySelectorAll('.shape');
    const saveButton = document.getElementById('save');
    const loadButton = document.getElementById('load');
    let draggingShape = null;
    let selectedShapeIndex = null;
    let resizing = false;
    let drawing = false;
    let shapesArray = [];
    let startX, startY;

    const drawShape = (shape) => {
        const { type, x, y, size } = shape;
        ctx.beginPath();
        if (type === 'football') {
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = 'black';
            ctx.fill();
        } else if (type === 'cone') {
            ctx.fillStyle = 'orange';
            // Draw base trapezoid
            ctx.moveTo(x - size / 2, y + size);
            ctx.lineTo(x + size / 2, y + size);
            ctx.lineTo(x + size / 3, y);
            ctx.lineTo(x - size / 3, y);
            ctx.closePath();
            ctx.fill();
            // Draw upper triangle
            ctx.beginPath();
            ctx.moveTo(x - size / 3, y);
            ctx.lineTo(x + size / 3, y);
            ctx.lineTo(x, y - size);
            ctx.closePath();
            ctx.fill();
        } else if (type === 'attacker') {
            ctx.fillStyle = 'blue';
            ctx.fillRect(x - size / 2, y - size / 2, size, size);
            ctx.fillStyle = 'white';
            ctx.fillText('A', x - 5, y + 5);
        } else if (type === 'defender') {
            ctx.fillStyle = 'red';
            ctx.fillRect(x - size / 2, y - size / 2, size, size);
            ctx.fillStyle = 'white';
            ctx.fillText('D', x - 5, y + 5);
        } else if (type === 'leftArrow') {
            ctx.fillStyle = 'green';
            ctx.fillRect(x - size, y - 5, size * 2, 10);
            ctx.moveTo(x - size, y - 10);
            ctx.lineTo(x - size - 10, y);
            ctx.lineTo(x - size, y + 10);
        } else if (type === 'rightArrow') {
            ctx.fillStyle = 'green';
            ctx.fillRect(x - size, y - 5, size * 2, 10);
            ctx.moveTo(x + size, y - 10);
            ctx.lineTo(x + size + 10, y);
            ctx.lineTo(x + size, y + 10);
        } else if (type === 'upArrow') {
            ctx.fillStyle = 'green';
            ctx.fillRect(x - 5, y - size, 10, size * 2);
            ctx.moveTo(x - 10, y - size);
            ctx.lineTo(x, y - size - 10);
            ctx.lineTo(x + 10, y - size);
        } else if (type === 'downArrow') {
            ctx.fillStyle = 'green';
            ctx.fillRect(x - 5, y - size, 10, size * 2);
            ctx.moveTo(x - 10, y + size);
            ctx.lineTo(x, y + size + 10);
            ctx.lineTo(x + 10, y + size);
        } else if (type === 'vLine') {
            ctx.fillStyle = 'black';
            ctx.fillRect(x - 2, y - size, 4, size * 2);
        } else if (type === 'hLine') {
            ctx.fillStyle = 'black';
            ctx.fillRect(x - size, y - 2, size * 2, 4);
        }
        ctx.fill();
    };

    const redrawCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        shapesArray.forEach(shape => drawShape(shape));
    };

    const getShapeAtCoordinates = (x, y) => {
        for (let i = shapesArray.length - 1; i >= 0; i--) {
            const shape = shapesArray[i];
            const size = shape.size;
            if (shape.type === 'football') {
                const dist = Math.sqrt((x - shape.x) ** 2 + (y - shape.y) ** 2);
                if (dist <= size) return i;
            } else if (['cone', 'attacker', 'defender'].includes(shape.type)) {
                if (x > shape.x - size / 2 && x < shape.x + size / 2 &&
                    y > shape.y - size / 2 && y < shape.y + size / 2) return i;
            } else if (['leftArrow', 'rightArrow', 'upArrow', 'downArrow'].includes(shape.type)) {
                if (shape.type === 'leftArrow' || shape.type === 'rightArrow') {
                    if (x > shape.x - size && x < shape.x + size &&
                        y > shape.y - 5 && y < shape.y + 5) return i;
                } else if (shape.type === 'upArrow' || shape.type === 'downArrow') {
                    if (x > shape.x - 5 && x < shape.x + 5 &&
                        y > shape.y - size && y < shape.y + size) return i;
                }
            } else if (shape.type === 'vLine') {
                if (x > shape.x - 2 && x < shape.x + 2 &&
                    y > shape.y - size && y < shape.y + size) return i;
            } else if (shape.type === 'hLine') {
                if (x > shape.x - size && x < shape.x + size &&
                    y > shape.y - 2 && y < shape.y + 2) return i;
            }
        }
        return null;
    };

    shapes.forEach(shape => {
        shape.addEventListener('mousedown', (e) => {
            draggingShape = {
                type: e.target.dataset.shape,
                offsetX: e.offsetX,
                offsetY: e.offsetY,
                size: 30
            };
        });
    });

    canvas.addEventListener('mousedown', (e) => {
        const x = e.offsetX;
        const y = e.offsetY;
        const shapeIndex = getShapeAtCoordinates(x, y);

        if (shapeIndex !== null) {
            selectedShapeIndex = shapeIndex;
            const selectedShape = shapesArray[selectedShapeIndex];
            if (e.altKey) {
                // Start resizing
                resizing = true;
                startX = x;
                startY = y;
            } else {
                draggingShape = {
                    ...selectedShape,
                    offsetX: x - selectedShape.x,
                    offsetY: y - selectedShape.y
                };
            }
        } else {
            selectedShapeIndex = null;
            draggingShape = null;
            if (!draggingShape) {
                drawing = true;
                ctx.moveTo(e.offsetX, e.offsetY);
            }
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (draggingShape) {
            const x = e.offsetX;
            const y = e.offsetY;
            if (selectedShapeIndex !== null) {
                shapesArray[selectedShapeIndex].x = x - draggingShape.offsetX;
                shapesArray[selectedShapeIndex].y = y - draggingShape.offsetY;
            }
            redrawCanvas();
        } else if (resizing && selectedShapeIndex !== null) {
            const selectedShape = shapesArray[selectedShapeIndex];
            const dist = Math.sqrt((e.offsetX - startX) ** 2 + (e.offsetY - startY) ** 2);
            selectedShape.size = dist;
            redrawCanvas();
        } else if (drawing) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    });

    canvas.addEventListener('mouseup', (e) => {
        if (draggingShape && selectedShapeIndex === null) {
            const x = e.offsetX;
            const y = e.offsetY;
            // Add shape to array
            shapesArray.push({
                ...draggingShape,
                x: x - draggingShape.offsetX,
                y: y - draggingShape.offsetY
            });
            draggingShape = null;
            redrawCanvas();
        } else if (drawing) {
            drawing = false;
            ctx.beginPath();
        } else if (resizing) {
            resizing = false;
        }
    });

    canvas.addEventListener('dblclick', (e) => {
        const x = e.offsetX;
        const y = e.offsetY;
        const shapeIndex = getShapeAtCoordinates(x, y);
        if (shapeIndex !== null) {
            shapesArray.splice(shapeIndex, 1);
            redrawCanvas();
        }
    });

    saveButton.addEventListener('click', () => {
        const shapesData = JSON.stringify(shapesArray);
        localStorage.setItem('shapesData', shapesData);
        alert('Shapes saved!');
    });

    loadButton.addEventListener('click', () => {
        const shapesData = localStorage.getItem('shapesData');
        if (shapesData) {
            shapesArray = JSON.parse(shapesData);
            redrawCanvas();
        } else {
            alert('No saved shapes found.');
        }
    });

    canvas.addEventListener('mouseout', () => {
        draggingShape = null;
        drawing = false;
    });
});
