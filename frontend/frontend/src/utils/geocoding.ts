// utils/geocoding.ts
export async function getDireccion(lat: number, lng: number) {
  try {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          "User-Agent": "tuapp/1.0", // requerido por Nominatim
        },
      }
    );
    const data = await resp.json();

    return {
      ciudad: data.address.city || data.address.town || data.address.village,
      calle: data.address.road,
      referencia: data.display_name, // dirección completa
    };
  } catch (err) {
    console.error("Error en geocodificación inversa:", err);
    return null;
  }
}
