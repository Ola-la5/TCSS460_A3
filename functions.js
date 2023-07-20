// When the DOM content is loaded, execute the following code
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('calculator-form');
    const resultContainer = document.getElementById('result-container');
    const bmiFields = document.getElementById('bmi-fields'); // Add this line
    const bodyfatFields = document.getElementById('bodyfat-fields');
    const idealweightFields = document.getElementById('idealweight-fields');
    const caloriesburnedFields = document.getElementById('caloriesburned-fields');

    // Set the dropdown value to "bmi" on page load
    document.getElementById('calculator').value = 'bmi';
    bmiFields.style.display = 'block'; 

    // Declare variables for calculations
    let bmi; // BMI value
    let weight; // Weight value
    let bodyfat; // Body fat percentage value
    let height; // Height value
    let age; // Age value
    

    // Add a form submit event listener
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const calculator = document.getElementById('calculator').value;
        let endpoint;
        let queryString = `?calculator=${calculator}`;

        // If BMI calculator is selected
        if (calculator === 'bmi') {
            // Get height and weight input values
            const heightInput = parseFloat(document.getElementById('height').value);
            const weightInput = parseFloat(document.getElementById('weight').value);

            // Validate height and weight inputs
            if (isNaN(heightInput) || isNaN(weightInput) || heightInput <= 0 || weightInput <= 0) {
                return alert('Invalid height or weight values.');
            }

            // Add height and weight to query string
            queryString += `&height=${heightInput}&weight=${weightInput}`;
            endpoint = '/bmi';

            // Fetch BMI calculation data
            fetch(endpoint + queryString)
                .then(response => response.json())
                .then(data => {
                    bmi = data.bmi; // Store the calculated BMI
                    weight = data.weight; // Store the provided weight for future calculations
                    height = heightInput; // Store the provided height for future calculations
                })
                .catch(error => {
                    console.error(error);
                });
        } else if (calculator === 'bodyfat') {
            // If Body Fat calculator is selected
            // Check if BMI is calculated before
            if (typeof bmi === 'undefined') {
                return alert('Please calculate BMI first.');
            }

            // Get gender and age input values
            const gender = document.getElementById('gender').value;
            const ageInput = parseInt(document.getElementById('age').value);

            // Validate age input
            if (isNaN(ageInput) || ageInput <= 0) {
                return alert('Invalid age value.');
            }

            // Add gender, age, bmi, and weight to query string
            queryString += `&age=${ageInput}&gender=${gender}&bmi=${bmi}&weight=${weight}`; 
            endpoint = '/bodyfat';

            // Fetch Body Fat calculation data
            fetch(endpoint + queryString)
                .then(response => response.json())
                .then(data => {
                    bodyfat = data.bodyFat; // Store the provided body fat for future calculations
                    age = ageInput; // Store the provided age for future calculations               
                })
                .catch(error => {
                    console.error(error);
                });
        } else if (calculator === 'idealweight') {
            // If Ideal Weight calculator is selected
            // Check if Body Fat is calculated before
            if (typeof bodyfat === 'undefined') {
                return alert('Please calculate Body fat index first.');
            }

            // Get the ideal weight input value
            const weightI = parseFloat(document.getElementById('weight').value);
            queryString = `?weight=${weightI}&bodyFat=${bodyfat}`; 
            endpoint = '/idealweight';
        } else if (calculator === 'caloriesburned') {
            // If Calories Burned calculator is selected
            // Check if BMI and Body Fat are calculated before
            if (typeof bmi === 'undefined' || typeof bodyfat === 'undefined') {
                return alert('Please calculate BMI, Body Fat Index.');
            }

            // Get activity level and daily caloric intake input values
            const activityLevel = document.getElementById('activityLevel').value;
            const dailyCaloricIntake = parseFloat(document.getElementById('calories').value);

            // Add age, height, weight, activity level, and daily caloric intake to query string
            queryString = `?age=${age}&height=${height}&weight=${weight}&activityLevel=${activityLevel}&calories=${dailyCaloricIntake}`;
            endpoint = '/caloriesburned';
        }

        // Fetch the data for the selected calculator
        fetch(endpoint + queryString)
            .then(response => response.json())
            .then(data => {
                // Display the result based on the selected calculator
                if (calculator === 'bmi') {
                    resultContainer.innerHTML = `<h3>BMI: ${data.bmi}</h3>`;
                } else if (calculator === 'bodyfat') {
                    resultContainer.innerHTML = `<h3>Body Fat Percentage: ${data.bodyFat} % </h3>`;
                } else if (calculator === 'idealweight') {
                    resultContainer.innerHTML = `<h3>Ideal Weight: ${data.idealWeight} kg </h3>`;
                } else if (calculator === 'caloriesburned') {
                    resultContainer.innerHTML = `<h3>Calories Burned: ${data.caloriesBurned} cal</h3>`;
                }
                // Show the result container after setting the innerHTML
                resultContainer.style.display = 'block';
            })
            .catch(error => {
                console.error(error);
            });
    });

    // Show/hide fields based on the selected calculator option
    document.getElementById('calculator').addEventListener('change', function () {
        if (this.value === 'bodyfat') {
            bodyfatFields.style.display = 'block';
            caloriesburnedFields.style.display = 'none';
            idealweightFields.style.display = 'none';
            bmiFields.style.display = 'none';
        } else if (this.value === 'caloriesburned') {
            caloriesburnedFields.style.display = 'block';
            bodyfatFields.style.display = 'none';
            idealweightFields.style.display = 'none';
            bmiFields.style.display = 'none';
        } else if (this.value === 'idealweight') {
            idealweightFields.style.display = 'block';
            bodyfatFields.style.display = 'none';
            caloriesburnedFields.style.display = 'none';
            bmiFields.style.display = 'none';
        } else if (this.value === 'bmi') {
            bmiFields.style.display = 'block';
            bodyfatFields.style.display = 'none';
            idealweightFields.style.display = 'none';
            caloriesburnedFields.style.display = 'none';
        } else {
            bodyfatFields.style.display = 'none';
            caloriesburnedFields.style.display = 'none';
            idealweightFields.style.display = 'none';
            bmiFields.style.display = 'none';
        }
    });
});