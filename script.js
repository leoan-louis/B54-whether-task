
  document.addEventListener('DOMContentLoaded', () => {
    const restCountriesApiUrl = 'https://restcountries.com/v3/all';
    const openWeatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const openWeatherApiKey = 'YOUR_OPENWEATHER_API_KEY';

    const countryCardsContainer = document.getElementById('country-cards');

    const fetchWeather = async (countryCode, countryName) => {
      try {
        const response = await fetch(`${openWeatherApiUrl}?q=${countryCode}&appid=${openWeatherApiKey}`);
        const weatherData = await response.json();
        return weatherData.weather[0].description;
      } catch (error) {
        console.error('Error fetching weather data:', error);
        return 'Not available';
      }
    };

    const createCard = (country) => {
      const card = document.createElement('div');
      card.className = 'card col-md-3';

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body text-center';

      const flagImg = document.createElement('img');
      flagImg.className = 'card-img-top mb-3';
      flagImg.src = country.flags[0];
      flagImg.alt = 'Country Flag';

      flagImg.addEventListener('click', async () => {
        const weatherDescription = await fetchWeather(country.cca2, country.name.common);
        showWeatherModal(country.name.common, weatherDescription);
      });

      cardBody.appendChild(flagImg);

      const capital = document.createElement('h5');
      capital.className = 'card-title';
      capital.textContent = country.capital;
      cardBody.appendChild(capital);

      const region = document.createElement('p');
      region.className = 'card-text';
      region.textContent = `Region: ${country.region}`;
      cardBody.appendChild(region);

      const name = document.createElement('p');
      name.className = 'card-text';
      name.textContent = `Name: ${country.name.common}`;
      cardBody.appendChild(name);

      const countryCode = document.createElement('p');
      countryCode.className = 'card-text';
      countryCode.textContent = `Country Code: ${country.cca2}`;
      cardBody.appendChild(countryCode);

      card.appendChild(cardBody);
      return card;
    };

    const showWeatherModal = (countryName, weatherDescription) => {
      const modal = document.createElement('div');
      modal.className = 'modal fade';
      modal.id = 'weatherModal';
      modal.tabIndex = '-1';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-labelledby', 'weatherModalLabel');
      modal.setAttribute('aria-hidden', 'true');

      const modalDialog = document.createElement('div');
      modalDialog.className = 'modal-dialog';
      modalDialog.setAttribute('role', 'document');

      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content';

      const modalHeader = document.createElement('div');
      modalHeader.className = 'modal-header';
      modalHeader.innerHTML = `
        <h5 class="modal-title" id="weatherModalLabel">${countryName} Weather</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      `;

      const modalBody = document.createElement('div');
      modalBody.className = 'modal-body';
      modalBody.textContent = `Weather: ${weatherDescription}`;

      const modalFooter = document.createElement('div');
      modalFooter.className = 'modal-footer';
      modalFooter.innerHTML = `
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      `;

      modalContent.appendChild(modalHeader);
      modalContent.appendChild(modalBody);
      modalContent.appendChild(modalFooter);

      modalDialog.appendChild(modalContent);
      modal.appendChild(modalDialog);

      document.body.appendChild(modal);

      $('#weatherModal').modal('show');
    };

    fetch(restCountriesApiUrl)
      .then(response => response.json())
      .then(data => {
        data.forEach(country => {
          const card = createCard(country);
          countryCardsContainer.appendChild(card);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  });
