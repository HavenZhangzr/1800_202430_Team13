async function loadPhoneCodes() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        let countries = await response.json();

        // Sort country names alphabetically
        countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

        const phoneDropdown = document.getElementById('countryCode');

        countries.forEach(country => {
            if (country.idd && country.idd.root) { // Ensure the country has a dialing code
                const option = document.createElement('option');
                option.value = country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : '');
                // option.text = `${country.flag} ${option.value}`;
                option.text = `${country.name.common} ${country.flag} (${option.value})`; // Display country name and dialing code only
                phoneDropdown.appendChild(option);
            }
        });
        console.log("Phone codes added to dropdown.");
    } catch (error) {
        console.error("Error loading phone codes:", error);
    }
}

// Call after page loads
document.addEventListener('DOMContentLoaded', loadPhoneCodes);

async function loadCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        let countries = await response.json();
        
        // Sort country names alphabetically
        countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
        
        const dropdown = document.getElementById('country');

        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : '');
            option.text = `${country.name.common}`; // Display only the country name
            dropdown.appendChild(option);
        });

        console.log("Countries added to dropdown.");
    } catch (error) {
        console.error("Error loading countries:", error);
    }
}

// Call after page loads
document.addEventListener('DOMContentLoaded', loadCountries);



