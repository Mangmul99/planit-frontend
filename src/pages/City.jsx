import { useEffect, useState } from "react";
import { listCities, addCity, removeCity } from "../services/cityService"; // 소문자!

function City() {
  const [cities, setCities] = useState([]);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    listCities().then(setCities).catch(err => alert(err.message));
  }, []);

  const onSave = async () => {
    try {
      if (!name.trim()) return alert("도시명을 입력하세요.");
      const created = await addCity({ name, country });
      setCities(prev => [...prev, created]);
      setName("");
      setCountry("");
    } catch (err) {
      alert(err.message);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      await removeCity(id);
      setCities(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">City (생성/목록/삭제)</h2>

      <div className="flex gap-2 mb-4">
        <input
          placeholder="도시명"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border px-2"
        />
        <input
          placeholder="국가 (예: KR)"
          value={country}
          onChange={e => setCountry(e.target.value)}
          className="border px-2"
        />
        <button onClick={onSave} className="border px-2">추가</button>
      </div>

      <ul className="space-y-2">
        {cities.map(c => (
          <li key={c.id} className="flex justify-between border p-2">
            <span>#{c.id} {c.name} ({c.country || "-"})</span>
            <button onClick={() => onDelete(c.id)} className="text-red-500">삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default City;
