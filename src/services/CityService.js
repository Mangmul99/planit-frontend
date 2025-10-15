// src/services/cityService.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";


export async function listCities() {
  const res = await fetch(`${API_BASE}/cities/`);
  if (!res.ok) throw new Error("도시 목록을 불러오지 못했습니다.");
  return res.json();
}

export async function addCity(data) {
  const res = await fetch(`${API_BASE}/cities/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("도시 추가 실패");
  return res.json();
}

// 백엔드에 도시 수정(UPDATE) 없음 → updateCity 제공하지 않음

export async function removeCity(id) {
  const res = await fetch(`${API_BASE}/cities/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("도시 삭제 실패");
  // 백엔드가 삭제된 City를 JSON으로 돌려주니 json() 가능하지만 UI에선 반환값 안 씀
  return res.json();
}

