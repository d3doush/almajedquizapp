import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, LogOut, Shield } from 'lucide-react'
import ResultsPage from './ResultsPage'
import axios from 'axios'

const AdminDashboard = ({ user, onLogout }) => {
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

  if (currentPage === 'results') {
    return <ResultsPage user={user} onBack={() => setCurrentPage('dashboard')} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Shield className="w-8 h-8 text-indigo-600" />
              <div className="text-right">
                <h1 className="text-xl font-bold text-gray-900">لوحة تحكم المشرف</h1>
                <p className="text-sm text-gray-600">إدارة النظام والنتائج</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">مرحباً بك في لوحة التحكم</h2>
          <p className="text-gray-600">إدارة وعرض نتائج جميع الموظفين</p>
        </div>

        <div className="grid md:grid-cols-1 gap-6 max-w-md mx-auto">
          {/* Results Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => setCurrentPage('results')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <BarChart3 className="w-8 h-8 text-indigo-600" />
              </div>
              <CardTitle className="text-xl">النتائج والإحصائيات</CardTitle>
              <CardDescription>
                عرض وتصدير نتائج جميع الموظفين مع إمكانية الفلترة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                عرض النتائج
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Admin Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-indigo-600">∞</div>
              <div className="text-sm text-gray-600">عدد الموظفين</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">Excel</div>
              <div className="text-sm text-gray-600">تصدير البيانات</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">📊</div>
              <div className="text-sm text-gray-600">تقارير شاملة</div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>تعليمات للمشرف</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>• يمكنك عرض نتائج جميع الموظفين مع إمكانية الفلترة حسب المنطقة، المدينة، أو المعرض</p>
            <p>• يمكنك تصدير النتائج كملف Excel للمراجعة والتحليل</p>
            <p>• النتائج تُحدث تلقائياً عند إكمال الموظفين للاختبارات اليومية</p>
            <p>• يمكنك فلترة النتائج حسب الفترة الزمنية (شهرياً أو سنوياً)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard

