const result = document.getElementById("result");
const countrySelect = document.getElementById("country");
const regionSelect = document.getElementById("region");
const yearInput = document.getElementById("year");
const loadBtn = document.getElementById("loadBtn");

const regions = {
    NZ: [
        { value: "NZ-AUK", text: "Auckland" },
        { value: "NZ-WGN", text: "Wellington" },
        { value: "NZ-CAN", text: "Canterbury" },
        { value: "NZ-OTA", text: "Otago" }
    ],

    CA: [
        { value: "CA-AB", text: "Alberta" },
        { value: "CA-BC", text: "British Columbia" },
        { value: "CA-MB", text: "Manitoba" },
        { value: "CA-NB", text: "New Brunswick" },
        { value: "CA-NL", text: "Newfoundland and Labrador" },
        { value: "CA-NS", text: "Nova Scotia" },
        { value: "CA-ON", text: "Ontario" },
        { value: "CA-PE", text: "Prince Edward Island" },
        { value: "CA-QC", text: "Quebec" },
        { value: "CA-SK", text: "Saskatchewan" }
    ],

    GB: [
        { value: "GB-ENG", text: "England" },
        { value: "GB-SCT", text: "Scotland" },
        { value: "GB-WLS", text: "Wales" },
        { value: "GB-NIR", text: "Northern Ireland" }
    ],
		
	US: [
		{ value: "US-AL", text: "Alabama" },
		{ value: "US-AK", text: "Alaska" },
		{ value: "US-AZ", text: "Arizona" },
		{ value: "US-AR", text: "Arkansas" },
		{ value: "US-CA", text: "California" },
		{ value: "US-CO", text: "Colorado" },
		{ value: "US-CT", text: "Connecticut" },
		{ value: "US-DE", text: "Delaware" },
		{ value: "US-FL", text: "Florida" },
		{ value: "US-GA", text: "Georgia" },
		{ value: "US-HI", text: "Hawaii" },
		{ value: "US-ID", text: "Idaho" },
		{ value: "US-IL", text: "Illinois" },
		{ value: "US-IN", text: "Indiana" },
		{ value: "US-IA", text: "Iowa" },
		{ value: "US-KS", text: "Kansas" },
		{ value: "US-KY", text: "Kentucky" },
		{ value: "US-LA", text: "Louisiana" },
		{ value: "US-ME", text: "Maine" },
		{ value: "US-MD", text: "Maryland" },
		{ value: "US-MA", text: "Massachusetts" },
		{ value: "US-MI", text: "Michigan" },
		{ value: "US-MN", text: "Minnesota" },
		{ value: "US-MS", text: "Mississippi" },
		{ value: "US-MO", text: "Missouri" },
		{ value: "US-MT", text: "Montana" },
		{ value: "US-NE", text: "Nebraska" },
		{ value: "US-NV", text: "Nevada" },
		{ value: "US-NH", text: "New Hampshire" },
		{ value: "US-NJ", text: "New Jersey" },
		{ value: "US-NM", text: "New Mexico" },
		{ value: "US-NY", text: "New York" },
		{ value: "US-NC", text: "North Carolina" },
		{ value: "US-ND", text: "North Dakota" },
		{ value: "US-OH", text: "Ohio" },
		{ value: "US-OK", text: "Oklahoma" },
		{ value: "US-OR", text: "Oregon" },
		{ value: "US-PA", text: "Pennsylvania" },
		{ value: "US-RI", text: "Rhode Island" },
		{ value: "US-SC", text: "South Carolina" },
		{ value: "US-SD", text: "South Dakota" },
		{ value: "US-TN", text: "Tennessee" },
		{ value: "US-TX", text: "Texas" },
		{ value: "US-UT", text: "Utah" },
		{ value: "US-VT", text: "Vermont" },
		{ value: "US-VA", text: "Virginia" },
		{ value: "US-WA", text: "Washington" },
		{ value: "US-WV", text: "West Virginia" },
		{ value: "US-WI", text: "Wisconsin" },
		{ value: "US-WY", text: "Wyoming" },
		{ value: "US-DC", text: "District of Columbia" }
	],

    AU: [
        { value: "AU-ACT", text: "Australian Capital Territory" },
        { value: "AU-NSW", text: "New South Wales" },
        { value: "AU-NT", text: "Northern Territory" },
        { value: "AU-QLD", text: "Queensland" },
        { value: "AU-SA", text: "South Australia" },
        { value: "AU-TAS", text: "Tasmania" },
        { value: "AU-VIC", text: "Victoria" },
        { value: "AU-WA", text: "Western Australia" }
    ]
};

function populateRegions() {

    const country = countrySelect.value;

    regionSelect.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "All Regions";

    regionSelect.appendChild(defaultOption);

    if (!regions[country]) {
        regionSelect.disabled = true;
        return;
    }

    regionSelect.disabled = false;

    regions[country].forEach(region => {
        const option = document.createElement("option");

        option.value = region.value;
        option.textContent = region.text;

        regionSelect.appendChild(option);
    });

    // Optional defaults
    if (country === "CA") {
        regionSelect.value = "CA-AB";
    }

    if (country === "GB") {
        regionSelect.value = "GB-ENG";
    }

    if (country === "AU") {
        regionSelect.value = "AU-VIC";
    }

}

countrySelect.addEventListener(
    "change",
    populateRegions
);

populateRegions();

yearInput.value = new Date().getFullYear();

loadBtn.addEventListener("click", loadHolidays);

async function loadHolidays() {
    const country = countrySelect.value;
    const year = yearInput.value;

    result.innerHTML =
        '<div class="loading">Loading holidays...</div>';

    try {
        const response = await fetch(
            `https://nagerholidays.com/api/v4/Holidays/${country}/${year}`
        );

        if (!response.ok) {
            throw new Error("Unable to retrieve holiday data");
        }

        const holidays = await response.json();

        const selectedRegion = regionSelect.value;

        const filteredHolidays =
            selectedRegion === ""
                ? holidays
                : holidays.filter(holiday =>
                    holiday.nationalHoliday ||
                    holiday.subdivisionCodes?.includes(selectedRegion)
                );

        renderHolidays(filteredHolidays);
        if (!holidays.length) {
            result.innerHTML =
                '<div class="no-results">No holidays found.</div>';
            return;
        }

    } catch (error) {
        result.innerHTML =
            `<div class="error"> ${error.message}</div> `;
    }
}

function renderHolidays(holidays) {

    const rows = holidays.map(holiday => `
            <tr>
            <td>${holiday.date}</td>
            <td>${holiday.name}</td>
            <td>${holiday.nationalHoliday ? "Yes" : "No"}</td>
            <td>${holiday.holidayTypes.join(", ")}</td>
            </tr >
            `).join("");

    result.innerHTML = `
            <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Holiday</th>
                    <th>National</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
            </table >
            `;
}

loadHolidays();