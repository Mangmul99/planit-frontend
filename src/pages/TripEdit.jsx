import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../components/Card'
import { useTrip } from '../hooks/useTrip'
import { useAuth } from '../hooks/useAuth'
import { useCity } from '../hooks/useCity'
import FormField from '../components/ui/FormField'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Separator from '../components/ui/Separator'

// TripEdit : 날짜와 체크리스트로 여행을 생성/수정하는 페이지
export default function TripEdit(){
  const { id } = useParams()
  const nav = useNavigate()
  const isNew = !id

  const [trip,setTrip] = useState({
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
    todo: []
  })
  const { getTrip, createTrip, updateTrip, loading } = useTrip()
  const { getCurrentUser } = useAuth()
  const { getCityByName, createCity } = useCity()

  useEffect(()=>{
    const fetchTrip = async () => {
      if(id){
        try {
          const t = await getTrip(id)
          if(t) setTrip({
            title: t.title,
            destination: t.destination,
            start_date: t.start_date,
            end_date: t.end_date,
            todo: t.todo || []
          })
        } catch (err) {
          console.error('여행 조회 실패:', err)
        }
      }
    }
    fetchTrip()
  },[id])

  const addTodo = ()=> setTrip(t=> ({...t, todo: [...t.todo, {id:crypto.randomUUID(), text:'', done:false}]}))
  const setTodo = (tid, patch)=> setTrip(t=> ({...t, todo: t.todo.map(it=> it.id===tid? {...it, ...patch}: it)}))
  const removeTodo = (tid)=> setTrip(t=> ({...t, todo: t.todo.filter(it=> it.id!==tid)}))

  const submit = async (e)=>{
    e.preventDefault()
    try {
      const user = await getCurrentUser()

      // Get or create city
      let city = null
      try {
        city = await getCityByName(trip.destination)
      } catch (err) {
        // City doesn't exist, create it
        city = await createCity({
          name: trip.destination,
          country: '대한민국' // Default country
        })
      }

      if(isNew) {
        // Remove destination field and add city_id for backend
        const { destination, ...tripData } = trip
        await createTrip({
          ...tripData,
          user_id: user.id,
          city_id: city.id
        })
      } else {
        await updateTrip(id, trip)
      }
      nav('/trips')
    } catch (err) {
      alert('여행 저장에 실패했습니다: ' + err.message)
    }
  }

  return (
    <Card title={isNew? '새 여행' : '여행 수정'}>
      <form className="flex flex-col gap-3" onSubmit={submit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="여행 이름" value={trip.title} onChange={e=>setTrip({...trip, title:e.target.value})} required className="w-full" />
          <FormField label="도시" value={trip.destination} onChange={e=>setTrip({...trip, destination:e.target.value})} required className="w-full" />
          <FormField label="출발일" type="date" value={trip.start_date} onChange={e=>setTrip({...trip, start_date:e.target.value})} required className="w-full" />
          <FormField label="도착일" type="date" value={trip.end_date} onChange={e=>setTrip({...trip, end_date:e.target.value})} required className="w-full" />
        </div>
        <Separator />
        <h4 className="my-3 text-sm font-bold text-text">준비물 체크리스트</h4>
        <div className="flex flex-col gap-2 mt-2">
          {trip.todo.map(item=> (
            <div key={item.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.done}
                onChange={e=>setTodo(item.id,{done:e.target.checked})}
                className="w-4 h-4 rounded border-primary-dark/20 text-primary focus:ring-primary focus:ring-offset-0"
              />
              <Input
                className="flex-1"
                placeholder="예: 여권"
                value={item.text}
                onChange={e=>setTodo(item.id,{text:e.target.value})}
              />
              <button
                type="button"
                className="text-xl hover:scale-110 transition-transform bg-surface border border-primary-dark/15 rounded-lg w-9 h-9 grid place-items-center"
                onClick={()=>removeTodo(item.id)}
              >
                🗑️
              </button>
            </div>
          ))}
          <Button type="button" variant="ghost" onClick={addTodo} className="self-start">+ 항목 추가</Button>
        </div>
        <div className="flex gap-2 mt-3">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? '저장 중...' : '저장'}
          </Button>
          <Button variant="ghost" type="button" onClick={()=>nav(-1)}>취소</Button>
        </div>
      </form>
    </Card>
  )
}
