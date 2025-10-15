import { useEffect, useState } from "react";
import { listCities } from "../services/cityService";           // 소문자!
import { listPlaces, addPlace, removePlace } from "../services/PlaceService"; // 대문자 P!

function Place() {
  const [places, setPlaces] = useState([]);
  const [cities, setCities] = useState([]);

  const [name, setName] = useState("");
  const [cityId, setCityId] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    listCities().then(setCities).catch(console.error);
    listPlaces().then(setPlaces).catch(err => alert(err.message));
  }, []);

  const onSave = async () => {
    try {
      if (!name || name.trim().length < 3 || name.trim().length > 50) {
        return alert("장소명은 3~50자여야 해요.");
      }
      if (!cityId) return alert("도시를 선택하세요.");
      const created = await addPlace({ name, city_id: Number(cityId), description });
      setPlaces(prev => [...prev, created]);
      setName("");
      setCityId("");
      setDescription("");
    } catch (err) {
      alert(err.message);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      await removePlace(id);
      setPlaces(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Place (생성/목록/삭제)</h2>

      <div className="flex gap-2 mb-4">
        <input
          placeholder="장소명 (3~50자)"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border px-2"
        />
        <select
          value={cityId}
          onChange={e => setCityId(e.target.value)}
          className="border px-2"
        >
          <option value="">도시 선택</option>
          {cities.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          placeholder="설명(선택)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border px-2"
        />
        <button onClick={onSave} className="border px-2">추가</button>
      </div>

      <ul className="space-y-2">
        {places.map(p => (
          <li key={p.id} className="flex justify-between border p-2">
            <span>#{p.id} {p.name} — city_id: {p.city_id} {p.description ? `| ${p.description}` : ""}</span>
            <button onClick={() => onDelete(p.id)} className="text-red-500">삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Place;
