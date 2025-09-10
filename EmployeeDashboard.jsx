import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, BarChart3, LogOut, User } from 'lucide-react'
import TrainingPage from './TrainingPage'
import ResultsPage from './ResultsPage'
import axios from 'axios'

const EmployeeDashboard = ({ user, onLogout }) => {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout')
      onLogout()
    } catch (error) {
      console.error('Logout error:', error)
      onLogout() // Logout anyway
    }
  }

  if (currentPage === 'training') {
    return <TrainingPage user={user} onBack={() => setCurrentPage('dashboard')} />
  }

  if (currentPage === 'results') {
    return <ResultsPage user={user} onBack={() => setCurrentPage('dashboard')} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <User className="w-8 h-8 text-blue-600" />
              <div className="text-right">
                <h1 className="text-xl font-bold text-gray-900">مرحباً، {user.employee?.name}</h1>
                <p className="text-sm text-gray-600">{user.employee?.store} - {user.employee?.city}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم</h2>
          <p className="text-gray-600">اختر ما تريد القيام به</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Training Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => setCurrentPage('training')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">الحصول على تدريب</CardTitle>
              <CardDescription>
                ابدأ جلسة تدريب جديدة واجب على 10 أسئلة يومياً
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                ابدأ التدريب
              </Button>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => setCurrentPage('results')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">النتائج</CardTitle>
              <CardDescription>
                اعرض نتائجك وتقدمك في التدريب
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" size="lg">
                عرض النتائج
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">10</div>
              <div className="text-sm text-gray-600">أسئلة يومياً</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">100</div>
              <div className="text-sm text-gray-600">النقاط الكاملة</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">∞</div>
              <div className="text-sm text-gray-600">فرص التحسن</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard

