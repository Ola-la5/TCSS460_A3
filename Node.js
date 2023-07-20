// Import required dependencies
const express = require('express'); // Express framework for building the server
const app = express(); // Create an instance of the Express application
const path = require('path'); // Node.js path module to handle file paths

// Set the port number where the server will run
const port = 3000;

// Define a route to calculate BMI (Body Mass Index) based on height and weight
app.get('/bmi', (req, res) => {
    // Get the height and weight from the query parameters
    const height = parseFloat(req.query.height);
    const weight = parseFloat(req.query.weight);

    // Check if height and weight are valid numbers and greater than 0
    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        // Return an error response if any of the conditions are not met
        return res.status(400).json({ error: 'Invalid height or weight values.' });
    }

    // Calculate BMI using the formula: BMI = weight (kg) / (height (m) * height (m))
    const bmi = weight / ((height / 100) * (height / 100));

    // Return the calculated BMI and the original weight in the response as JSON
    return res.json({ bmi: bmi.toFixed(2), weight: weight });
});

// Define a route to calculate body fat percentage based on age, gender, and BMI
app.get('/bodyfat', (req, res) => {
    // Get age, gender, and BMI from the query parameters
    const age = parseFloat(req.query.age);
    const gender = req.query.gender;
    const bmi = parseFloat(req.query.bmi);

    // Check if age, gender, and BMI are valid numbers and greater than 0
    if (isNaN(age) || !['male', 'female'].includes(gender) || isNaN(bmi) || age <= 0 || bmi <= 0) {
        // Return an error response if any of the conditions are not met
        return res.status(400).json({ error: 'Invalid age, gender, or BMI value.' });
    }

    let bodyFat;

    // Calculate body fat percentage based on gender using different formulas for males and females
    if (gender === 'female') {
        bodyFat = (1.20 * bmi) + (0.23 * age) - 5.4;
    } else if (gender === 'male') {
        bodyFat = (1.20 * bmi) + (0.23 * age) - 16.2;
    } else {
        // Return an error response if an invalid gender value is provided
        return res.status(400).json({ error: 'Invalid gender value.' });
    }

    // Return the calculated body fat percentage and the original BMI in the response as JSON
    res.json({ bodyFat: bodyFat.toFixed(2), bmi: bmi.toFixed(2) });
});

// Define a route to calculate ideal weight based on body fat percentage and current weight
app.get('/idealweight', (req, res) => {
    // Get body fat percentage and weight from the query parameters
    const bodyFatPercentage = parseFloat(req.query.bodyFat);
    const weight = parseFloat(req.query.weight);

    // Check if body fat percentage and weight are valid numbers and greater than 0
    if (isNaN(bodyFatPercentage) || isNaN(weight) || weight <= 0 || bodyFatPercentage <= 0) {
        // Return an error response if any of the conditions are not met
        return res.status(400).json({ error: 'Invalid weight, body fat percentage, or gender value.' });
    }

    // Calculate ideal weight using the formula: idealWeight = weight (kg) - (weight (kg) * (bodyFatPercentage / 100))
    const idealWeight = weight - (weight * (bodyFatPercentage / 100));

    // Return the calculated ideal weight in the response as JSON
    res.json({ idealWeight: idealWeight.toFixed(2) });
});

// Define a route to calculate calories burned based on weight, height, age, activity level, and daily caloric intake
app.get('/caloriesburned', (req, res) => {
    // Get weight, height, age, activity level, and daily caloric intake from the query parameters
    const weight = parseFloat(req.query.weight);
    const height = parseFloat(req.query.height);
    const age = parseFloat(req.query.age);
    const activityLevel = req.query.activityLevel;
    const dailyCaloricIntake = parseFloat(req.query.calories);

    // Check if weight, height, and age are valid numbers and greater than 0
    if (isNaN(weight) || isNaN(height) || isNaN(age) || weight <= 0 || height <= 0 || age <= 0) {
        // Return an error response if any of the conditions are not met
        return res.status(400).json({ error: 'Invalid weight, height, or age value.' });
    }

    // Calculate BMR (Basal Metabolic Rate) using the Harris-Benedict Equation (Revised BMR Formula)
    const bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);

    // Calculate TDEE (Total Daily Energy Expenditure) based on activity level
    let tdee;
    switch (activityLevel) {
        case 'sedentary':
            tdee = bmr * 1.2;
            break;
        case 'lightlyactive':
            tdee = bmr * 1.375;
            break;
        case 'moderatelyactive':
            tdee = bmr * 1.55;
            break;
        case 'veryactive':
            tdee = bmr * 1.725;
            break;
        case 'extraactive':
            tdee = bmr * 1.9;
            break;
        default:
            // Return an error response if an invalid activity level value is provided
            return res.status(400).json({ error: 'Invalid activity level value.' });
    }

    // Calculate calories burned by subtracting daily caloric intake from TDEE
    const caloriesBurned = tdee - dailyCaloricIntake;   
    // Set caloriesBurned to 0 if it's less than or equal to 0
    const caloriesBurnedNonNegative = caloriesBurned <= 0 ? 0 : caloriesBurned;

     // Return the calculated calories burned in the response as JSON
     res.json({ caloriesBurned: caloriesBurnedNonNegative.toFixed(2) });
    });

// Serve static files from the current directory (e.g., index.html)
app.use(express.static(path.join(__dirname)));

// Define a route to serve the index.html file when accessing the root URL '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server and listen on the specified port
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));