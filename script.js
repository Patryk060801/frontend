const timerIcon = document.querySelector(".timer");
const cameraIcon = document.querySelector(".camera");
const trainingSchedule = document.querySelector(".main-training-schedule");
const trainingContent = document.querySelector("#add-training-content");
const addTrainingIcon = document.querySelector(".add-training-icon");
const inputTitle = document.querySelector(".training-title-input");
const resetBtn = document.querySelector(".reset");
const addBtn = document.querySelector("#add");
const addInputBtn = document.querySelector(".btn-add-title");
const closeInputbtn = document.querySelector(".close-input-title-icon");
const form = document.querySelector(".exercise-specifications");
let currentTrainingName = null; // Globalna zmienna dla nazwy treningu
let selectedTrainingClass = null; // Zmienna dla wybranego treningu (np. training-1)
let dateObject = null;
let weeklyTrening = null;

addTrainingIcon.addEventListener("click", () => {
  resetTrainingName();
  trainingList.style.display = "none";
  inputTitle.style.display = "block";
  inputTitle.classList.add("active");
  inputTitle.classList.remove("hidden");
  addTrainingIcon.style.display = "none";
});

addInputBtn.addEventListener("click", () => {
  trainingContent.classList.toggle("active");
  trainingContent.classList.toggle("hidden");
  inputTitle.style.display = "none";
  addTrainingIcon.style.display = "none";
  trainingList.style.display = "none";

  if (trainingContent.classList.contains("active")) {
    inputTitle.classList.add("hidden");
    addTrainingIcon.style.display = "none";
  } else {
    inputTitle.classList.remove("hidden");
  }
});

closeInputbtn.addEventListener("click", () => {
  inputTitle.classList.add("hidden");
  inputTitle.style.display = "none";
  trainingContent.classList.remove("active");
  trainingContent.classList.add("hidden");
  addTrainingIcon.style.display = "block";
  trainingList.style.display = "flex";
});

// Funkcja do pobierania ćwiczeń z localStorage
function getExercisesFromLocalStorage() {
  const exercisesJSON = localStorage.getItem("exercises");
  return exercisesJSON ? JSON.parse(exercisesJSON) : [];
}

// Funkcja do zapisywania ćwiczeń do localStorage
function saveExercisesToLocalStorage(exercises) {
  localStorage.setItem("exercises", JSON.stringify(exercises));
}

let exercises = getExercisesFromLocalStorage();

function addExercise(targetTrainingClass = null) {
  const trainingName =
    currentTrainingName ||
    document.getElementById("training-input").value.trim();
  const exerciseName = document.getElementById("exercise-input").value.trim();
  const timer = parseInt(document.getElementById("set-timer").value);
  const weight = parseInt(document.getElementById("weight-input").value);
  const reps = parseInt(document.getElementById("reps-input").value);
  const sets = parseInt(document.getElementById("sets-input").value);

  // Sprawdzanie, czy wprowadzono nazwę ćwiczenia
  if (!exerciseName) {
    return;
  }

  const exercise = {
    name: exerciseName,
    timer: timer,
    weight: weight,
    reps: reps,
    sets: sets,
  };

  let targetTraining = exercises.find(
    (training, index) => `training-${index + 1}` === targetTrainingClass
  );

  if (!targetTraining) {
    // Jeśli trening nie istnieje, tworzymy nowy trening z ćwiczeniem
    const training = {
      trainingName: trainingName,
      exercises: [exercise],
    };
    exercises.push(training);

    currentTrainingName = trainingName;
    document.getElementById("training-input").style.display = "none";
  } else {
    // Jeśli trening istnieje, dodajemy do niego ćwiczenie
    targetTraining.exercises.push(exercise);
  }

  saveExercisesToLocalStorage(exercises);
  displayExercises();

  // Czyścimy pola input dla kolejnego ćwiczenia
  document.getElementById("exercise-input").value = "";
  document.getElementById("set-timer").value = "";
  document.getElementById("weight-input").value = "";
  document.getElementById("reps-input").value = "";
  document.getElementById("sets-input").value = "";
}

function displayExercises() {
  const trainingList = document.getElementById("trainingList");
  trainingList.innerHTML = "";

  exercises.forEach((training, trainingIndex) => {
    const trainingItem = document.createElement("div");
    trainingItem.classList.add("training-item");

    const uniqueClass = `training-${trainingIndex + 1}`;
    trainingItem.classList.add(uniqueClass);
    trainingItem.textContent = `${training.trainingName}`.toUpperCase();

    const exerciseContainer = document.createElement("div");
    exerciseContainer.classList.add("exercise-container");
    exerciseContainer.style.display = "none";

    training.exercises.forEach((exercise, exerciseIndex) => {
      const exerciseItem = document.createElement("div");
      exerciseItem.classList.add("exercise-item");

      exerciseItem.innerHTML = `
      <div class="name-timer">
        <input type="text" class="exercise-name-item" value="${exercise.name.toUpperCase()}"/>
        <label for="set-timer">Rest(s):</label>
        <input type="number" id="set-timer" value="${exercise.timer}"/>
        </div>
        <br>
        <div class="items">
          <ion-icon class="remove-items-icon" name="close-outline"></ion-icon>
          <label for="weight-item">Weight(kg):</label>
          <input type="number" id="weight-item" value="${exercise.weight}"/>
          <label for="reps-item">Reps:</label>
          <input type="number" id="reps-item" value="${exercise.reps}"/>
          <label for="sets-item">Sets:</label>
          <input type="number" id="sets-item" value="${exercise.sets}"/>
        </div>
      `;
      exerciseContainer.appendChild(exerciseItem);

      const removeIcon = exerciseItem.querySelector(".remove-items-icon");
      removeIcon.addEventListener("click", () => {
        // Usuń ćwiczenie z tablicy exercises
        exercises[trainingIndex].exercises.splice(exerciseIndex, 1);

        // Sprawdź, czy lista ćwiczeń jest pusta po usunięciu
        if (exercises[trainingIndex].exercises.length === 0) {
          // Usuń cały trening, jeśli nie ma już ćwiczeń
          exercises.splice(trainingIndex, 1);
        }

        saveExercisesToLocalStorage(exercises);
        displayExercises();
      });
    });

    const nextItemBtn = document.createElement("div");
    nextItemBtn.innerHTML = `<ion-icon class="next-exercise" name="add-circle"></ion-icon>`;
    nextItemBtn.classList.add("next-item-btn");
    exerciseContainer.appendChild(nextItemBtn);

    nextItemBtn.addEventListener("click", () => {
      selectedTrainingClass = uniqueClass;
      trainingContent.classList.toggle("active");
      trainingContent.classList.toggle("hidden");
      inputTitle.style.display = "none";
      addTrainingIcon.style.display = "none";
      trainingList.style.display = "none";

      addBtn.addEventListener("click", () => {
        if (form.checkValidity()) {
          addExercise(selectedTrainingClass);
          selectedTrainingClass = null;
        } else {
          form.reportValidity();
        }
      });
    });

    trainingItem.addEventListener("click", () => {
      trainingItem.classList.toggle("active2");
      exerciseContainer.style.display =
        exerciseContainer.style.display === "none" ? "block" : "none";
    });

    trainingList.appendChild(trainingItem);
    trainingList.appendChild(exerciseContainer);
    trainingList.append(saveButton);
  });
}

const saveButton = document.createElement("div");
saveButton.classList.add("save-btn");
saveButton.textContent = "save";

// <--------------------------trzeba dopracować------------------------------------>
function createDateObject() {
  const clickDate = new Date();

  const endDate = new Date(clickDate);
  endDate.setDate(clickDate.getDate() + 7);

  const formattedClickDate = clickDate.toLocaleDateString("pl-PL");
  const formattedEndDate = endDate.toLocaleDateString("pl-PL");

  dateObject = {
    clickDate: formattedClickDate,
    endDate: formattedEndDate,
  };
}

saveButton.addEventListener("click", () => {
  createDateObject();
  weeklyTrening = {
    data: dateObject,
    exercises: exercises,
  };

  try {
    // Pobierz istniejące treningi
    const existingTrainings = JSON.parse(localStorage.getItem("weeklyTrainings") || "[]");
    
    // Dodaj nowy trening do listy
    existingTrainings.push(weeklyTrening);
    
    // Zapisz zaktualizowaną listę do localStorage
    localStorage.setItem("weeklyTrainings", JSON.stringify(existingTrainings));
    
    // Nie czyścimy listy treningów po zapisaniu
    // exercises = [];
    // displayExercises();

  } catch (error) {
    console.error("Błąd podczas zapisywania treningu:", error);
    alert("Wystąpił błąd podczas zapisywania treningu!");
  }
});

// <--------------------------trzeba dopracować------------------------------------>

addBtn.addEventListener("click", () => {
  if (form.checkValidity()) {
    addExercise(selectedTrainingClass);
    trainingContent.classList.add("hidden");
    addTrainingIcon.style.display = "block";
    trainingList.style.display = "flex";
    selectedTrainingClass = null;
  } else {
    form.reportValidity();
  }
});

// Wyświetlenie ćwiczeń przy załadowaniu strony
displayExercises();

function resetTrainingName() {
  currentTrainingName = null;
  document.getElementById("training-input").style.display = "block";
  document.getElementById("training-input").value = "";
}

resetBtn.addEventListener("click", () => {
  clearExercises();
  resetTrainingName();
});

function clearExercises() {
  localStorage.clear();
  exercises = [];
  displayExercises();
}

// Dodanie event listenera do napisu GYM App
const titleNav = document.querySelector(".title-nav");
titleNav.style.cursor = "pointer"; // Dodanie kursora pointer, żeby pokazać że element jest klikalny

titleNav.addEventListener("click", () => {
  // Pokazanie głównej sekcji treningowej
  mainSection.style.display = "block";
  // Ukrycie sekcji z poprzednimi treningami
  buttonSchedule.style.display = "none";
  // Resetowanie widoku formularza
  trainingContent.classList.add("hidden");
  addTrainingIcon.style.display = "block";
  trainingList.style.display = "flex";
  inputTitle.style.display = "none";
});
