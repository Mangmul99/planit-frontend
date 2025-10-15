// src/services/PlaceService.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// 장소 전체 목록
export async function listPlaces() {
  const res = await fetch(`${API_BASE}/cities/places`);
  if (!res.ok) throw new Error("장소 목록 불러오기 실패");
  return res.json();
}

// 특정 도시의 장소 목록(옵션)
export async function listPlacesByCity(cityId) {
  const res = await fetch(`${API_BASE}/cities/${cityId}/places`);
  if (!res.ok) throw new Error("도시별 장소 목록 불러오기 실패");
  return res.json();
}

// 장소 생성
export async function addPlace(data) {
  const res = await fetch(`${API_BASE}/cities/places`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("장소 생성 실패");
  return res.json();
}

// 장소 삭제
export async function removePlace(placeId) {
  const res = await fetch(`${API_BASE}/cities/places/${placeId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("장소 삭제 실패");
  return res.json();
}

// 백엔드에 장소 수정(UPDATE) 없음 → updatePlace 제공하지 않음
