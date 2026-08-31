import { useState, useEffect } from 'react'
import './App.css'

const API_URL = (deviceId: string) => 
  `https://lumentree.nguyensuong1509.workers.dev/api/realtime/device/${deviceId}`

function App() {
  const [deviceId, setDeviceId] = useState('P250812094')
  const [inputId, setInputId] = useState('P250812094')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchData = async () => {
    if (!deviceId) return
    setLoading(true); setError('')
    try {
      const res = await fetch(API_URL(deviceId))
      if (!res.ok) throw new Error('Lỗi kết nối API')
      const result = await res.json()
      if (!result.success) throw new Error(result.error || 'Không có dữ liệu')
      setData(result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [deviceId])
  useEffect(() => {
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [deviceId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDeviceId(inputId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-amber-400 text-center mb-6">☀️ Điện Mặt Trời — Lumentree</h1>
        
        <form onSubmit={handleSubmit} className="bg-white/5 rounded-2xl p-5 mb-6 border border-white/10">
          <label className="block text-sm text-slate-300 mb-2">Mã thiết bị</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white"
              required
            />
            <button type="submit" className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition">
              Xem →
            </button>
          </div>
        </form>

        {loading && <p className="text-center text-slate-400 py-10">⏳ Đang tải dữ liệu...</p>}
        {error && <p className="text-center text-red-400 py-10">{error}</p>}

        {data && !loading && (
          <>
            <p className="text-center text-sm text-slate-400 mb-4">Thiết bị: {deviceId} ● Online</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-4 rounded-xl border-l-4 border-orange-500">
                <h3 className="text-sm text-slate-400 mb-1">⚡ Công suất PV</h3>
                <p className="text-2xl font-bold">{data.pvPower ?? 0} <span className="text-sm text-slate-400">W</span></p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border-l-4 border-green-500">
                <h3 className="text-sm text-slate-400 mb-1">🔋 Mức pin</h3>
                <p className="text-2xl font-bold">{data.batterySoc ?? 0} <span className="text-sm text-slate-400">%</span></p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border-l-4 border-blue-500">
                <h3 className="text-sm text-slate-400 mb-1">📊 Sản lượng hôm nay</h3>
                <p className="text-2xl font-bold">{data.todayEnergy ?? 0} <span className="text-sm text-slate-400">kWh</span></p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border-l-4 border-purple-500">
                <h3 className="text-sm text-slate-400 mb-1">🏠 Tải tiêu thụ</h3>
                <p className="text-2xl font-bold">{data.loadPower ?? 0} <span className="text-sm text-slate-400">W</span></p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border-l-4 border-slate-500">
                <h3 className="text-sm text-slate-400 mb-1">🔌 Điện lưới</h3>
                <p className="text-2xl font-bold">{data.gridPower ?? 0} <span className="text-sm text-slate-400">W</span></p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border-l-4 border-slate-500">
                <h3 className="text-sm text-slate-400 mb-1">🔋 Điện áp pin</h3>
                <p className="text-2xl font-bold">{data.batteryVoltage ?? 0} <span className="text-sm text-slate-400">V</span></p>
              </div>
            </div>
            <p className="text-center text-xs text-slate-500 mt-6">Cập nhật: {new Date().toLocaleTimeString('vi-VN')} (mỗi 30s)</p>
          </>
        )}
      </div>
    </div>
  )
}

export default App
