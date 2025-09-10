import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Download, Trophy, TrendingUp } from 'lucide-react'
import axios from 'axios'

const ResultsPage = ({ user, onBack }) => {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    date_filter: 'month',
    scope_filter: 'employee'
  })

  useEffect(() => {
    loadScores()
  }, [filters])

  const loadScores = async () => {
    setLoading(true)
    setError('')
    
    try {
      const params = new URLSearchParams(filters)
      const response = await axios.get(`/api/scores?${params}`)
      
      if (response.data.success) {
        setScores(response.data.scores)
      }
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ في تحميل النتائج')
    } finally {
      setLoading(false)
    }
  }

  const exportExcel = async () => {
    try {
      const response = await axios.post('/api/export-excel', 
        { scores },
        { responseType: 'blob' }
      )
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `results_${new Date().toISOString().split('T')[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500" />
    if (index === 1) return <Trophy className="w-5 h-5 text-gray-400" />
    if (index === 2) return <Trophy className="w-5 h-5 text-amber-600" />
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{index + 1}</span>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              العودة
            </Button>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <span className="font-semibold">النتائج والإحصائيات</span>
            </div>
            {user.user_type === 'admin' && (
              <Button onClick={exportExcel} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                تصدير Excel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardHeader>
            <CardTitle>فلاتر البحث</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">الفترة الزمنية</label>
                <Select value={filters.date_filter} onValueChange={(value) => setFilters({...filters, date_filter: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">من بداية الشهر</SelectItem>
                    <SelectItem value="year">من بداية السنة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">النطاق</label>
                <Select value={filters.scope_filter} onValueChange={(value) => setFilters({...filters, scope_filter: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {user.user_type === 'employee' && (
                      <>
                        <SelectItem value="employee">نتائجي فقط</SelectItem>
                        <SelectItem value="store">على مستوى المعرض</SelectItem>
                        <SelectItem value="city">على مستوى المدينة</SelectItem>
                        <SelectItem value="region">على مستوى المنطقة</SelectItem>
                        <SelectItem value="all">جميع الموظفين</SelectItem>
                      </>
                    )}
                    {user.user_type === 'admin' && (
                      <>
                        <SelectItem value="all">جميع الموظفين</SelectItem>
                        <SelectItem value="region">على مستوى المنطقة</SelectItem>
                        <SelectItem value="city">على مستوى المدينة</SelectItem>
                        <SelectItem value="store">على مستوى المعرض</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p>جاري تحميل النتائج...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : scores.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">لا توجد نتائج للفترة المحددة</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {scores.map((score, index) => (
              <Card key={index} className={`transition-all hover:shadow-lg ${
                user.user_type === 'employee' && score.employee_name === user.employee?.name 
                  ? 'ring-2 ring-purple-500 bg-purple-50' 
                  : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getRankIcon(index)}
                      <div>
                        <h3 className="font-semibold text-lg">{score.employee_name}</h3>
                        <p className="text-sm text-gray-600">{score.store_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        {score.average_score}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {score.total_score} نقطة من {score.test_count} اختبار
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${score.average_score}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultsPage

