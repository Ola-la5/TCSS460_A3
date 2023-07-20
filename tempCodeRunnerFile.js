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


    // Return the calculated calories burned in the response as JSON
    res.json({ caloriesBurned: caloriesBurned.toFixed(2) });
});