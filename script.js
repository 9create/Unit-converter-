document.addEventListener('DOMContentLoaded', function() {
    const inputValue = document.getElementById('inputValue');
    const inputUnit = document.getElementById('inputUnit');
    const outputValue = document.getElementById('outputValue');
    const outputUnit = document.getElementById('outputUnit');
    const convertBtn = document.getElementById('convertBtn');

    // Object containing conversion rates relative to a base unit (e.g., meters for length)
    const conversions = {
        // Length conversions (base: meters)
        meters: {
            feet: 3.28084,
            meters: 1 // base
        },
        feet: {
            meters: 0.3048,
            feet: 1 // base
        },
        // Mass conversions (base: kilograms)
        kilograms: {
            pounds: 2.20462,
            kilograms: 1 // base
        },
        pounds: {
            kilograms: 0.453592,
            pounds: 1 // base
        },
        // Temperature conversions (special handling needed)
        celsius: {
            fahrenheit: tempC => (tempC * 9/5) + 32,
            celsius: tempC => tempC // base
        },
        fahrenheit: {
            celsius: tempF => (tempF - 32) * 5/9,
            fahrenheit: tempF => tempF // base
        }
    };

    function convertUnits() {
        const inputVal = parseFloat(inputValue.value); // Get input value as a number
        const fromUnit = inputUnit.value;
        const toUnit = outputUnit.value;

        if (isNaN(inputVal)) {
            outputValue.value = 'Invalid Input';
            return;
        }

        let result;

        // Handle temperature conversions separately as they are not simple multiplications
        if ((fromUnit === 'celsius' && toUnit === 'fahrenheit') || (fromUnit === 'fahrenheit' && toUnit === 'celsius')) {
            if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
                result = conversions.celsius.fahrenheit(inputVal);
            } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
                result = conversions.fahrenheit.celsius(inputVal);
            } else {
                result = inputVal; // Same temperature unit
            }
        } else if (fromUnit === toUnit) {
             // If units are the same, just return the input value
            result = inputVal;
        } else {
            // General conversion for non-temperature units
            // We need a common base for conversion if units are different types (e.g., meters to pounds won't work)
            // For simplicity, this example assumes conversions only within the same type (length to length, mass to mass)
            // A more robust converter would need a way to group units by type.

            // Here, we check if the conversion is valid within the defined conversion types
            const inputGroup = Object.keys(conversions).find(key => conversions[key][fromUnit]);
            const outputGroup = Object.keys(conversions).find(key => conversions[key][toUnit]);

            if (inputGroup !== outputGroup || !conversions[fromUnit] || !conversions[fromUnit][toUnit]) {
                outputValue.value = 'Cannot convert between these units';
                return;
            }

            result = inputVal * conversions[fromUnit][toUnit];
        }

        // Display the result, rounded to a few decimal places
        outputValue.value = result.toFixed(4); // Round to 4 decimal places
    }

    // Event Listeners
    convertBtn.addEventListener('click', convertUnits);
    // Also convert when input value or units change
    inputValue.addEventListener('input', convertUnits);
    inputUnit.addEventListener('change', convertUnits);
    outputUnit.addEventListener('change', convertUnits);

    // Run conversion on initial load
    convertUnits();
});
