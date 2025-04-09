export function formatAddress({
  city,
  district,
  ward,
  address,
}: {
  city?: string;
  district?: string;
  ward?: string;
  address?: string;
}) {
  let locationString = "";
  //đếm để check nếu chỉ có 1 thuộc tính
  let addressUnitCount = 0;

  if (address) {
    locationString += `${address}, `;
    addressUnitCount++;
  }

  if (ward) {
    locationString += `${ward}, `;
    addressUnitCount++;
  }

  if (district) {
    locationString += `${district}, `;
    addressUnitCount++;
  }

  if (city) {
    locationString += `${city}`;
    addressUnitCount++;
  }

  if (addressUnitCount < 2) {
    locationString = locationString.replaceAll(",", "");
  }

  return locationString.trim(); // Remove trailing comma and spaces
}
