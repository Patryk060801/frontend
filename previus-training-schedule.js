const previousTraining = document.querySelector(".previus-training-schedule");
const buttonSchedule = document.querySelector(".button-schedule-section");
const mainSection = document.querySelector(".main-training-schedule");
const trainingData = document.querySelector(".trening-data");

previousTraining.addEventListener("click", () => {
  mainSection.style.display = "none";
  buttonSchedule.style.display = "flex";
  displayLoadedExercises();
});

// Dodanie event listenera do burger menu (tylko raz)
const burgerMenu = document.querySelector(".burger-menu");
burgerMenu.addEventListener("click", () => {
  const containerExercise = document.querySelector(".container-exercise");
  containerExercise.classList.toggle("hide");
});

function displayLoadedExercises() {
  const weeklyTrainings = loadWeeklyTrainings();
  const containerExercise = document.querySelector(".container-exercise");
  const trainingData = document.querySelector(".trening-data");

  containerExercise.innerHTML = "";
  trainingData.innerHTML = "";

  weeklyTrainings.forEach((weeklyTraining) => {
    const clickDate = weeklyTraining.data.clickDate;
    const endDate = weeklyTraining.data.endDate;
    
    // Tworzymy dwa zestawy treningów
    const trainings = [
      weeklyTraining.exercises[0], // Pierwszy trening (asda)
      weeklyTraining.exercises[1] || { // Drugi trening (klata)
        trainingName: "KLATA",
        exercises: [] // Puste ćwiczenia, jeśli nie ma treningu klaty
      }
    ];

    // Tworzenie tylko jednego elementu z datą dla głównego diva
    const trainingDateElement = document.createElement("div");
    trainingDateElement.classList.add("training-date");
    trainingDateElement.innerHTML = `
      <p>Data treningu: ${clickDate} - ${endDate}</p>
    `;
    trainingData.appendChild(trainingDateElement);

    trainings.forEach(training => {
      // Tworzenie kontenera dla szczegółów ćwiczeń (w burger menu)
      const exerciseDetailsContainer = document.createElement("div");
      exerciseDetailsContainer.classList.add("exercise-details");

      const exerciseItem = document.createElement("div");
      exerciseItem.classList.add("exercise-item-weekly");

      const titleElement = document.createElement("h2");
      titleElement.classList.add("schedule-title");
      titleElement.textContent = training.trainingName;
      exerciseItem.appendChild(titleElement);

      const detailsContainer = document.createElement("div");
      detailsContainer.classList.add("items-weekly");

      if (training.exercises && training.exercises.length > 0) {
        training.exercises.forEach((exerciseDetails) => {
          const exerciseInfo = document.createElement("div");
          exerciseInfo.classList.add("exercise-info");

          exerciseInfo.innerHTML = `
            <p class="exercise-name-item">${exerciseDetails.name}</p>
            <span><label>Rest(s):</label> <span>${exerciseDetails.timer}</span></span>
            <span><label>Weight(kg):</label> <span>${exerciseDetails.weight}</span></span>
            <span><label>Reps:</label> <span>${exerciseDetails.reps}</span></span>
            <span><label>Sets:</label> <span>${exerciseDetails.sets}</span></span>
          `;

          detailsContainer.appendChild(exerciseInfo);
        });
      }

      exerciseItem.appendChild(detailsContainer);
      exerciseDetailsContainer.appendChild(exerciseItem);
      containerExercise.appendChild(exerciseDetailsContainer);
    });
  });
}

// Funkcja do ładowania zapisanych treningów z localStorage
function loadWeeklyTrainings() {
  const savedWeeklyTrainings = localStorage.getItem("weeklyTrainings");
  return savedWeeklyTrainings ? JSON.parse(savedWeeklyTrainings) : [];
}

// Dodanie obsługi przycisku czyszczenia historii
const clearHistoryBtn = document.querySelector(".clear-history-btn");
clearHistoryBtn.addEventListener("click", () => {
    localStorage.removeItem("weeklyTrainings");
    const containerExercise = document.querySelector(".container-exercise");
    const trainingData = document.querySelector(".trening-data");
    containerExercise.innerHTML = "";
    trainingData.innerHTML = "";
});
