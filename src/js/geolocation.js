export default function geolocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (data) => resolve(data),
        (data) => reject(data)
      );
    } else {
      reject(new Error('This browser does not support Geolocation'));
    }
  });
}
