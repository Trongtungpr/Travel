function checkWeatherSubmit(event) {
  event.preventDefault();
  const location = document.getElementById("location").value;
  const startDate = document.getElementById("startDate").value;

  const request = {
    location: location,
    startDate: startDate,
  };

  // Kiểm tra startDate có hợp lệ hay không trước khi tính toán khoảng thời gian
  if (Client.isValidData(location) && Client.isValidData(startDate) && Client.isEndDateValid(startDate)) {
    // Tính toán khoảng thời gian sau khi xác định startDate hợp lệ
    const daysDifference = Client.daysBetween2Dates(startDate);
    console.log(`duration: ${daysDifference} days`);

    // Sử dụng daysDifference cho việc kiểm tra
    if (daysDifference < 16) {
      updateUiWaiting();
      console.log(
        "checkWeatherSubmit - send data to server, location: " +
          request.location +
          ", startDate: " +
          request.startDate
      );
      checkWeather(request).then((response) => updateUI(response));
    } else {
      alert("Start date must be within 15 days from today!!!");
    }
  } else {
    alert("You must enter a valid Location and Start date!!!");
  }
}

// request check weather to server
const checkWeather = async (data = {}) => {
  console.log("checkWeather - send data to server :", data);
  const response = await fetch("/getDataFromAllAPI", {
    method: "POST",
    credentials: "same-origin",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  try {
    const newData = await response.json();
    console.log("Data received:", newData);
    return newData;
  } catch (error) {
    console.log("checkWeather - error: ", error);
    // Xử lý lỗi khi fetch hoặc parse JSON thất bại
    // Ví dụ: Hiển thị thông báo lỗi cho người dùng
    alert("Failed to fetch weather data. Please try again later.");
  }
};

const updateUI = (data) => {
  // Kiểm tra xem data có tồn tại trước khi truy cập thuộc tính
  if (data) {
    document.getElementById("country").innerHTML = `Your location: ${data.country || ''}`;
    document.getElementById("date").innerHTML = `Date: ${data.startDate || ''}`;
    document.getElementById("city-name").innerHTML = `Nation: ${data.city_name || ''}`;
    document.getElementById("weather").innerHTML = `Weather: ${data.weather || ''}`;
    document.getElementById("temp").innerHTML = `Tempature: ${data.temp || ''}`;
    document.getElementById("location-picture").src = data.webformatURL || '';

    //set data to localStorage
    localStorage.setItem('country', data.country || '');
    localStorage.setItem('date', data.startDate || '');
    localStorage.setItem('city_name', data.city_name || '');
    localStorage.setItem('weather', data.weather || '');
    localStorage.setItem('temp', data.temp || '');
    localStorage.setItem('location-picture', data.webformatURL || '');
  } else {
    // Xử lý trường hợp data không hợp lệ
    // Ví dụ: Hiển thị thông báo lỗi hoặc dữ liệu mặc định
    console.error("Invalid data received from server.");
  }
};

const updateUiWaiting = () => {
  document.getElementById("country").innerHTML = `Waiting getting data...`;
  document.getElementById("date").innerHTML = `Waiting getting data...`;
  document.getElementById("city-name").innerHTML = `Waiting getting data...`;
  document.getElementById("weather").innerHTML = `Waiting getting data...`;
  document.getElementById("temp").innerHTML = `Waiting getting data...`;
};

// Local Storage
const getDataFromLocalStorage = () => {
  document.getElementById("country").innerHTML = localStorage.getItem('country') || '';
  document.getElementById("date").innerHTML = localStorage.getItem('date') || '';
  document.getElementById("city-name").innerHTML = localStorage.getItem('city_name') || '';
  document.getElementById("weather").innerHTML = localStorage.getItem('weather') || '';
  document.getElementById("temp").innerHTML = localStorage.getItem('temp') || '';
  document.getElementById("location-picture").src = localStorage.getItem('location-picture') || '';
}

export { checkWeatherSubmit, updateUI, updateUiWaiting, getDataFromLocalStorage };