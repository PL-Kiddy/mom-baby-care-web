import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../../../shared/hooks/useAuth'
import { updateProfileApi } from '../services/memberProfileService'

interface ProfileForm {
  name: string
  date_of_birth: string
  gender: 'male' | 'female' | 'other'
  street: string
  ward: string
  district: string
  city: string
}

export default function AccountProfilePage() {
  const { user, token, refreshToken, setUserFromProfile } = useAuth() as any
  const [form, setForm] = useState<ProfileForm>({
    name: user?.name ?? '',
    date_of_birth: '',
    gender: 'female',
    street: '',
    ward: '',
    district: '',
    city: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: user?.name ?? prev.name,
    }))
  }, [user?.name])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)
    try {
      setLoading(true)
      const updated = await updateProfileApi(token, refreshToken, {
        name: form.name,
        date_of_birth: form.date_of_birth || undefined,
        gender: form.gender,
        address: {
          street: form.street,
          ward: form.ward,
          district: form.district,
          city: form.city,
        },
      })
      if (setUserFromProfile) {
        setUserFromProfile(updated)
      }
      setMessage('Cập nhật thông tin thành công.')
    } catch (err: any) {
      setError(err.message ?? 'Không thể cập nhật thông tin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background-light text-text-main font-display min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-grow w-full max-w-[960px] mx-auto px-4 md:px-8 lg:px-0 py-8">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold">Tài khoản của tôi</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-text-main mb-6">
          Thông tin tài khoản
        </h1>

        <div className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              {user?.name
                ?.split(' ')
                .map((w: string) => w[0])
                .slice(-2)
                .join('')
                .toUpperCase() ?? 'ME'}
            </div>
            <div>
              <div className="font-bold text-text-main">{user?.name ?? 'Thành viên'}</div>
              <div className="text-sm text-text-muted">{user?.email ?? 'member@gmail.com'}</div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-pink-50"
          >
            <div className="space-y-1">
              <label className="block text-xs font-bold text-text-muted mb-1">
                Họ và tên
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-[#fce7ef] bg-[#fffafa] text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-text-muted mb-1">
                Email
              </label>
              <input
                disabled
                value={user?.email ?? ''}
                className="w-full px-3 py-2 rounded-xl border border-[#fce7ef] bg-[#fffafa] text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-text-muted mb-1">
                Ngày sinh
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-[#fce7ef] bg-[#fffafa] text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-text-muted mb-1">
                Giới tính
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-[#fce7ef] bg-[#fffafa] text-sm"
              >
                <option value="female">Nữ</option>
                <option value="male">Nam</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-text-muted mb-1">
                Địa chỉ (Đường)
              </label>
              <input
                name="street"
                value={form.street}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-[#fce7ef] bg-[#fffafa] text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-text-muted mb-1">
                Phường/Xã
              </label>
              <input
                name="ward"
                value={form.ward}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-[#fce7ef] bg-[#fffafa] text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-text-muted mb-1">
                Quận/Huyện
              </label>
              <input
                name="district"
                value={form.district}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-[#fce7ef] bg-[#fffafa] text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-text-muted mb-1">
                Tỉnh/Thành phố
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-[#fce7ef] bg-[#fffafa] text-sm"
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-2 mt-2">
              {message && (
                <p className="text-sm text-emerald-600 font-medium">
                  {message}
                </p>
              )}
              {error && (
                <p className="text-sm text-red-500 font-medium">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-extrabold shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">
                  save
                </span>
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}

