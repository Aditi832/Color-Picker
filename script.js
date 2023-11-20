document.addEventListener('DOMContentLoaded', function () {
    var colorPicker = document.getElementById('colorPicker');
    var colorValue = document.getElementById('colorValue');
    var swatchWheel = document.querySelector('.swatch-wheel');
    var copyButton = document.getElementById('copyButton');
    var manualColorInput = document.getElementById('manualColorInput');
    // 10 degrees increment
    const numOfSwatches = 360 / 10; 

    // Function to position swatches in a static circle
    function positionSwatches() {
        const swatchWheel = document.querySelector('.swatch-wheel');
        // For a full circle
        const numOfSwatches = 360 / 10; 
        // Radius from center to middle of swatch
        const radius = swatchWheel.offsetWidth / 2 - 30; 

        // Function to convert degrees to radians
        const degToRad = (deg) => (deg * Math.PI) / 180.0;

        // Clear existing swatches
        swatchWheel.innerHTML = '';

        for (let i = 0; i < numOfSwatches; i++) {
            // Increment angle for each swatch
            const angle = 10 * i; 
            const swatchElement = document.createElement('div');
            swatchElement.className = 'swatch';
            swatchElement.style.backgroundColor = `hsl(${angle}, 100%, 50%)`;
            swatchElement.setAttribute('data-color', `hsl(${angle}, 100%, 50%)`);

            // Positioning each swatch in a static circle
            const x = radius * Math.cos(degToRad(angle)) + radius;
            const y = radius * Math.sin(degToRad(angle)) + radius;
            swatchElement.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;

            swatchWheel.appendChild(swatchElement);
        }
    }

    // Call function to position swatches
    positionSwatches();

    // Function to generate dynamic swatches based on the selected color
    function generateSwatches(baseColor) {
        // Clear existing swatches
        swatchWheel.innerHTML = ''; 
        const baseRGB = hexToRgb(baseColor);

        // Generate lighter and darker shades of the selected color
        for (let i = 1; i <= 5; i++) {
            // Factor to adjust the lightness
            const factor = i * 20; 
            // Create lighter swatch
            const lighter = `rgb(${Math.min(baseRGB.r + factor, 255)}, ${Math.min(baseRGB.g + factor, 255)}, ${Math.min(baseRGB.b + factor, 255)})`;
            appendSwatch(lighter);
            // Create darker swatch
            const darker = `rgb(${Math.max(baseRGB.r - factor, 0)}, ${Math.max(baseRGB.g - factor, 0)}, ${Math.max(baseRGB.b - factor, 0)})`;
            appendSwatch(darker);
        }
    }

    // Append swatch to the swatch wheel
    function appendSwatch(color) {
        const swatchElement = document.createElement('div');
        swatchElement.className = 'swatch';
        swatchElement.style.backgroundColor = color;
        swatchElement.setAttribute('data-color', color);
        swatchElement.addEventListener('click', function() {
            colorPicker.value = rgbToHex(this.style.backgroundColor);
            colorValue.textContent = colorPicker.value;
            document.body.style.backgroundColor = this.style.backgroundColor;
            updateRGBDisplay(this.style.backgroundColor);
            setHeadingColor(this.style.backgroundColor);
        });
        swatchWheel.appendChild(swatchElement);
    }

    // Convert an RGB color to Hex
    function rgbToHex(rgb) {
        // Extract the numbers from the rgb format
        let [r, g, b] = rgb.match(/\d+/g).map(Number);
        // Convert each number to a hex string and pad with zero if necessary
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    // Color Picker Functionality
    colorPicker.addEventListener('input', function () {
        colorValue.textContent = colorPicker.value;
        document.body.style.backgroundColor = colorPicker.value;
    });

    // Clipboard Functionality
    copyButton.addEventListener('click', function () {
        navigator.clipboard.writeText(colorPicker.value).then(function() {
            alert('Color copied to clipboard!');
        });
    });

    // Manual Color Input Functionality
    manualColorInput.addEventListener('input', function () {
        colorPicker.value = manualColorInput.value;
        document.body.style.backgroundColor = manualColorInput.value;
        colorValue.textContent = manualColorInput.value;
    });

    // Color Swatches Functionality
    document.querySelectorAll('.swatch').forEach(function(swatch) {
        swatch.addEventListener('click', function() {
            var color = this.getAttribute('data-color');
            colorPicker.value = color;
            document.body.style.backgroundColor = color;
            colorValue.textContent = color;
        });
    });

    // Save Favorite Colors (Simplified Example)
    var favorites = JSON.parse(localStorage.getItem('favoriteColors')) || [];
    colorPicker.addEventListener('change', function () {
        favorites.push(colorPicker.value);
        localStorage.setItem('favoriteColors', JSON.stringify(favorites));
    });

    // Function to update the RGB composition display
function updateRGBDisplay(color) {
    // Assuming the color is in hex format
    const rgb = hexToRgb(color);
    const rgbCompositionDisplay = document.getElementById('rgbComposition');
    rgbCompositionDisplay.textContent = `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

// Convert a hex color to an RGB object
function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Update the color picker functionality to include dynamic swatch generation
colorPicker.addEventListener('input', function () {
    colorValue.textContent = colorPicker.value;
    document.body.style.backgroundColor = colorPicker.value;
    setHeadingColor(colorPicker.value);
    updateRGBDisplay(colorPicker.value);
    generateSwatches(colorPicker.value);
});

// Initialize the heading color and swatches with the default color value
setHeadingColor(colorPicker.value);
updateRGBDisplay(colorPicker.value);
generateSwatches(colorPicker.value);

// Update the RGB display when the color picker value changes
colorPicker.addEventListener('input', function () {
    // ... existing functionality ...
    updateRGBDisplay(colorPicker.value);
});

// Update the RGB display when a swatch is clicked
document.querySelectorAll('.swatch').forEach(function (swatch) {
    swatch.addEventListener('click', function () {
        // ... existing functionality ...
        updateRGBDisplay(this.getAttribute('data-color'));
    });
});

// Initialize the RGB display with the default color value
updateRGBDisplay(colorPicker.value);

// Function to set the heading color based on the background color
function setHeadingColor(color) {
    const heading = document.querySelector('.heading');
    // A simple contrast check
    const brightness = calculateBrightness(hexToRgb(color));
    // If the color is dark, use white, otherwise black
    heading.style.color = brightness < 128 ? 'white' : 'black'; 
}

// Calculate brightness of the color for contrast
function calculateBrightness({ r, g, b }) {
    // Algorithm from the Web Content Accessibility Guidelines (WCAG 2.0)
    return (r * 299 + g * 587 + b * 114) / 1000;
}

// Update the color picker functionality to include heading color change
colorPicker.addEventListener('input', function () {
    // ... existing functionality ...
    setHeadingColor(colorPicker.value);
    updateRGBDisplay(colorPicker.value);
});

// Update the swatch functionality to include heading color change
document.querySelectorAll('.swatch').forEach(function(swatch) {
    swatch.addEventListener('click', function() {
        // ... existing functionality ...
        setHeadingColor(this.getAttribute('data-color'));
        updateRGBDisplay(this.getAttribute('data-color'));
    });
});

// Initialize the heading color with the default value
setHeadingColor(colorPicker.value);

});
